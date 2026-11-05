import { createClient } from '@supabase/supabase-js';

const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined' && process.env
    ? process.env
    : {};

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false // Using custom clean state for college project demo
      }
    })
  : null;

/**
 * Live health check helper
 */
export const checkSupabaseStatus = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      mode: 'Local Engine (Awaiting Supabase .env keys)',
      url: supabaseUrl || 'Not set in website/.env',
      tablesCount: 0
    };
  }

  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return {
      connected: true,
      mode: 'Live Supabase Cloud Connected (PostgreSQL 15 + PostGIS)',
      url: supabaseUrl,
      usersCount: count || 0
    };
  } catch (err) {
    return {
      connected: false,
      mode: 'Connection Attempted but Failed',
      error: err.message,
      url: supabaseUrl
    };
  }
};
