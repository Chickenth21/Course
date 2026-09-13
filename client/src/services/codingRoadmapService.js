import { apiRequest } from './api.js';

export const codingRoadmapService = {
  /**
   * Get a user's coding roadmap for a course (returns null if not generated yet)
   * @param {string} courseId
   */
  async getRoadmap(courseId) {
    return await apiRequest(`/api/coding-roadmap/${courseId}`);
  },

  /**
   * Generate (or re-generate) a personalized roadmap using Gemini AI
   * @param {string} courseId
   * @param {{ goal: string, skillLevel: 'beginner'|'intermediate'|'advanced' }} options
   */
  async generateRoadmap(courseId, { goal, skillLevel }) {
    return await apiRequest(`/api/coding-roadmap/${courseId}/generate`, {
      method: 'POST',
      body: JSON.stringify({ goal, skillLevel })
    });
  },

  /**
   * Update the status of a roadmap step
   * @param {string} stepId
   * @param {'pending'|'in_progress'|'completed'} status
   */
  async updateStepStatus(stepId, status) {
    return await apiRequest(`/api/coding-roadmap/steps/${stepId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};
