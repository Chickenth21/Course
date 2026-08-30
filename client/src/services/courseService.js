import { apiRequest } from './api.js';

export const courseService = {
  async getAllCourses() {
    return await apiRequest('/api/courses');
  },

  async getCourseById(id) {
    return await apiRequest(`/api/courses/${id}`);
  }
};
