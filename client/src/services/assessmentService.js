import { apiRequest } from './api.js';

export const assessmentService = {
  async getPlacementTest() {
    return await apiRequest('/api/assessments/placement');
  },

  async submitTest(assessmentId, answers) {
    return await apiRequest(`/api/assessments/${assessmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  }
};
