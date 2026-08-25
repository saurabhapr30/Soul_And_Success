import api from './api';

export const newsletterService = {
  subscribe: async (email: string) => {
    const response = await api.post('/newsletter', { email });
    return response.data;
  },
};
