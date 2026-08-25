import api from './api';

export const bookService = {
  getBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },
  getBookBySlug: async (slug: string) => {
    const response = await api.get(`/books/slug/${slug}`);
    return response.data;
  },
};
