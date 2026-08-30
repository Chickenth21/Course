import { supabase } from '../config/supabase.js';

export const userRepository = {
  async findByEmail(email) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findById(id) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(userData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email.toLowerCase().trim(),
        password_hash: userData.passwordHash,
        full_name: userData.fullName,
        role: userData.role || 'student',
        current_level: userData.currentLevel || 'A1',
        target_level: userData.targetLevel || 'B2'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLevel(userId, currentLevel, targetLevel) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .update({
        current_level: currentLevel,
        ...(targetLevel && { target_level: targetLevel }),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
