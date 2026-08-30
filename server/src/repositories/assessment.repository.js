import { supabase } from '../config/supabase.js';

export const assessmentRepository = {
  async getActivePlacementTest() {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getQuestionsByAssessmentId(assessmentId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('id, assessment_id, question, skill, type, options, difficulty, order_index')
      .eq('assessment_id', assessmentId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getQuestionsWithAnswers(assessmentId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createSubmission(submissionData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('assessment_submissions')
      .insert([submissionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveAnswers(answers) {
    if (!supabase || !answers.length) return [];
    const { data, error } = await supabase
      .from('assessment_answers')
      .insert(answers)
      .select();

    if (error) throw error;
    return data;
  },

  async getUserSubmissions(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
