import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string(),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES: z.string().default('365d'),
  JWT_REFRESH_EXPIRES: z.string().default('365d'),
  
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string(),
  
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  
  UPLOAD_DIR: z.string().default('uploads'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
