import { useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase, getServerUrl } from '../utils/supabase';

export default function Login() {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'register') {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const name = `${firstName.trim()} ${lastName.trim()}`.trim();

        try {
          const res = await fetch(`${getServerUrl()}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
        } catch (e: any) {
          // If custom signup server fails, fallback to Supabase standard auth
          if (e.message !== "Failed to fetch") {
             console.warn("Custom signup endpoint failed, using direct Supabase signup", e);
          }
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } }
          });
          if (signUpError) throw signUpError;
        }
        
        // Auto sign-in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
      
      // Initialize storage on login/signup just to be safe
      try {
        await fetch(`${getServerUrl()}/init-storage`, { method: 'POST' });
      } catch (e) {
        // Ignore initialization failure if server is unreachable
      }
      
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center relative">
      <div className="absolute inset-0" style={{ 
        backgroundImage: "linear-gradient(141.34deg, rgba(209, 225, 250, 0.3) 0%, rgb(248, 249, 250) 50%, rgba(57, 87, 113, 0.1) 100%)" 
      }} />
      <div className="z-10 bg-white/80 backdrop-blur-xl p-10 rounded-[32px] shadow-2xl w-full max-w-md border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#214059] mb-2">The Architect</h1>
          <p className="text-sm font-medium text-[#44474c] uppercase tracking-wider">DESIGN YOUR UNIVERSE</p>
        </div>

        {error && <div className="bg-red-50/80 backdrop-blur-sm text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          {view === 'register' && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#214059] mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-sm p-3 rounded-xl text-[#214059] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#214059] transition-all"
                  required
                  placeholder="First"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#214059] mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-sm p-3 rounded-xl text-[#214059] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#214059] transition-all"
                  required
                  placeholder="Last"
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#214059] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/50 backdrop-blur-sm p-3 rounded-xl text-[#214059] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#214059] transition-all"
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#214059] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 backdrop-blur-sm p-3 rounded-xl text-[#214059] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#214059] transition-all"
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          {view === 'register' && (
            <div>
              <label className="block text-sm font-medium text-[#214059] mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-sm p-3 rounded-xl text-[#214059] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#214059] transition-all"
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#214059] text-white font-semibold py-3 rounded-xl hover:bg-[#1a3347] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 mt-6"
          >
            {loading ? 'Processing...' : view === 'register' ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#44474c] text-sm">
            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => {
                setView(view === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-[#214059] font-semibold hover:underline"
            >
              {view === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
