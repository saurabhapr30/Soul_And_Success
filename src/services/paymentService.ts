import api from './api';

export const paymentService = {
  createOrder: async (orderId: string) => {
    const response = await api.post('/payments/create-order', { orderId });
    return response.data;
  },
  verifyPayment: async (verificationData: { orderId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string }) => {
    const response = await api.post('/payments/verify', verificationData);
    return response.data;
  }
};
