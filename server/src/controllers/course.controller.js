import { courseRepository } from '../repositories/course.repository.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getCourses = async (_req, res) => {
  try {
    const courses = await courseRepository.getAllCourses();
    return successResponse(res, courses, 'Courses retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseRepository.getCourseById(id);
    if (!course) {
      return errorResponse(res, 'Course not found', 404);
    }
    return successResponse(res, course, 'Course details retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
