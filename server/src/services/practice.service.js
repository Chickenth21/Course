import { practiceRepository } from '../repositories/practice.repository.js';
import { progressRepository } from '../repositories/progress.repository.js';
import { aiService } from '../ai/ai.service.js';

/**
 * Helper: resolve or create a practice topic record.
 * For inline AI-generated topics (no DB id), inserts a transient row first.
 */
async function resolveTopicId(topicId, _inlineTopic) {
  if (topicId && topicId !== 'inline') {
    const topic = await practiceRepository.getTopicById(topicId).catch(() => null);
    if (topic) return { topic, topicIdResolved: topic.id };
  }

  // Inline — persist the AI-generated topic so we can FK the submission
  if (_inlineTopic) {
    const saved = await practiceRepository.saveInlineTopic({
      type: _inlineTopic.type || 'reading_translation',
      level: _inlineTopic.level || 'B1',
      title: _inlineTopic.title || 'AI-Generated Topic',
      source_text: _inlineTopic.sourceText || '',
      reference_translation: _inlineTopic.referenceTranslation || null,
      instructions: _inlineTopic.instructions || '',
      is_ai_generated: true,
      is_active: false  // hidden from public catalogue
    }).catch(() => null);
    if (saved) return { topic: saved, topicIdResolved: saved.id };
  }

  return { topic: null, topicIdResolved: null };
}

