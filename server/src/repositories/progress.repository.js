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

  async updateSkillScore(userId, skill, isCorrect) {
    if (!supabase) return null;

    // Check existing skill row
    const { data: existing } = await supabase
      .from('user_skill_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('skill', skill)
      .single();

    const totalQuestions = (existing?.total_questions || 0) + 1;
    const correctQuestions = (existing?.correct_questions || 0) + (isCorrect ? 1 : 0);
    const score = Math.round((correctQuestions / totalQuestions) * 100);

    const { data, error } = await supabase
      .from('user_skill_progress')
      .upsert({
        user_id: userId,
        skill,
        score,
        total_questions: totalQuestions,
        correct_questions: correctQuestions,
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
