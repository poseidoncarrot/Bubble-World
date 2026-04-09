/**
 * Reset Password component for setting a new password
 * 
 * This component handles the password reset flow after user clicks the reset link from email.
 * 
 * Flow:
 * 1. Extracts access_token and refresh_token from URL parameters
 * 2. Restores Supabase session using the tokens
 * 3. Verifies the reset link is valid
 * 4. Allows user to set new password
 * 5. Updates password via Supabase
 * 6. Signs out user for security
 * 7. Redirects to login page
 * 
 * Security Features:
 * - Token-based verification (prevents unauthorized resets)
 * - Session restoration before password update
 * - Automatic sign-out after password change
 * - Password validation (minimum 6 characters)
 * - Password confirmation matching
 * 
 * TODO: Add password strength requirements
 * TODO: Show password strength indicator
 * TODO: Add option to cancel and go back
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth';
import { supabase } from '../utils/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      
      console.log('Reset password params:', { 
        accessToken: !!accessToken, 
        refreshToken: !!refreshToken,
        allParams: Object.fromEntries(searchParams.entries())
      });
      
      if (!accessToken) {
        setError('Invalid or expired reset link. Please request a new password reset.');
        return;
      }

      try {
        // Restore the session using the tokens from the reset link
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });

        if (error) {
          console.error('Session restoration error:', error);
          setError('Invalid or expired reset link. Please request a new password reset.');
          return;
        }

        if (data.session) {
          console.log('Session restored successfully');
          setCodeVerified(true);
        } else {
          setError('Invalid or expired reset link. Please request a new password reset.');
        }
      } catch (err) {
        console.error('Unexpected error during session restoration:', err);
        setError('Invalid or expired reset link. Please request a new password reset.');
      }
    };

    restoreSession();
  }, [searchParams]);

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { error } = await authService.updatePassword(password);

      if (error) {
        throw error;
      }

      // Sign out the user after successful password reset for security
      await supabase.auth.signOut();
      
      setSuccess('Password reset successfully! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!codeVerified && !error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center relative">
        <div className="absolute inset-0" style={{ 
          backgroundImage: "linear-gradient(141.34deg, rgba(209, 225, 250, 0.3) 0%, rgb(248, 249, 250) 50%, rgba(57, 87, 113, 0.1) 100%)" 
        }} />
        <div className="z-10 bg-white/80 backdrop-blur-xl p-10 rounded-[32px] shadow-2xl w-full max-w-md border border-white/50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#214059] mx-auto mb-4"></div>
            <p className="text-[#44474c]">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center relative">
      <div className="absolute inset-0" style={{ 
        backgroundImage: "linear-gradient(141.34deg, rgba(209, 225, 250, 0.3) 0%, rgb(248, 249, 250) 50%, rgba(57, 87, 113, 0.1) 100%)" 
      }} />
      <div className="z-10 bg-white/80 backdrop-blur-xl p-10 rounded-[32px] shadow-2xl w-full max-w-md border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#214059] mb-2">Set New Password</h1>
          <p className="text-sm font-medium text-[#44474c] uppercase tracking-wider">SECURE YOUR ACCOUNT</p>
          <p className="text-sm text-[#44474c] mt-4">Enter your new password below</p>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50/80 backdrop-blur-sm text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100">
            {success}
          </div>
        )}

        {codeVerified && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#214059] mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-sm p-3 rounded-xl text-[#214059] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#214059] transition-all"
                required
                placeholder="Enter new password"
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#214059] mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-sm p-3 rounded-xl text-[#214059] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#214059] transition-all"
                required
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#214059] text-white font-semibold py-3 rounded-xl hover:bg-[#1a3347] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 mt-6"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-[#44474c] text-sm">
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#214059] font-semibold hover:underline"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
