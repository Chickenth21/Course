import { codingRoadmapService } from '../services/codingRoadmap.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * GET /api/coding-roadmap/:courseId
 * Returns the user's roadmap (with steps) for a course
 */
export const getRoadmap = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const roadmap = await codingRoadmapService.getRoadmap(userId, courseId);
    return successResponse(res, roadmap, roadmap ? 'Lấy lộ trình thành công' : 'Chưa có lộ trình');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * POST /api/coding-roadmap/:courseId/generate
 * Body: { goal: string, skillLevel: 'beginner' | 'intermediate' | 'advanced' }
 * Generate (or re-generate) a personalized coding roadmap using Gemini AI
 */
export const generateRoadmap = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const { goal, skillLevel } = req.body;

    const roadmap = await codingRoadmapService.generateRoadmap(userId, courseId, { goal, skillLevel });
    return successResponse(res, roadmap, 'Tạo lộ trình học tập thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * PATCH /api/coding-roadmap/steps/:stepId
 * Body: { status: 'pending' | 'in_progress' | 'completed' }
 * Update a roadmap step's status
 */
export const updateStepStatus = async (req, res) => {
  try {
    const { stepId } = req.params;
    const { status } = req.body;
    const step = await codingRoadmapService.updateStepStatus(stepId, status);
    return successResponse(res, step, 'Cập nhật trạng thái thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
