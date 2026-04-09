import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { authService } from '../services/auth';
import { getServerUrl } from '../utils/supabase';

export default function Login() {
  const [view, setView] = useState<'login' | 'register' | 'confirm'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Handle email confirmation from URL parameters
  useEffect(() => {
    const message = searchParams.get('message');
    const error = searchParams.get('error');
    
    if (message) {
      setSuccess(decodeURIComponent(message));
    }
    if (error) {
      setError(decodeURIComponent(error));
    }
  }, [searchParams]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const resendConfirmationEmail = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    try {
      const { error } = await authService.resendConfirmationEmail(email);

      if (error) {
        throw error;
      }

      setSuccess('Confirmation code has been resent. Please check your inbox.');
    } catch (err: any) {
      setError(`Failed to resend confirmation code: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!email || !confirmationCode) {
        throw new Error('Please enter both email and confirmation code');
      }

      const { data, error } = await authService.confirmSignUp(email, confirmationCode);
      
      if (error) {
        throw error;
      }

      setSuccess('Account confirmed successfully! You can now log in.');
      setLoading(false);
      
      // Switch to login view after successful confirmation
      setTimeout(() => {
        setView('login');
        setSuccess('Account confirmed! Please sign in with your credentials.');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Invalid confirmation code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (view === 'register') {
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error('Please enter both first and last name');
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        // Check if user already exists using Supabase's built-in protection
        // First, attempt to sign up
        const { data, error: signUpError } = await authService.signUp(email, password, firstName.trim(), lastName.trim());
        
        console.log('Signup attempt result:', { data, signUpError });
        
        // Supabase trick: if email enumeration protection is ON, it returns a user but with an empty identities array for duplicates
        if (authService.checkIfUserExists(data)) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        
        if (signUpError) {
          console.error('Signup error details:', signUpError);
          if (signUpError.message.includes('User already registered') || 
              signUpError.message.includes('user_already_exists')) {
            throw new Error('An account with this email already exists. Please sign in instead.');
          }
          throw new Error(`Registration failed: ${signUpError.message}`);
        }

        // Handle different signup scenarios
        if (authService.isEmailConfirmationNeeded(data)) {
          // Email verification required - user created but not logged in
          setSuccess('Account created successfully! Please check your email for a confirmation code.');
          setLoading(false);
          
          // Switch to confirmation view after successful registration
          setTimeout(() => {
            setView('confirm');
            setSuccess('Registration complete! Enter the confirmation code from your email to activate your account.');
          }, 3000);
          return;
        } else if (authService.isUserImmediatelyLoggedIn(data)) {
          // Email verification off and user is logged in immediately
          setSuccess('Account created and logged in successfully! Redirecting...');
          
          // Initialize storage if needed
          try {
            await fetch(`${getServerUrl()}/init-storage`, { method: 'POST' });
          } catch (e) {
            console.warn('Storage initialization failed:', e);
          }
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate('/');
          }, 1500);
          return;
        } else {
          // Fallback success message
          setSuccess('Registration successful. Please proceed to sign in.');
          setLoading(false);
          return;
        }
      } else {
        // Login flow
        const { error: signInError } = await authService.signIn(email, password);
        
        if (signInError) {
          console.error('Login error details:', signInError);
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('Incorrect email or password. Please try again.');
          }
          if (signInError.message.includes('Email not confirmed')) {
            throw new Error('Please check your email and confirm your account before signing in. Click "Resend Confirmation" if you need a new confirmation email.');
          }
          throw new Error(`Login failed: ${signInError.message}`);
        }
        
        setSuccess('Login successful! Redirecting...');
      }
      
      // Initialize storage if needed
      try {
        await fetch(`${getServerUrl()}/init-storage`, { method: 'POST' });
      } catch (e) {
        // Ignore initialization failure
        console.warn('Storage initialization failed:', e);
      }
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err: any) {
      console.error('Auth error:', err);
      const isDuplicate = err.message?.includes('already exists') || 
                         err.message?.includes('already registered') || 
                         err.message?.includes('already taken');
      
      if (isDuplicate) {
        setError('This email is already taken. Please sign up with another email or log into your existing account.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
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
          {view === 'confirm' && (
            <p className="text-sm text-[#44474c] mt-4">Enter the confirmation code from your email</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
            {(error.includes('confirm your account') || error.includes('confirmation code')) && (
              <button
                type="button"
                onClick={resendConfirmationEmail}
                disabled={loading}
                className="ml-2 text-red-600 underline hover:text-red-700 disabled:opacity-50"
              >
                Resend Code
              </button>
            )}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50/80 backdrop-blur-sm text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100">
            {success}
          </div>
        )}

        <form onSubmit={view === 'confirm' ? handleConfirmation : handleAuth} className="space-y-4">
          {view === 'confirm' && (
            <div>
              <label className="block text-sm font-medium text-[#214059] mb-1">Confirmation Code</label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-sm p-3 rounded-xl text-[#214059] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#214059] transition-all"
                required
                placeholder="Enter confirmation code"
                maxLength={10}
              />
            </div>
          )}
          
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
            {loading ? 'Processing...' : view === 'register' ? 'Create Account' : view === 'confirm' ? 'Confirm Account' : 'Log In'}
          </button>
        </form>

        {view === 'login' && (
          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[#214059] text-sm font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-[#44474c] text-sm">
            {view === 'login' ? "Don't have an account? " : view === 'confirm' ? "Need to resend code? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => {
                if (view === 'confirm') {
                  // Handle resend confirmation
                  resendConfirmationEmail();
                } else {
                  setView(view === 'login' ? 'register' : 'login');
                }
                setError('');
                setSuccess('');
              }}
              className="text-[#214059] font-semibold hover:underline"
            >
              {view === 'login' ? 'Sign up' : view === 'confirm' ? 'Resend Code' : 'Log in'}
            </button>
            {view === 'confirm' && (
              <button 
                type="button"
                onClick={() => {
                  setView('login');
                  setError('');
                  setSuccess('');
                }}
                className="text-[#214059] font-semibold hover:underline ml-4"
              >
                Back to Login
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
