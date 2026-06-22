// supabaseClient.ts
// Secure Supabase Client initiation with fallback checks

import { createClient } from '@supabase/supabase-js';

const supabaseEnv = (import.meta as any).env || {};
const supabaseUrl = (supabaseEnv.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (supabaseEnv.VITE_SUPABASE_ANON_KEY || '').trim();

// Verify key completeness and reject empty placeholders or standard templates safely
export const isSupabaseConfigured = 
  supabaseUrl.length > 0 && 
  supabaseAnonKey.length > 0 && 
  !supabaseUrl.includes('your_supabase_project_url') &&
  !supabaseAnonKey.includes('your_supabase_anon_key');

// Create a single client instance that can be used throughout the app
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment parameters are not present or configured. EF26 Tactics is falling back to standard client local storage Guest Mode.'
  );
}
