import { apiRequest } from './api.js';

export const exerciseService = {
  async submitAnswer(exerciseId, answer) {
    return await apiRequest(`/api/exercises/${exerciseId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answer })
    });
  }
};
