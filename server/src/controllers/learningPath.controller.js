import { learningPathService } from '../services/learningPath.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getActiveLearningPath = async (req, res) => {
  try {
    const userId = req.user.id;
    const path = await learningPathService.getActivePath(userId);
    return successResponse(res, path, 'Lấy lộ trình học tập thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

export const generateLearningPath = async (req, res) => {
  try {
    const userId = req.user.id;
    const path = await learningPathService.generatePath(userId);
    return successResponse(res, path, 'Tạo lộ trình học tập cùng AI thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

export const updateItemStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const updatedItem = await learningPathService.updateItemStatus(userId, id, status);
    return successResponse(res, updatedItem, 'Cập nhật trạng thái bài học thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
