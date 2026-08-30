import { supabase } from '../config/supabase.js';

export const courseRepository = {
  async getAllCourses() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getCourseById(courseId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        modules:modules (
          id,
          title,
          description,
          order_index,
          lessons:lessons (
            id,
            title,
            description,
            level,
            duration_minutes,
            order_index
          )
        )
      `)
      .eq('id', courseId)
      .single();

    if (error) throw error;
    return data;
  },

  async createCourse(courseData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
