import { courseRepository } from '../repositories/course.repository.js';

/**
 * Course Service — business logic layer between controller and repository.
 * Keeps controllers thin and provides a single point for validation/enrichment.
 */
export const courseService = {
  /**
   * Get all published courses ordered by index.
   */
  async getAllCourses() {
    return courseRepository.getAllCourses();
  },

  /**
   * Get full course detail including modules and lessons.
   * Throws 404 if course does not exist or is not published.
   */
  async getCourseById(courseId) {
    if (!courseId) {
      const err = new Error('courseId là bắt buộc');
      err.statusCode = 400;
      throw err;
    }
    const course = await courseRepository.getCourseById(courseId);
    if (!course) {
      const err = new Error('Khóa học không tồn tại hoặc chưa được phát hành');
      err.statusCode = 404;
      throw err;
    }
    return course;
  }
};
