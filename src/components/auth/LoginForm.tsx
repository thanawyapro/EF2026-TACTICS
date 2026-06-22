import React, { useState, FormEvent } from 'react';

interface LoginFormProps {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
  onForgotPassword: (email: string) => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
}

export function LoginForm({
  onSuccess,
  onNavigateToRegister,
  onForgotPassword,
  loginWithEmail,
  loginWithGoogle,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please supply both your registered email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected connection error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg(res.error || 'Google Sign-in failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during Google authentication.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden">
      {/* Visual Accent Overlay */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>
      
      {/* Tech Branding Head */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 text-2xl mb-3">
          ⚽
        </div>
        <h2 className="text-2xl font-black tracking-wider text-white font-orbitron uppercase">EF26 TACTICS</h2>
        <p className="text-xs text-gray-400 mt-1">Deploy elite eFootball strategies on your dashboard</p>
      </div>

      {/* Social Oauth Option */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading || googleLoading}
        type="button"
        className="w-full h-12 flex items-center justify-center gap-3 px-4 py-2.5 bg-surface2 hover:bg-gray-800 text-white rounded-xl border border-border hover:border-primary/50 font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        {googleLoading ? (
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.147 2.78-1.5 3.69v3.06h2.41c1.4-1.3 2.22-3.2 2.22-5.6z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.07-2.38c-.85.57-1.95.91-3.14.91-2.42 0-4.48-1.64-5.21-3.84H2.1v3.13C4.1 23.44 7.8 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M6.79 13.82c-.19-.57-.3-1.17-.3-1.82s.11-1.25.3-1.82V7.05H2.1a11.988 11.988 0 000 9.9l4.69-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.8 0 4.1 1.56 2.1 4.75l4.69 3.13c.73-2.2 2.79-3.84 5.21-3.84z"
            />
          </svg>
        )}
        <span className="text-sm">Sign in with Google</span>
      </button>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-border/80"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-xs font-semibold uppercase tracking-wider">or with electronic mail</span>
        <div className="flex-grow border-t border-border/80"></div>
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs leading-relaxed flex items-start gap-2.5 animate-fadeIn">
          <span className="text-base select-none">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Traditional Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-gray-500">📧</span>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="coach@efootball.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-surface2 border border-border focus:border-primary focus:glow-active text-white rounded-xl text-sm placeholder-gray-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block" htmlFor="password">
              Password
            </label>
            <button
              type="button"
              onClick={() => onForgotPassword(email)}
              className="text-xs font-semibold text-primary hover:text-accent tracking-wider transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-gray-500">🔒</span>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-surface2 border border-border focus:border-primary focus:glow-active text-white rounded-xl text-sm placeholder-gray-500 transition-all outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || googleLoading}
          className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-[0_4px_12px_rgba(0,212,255,0.2)] hover:shadow-[0_4px_20px_rgba(0,212,255,0.4)] active:scale-[0.98] hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Formulating Entry...</span>
            </div>
          ) : (
            'Access Locker Room ➔'
          )}
        </button>
      </form>

      {/* Switch Screens Dialog */}
      <div className="text-center mt-6 pt-5 border-t border-border/40">
        <p className="text-xs text-gray-400">
          New to EF26 Tactics?{' '}
          <button
            onClick={onNavigateToRegister}
            className="text-primary font-bold hover:text-accent transition-colors ml-1 cursor-pointer"
          >
            Create Tactics Profile
          </button>
        </p>
      </div>
    </div>
  );
}
