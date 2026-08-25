import api from './api';

export const promotionService = {
  getActivePromotions: async () => {
    const response = await api.get('/promotions/active');
    return response.data;
  },
};
