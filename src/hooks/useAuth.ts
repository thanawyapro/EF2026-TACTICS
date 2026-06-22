// useAuth.ts
// Custom React Hook to manage Authentication session states

import { useState, useEffect } from 'react';
import { supabaseAuth } from '../lib/supabaseAuth';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export interface AuthState {
  user: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  isCloudMode: boolean; // True if Supabase is configured AND the user is logged in
  isSupabaseAvailable: boolean; // True if VITE_ keys are provided
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
    isCloudMode: false,
    isSupabaseAvailable: isSupabaseConfigured,
    error: null,
  });

  useEffect(() => {
    let unsubscribe = () => {};

    if (isSupabaseConfigured) {
      // 1. Fetch initial user session
      supabaseAuth.getCurrentUser().then((user) => {
        setState((prev) => ({
          ...prev,
          user,
          loading: false,
          isAuthenticated: !!user,
          isCloudMode: !!user,
        }));
      }).catch((err) => {
        console.error('Failed to get initial Supabase user:', err);
        setState((prev) => ({ ...prev, loading: false, error: err.message }));
      });

      // 2. Set up event subscriber for auth transitions
      unsubscribe = supabaseAuth.onAuthStateChange((session) => {
        const user = session?.user || null;
        setState((prev) => ({
          ...prev,
          user,
          loading: false,
          isAuthenticated: !!user,
          isCloudMode: !!user,
        }));
      });
    } else {
      // Fallback immediately to Guest Mode if Supabase parameters are absent
      setState((prev) => ({
        ...prev,
        loading: false,
        isAuthenticated: false,
        isCloudMode: false,
      }));
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await supabaseAuth.signIn(email, pass);
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message || 'Login failed' }));
      throw err;
    }
  };

  const signUp = async (email: string, pass: string, name?: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await supabaseAuth.signUp(email, pass, name);
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message || 'Registration failed' }));
      throw err;
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await supabaseAuth.signOut();
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message }));
      throw err;
    }
  };

  return {
    ...state,
    login,
    signUp,
    logout,
  };
}
export default useAuth;
