import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../config/database';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new UnauthorizedError('You are not logged in! Please log in to get access.')
    );
  }

  const decoded: any = verifyAccessToken(token);

  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!currentUser) {
    return next(
      new UnauthorizedError(
        'The user belonging to this token does no longer exist.'
      )
    );
  }

  (req as any).user = currentUser;
  next();
});

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return next(
        new ForbiddenError('You do not have permission to perform this action')
      );
    }
    next();
  };
};
