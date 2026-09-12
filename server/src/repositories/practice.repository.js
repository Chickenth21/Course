import { supabase } from '../config/supabase.js';

export const practiceRepository = {
  /**
   * Get all active practice topics filtered by type and/or level.
   */
  async getTopicsByTypeAndLevel(type, level) {
    if (!supabase) return [];

    let query = supabase
      .from('practice_topics')
      .select('id, type, level, title, instructions, target_word_count, vocabulary_hints, order_index')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (type) query = query.eq('type', type);
    if (level) query = query.eq('level', level);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single topic by ID (includes source_text and reference_translation).
   * Returns null (not throws) when topic is not found.
   */
  async getTopicById(topicId) {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('practice_topics')
      .select('*')
      .eq('id', topicId)
      .eq('is_active', true)
      .maybeSingle();  // Returns null instead of error when not found

    if (error) throw error;
    return data;
  },

  /**
   * Save an inline AI-generated topic (hidden from public catalogue).
   * Called before saving a submission so we always have a topic FK.
   */
  async saveInlineTopic(topicData) {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('practice_topics')
      .insert([{
        ...topicData,
        order_index: 999,
        is_active: false  // Never shown in public catalogue
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Save a practice submission with full Gemini AI feedback.
   */
  async saveSubmission(submissionData) {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('practice_submissions')
      .insert([submissionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get a user's submission history (optionally filtered by type).
   */
  async getUserSubmissions(userId, type) {
    if (!supabase) return [];

    let query = supabase
      .from('practice_submissions')
      .select(`
        id,
        submission_type,
        overall_score,
        cefr_band,
        feedback_summary,
        word_count,
        is_ai_graded,
        created_at,
        practice_topics ( id, title, level, type )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (type) query = query.eq('submission_type', type);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single submission by ID (with full feedback for review).
   */
  async getSubmissionById(submissionId, userId) {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('practice_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }
};
