import { assessmentService } from '../services/assessment.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getPlacementTest = async (_req, res) => {
  try {
    const test = await assessmentService.getTestForTaking();
    return successResponse(res, test, 'Lấy bài kiểm tra đầu vào thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

export const submitPlacementTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user?.id;

    if (!answers || typeof answers !== 'object') {
      return errorResponse(res, 'Dữ liệu câu trả lời không hợp lệ', 400);
    }

    const result = await assessmentService.submitTest(userId, id, answers);
    return successResponse(res, result, 'Nộp bài và chấm điểm thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
