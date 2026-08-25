import api from './api';

export const blogService = {
  getPosts: async (params?: any) => {
    const response = await api.get('/blog', { params });
    return response.data;
  },
  getPostBySlug: async (slug: string) => {
    const response = await api.get(`/blog/slug/${slug}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/blog/categories');
    return response.data;
  }
};
