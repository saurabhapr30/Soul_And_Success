import api from './api';

export const productService = {
  getProducts: async (params?: any) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getProductBySlug: async (slug: string) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },
};
