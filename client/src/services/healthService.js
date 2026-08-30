import { apiRequest } from './api.js';

/**
 * Fetch server health status
 */
export async function getHealthStatus() {
  return await apiRequest('/api/health');
}
