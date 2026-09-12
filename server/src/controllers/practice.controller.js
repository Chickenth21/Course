import { practiceService } from '../services/practice.service.js';
import { aiService } from '../ai/ai.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import {
  validate,
  generateTopicSchema,
  submitTranslationSchema,
  submitWritingSchema
} from '../validators/practice.validator.js';

/**
 * GET /api/practice/topics
 * Query params: type, level
 */
export const getPracticeTopics = async (req, res) => {
  try {
    const { type, level } = req.query;
    const topics = await practiceService.getTopics(type || null, level || null);
    return successResponse(res, topics, 'Lấy danh sách đề bài thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * GET /api/practice/topics/:id
 */
export const getTopicDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await practiceService.getTopicById(id);
    return successResponse(res, topic, 'Lấy chi tiết đề bài thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * POST /api/practice/submit-translation
 * Body: { topicId, userTranslation }
 */
export const submitReadingTranslation = async (req, res) => {
  try {
    const userId = req.user?.id;
    const validation = validate(submitTranslationSchema, req.body);
    if (!validation.success) {
      return errorResponse(res, validation.errors[0], 400);
    }
    const { topicId, userTranslation, _inlineTopic } = validation.data;

    const result = await practiceService.submitReadingTranslation(userId, {
      topicId,
      userTranslation,
      _inlineTopic
    });

    return successResponse(res, result, 'Chấm điểm bản dịch thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * POST /api/practice/submit-writing
 * Body: { topicId, userEssay }
 */
export const submitWritingEssay = async (req, res) => {
  try {
    const userId = req.user?.id;
    const validation = validate(submitWritingSchema, req.body);
    if (!validation.success) {
      return errorResponse(res, validation.errors[0], 400);
    }
    const { topicId, userEssay, _inlineTopic } = validation.data;

    const result = await practiceService.submitWritingEssay(userId, {
      topicId,
      userEssay,
      _inlineTopic
    });

    return successResponse(res, result, 'Chấm điểm bài viết thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * GET /api/practice/history
 * Query params: type
 */
export const getUserPracticeHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;
    const history = await practiceService.getUserHistory(userId, type || null);
    return successResponse(res, history, 'Lấy lịch sử luyện tập thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * GET /api/practice/history/:id
 * Get a single submission for review
 */
export const getSubmissionReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const submission = await practiceService.getSubmissionById(id, userId);
    return successResponse(res, submission, 'Lấy chi tiết bài nộp thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * POST /api/practice/generate-topic
 * Body: { type: 'reading_translation'|'writing_essay', level: 'A1'|'A2'|'B1'|'B2', usedTitles?: string[] }
 * Gemini generates a fresh practice topic on demand.
 */
export const generateTopic = async (req, res) => {
  try {
    const validation = validate(generateTopicSchema, req.body);
    if (!validation.success) {
      return errorResponse(res, validation.errors[0], 400);
    }
    const { type, level, usedTitles } = validation.data;

    const topic = await aiService.generatePracticeTopic({ type, level, usedTitles });
    return successResponse(res, topic, 'Tạo đề bài thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
