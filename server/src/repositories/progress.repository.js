import { supabase } from '../config/supabase.js';

export const progressRepository = {
  async getUserSkills(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('user_skill_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  /**
   * Update a skill score using a weighted running average of actual submission scores.
   * @param {string} userId
   * @param {string} skill - e.g. 'Reading', 'Writing'
   * @param {number|boolean} scoreOrCorrect - Numeric 0-100 score (new) OR boolean correct/incorrect (legacy)
   */
  async updateSkillScore(userId, skill, scoreOrCorrect) {
    if (!supabase) return null;

    // Normalise: legacy callers pass boolean, new callers pass numeric
    const newScore = typeof scoreOrCorrect === 'boolean'
      ? (scoreOrCorrect ? 80 : 40)  // Legacy fallback
      : Math.max(0, Math.min(100, Math.round(scoreOrCorrect)));

    // Fetch existing record
    const { data: existing } = await supabase
      .from('user_skill_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('skill', skill)
      .maybeSingle();

    // Weighted running average: give recent submissions more weight
    const prevScore = existing?.score || 0;
    const totalSessions = (existing?.total_questions || 0) + 1;
    // Exponential moving average with alpha=0.3 (recent bias)
    const alpha = totalSessions <= 3 ? 0.5 : 0.3;
    const updatedScore = Math.round(existing ? prevScore * (1 - alpha) + newScore * alpha : newScore);

    const { data, error } = await supabase
      .from('user_skill_progress')
      .upsert({
        user_id: userId,
        skill,
        score: updatedScore,
        total_questions: totalSessions,
        correct_questions: (existing?.correct_questions || 0) + (newScore >= 65 ? 1 : 0),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, skill' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },


  async updateLessonProgress(userId, lessonId, status, score = 0) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        status,
        score,
        ...(status === 'completed' && { completed_at: new Date().toISOString() }),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, lesson_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserLessonProgress(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .select(`
        *,
        lesson:lessons (
          id,
          title,
          level,
          module_id
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }
};
