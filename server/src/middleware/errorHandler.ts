import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Normalize known errors
  if (err.name === 'MulterError') error = handleMulterError(err);
  else if (err.code === 'P2022') {
    console.error('Prisma schema mismatch:', err);
    error = new AppError(
      'The database schema is out of date. Restart the backend with its migration step enabled, then try again.',
      503
    );
  }
  else if (err.code === 'P2002') error = handleDuplicateFieldsDB(err);
  else if (err.code === 'P2025') error = handleRecordNotFoundDB(err);
  else if (err instanceof ZodError || err.name === 'ZodError') error = handleValidationError(err);
  else if (err.name === 'JsonWebTokenError') error = handleJWTError();
  else if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (env.NODE_ENV === 'development') {
    return sendErrorDev(error, res);
  } else {
    return sendErrorProd(error, res);
  }
};

const handleMulterError = (err: any) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File size is too large. Maximum allowed file size for images is 5MB.', 400);
  }
  return new AppError(`File upload error: ${err.message}`, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const message = `Duplicate field value entered. Please use another value!`;
  return new AppError(message, 400);
};

const handleRecordNotFoundDB = (err: any) => {
  const message = `Record not found.`;
  return new AppError(message, 404);
};

const handleValidationError = (err: ZodError | any) => {
  const errors = err.errors ? err.errors.map((el: any) => el.message) : err.issues.map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  const appError = new AppError(message, 400);
  (appError as any).errors = errors;
  return appError;
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: any, res: Response) => {
  console.error('ERROR 💥', err);
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};
