import { codeChallengeRepository } from '../repositories/codeChallenge.repository.js';
import { progressRepository } from '../repositories/progress.repository.js';
import { aiService } from '../ai/ai.service.js';

export const codeChallengeService = {
  /**
   * Get all challenges for a lesson with user completion status
   */
  async getChallengesForLesson(lessonId, userId) {
    const challenges = await codeChallengeRepository.getByLessonIdWithStatus(lessonId, userId);
    return challenges;
  },

  /**
   * Submit code for grading:
   * 1. Fetch challenge with solution (server-side only)
   * 2. Call Gemini AI grader
   * 3. Save submission to DB
   * 4. Update lesson progress score if passed
   */
  async submitAndGrade(userId, challengeId, userCode) {
    if (!userCode || !userCode.trim()) {
      const error = new Error('Code không được để trống');
      error.statusCode = 400;
      throw error;
    }

    if (userCode.length > 10000) {
      const error = new Error('Code vượt quá giới hạn 10,000 ký tự');
      error.statusCode = 400;
      throw error;
    }

    // Fetch challenge with solution (server-side)
    const challenge = await codeChallengeRepository.getByIdWithSolution(challengeId);
    if (!challenge) {
      const error = new Error('Bài tập không tồn tại');
      error.statusCode = 404;
      throw error;
    }

    // Get attempt number
    const attemptNumber = await codeChallengeRepository.getNextAttemptNumber(userId, challengeId);

    // Grade with Gemini AI
    const gradeResult = await aiService.gradeCode({
      title: challenge.title,
      description: challenge.description,
      userCode,
      starterCode: challenge.starter_code || '',
      testCases: challenge.test_cases || [],
      concepts: challenge.concepts || [],
      language: 'javascript',
      solutionCode: challenge.solution_code
    });

    // Save submission
    const submission = await codeChallengeRepository.createSubmission({
      user_id: userId,
      challenge_id: challengeId,
      submitted_code: userCode,
      ai_score: gradeResult.score,
      ai_feedback: gradeResult.feedback,
      ai_strengths: gradeResult.strengths,
      ai_improvements: gradeResult.improvements,
      is_passed: gradeResult.isPassed,
      attempt_number: attemptNumber,
      is_ai_graded: gradeResult.isAiGraded
    });

    // Update lesson progress if challenge is passed
    if (gradeResult.isPassed && challenge.lesson_id) {
      // Get best score across all challenges in the lesson to compute lesson score
      const bestScore = await codeChallengeRepository.getBestScore(userId, challengeId);
      const lessonScore = bestScore?.ai_score ?? gradeResult.score;
      await progressRepository.updateLessonProgress(userId, challenge.lesson_id, 'in_progress', lessonScore);
      // Update skill progress for "Coding"
      await progressRepository.updateSkillScore(userId, 'Coding', gradeResult.score);
    }

    return {
      submission,
      grade: {
        score: gradeResult.score,
        isPassed: gradeResult.isPassed,
        feedback: gradeResult.feedback,
        codeReview: gradeResult.codeReview,
        strengths: gradeResult.strengths,
        improvements: gradeResult.improvements,
        isAiGraded: gradeResult.isAiGraded,
        attemptNumber
      }
    };
  },

  /**
   * Get submission history for a user on a challenge
   */
  async getSubmissions(userId, challengeId) {
    return codeChallengeRepository.getUserSubmissions(userId, challengeId);
  }
};
