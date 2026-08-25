import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env';
import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';

// Create Razorpay instance if keys are provided
let razorpay: any;
if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

export const createRazorpayOrder = async (orderId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError('Order not found');
  if (order.paymentStatus === 'PAID') throw new BadRequestError('Order already paid');

  const amountInPaise = Math.round(Number(order.total) * 100);

  if (!razorpay) {
    // Development fallback simulation
    return {
      orderId: null,
      amount: amountInPaise,
      currency: 'INR',
    };
  }

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: order.id,
    notes: {
      orderId: order.id,
    },
  };

  const razorpayOrder = await razorpay.orders.create(options);
  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  };
};

export const verifyPaymentSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) => {
  if (!env.RAZORPAY_KEY_SECRET) return true; // Development simulation mode

  const generatedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature === razorpaySignature;
};

export const handlePaymentSuccess = async (orderId: string, paymentDetails: any) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new NotFoundError('Order not found');

  if (order.paymentStatus === 'PAID') return order; // Idempotent

  await prisma.$transaction(async (tx: any) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
      }
    });

    if (order.userId) {
       await tx.cart.deleteMany({ where: { userId: order.userId } });
       
       // Process enrollments for any purchased courses
       for (const item of order.items) {
         if (item.sku && item.sku.startsWith('COURSE-')) {
            const courseId = item.sku.replace('COURSE-', '');
            
            // Ensure idempotency
            const existing = await tx.courseEnrollment.findFirst({
               where: { userId: order.userId, courseId: courseId }
            });
            
            if (!existing) {
               await tx.courseEnrollment.create({
                 data: {
                   userId: order.userId,
                   courseId: courseId,
                   orderId: order.id,
                   status: 'ACTIVE',
                   progress: 0
                 }
               });
            }
         }
       }
    }
  });

  return await prisma.order.findUnique({ where: { id: orderId } });
};
