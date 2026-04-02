import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useToast } from '../components/Toast';
import { api } from '../lib/api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.login);
  const toast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast('Password must be at least 6 characters.', 'error');
      return;
    }
    setLoading(true);

    try {
      const data = await api('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      setAuth(data.data.user, data.data.token);
      toast('Account created successfully! 🎉', 'success');
      setTimeout(() => navigate('/dashboard'), 400);

    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-golf-500'];

  return (
    <div className="min-h-screen bg-golf-dark flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-golf-500/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-scale-in">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-golf-500/10 rounded-2xl flex items-center justify-center text-golf-400 animate-pulse-glow">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 gradient-text">Create Account</h2>
          <p className="text-slate-400">Join CharityLinks — it's free to start</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <div className="relative group">
            <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-golf-400 transition-colors" />
            <input
              id="signup-name"
              type="text"
              className="input-field pl-12"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-golf-400 transition-colors" />
            <input
              id="signup-email"
              type="email"
              className="input-field pl-12"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <div className="relative group">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-golf-400 transition-colors" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field pl-12 pr-12"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="mt-2 flex gap-1.5 items-center">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength >= level ? strengthColors[strength] : 'bg-slate-700'}`}
                  />
                ))}
                <span className={`text-xs font-medium ml-1 transition-colors ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-yellow-400' : 'text-golf-400'}`}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            id="signup-submit"
            className="btn-primary w-full py-3 mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-golf-400 hover:text-golf-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
