import { lessonRepository } from '../repositories/lesson.repository.js';
import { progressRepository } from '../repositories/progress.repository.js';

export const lessonService = {
  async getLessonDetails(lessonId, userId) {
    const lesson = await lessonRepository.getLessonById(lessonId);
    if (!lesson) {
      const error = new Error('Không tìm thấy bài học');
      error.statusCode = 404;
      throw error;
    }

    let progress = null;
    if (userId) {
      const userProgressList = await progressRepository.getUserLessonProgress(userId);
      progress = userProgressList.find((p) => p.lesson_id === lessonId) || null;
    }

    return {
      ...lesson,
      userProgress: progress
    };
  },

  async completeLesson(userId, lessonId, score = 100) {
    return await progressRepository.updateLessonProgress(userId, lessonId, 'completed', score);
  }
};
