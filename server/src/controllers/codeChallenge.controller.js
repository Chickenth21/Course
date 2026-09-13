import { codeChallengeService } from '../services/codeChallenge.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * GET /api/code-challenges/lesson/:lessonId
 * Returns all challenges for a lesson with the user's completion status
 */
export const getChallengesByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;
    const challenges = await codeChallengeService.getChallengesForLesson(lessonId, userId);
    return successResponse(res, challenges, 'Lấy danh sách bài tập thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * POST /api/code-challenges/:id/submit
 * Body: { code: string }
 * Submit and AI-grade a code submission
 */
export const submitCode = async (req, res) => {
  try {
    const { id: challengeId } = req.params;
    const userId = req.user.id;
    const { code } = req.body;

    const result = await codeChallengeService.submitAndGrade(userId, challengeId, code);
    return successResponse(res, result, 'Chấm bài thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * GET /api/code-challenges/:id/submissions
 * Get user's submission history for a challenge
 */
export const getSubmissions = async (req, res) => {
  try {
    const { id: challengeId } = req.params;
    const userId = req.user.id;
    const submissions = await codeChallengeService.getSubmissions(userId, challengeId);
    return successResponse(res, submissions, 'Lấy lịch sử nộp bài thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
