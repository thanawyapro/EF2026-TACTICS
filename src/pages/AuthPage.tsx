// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { supabaseAuth } from '../lib/supabaseAuth';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { AuthCard } from '../components/auth/AuthCard';
import { useLanguage } from '../hooks/useLanguage';
import { AlertTriangle } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onContinueAsGuest: () => void;
}

export default function AuthPage({ onAuthSuccess, onContinueAsGuest }: AuthPageProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (email: string, pass: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await supabaseAuth.signIn(email, pass);
      onAuthSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || t('auth.errorAuth'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, pass: string, name?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await supabaseAuth.signUp(email, pass, name);
      setSuccessMsg(t('auth.successConfirmation', 'Check your email inbox to confirm registration and activate your account. You can then log into your lobby!'));
    } catch (err: any) {
      setErrorMsg(err.message || t('auth.errorAuth'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      // Create redirection URL pointing back to the /update-password route dynamically
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
      const redirectUrl = `${origin}/update-password`;
      
      await supabaseAuth.resetPasswordForEmail(email, redirectUrl);
      setSuccessMsg(t('auth.successResetSent'));
    } catch (err: any) {
      setErrorMsg(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-8 px-4" data-testid="auth-page">
      <div className="w-full max-w-md space-y-4">
        {/* Connection warnings for developers/users */}
        {!isSupabaseConfigured && (
          <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-3xl flex items-start gap-3 text-amber-200 text-xs font-semibold leading-relaxed select-none animate-fadeIn">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-400 uppercase block leading-none">
                LOCAL OFFLINE ACTIVE
              </span>
              <p className="text-[10px] text-gray-400 font-semibold leading-normal">
                Supabase credentials are not detected in your project environment secrets. App synchronization will run on your local web cache. You can use guest mode to save custom tactics locally.
              </p>
            </div>
          </div>
        )}

        <AuthCard
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          onResetPassword={handleResetPassword}
          onGuestClick={onContinueAsGuest}
          loading={loading}
          errorMsg={errorMsg}
          successMsg={successMsg}
        />
      </div>
    </div>
  );
}
export { AuthPage };
