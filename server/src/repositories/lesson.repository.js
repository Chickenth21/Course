import { supabase } from '../config/supabase.js';

export const lessonRepository = {
  async getLessonById(lessonId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        exercises:exercises (
          id,
          type,
          instructions,
          question,
          options,
          difficulty,
          order_index
        )
      `)
      .eq('id', lessonId)
      .single();

    if (error) throw error;
    return data;
  },

  async createLesson(lessonData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('lessons')
      .insert([lessonData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getLessonsByModuleId(moduleId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  }
};
