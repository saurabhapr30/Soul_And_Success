import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import { prisma } from '../config/database';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../utils/errors';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new BadRequestError('Please provide name, email and password'));
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(new BadRequestError('Email already in use'));
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  const accessToken = signAccessToken(newUser.id);
  const refreshToken = signRefreshToken(newUser.id);

  // Store refresh token in db (ideally with expiration)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: newUser.id,
      expiresAt,
    }
  });

  // Remove password from output
  const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, isEmailVerified: newUser.isEmailVerified };

  // Generate verification token
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(token, 10);
  
  const tokenExpiresAt = new Date();
  tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24); // 24 hours
  
  await prisma.verificationToken.create({
    data: {
      email: newUser.email,
      token: tokenHash,
      expiresAt: tokenExpiresAt,
    }
  });

  try {
    await sendVerificationEmail(newUser.email, token);
  } catch (err) {
    console.error('Failed to send verification email', err);
  }

  sendSuccessResponse({
    res,
    statusCode: 201,
    data: {
      user: userResponse,
      accessToken,
      refreshToken,
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Please provide email and password'));
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return next(new UnauthorizedError('Incorrect email or password'));
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    }
  });

  const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role };

  sendSuccessResponse({
    res,
    data: {
      user: userResponse,
      accessToken,
      refreshToken,
    },
  });
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      createdAt: true
    }
  });

  sendSuccessResponse({ res, data: { user } });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, token } = req.body;
  if (!email || !token) return next(new BadRequestError('Email and token required'));

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return next(new BadRequestError('Invalid user or token'));
  if (user.isEmailVerified) return next(new BadRequestError('Email already verified'));

  const verificationRecord = await prisma.verificationToken.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' }
  });

  if (!verificationRecord) return next(new BadRequestError('Invalid or expired token'));

  if (new Date() > verificationRecord.expiresAt) {
    return next(new BadRequestError('Token expired'));
  }

  const isValid = await bcrypt.compare(token, verificationRecord.token);
  if (!isValid) return next(new BadRequestError('Invalid or expired token'));

  await prisma.user.update({
    where: { email },
    data: { isEmailVerified: true }
  });

  await prisma.verificationToken.deleteMany({ where: { email } });

  sendSuccessResponse({ res, data: { message: 'Email verified successfully' } });
});

export const resendVerification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) return next(new BadRequestError('Email required'));

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return sendSuccessResponse({ res, data: { message: 'If an account exists, a verification email has been sent.' } });
  if (user.isEmailVerified) return sendSuccessResponse({ res, data: { message: 'Email already verified' } });

  await prisma.verificationToken.deleteMany({ where: { email } });

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(token, 10);
  
  const tokenExpiresAt = new Date();
  tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24);

  await prisma.verificationToken.create({
    data: {
      email,
      token: tokenHash,
      expiresAt: tokenExpiresAt,
    }
  });

  try {
    await sendVerificationEmail(email, token);
  } catch (err) {
    console.error('Failed to send verification email', err);
  }

  sendSuccessResponse({ res, data: { message: 'If an account exists, a verification email has been sent.' } });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) return next(new BadRequestError('Email required'));

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return sendSuccessResponse({ res, data: { message: 'If an account exists, a password reset link has been sent.' } });

  await prisma.passwordResetToken.deleteMany({ where: { email } });

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(token, 10);
  
  const tokenExpiresAt = new Date();
  tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1);

  await prisma.passwordResetToken.create({
    data: {
      email,
      token: tokenHash,
      expiresAt: tokenExpiresAt,
    }
  });

  try {
    await sendPasswordResetEmail(email, token);
  } catch (err) {
    console.error('Failed to send password reset email', err);
  }

  sendSuccessResponse({ res, data: { message: 'If an account exists, a password reset link has been sent.' } });
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) return next(new BadRequestError('Missing required fields'));

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return next(new BadRequestError('Invalid or expired token'));

  const resetRecord = await prisma.passwordResetToken.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' }
  });

  if (!resetRecord) return next(new BadRequestError('Invalid or expired token'));

  if (new Date() > resetRecord.expiresAt) {
    return next(new BadRequestError('Token expired'));
  }

  const isValid = await bcrypt.compare(token, resetRecord.token);
  if (!isValid) return next(new BadRequestError('Invalid or expired token'));

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { passwordHash }
  });

  await prisma.passwordResetToken.deleteMany({ where: { email } });
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

  sendSuccessResponse({ res, data: { message: 'Password reset successfully. Please login with your new password.' } });
});
