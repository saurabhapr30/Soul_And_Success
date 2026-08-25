import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';

const router = Router();

router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.post('/webhook', paymentController.webhook);

export default router;
