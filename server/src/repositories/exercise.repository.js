import { supabase } from '../config/supabase.js';

export const exerciseRepository = {
  async getById(id) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByLessonId(lessonId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  async recordAttempt(attemptData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('user_exercise_attempts')
      .insert([attemptData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
