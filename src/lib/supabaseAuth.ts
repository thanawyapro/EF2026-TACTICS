// supabaseAuth.ts
// Supabase Authentication Helper Actions

import { supabase, isSupabaseConfigured } from './supabaseClient';

export const supabaseAuth = {
  /**
   * Register a new user with Email and Password
   */
  async signUp(email: string, password: string, displayName?: string) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Please use local Guest Mode.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Log into an existing account with Email and Password
   */
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Please use local Guest Mode.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out the currently logged in session
   */
  async signOut() {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current active user session details
   */
  async getCurrentUser() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  /**
   * Register listener for authentication state updates
   */
  onAuthStateChange(callback: (session: any) => void) {
    if (!isSupabaseConfigured || !supabase) {
      return () => {}; // return empty unsubscribe handler
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }
};
