import { courseService } from '../services/course.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getCourses = async (_req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    return successResponse(res, courses, 'Lấy danh sách khóa học thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);
    return successResponse(res, course, 'Lấy chi tiết khóa học thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
