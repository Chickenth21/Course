import { apiRequest } from './api.js';

export const learningPathService = {
  async getActivePath() {
    return await apiRequest('/api/learning-path');
  },

  async generatePath() {
    return await apiRequest('/api/learning-path/generate', {
      method: 'POST'
    });
  },

  async updateItemStatus(itemId, status) {
    return await apiRequest(`/api/learning-path/items/${itemId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};
