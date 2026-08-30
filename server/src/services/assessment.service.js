import { assessmentRepository } from '../repositories/assessment.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { progressRepository } from '../repositories/progress.repository.js';

export const assessmentService = {
  /**
   * Get active placement test for a user to take
   * Hides correct_answer and explanation to prevent cheating
   */
  async getTestForTaking() {
    const test = await assessmentRepository.getActivePlacementTest();
    if (!test) {
      const error = new Error('Không tìm thấy bài kiểm tra đầu vào');
      error.statusCode = 404;
      throw error;
    }

    const questions = await assessmentRepository.getQuestionsByAssessmentId(test.id);

    // Sanitize: ensure no answers leaked
    const sanitizedQuestions = questions.map(({ correct_answer, explanation, ...rest }) => rest);

    return {
      ...test,
      questions: sanitizedQuestions
    };
  },

  /**
   * Deterministically evaluate submission
   */
  async submitTest(userId, assessmentId, userAnswers = {}) {
    // 1. Fetch full questions with correct answers
    const questions = await assessmentRepository.getQuestionsWithAnswers(assessmentId);
    if (!questions || questions.length === 0) {
      const error = new Error('Không tìm thấy câu hỏi của bài kiểm tra này');
      error.statusCode = 404;
      throw error;
    }

    let totalScore = 0;
    const skillStats = {}; // { Grammar: { total: 0, correct: 0 }, ... }
    const answersToSave = [];
    const weakAreas = new Set();
    const strongAreas = new Set();

    // 2. Score each question
    for (const q of questions) {
      const skill = q.skill || 'General';
      if (!skillStats[skill]) {
        skillStats[skill] = { total: 0, correct: 0 };
      }
      skillStats[skill].total += 1;

      const userAnswer = (userAnswers[q.id] || '').trim();
      const isCorrect = userAnswer.toLowerCase() === (q.correct_answer || '').trim().toLowerCase();

      if (isCorrect) {
        totalScore += 1;
        skillStats[skill].correct += 1;
        strongAreas.add(`${skill} (${q.difficulty})`);
      } else {
        weakAreas.add(`${skill} (${q.difficulty})`);
      }

      answersToSave.push({
        question_id: q.id,
        user_answer: userAnswer,
        is_correct: isCorrect
      });

      // Update skill progress in user_skill_progress table
      if (userId) {
        await progressRepository.updateSkillScore(userId, skill, isCorrect);
      }
    }

    const totalQuestions = questions.length;
    const percentage = Math.round((totalScore / totalQuestions) * 100);

    // 3. Estimate CEFR Level based on deterministic percentage & difficulty breakdown
    let estimatedLevel = 'A1';
    if (percentage >= 90) estimatedLevel = 'C1';
    else if (percentage >= 75) estimatedLevel = 'B2';
    else if (percentage >= 50) estimatedLevel = 'B1';
    else if (percentage >= 30) estimatedLevel = 'A2';
    else estimatedLevel = 'A1';

    // Calculate percentages per skill
    const skillScores = {};
    for (const [skill, stats] of Object.entries(skillStats)) {
      skillScores[skill] = Math.round((stats.correct / stats.total) * 100);
    }

    // 4. Update user's current level in user profile
    if (userId) {
      await userRepository.updateLevel(userId, estimatedLevel);
    }

    // 5. Create submission record
    const submission = await assessmentRepository.createSubmission({
      user_id: userId,
      assessment_id: assessmentId,
      total_score: totalScore,
      total_questions: totalQuestions,
      estimated_level: estimatedLevel,
      skill_scores: skillScores,
      weak_areas: Array.from(weakAreas),
      strong_areas: Array.from(strongAreas),
      qualitative_feedback: `Bạn đạt ${totalScore}/${totalQuestions} điểm (${percentage}%). Trình độ ước tính: ${estimatedLevel}.`
    });

    // 6. Save individual answer rows
    const answersWithSubmissionId = answersToSave.map((a) => ({
      ...a,
      submission_id: submission.id
    }));
    await assessmentRepository.saveAnswers(answersWithSubmissionId);

    // 7. Build question-by-question review for response
    const questionReview = questions.map((q) => {
      const userAnswerObj = answersToSave.find((a) => a.question_id === q.id);
      return {
        id: q.id,
        question: q.question,
        skill: q.skill,
        difficulty: q.difficulty,
        options: q.options,
        user_answer: userAnswerObj ? userAnswerObj.user_answer : '',
        correct_answer: q.correct_answer,
        is_correct: userAnswerObj ? userAnswerObj.is_correct : false,
        explanation: q.explanation
      };
    });

    return {
      submissionId: submission.id,
      totalScore,
      totalQuestions,
      percentage,
      estimatedLevel,
      skillScores,
      weakAreas: Array.from(weakAreas),
      strongAreas: Array.from(strongAreas),
      questionReview
    };
  }
};
