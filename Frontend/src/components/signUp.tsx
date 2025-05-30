import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '../utils/supabaseClient'; // Adjust path if needed

interface SignUpPageProps {
  onSignUpSuccess?: () => void;           // called on successful signup
  onSwitchToLogin?: () => void;           // called to switch to login panel
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        setError(error.message);
      } else if (data.user) {
        onSignUpSuccess && onSignUpSuccess();
      } else {
        setError('Sign-up failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('Unexpected error. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#0c0920] px-6">
      <div className="max-w-md w-full mx-auto bg-[#1a1a2e] rounded-3xl shadow-lg p-10 text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Account</h1>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg bg-[#0f0d29] py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Mail className="absolute top-3 left-3 text-purple-400" size={20} />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-[#0f0d29] py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Lock className="absolute top-3 left-3 text-purple-400" size={20} />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-[#0f0d29] py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Lock className="absolute top-3 left-3 text-purple-400" size={20} />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-colors font-semibold text-white shadow-lg"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-purple-400 hover:underline focus:outline-none"
            type="button"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
