import { learningPathRepository } from '../repositories/learningPath.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { assessmentRepository } from '../repositories/assessment.repository.js';
import { aiService } from '../ai/ai.service.js';

export const learningPathService = {
  /**
   * Get user's currently active learning path, or create one automatically if none exists
   */
  async getActivePath(userId) {
    let path = await learningPathRepository.getActiveByUserId(userId);
    if (!path) {
      // Auto generate initial path if user doesn't have one
      path = await this.generatePath(userId);
    }
    return path;
  },

  /**
   * Generate or regenerate personalized learning path using AI
   */
  async generatePath(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }

    // 1. Fetch latest assessment submission if available
    const submissions = await assessmentRepository.getUserSubmissions(userId);
    const latestSubmission = submissions.length > 0 ? submissions[0] : null;

    const currentLevel = user.current_level || latestSubmission?.estimated_level || 'A1';
    const targetLevel = user.target_level || 'B2';
    const skillScores = latestSubmission?.skill_scores || {};
    const weakAreas = latestSubmission?.weak_areas || [];
    const strongAreas = latestSubmission?.strong_areas || [];

    // 2. Query Gemini AI service
    const aiResult = await aiService.generateLearningPath({
      currentLevel,
      targetLevel,
      skillScores,
      weakAreas,
      strongAreas
    });

    // 3. Save into Supabase PostgreSQL
    const pathRecord = await learningPathRepository.createPath(
      {
        user_id: userId,
        current_level: currentLevel,
        target_level: targetLevel,
        status: 'active',
        summary: aiResult.summary
      },
      aiResult.steps.map((step) => ({
        topic: step.topic,
        skill: step.skill,
        order_index: step.order_index,
        status: 'pending',
        reason: step.reason
      }))
    );

    return pathRecord;
  },

  /**
   * Update item status (pending, in_progress, completed)
   */
  async updateItemStatus(userId, itemId, status) {
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      const error = new Error('Trạng thái không hợp lệ');
      error.statusCode = 400;
      throw error;
    }

    return await learningPathRepository.updateItemStatus(itemId, status);
  }
};
