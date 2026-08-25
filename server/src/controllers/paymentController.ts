import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as paymentService from '../services/paymentService';
import { BadRequestError } from '../utils/errors';
import crypto from 'crypto';
import { env } from '../config/env';

export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.body;
  if (!orderId) return next(new BadRequestError('Order ID required'));

  const razorpayOrder = await paymentService.createRazorpayOrder(orderId);
  sendSuccessResponse({ res, data: { orderId: razorpayOrder.orderId, amount: razorpayOrder.amount, currency: razorpayOrder.currency } });
});

export const verifyPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return next(new BadRequestError('Missing required payment verification details'));
  }

  const isValid = paymentService.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (!isValid) {
    return next(new BadRequestError('Invalid payment signature'));
  }

  const updatedOrder = await paymentService.handlePaymentSuccess(orderId, {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  sendSuccessResponse({ res, data: { message: 'Payment verified successfully', order: updatedOrder } });
});

export const webhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const secret = env.RAZORPAY_KEY_SECRET;
  if (!secret) return next(new BadRequestError('Webhook secret not configured'));

  const signature = req.headers['x-razorpay-signature'] as string;
  if (!signature) return next(new BadRequestError('Missing signature'));

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return next(new BadRequestError('Invalid signature'));
  }

  const event = req.body.event;
  const payload = req.body.payload;

  if (event === 'payment.captured') {
    const payment = payload.payment.entity;
    const orderId = payment.notes?.orderId;
    
    if (orderId) {
      await paymentService.handlePaymentSuccess(orderId, payment);
    }
  }

  // Acknowledge receipt
  res.status(200).json({ status: 'ok' });
});
