import { apiRequest } from './api.js';

export const lessonService = {
  async getLessonById(id) {
    return await apiRequest(`/api/lessons/${id}`);
  },

  async completeLesson(id, score = 100) {
    return await apiRequest(`/api/lessons/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ score })
    });
  }
};
