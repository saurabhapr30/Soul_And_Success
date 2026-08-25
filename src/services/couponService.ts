import api from './api';

export const couponService = {
  validateCoupon: async (code: string) => {
    const response = await api.post('/coupons/validate', { code });
    return response.data;
  },
};
