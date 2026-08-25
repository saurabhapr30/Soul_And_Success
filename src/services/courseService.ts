import api from './api';

export const courseService = {
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  getCourseBySlug: async (slug: string) => {
    const response = await api.get(`/courses/slug/${slug}`);
    return response.data;
  },
  enroll: async (courseId: string) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  }
};
