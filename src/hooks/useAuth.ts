import { useState, useCallback } from 'react';
import { User, AuthState } from '../types';

// Placeholder Supabase configurations could go here:
// import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: {
      id: 'usr_ef26_7931',
      email: 'efootball.pro@example.com',
      username: 'tactician_26',
      displayName: 'Captain Tactician',
      isPro: true,
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });

  const loginWithGoogle = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      // Supabase Google OAuth integration:
      // const { data, error } = await supabase.auth.signInWithOAuth({
      //   provider: 'google',
      //   options: { redirectTo: window.location.origin }
      // });
      // if (error) throw error;

      // Mocking successful integration for UI preview
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const googleUser: User = {
        id: 'usr_google_idx',
        email: 'hfarahat51@gmail.com',
        username: 'hfarahat_ef26',
        displayName: 'Hassan Farahat',
        isPro: true,
      };
      setState({
        user: googleUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (err: any) {
      setState((s) => ({ ...s, isLoading: false, error: err.message || 'Google Sign-in failed' }));
      return { success: false, error: err.message };
    }
  }, []);

  const loginWithEmail = useCallback(async (email: string, pass: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      // Supabase email credentials integration:
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      // if (error) throw error;

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (email.toLowerCase() === 'error@example.com') {
        throw new Error('Invalid email or password combination. Try again.');
      }

      const emailUser: User = {
        id: 'usr_email_idx',
        email: email,
        username: email.split('@')[0],
        displayName: email.split('@')[0].toUpperCase(),
        isPro: false,
      };
      setState({
        user: emailUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (err: any) {
      setState((s) => ({ ...s, isLoading: false, error: err.message || 'Authentication failed' }));
      return { success: false, error: err.message };
    }
  }, []);

  const registerWithEmail = useCallback(async (email: string, pass: string, username: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      // Supabase registration integration:
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password: pass,
      //   options: { data: { username } }
      // });
      // if (error) throw error;

      await new Promise((resolve) => setTimeout(resolve, 1800));
      if (email.toLowerCase() === 'taken@example.com') {
        throw new Error('This email address is already registered.');
      }

      const newUser: User = {
        id: 'usr_new_idx',
        email: email,
        username: username || email.split('@')[0],
        displayName: username || 'New Tactician',
        isPro: false,
      };
      setState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (err: any) {
      setState((s) => ({ ...s, isLoading: false, error: err.message || 'Registration failed' }));
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      // Supabase logout integration:
      // await supabase.auth.signOut();

      await new Promise((resolve) => setTimeout(resolve, 500));
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setState((s) => ({ ...s, isLoading: false, error: err.message }));
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return { success: false, error: 'No authenticated user found.' };
    setState((s) => ({ ...s, isLoading: true }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedUser = { ...state.user, ...updates };
      setState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (err: any) {
      setState((s) => ({ ...s, isLoading: false, error: err.message }));
      return { success: false, error: err.message };
    }
  }, [state.user]);

  return {
    ...state,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    updateProfile,
  };
}
