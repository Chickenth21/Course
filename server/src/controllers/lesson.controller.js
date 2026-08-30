import { lessonService } from '../services/lesson.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const lesson = await lessonService.getLessonDetails(id, userId);
    return successResponse(res, lesson, 'Lấy chi tiết bài học thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

export const completeLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { score } = req.body;

    const progress = await lessonService.completeLesson(userId, id, score || 100);
    return successResponse(res, progress, 'Hoàn thành bài học thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
