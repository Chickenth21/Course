import { exerciseRepository } from '../repositories/exercise.repository.js';
import { progressRepository } from '../repositories/progress.repository.js';

export const exerciseService = {
  async submitExerciseAttempt(userId, exerciseId, userAnswer) {
    const exercise = await exerciseRepository.getById(exerciseId);
    if (!exercise) {
      const error = new Error('Không tìm thấy bài tập');
      error.statusCode = 404;
      throw error;
    }

    const cleanUserAnswer = (userAnswer || '').trim().toLowerCase();
    const cleanCorrectAnswer = (exercise.correct_answer || '').trim().toLowerCase();
    const isCorrect = cleanUserAnswer === cleanCorrectAnswer;

    // 1. Record attempt in database
    let attempt = null;
    if (userId) {
      attempt = await exerciseRepository.recordAttempt({
        user_id: userId,
        exercise_id: exerciseId,
        user_answer: userAnswer,
        is_correct: isCorrect
      });

      // 2. Update user's skill score
      await progressRepository.updateSkillScore(userId, exercise.skill || 'Grammar', isCorrect);
    }

    return {
      isCorrect,
      correctAnswer: exercise.correct_answer,
      explanation: exercise.explanation,
      userAnswer,
      attemptId: attempt?.id
    };
  }
};
