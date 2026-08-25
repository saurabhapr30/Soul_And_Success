import { Router } from 'express';
import * as authController from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
