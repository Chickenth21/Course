import { exerciseService } from '../services/exercise.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const submitExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const userId = req.user?.id;

    if (answer === undefined || answer === null) {
      return errorResponse(res, 'Vui lòng cung cấp câu trả lời', 400);
    }

    const result = await exerciseService.submitExerciseAttempt(userId, id, String(answer));
    return successResponse(res, result, 'Chấm điểm bài tập thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
