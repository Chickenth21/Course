import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { config } from './index.js';

let supabaseClient = null;

if (config.supabase.url && config.supabase.publishableKey) {
  try {
    supabaseClient = createClient(config.supabase.url, config.supabase.publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      realtime: {
        transport: ws
      }
    });
    console.log('✅ Supabase client initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error.message);
  }
} else {
  console.warn('⚠️ Supabase credentials missing in .env');
}

export const supabase = supabaseClient;
