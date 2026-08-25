import nodemailer from 'nodemailer';
import { env } from '../config/env';

const createTransporter = () => {
  if (env.EMAIL_HOST && env.EMAIL_PORT && env.EMAIL_USER && env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: parseInt(env.EMAIL_PORT),
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }
  // Mock transporter for development if no config is provided
  return {
    sendMail: async (options: any) => {
      console.log('--- MOCK EMAIL SENT ---');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Body:\n${options.html || options.text}`);
      console.log('-------------------------');
      return true;
    }
  };
};

const transporter = createTransporter();

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${env.CLIENT_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: env.EMAIL_FROM || '"Soul And Success" <noreply@soulandsuccess.com>',
    to: email,
    subject: 'Verify your Soul And Success account',
    html: `
      <div style="font-family: 'Montserrat', sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; color: #2C1810; background: #FAF6F1; border-radius: 8px;">
        <h1 style="color: #5C3D2E; text-align: center;">Soul And Success</h1>
        <h2 style="font-weight: 500;">Welcome!</h2>
        <p>Thank you for joining us. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #5C3D2E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600;">Verify Email</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #A68B6B;">${verificationLink}</p>
        <p style="margin-top: 40px; font-size: 12px; color: #A68B6B;">If you did not create an account, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${env.CLIENT_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: env.EMAIL_FROM || '"Soul And Success" <noreply@soulandsuccess.com>',
    to: email,
    subject: 'Reset your Soul And Success password',
    html: `
      <div style="font-family: 'Montserrat', sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; color: #2C1810; background: #FAF6F1; border-radius: 8px;">
        <h1 style="color: #5C3D2E; text-align: center;">Soul And Success</h1>
        <h2 style="font-weight: 500;">Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to choose a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #5C3D2E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #A68B6B;">${resetLink}</p>
        <p style="margin-top: 40px; font-size: 12px; color: #A68B6B;">If you did not request a password reset, please ignore this email. This link will expire in 1 hour.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
