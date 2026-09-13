import { apiRequest } from './api.js';

export const codeChallengeService = {
  /**
   * Get all code challenges for a lesson (with user's completion status)
   * @param {string} lessonId
   */
  async getChallenges(lessonId) {
    return await apiRequest(`/api/code-challenges/lesson/${lessonId}`);
  },

  /**
   * Submit code to be AI-graded by Gemini
   * @param {string} challengeId
   * @param {string} code — The code the user wrote
   */
  async submitCode(challengeId, code) {
    return await apiRequest(`/api/code-challenges/${challengeId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },

  /**
   * Get the user's past submissions for a challenge
   * @param {string} challengeId
   */
  async getSubmissions(challengeId) {
    return await apiRequest(`/api/code-challenges/${challengeId}/submissions`);
  }
};
