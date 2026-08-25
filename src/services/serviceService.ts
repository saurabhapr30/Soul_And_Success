import api from './api';

export const serviceService = {
  getServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },
  getServiceBySlug: async (slug: string) => {
    const response = await api.get(`/services/slug/${slug}`);
    return response.data;
  },
};
