import React, { useState } from 'react';

const backgroundSvg = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate login - in real app, this would call Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrialStart = () => {
    // Start trial immediately without signup
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-background flex items-center justify-center relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/30 via-background to-primary-container/10"></div>
        <div className={`absolute inset-0 bg-[url('${backgroundSvg}')] opacity-20 scale-110`}></div>
      </div>

      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-[480px] px-6 py-12">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <h1 className="font-headline text-primary text-3xl font-extrabold tracking-tighter mb-2">
            The Architect
          </h1>
          <p className="text-on-surface-variant text-sm font-medium tracking-wide">
            DESIGN YOUR UNIVERSE
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel rounded-xl shadow-[0_12px_40px_rgba(25,28,29,0.06)] p-10 flex flex-col gap-8 border border-white/20">
          <div className="space-y-2">
            <h2 className="font-headline text-2xl text-primary">Welcome back</h2>
            <p className="text-on-surface-variant text-sm">
              Please enter your credentials to access your worlds.
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none">
                  mail
                </span>
                <input
                  className="w-full bg-surface-container-highest/50 border-none rounded-md py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant font-medium text-sm"
                  id="email"
                  type="email"
                  placeholder="da-vinci@architect.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <a className="text-xs font-medium text-primary hover:underline" href="#">
                  Forgot?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none">
                  lock
                </span>
                <input
                  className="w-full bg-surface-container-highest/50 border-none rounded-md py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant font-medium text-sm"
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-error text-sm text-center">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-4">
              <button
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold py-4 rounded-full shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-outline-variant/30"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-tighter">
                  <span className="bg-transparent px-2 text-on-surface-variant font-medium">
                    New to the craft?
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-surface-container-low hover:bg-surface-container-high text-primary font-semibold py-4 rounded-full transition-colors active:scale-95 duration-200"
                type="button"
                onClick={handleTrialStart}
              >
                Try for 5 minutes
              </button>
            </div>
          </form>

          {/* Social/Alternative Links */}
          <div className="flex justify-center gap-6">
            <button
              aria-label="Sign in with Apple"
              className="p-3 rounded-full bg-white/50 hover:bg-white transition-colors border border-outline-variant/10 shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">apple</span>
            </button>
            <button
              aria-label="Sign in with Google"
              className="p-3 rounded-full bg-white/50 hover:bg-white transition-colors border border-outline-variant/10 shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">google</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 flex justify-center gap-6 text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Help
          </a>
        </footer>
      </main>
    </div>
  );
};
