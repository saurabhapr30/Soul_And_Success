import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import crypto from 'crypto';

export const signAccessToken = (userId: string) => {
  return jwt.sign({ id: userId, jti: crypto.randomUUID() }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES as any,
  });
};

export const signRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId, jti: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES as any,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
