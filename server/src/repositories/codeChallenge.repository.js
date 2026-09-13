import { supabase } from '../config/supabase.js';

export const codeChallengeRepository = {
  /**
   * Get all challenges for a lesson (strips solution_code for security)
   */
  async getByLessonId(lessonId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('code_challenges')
      .select('id, lesson_id, title, description, starter_code, test_cases, hints, difficulty, concepts, order_index')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Get a single challenge WITH solution_code (for AI grading only — server-side)
   */
  async getByIdWithSolution(challengeId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('code_challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Save a code submission after AI grading
   */
  async createSubmission(submissionData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('code_submissions')
      .insert([submissionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user's submission history for a challenge
   */
  async getUserSubmissions(userId, challengeId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('code_submissions')
      .select('id, ai_score, ai_feedback, ai_strengths, ai_improvements, is_passed, attempt_number, is_ai_graded, created_at')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get the next attempt number for a user/challenge pair
   */
  async getNextAttemptNumber(userId, challengeId) {
    if (!supabase) return 1;
    const { count, error } = await supabase
      .from('code_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('challenge_id', challengeId);

    if (error) throw error;
    return (count || 0) + 1;
  },

  /**
   * Get best score for a user on a challenge
   */
  async getBestScore(userId, challengeId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('code_submissions')
      .select('ai_score, is_passed')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .order('ai_score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Get all challenges for a lesson with user completion status
   */
  async getByLessonIdWithStatus(lessonId, userId) {
    if (!supabase) return [];
    const { data: challenges, error } = await supabase
      .from('code_challenges')
      .select('id, lesson_id, title, description, starter_code, test_cases, hints, difficulty, concepts, order_index')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    if (!challenges?.length) return [];

    // Fetch best scores for all challenges in one query
    const challengeIds = challenges.map(c => c.id);
    const { data: submissions } = await supabase
      .from('code_submissions')
      .select('challenge_id, ai_score, is_passed')
      .eq('user_id', userId)
      .in('challenge_id', challengeIds)
      .order('ai_score', { ascending: false });

    // Map best score per challenge
    const bestScores = {};
    (submissions || []).forEach(s => {
      if (!bestScores[s.challenge_id] || s.ai_score > bestScores[s.challenge_id].ai_score) {
        bestScores[s.challenge_id] = s;
      }
    });

    return challenges.map(c => ({
      ...c,
      userBestScore: bestScores[c.id]?.ai_score ?? null,
      isPassed: bestScores[c.id]?.is_passed ?? false
    }));
  }
};
