import { apiRequest } from './api.js';

export const authService = {
  async register(data) {
    return await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async login(data) {
    return await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getMe() {
    return await apiRequest('/api/auth/me', {
      method: 'GET'
    });
  }
};
