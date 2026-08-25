import api from './api';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    const token = response.data?.data?.accessToken || response.data?.accessToken;
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    const token = response.data?.data?.accessToken || response.data?.accessToken;
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    return response.data;
  },
  verifyEmail: async (email: string, token: string) => {
    const response = await api.post('/auth/verify-email', { email, token });
    return response.data;
  },
  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (data: any) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('accessToken');
  }
};
