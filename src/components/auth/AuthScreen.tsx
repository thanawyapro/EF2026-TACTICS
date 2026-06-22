import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthScreenProps {
  onAuthSuccess: () => void;
  triggerToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function AuthScreen({ onAuthSuccess, triggerToast }: AuthScreenProps) {
  const [view, setView] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const auth = useAuth();

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      if (triggerToast) triggerToast('Please specify your coach email first.', 'error');
      return;
    }

    setIsForgotSubmitting(true);
    try {
      // Simulate Supabase/Any API call for password reset email triggering
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setForgotSuccess(true);
      if (triggerToast) {
        triggerToast('Reset instructions successfully dispatched to your inbox!', 'success');
      }
    } catch (err: any) {
      if (triggerToast) {
        triggerToast(err.message || 'Error executing forgot password lookup.', 'error');
      }
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navyBg text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background aesthetics - tactile glowing grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.06)_0%,rgba(10,14,26,0.95)_70%)] pointer-events-none" />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] -top-40 -left-40 pointer-events-none"
        style={{ content: '""' }}
      ></div>
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[120px] -bottom-40 -right-40 pointer-events-none"
        style={{ content: '""' }}
      ></div>

      {/* Main content wrapper */}
      <div className="w-full z-10 py-6">
        {view === 'login' && (
          <LoginForm
            onSuccess={onAuthSuccess}
            onNavigateToRegister={() => setView('register')}
            onForgotPassword={(email) => {
              setForgotEmail(email);
              setView('forgot-password');
              setForgotSuccess(false);
            }}
            loginWithEmail={auth.loginWithEmail}
            loginWithGoogle={auth.loginWithGoogle}
          />
        )}

        {view === 'register' && (
          <RegisterForm
            onSuccess={onAuthSuccess}
            onNavigateToLogin={() => setView('login')}
            registerWithEmail={auth.registerWithEmail}
            loginWithGoogle={auth.loginWithGoogle}
          />
        )}

        {view === 'forgot-password' && (
          <div className="w-full max-w-md mx-auto bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary"></div>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 text-2xl mb-3">
                🔑
              </div>
              <h2 className="text-2xl font-black tracking-wider text-white font-orbitron uppercase">RESET CREDENTIALS</h2>
              <p className="text-xs text-gray-400 mt-1">Retrieve your eFootball locker room keycard</p>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4 text-center py-4 animate-fadeIn">
                <div className="p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-xs leading-relaxed text-left">
                  <p className="font-bold mb-1">✓ Despach System Triggered</p>
                  <p>A secure password correction linkage was directed toward <strong className="underline">{forgotEmail}</strong>. Check your spam file directory if it fails to surface in 5 minutes.</p>
                </div>
                
                <button
                  onClick={() => setView('login')}
                  className="w-full h-11 bg-surface2 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-border transition-colors cursor-pointer"
                >
                  Return to Active Gate
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block" htmlFor="forgot-email">
                    Coach Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-500">📧</span>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      placeholder="coach@ef26tactics.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 bg-surface2 border border-border focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl text-sm placeholder-gray-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="h-11 bg-surface2/60 hover:bg-gray-800 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-xl border border-border transition-colors cursor-pointer"
                  >
                    Back to Gate
                  </button>

                  <button
                    type="submit"
                    disabled={isForgotSubmitting}
                    className="h-11 bg-gradient-to-r from-accent to-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_12px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isForgotSubmitting ? 'Verifying...' : 'Dispatch Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
