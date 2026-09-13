import { supabase } from '../config/supabase.js';

export const codingRoadmapRepository = {
  /**
   * Get a user's roadmap for a specific course (with steps)
   */
  async getByUserAndCourse(userId, courseId) {
    if (!supabase) return null;
    const { data: roadmap, error } = await supabase
      .from('coding_roadmaps')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (error) throw error;
    if (!roadmap) return null;

    const { data: steps, error: stepsError } = await supabase
      .from('coding_roadmap_steps')
      .select(`
        *,
        lesson:lessons (
          id,
          title,
          description,
          duration_minutes,
          level
        )
      `)
      .eq('roadmap_id', roadmap.id)
      .order('order_index', { ascending: true });

    if (stepsError) throw stepsError;

    return { ...roadmap, steps: steps || [] };
  },

  /**
   * Create a new coding roadmap for a user/course pair (upsert)
   */
  async upsert(roadmapData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('coding_roadmaps')
      .upsert(roadmapData, { onConflict: 'user_id, course_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete existing steps for a roadmap (before regenerating)
   */
  async deleteSteps(roadmapId) {
    if (!supabase) return;
    const { error } = await supabase
      .from('coding_roadmap_steps')
      .delete()
      .eq('roadmap_id', roadmapId);

    if (error) throw error;
  },

  /**
   * Insert roadmap steps in bulk
   */
  async createSteps(steps) {
    if (!supabase || !steps.length) return [];
    const { data, error } = await supabase
      .from('coding_roadmap_steps')
      .insert(steps)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Update a step's status (pending → in_progress → completed)
   */
  async updateStepStatus(stepId, status) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('coding_roadmap_steps')
      .update({ status })
      .eq('id', stepId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mark the step associated with a lesson as in_progress when user starts
   */
  async markStepForLesson(roadmapId, lessonId, status = 'in_progress') {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('coding_roadmap_steps')
      .update({ status })
      .eq('roadmap_id', roadmapId)
      .eq('lesson_id', lessonId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
