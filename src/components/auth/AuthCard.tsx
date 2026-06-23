// src/components/auth/AuthCard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudLightning, Shield, User, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

interface AuthCardProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onSignUp: (email: string, pass: string, name?: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
  onGuestClick: () => void;
  loading: boolean;
  errorMsg: string | null;
  successMsg: string | null;
}

export function AuthCard({
  onLogin,
  onSignUp,
  onResetPassword,
  onGuestClick,
  loading,
  errorMsg,
  successMsg
}: AuthCardProps) {
  const { t } = useLanguage();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  return (
    <div className="bg-slate-950/85 border border-border/80 rounded-3xl p-6 sm:p-8 max-w-md mx-auto shadow-2xl space-y-6 relative overflow-hidden animate-fadeIn" data-testid="auth-card">
      {/* Dynamic top visual indicator element */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

      {/* Header section with brand/tagline */}
      <div className="text-center space-y-2 select-none">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-3">
          <CloudLightning className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-lg font-black font-orbitron tracking-wider text-white uppercase">
          {authMode === 'forgot' 
            ? t('auth.forgotPassword') 
            : authMode === 'register' 
            ? t('auth.register') 
            : t('auth.login')
          }
        </h2>
        <p className="text-[11px] text-gray-400 max-w-[280px] mx-auto leading-normal font-semibold">
          {authMode === 'register'
            ? t('auth.registerSubtitle', 'Join eFootball tacticians and backup your setups instantly.')
            : t('auth.loginSubtitle', 'Synchronize your custom squads and formations securely in the cloud.')
          }
        </p>
      </div>

      {/* Mode selectors (Visible only for non-forgot password views) */}
      {authMode !== 'forgot' && (
        <div className="flex border-b border-border/45 pb-0.5">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); }}
            className={`flex-1 pb-3 text-xs font-black font-orbitron tracking-widest uppercase transition-colors relative cursor-pointer ${
              authMode === 'login' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t('auth.login')}
            {authMode === 'login' && (
              <motion.div layoutId="authUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); }}
            className={`flex-1 pb-3 text-xs font-black font-orbitron tracking-widest uppercase transition-colors relative cursor-pointer ${
              authMode === 'register' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t('auth.register')}
            {authMode === 'register' && (
              <motion.div layoutId="authUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      )}

      {/* Main Switcher Form Container */}
      <div className="min-h-[180px]">
        {authMode === 'login' && (
          <LoginForm
            onLogin={onLogin}
            onForgotPasswordClick={() => setAuthMode('forgot')}
            loading={loading}
            errorMsg={errorMsg}
          />
        )}

        {authMode === 'register' && (
          <RegisterForm
            onSignUp={onSignUp}
            loading={loading}
            errorMsg={errorMsg}
          />
        )}

        {authMode === 'forgot' && (
          <ForgotPasswordForm
            onResetPassword={onResetPassword}
            onBackToLogin={() => setAuthMode('login')}
            loading={loading}
            errorMsg={errorMsg}
            successMsg={successMsg}
          />
        )}
      </div>

      {/* Guest Mode option */}
      <div className="pt-4 border-t border-border/45 text-center space-y-2 select-none">
        <button
          type="button"
          onClick={onGuestClick}
          className="text-xs text-gray-300 hover:text-primary font-black underline cursor-pointer inline-flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5" />
          <span>{t('auth.guest')}</span>
        </button>
        
        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-border/45 text-left flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-normal">
            <span className="text-[10px] text-gray-200 font-black uppercase block">
              {t('auth.guestModeActive')}
            </span>
            <p className="text-[9px] text-gray-400 font-semibold leading-relaxed">
              {t('auth.guestModeDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Secure footer tagline */}
      <div className="pt-2 border-t border-border/40 text-center select-none text-[8.5px] text-gray-500 font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
        <Shield className="w-3 text-primary" />
        <span>ROW LEVEL SECURITY LAB ENFORCED</span>
      </div>
    </div>
  );
}
export default AuthCard;