export const practiceService = {
  /**
   * Get list of practice topics (browsable catalogue).
   * @param {string|null} type - 'reading_translation' | 'writing_essay' | null (all)
   * @param {string|null} level - 'A1' | 'A2' | 'B1' | 'B2' | null (all)
   */
  async getTopics(type, level) {
    return practiceRepository.getTopicsByTypeAndLevel(type, level);
  },

  /**
   * Get full details of a single topic (including source_text).
   */
  async getTopicById(topicId) {
    const topic = await practiceRepository.getTopicById(topicId);
    if (!topic) {
      const err = new Error('Không tìm thấy đề bài luyện tập');
      err.statusCode = 404;
      throw err;
    }
    return topic;
  },

  /**
   * Submit a Reading/Translation answer for Gemini AI evaluation.
   * Always saves to DB — for inline AI topics, persists the topic first.
   */
  async submitReadingTranslation(userId, { topicId, userTranslation, _inlineTopic }) {
    if (!userTranslation || !userTranslation.trim()) {
      const err = new Error('Vui lòng nhập bản dịch trước khi nộp bài');
      err.statusCode = 400;
      throw err;
    }
    const wordCount = userTranslation.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 3) {
      const err = new Error('Bản dịch quá ngắn. Vui lòng dịch đầy đủ.');
      err.statusCode = 400;
      throw err;
    }

    // Resolve topic — from DB or inline payload
    const { topic } = await resolveTopicId(
      topicId,
      _inlineTopic ? { ..._inlineTopic, type: 'reading_translation' } : null
    );

    const sourceText = topic?.source_text || _inlineTopic?.sourceText || '';
    const referenceTranslation = topic?.reference_translation || _inlineTopic?.referenceTranslation || null;
    const topicLevel = topic?.level || _inlineTopic?.level || 'B1';

    if (!sourceText) {
      const err = new Error('Không tìm thấy nội dung đề bài');
      err.statusCode = 404;
      throw err;
    }

    // Gemini AI evaluation
    const evaluation = await aiService.evaluateReadingTranslation({
      sourceText,
      userTranslation: userTranslation.trim(),
      level: topicLevel,
      referenceTranslation
    });

    // Always save submission to DB
    let submission = null;
    if (userId) {
      submission = await practiceRepository.saveSubmission({
        user_id: userId,
        topic_id: topic?.id || null,
        submission_type: 'reading_translation',
        user_content: userTranslation.trim(),
        overall_score: evaluation.overallScore,
        detailed_scores: {
          accuracy: evaluation.accuracyScore,
          fluency: evaluation.fluencyScore,
          grammar: evaluation.grammarScore
        },
        feedback_summary: evaluation.feedback,
        detailed_errors: evaluation.errors || [],
        improved_version: evaluation.bestTranslation,
        actionable_advice: evaluation.actionableAdvice || [],
        word_count: wordCount,
        is_ai_graded: evaluation.isAiGraded ?? true
      }).catch(() => null);
    }

    // Update Reading skill using actual score (not binary)
    if (userId) {
      await progressRepository.updateSkillScore(userId, 'Reading', evaluation.overallScore).catch(() => {});
    }

    return {
      submissionId: submission?.id,
      evaluation,
      topic: topic ? { id: topic.id, title: topic.title, level: topic.level } : null
    };
  },

  /**
   * Submit a Writing/Essay answer for Gemini AI evaluation.
   * Always saves to DB — for inline AI topics, persists the topic first.
   */
  async submitWritingEssay(userId, { topicId, userEssay, _inlineTopic }) {
    if (!userEssay || !userEssay.trim()) {
      const err = new Error('Vui lòng nhập bài viết trước khi nộp bài');
      err.statusCode = 400;
      throw err;
    }

    const wordCount = userEssay.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 10) {
      const err = new Error('Bài viết quá ngắn. Vui lòng viết ít nhất 10 từ.');
      err.statusCode = 400;
      throw err;
    }

    // Resolve topic — from DB or inline payload
    const { topic } = await resolveTopicId(
      topicId,
      _inlineTopic ? { ..._inlineTopic, type: 'writing_essay' } : null
    );

    const topicTitle = topic?.title || _inlineTopic?.title || 'Bài viết tự do';
    const instructions = topic?.instructions || _inlineTopic?.instructions || '';
    const targetLevel = topic?.level || _inlineTopic?.level || 'B1';
    const minWords = topic?.target_word_count ? Math.floor(topic.target_word_count * 0.6) : 50;
    const maxWords = topic?.target_word_count ? Math.ceil(topic.target_word_count * 1.5) : 300;

    // Gemini AI evaluation
    const evaluation = await aiService.evaluateWritingEssay({
      topicTitle,
      instructions,
      userEssay: userEssay.trim(),
      targetLevel,
      minWords,
      maxWords
    });

    // Always save submission to DB
    let submission = null;
    if (userId) {
      submission = await practiceRepository.saveSubmission({
        user_id: userId,
        topic_id: topic?.id || null,
        submission_type: 'writing_essay',
        user_content: userEssay.trim(),
        overall_score: evaluation.overallScore,
        cefr_band: evaluation.cefrBand,
        detailed_scores: evaluation.criteriaScores || {},
        feedback_summary: evaluation.feedback,
        strengths: evaluation.strengths || [],
        detailed_errors: evaluation.sentenceErrors || [],
        improved_version: evaluation.polishedEssay,
        actionable_advice: evaluation.actionableAdvice || [],
        word_count: evaluation.wordCount || wordCount,
        is_ai_graded: evaluation.isAiGraded ?? true
      }).catch(() => null);
    }

    // Update Writing skill using actual score
    if (userId) {
      await progressRepository.updateSkillScore(userId, 'Writing', evaluation.overallScore).catch(() => {});
    }

    return {
      submissionId: submission?.id,
      evaluation,
      topic: topic ? { id: topic.id, title: topic.title, level: topic.level } : { title: topicTitle, level: targetLevel }
    };
  },

  /**
   * Get a user's submission history.
   */
  async getUserHistory(userId, type) {
    return practiceRepository.getUserSubmissions(userId, type);
  },

  /**
   * Get a specific submission (for review).
   */
  async getSubmissionById(submissionId, userId) {
    const submission = await practiceRepository.getSubmissionById(submissionId, userId);
    if (!submission) {
      const err = new Error('Không tìm thấy bài nộp');
      err.statusCode = 404;
      throw err;
    }
    return submission;
  }
};
