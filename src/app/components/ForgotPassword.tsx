import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      const { error } = await authService.resetPassword(email);

      if (error) {
        throw error;
      }

      // Always show success message for security (prevents email enumeration)
      setSuccess('If an account exists with this email, you will receive a password reset link shortly.');
      setEmail('');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email. Please try again.');
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
          <h1 className="text-3xl font-extrabold text-[#214059] mb-2">Reset Password</h1>
          <p className="text-sm font-medium text-[#44474c] uppercase tracking-wider">RECOVER YOUR ACCOUNT</p>
          <p className="text-sm text-[#44474c] mt-4">Enter your email address and we'll send you a link to reset your password</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#214059] text-white font-semibold py-3 rounded-xl hover:bg-[#1a3347] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 mt-6"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#44474c] text-sm">
            Remember your password?{' '}
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
