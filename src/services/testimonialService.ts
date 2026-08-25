import api from './api';

export const testimonialService = {
  getTestimonials: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },
  getTestimonialById: async (id: string) => {
    const response = await api.get('/testimonials/' + id);
    return response.data;
  },
  createTestimonial: async (data: any) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },
  updateTestimonial: async (id: string, data: any) => {
    const response = await api.patch('/testimonials/' + id, data);
    return response.data;
  },
  deleteTestimonial: async (id: string) => {
    const response = await api.delete('/testimonials/' + id);
    return response.data;
  }
};
