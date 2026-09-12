import { apiRequest } from './api.js';

export const practiceService = {
  /**
   * Get browsable practice topics.
   * @param {string|null} type - 'reading_translation' | 'writing_essay' | null
   * @param {string|null} level - 'A1' | 'A2' | 'B1' | 'B2' | null
   */
  async getTopics(type = null, level = null) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (level) params.append('level', level);
    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/api/practice/topics${query}`);
  },

  /**
   * Get full details of a single topic (includes source_text).
   */
  async getTopic(topicId) {
    return await apiRequest(`/api/practice/topics/${topicId}`);
  },

  /**
   * Submit a reading/translation answer for Gemini AI grading.
   */
  async submitTranslation(topicId, userTranslation) {
    return await apiRequest('/api/practice/submit-translation', {
      method: 'POST',
      body: JSON.stringify({ topicId, userTranslation })
    });
  },

  /**
   * Submit a writing/essay answer for Gemini AI grading.
   */
  async submitWriting(topicId, userEssay) {
    return await apiRequest('/api/practice/submit-writing', {
      method: 'POST',
      body: JSON.stringify({ topicId, userEssay })
    });
  },

  /**
   * Get the authenticated user's submission history.
   * @param {string|null} type - Optional filter by submission type
   */
  async getHistory(type = null) {
    const query = type ? `?type=${type}` : '';
    return await apiRequest(`/api/practice/history${query}`);
  },

  /**
   * Get a specific submission for review.
   */
  async getSubmission(submissionId) {
    return await apiRequest(`/api/practice/history/${submissionId}`);
  },

  /**
   * Ask Gemini to generate a fresh practice topic on demand.
   * @param {'reading_translation'|'writing_essay'} type
   * @param {'A1'|'A2'|'B1'|'B2'} level
   * @param {string[]} usedTitles - Avoid repeating these topics
   */
  async generateTopic(type, level, usedTitles = []) {
    return await apiRequest('/api/practice/generate-topic', {
      method: 'POST',
      body: JSON.stringify({ type, level, usedTitles })
    });
  }
};
