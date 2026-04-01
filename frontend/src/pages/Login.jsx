import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useToast } from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.login);
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      setAuth(data.data.user, data.data.token);
      toast('Welcome back! 🏌️', 'success');
      setTimeout(() => navigate('/dashboard'), 400);

    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-golf-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-golf-500/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-golf-500/10 rounded-2xl flex items-center justify-center text-golf-400 animate-pulse-glow">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 gradient-text">Welcome Back</h2>
          <p className="text-slate-400">Sign in to your CharityLinks account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="relative group">
            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-golf-400 transition-colors" />
            <input
              id="login-email"
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
          <div className="relative group">
            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-golf-400 transition-colors" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="input-field pl-12 pr-12"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            id="login-submit"
            className="btn-primary w-full py-3 mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>Sign In <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-golf-400 hover:text-golf-300 font-semibold transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
