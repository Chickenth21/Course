import { supabase } from '../config/supabase.js';

export const learningPathRepository = {
  async getActiveByUserId(userId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        items:learning_path_items (
          id,
          topic,
          skill,
          lesson_id,
          order_index,
          status,
          reason
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createPath(pathData, items = []) {
    if (!supabase) return null;
    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .insert([pathData])
      .select()
      .single();

    if (pathError) throw pathError;

    if (items.length > 0) {
      const itemsWithId = items.map((item, idx) => ({
        ...item,
        learning_path_id: path.id,
        order_index: item.order_index ?? idx + 1
      }));

      const { data: insertedItems, error: itemsError } = await supabase
        .from('learning_path_items')
        .insert(itemsWithId)
        .select();

      if (itemsError) throw itemsError;
      path.items = insertedItems;
    }

    return path;
  },

  async updateItemStatus(itemId, status) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('learning_path_items')
      .update({ status })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
