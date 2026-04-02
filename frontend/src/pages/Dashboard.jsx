import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, PlusCircle, Target, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { useToast } from '../components/Toast';
import { DashboardSkeleton } from '../components/Skeleton';
import { api, authHeaders, jsonAuthHeaders } from '../lib/api';

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  const [subStatus, setSubStatus] = useState('loading');
  const [scores, setScores] = useState([]);
  const [scoreInput, setScoreInput] = useState('');
  const [charities, setCharities] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [latestDraw, setLatestDraw] = useState(null);

  useEffect(() => { fetchSub(); }, []);

  const fetchSub = async () => {
    try {
      const data = await api('/subscription/status', {
        headers: authHeaders(token)
      });
      if (data.success) {
        setSubStatus(data.data.status);
        if (data.data.status === 'active') fetchDashboardData();
      }
    } catch {
      setSubStatus('none');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [scoreData, charityData, drawData] = await Promise.all([
        api('/score', { headers: authHeaders(token) }),
        api('/charity', { headers: authHeaders(token) }),
        api('/draw/results', { headers: authHeaders(token) }).catch(() => ({ success: false })),
      ]);

      if (scoreData.success)  setScores(scoreData.data);
      if (charityData.success) setCharities(charityData.data);
      if (drawData.success && drawData.data) setLatestDraw(drawData.data);
    } catch (e) {
      toast('Failed to load dashboard data.', 'error');
    }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    const val = parseInt(scoreInput);
    if (!val || val < 1 || val > 45) {
      toast('Score must be between 1 and 45.', 'error');
      return;
    }
    setLoadingAction(true);
    try {
      await api('/score', {
        method: 'POST',
        headers: jsonAuthHeaders(token),
        body: JSON.stringify({ value: val })
      });
      setScoreInput('');
      toast(`Score ${val} submitted! 🏌️`, 'success');
      fetchDashboardData();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSelectCharity = async (charityId, charityName) => {
    try {
      await api('/charity/select', {
        method: 'POST',
        headers: jsonAuthHeaders(token),
        body: JSON.stringify({ charityId })
      });
      toast(`Supporting "${charityName}" ❤️`, 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (subStatus === 'loading') return <DashboardSkeleton />;

  const drawProgress = Math.min((scores.length / 5) * 100, 100);

  return (
    <div className="min-h-screen bg-golf-dark overflow-hidden relative">
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-golf-500/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5 mb-8 animate-fade-in-down">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-golf-500/10 flex items-center justify-center">
            <User className="w-5 h-5 text-golf-400" />
          </div>
          <span>Hello, <span className="text-golf-400">{user?.name?.split(' ')[0] || 'Golfer'}</span></span>
        </h1>
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <Link to="/admin"
              className="flex items-center gap-2 text-sm font-medium text-golf-400 hover:text-golf-300 px-4 py-2 rounded-xl border border-golf-500/20 hover:bg-golf-500/10 transition-all duration-200">
              <ShieldCheck className="w-4 h-4" /> Admin Panel
            </Link>
          )}
          <button onClick={handleLogout}
            className="btn-ghost text-slate-400 hover:text-red-400">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      {/* Paywall */}
      {subStatus !== 'active' ? (
        <div className="max-w-2xl mx-auto px-6 mt-16 animate-scale-in">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-golf-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-golf-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
                <Award className="w-10 h-10 text-golf-400" />
              </div>
              <h2 className="text-3xl font-bold mb-3 gradient-text">You're almost on the green!</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                An active subscription unlocks score tracking, charity giving, and entry into the monthly prize draw.
              </p>
              <button onClick={() => navigate('/subscribe')} className="btn-primary text-base px-8 py-3">
                View Plans <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── Score Tracker ── */}
          <div className="glass-card p-6 col-span-1 md:col-span-2 flex flex-col animate-slide-left">
            <h2 className="text-lg font-semibold flex items-center gap-2.5 mb-6 pb-4 border-b border-white/5">
              <div className="w-8 h-8 bg-golf-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-golf-400" />
              </div>
              Score Tracker
            </h2>

            <form onSubmit={handleScoreSubmit} className="flex gap-3 mb-6">
              <input
                type="number" min="1" max="45"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                className="input-field flex-1"
                placeholder="Enter score (1–45)"
                required
              />
              <button disabled={loadingAction} className="btn-primary shrink-0">
                {loadingAction
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><PlusCircle className="w-4 h-4" /> Add</>
                }
              </button>
            </form>

            <div className="flex-1 space-y-2.5">
              {scores.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-700/40 rounded-xl">
                  <Target className="w-10 h-10 text-slate-700 mb-3" />
                  <p className="text-slate-500 text-sm">No scores yet — add your first round!</p>
                </div>
              ) : (
                scores.map((score, idx) => (
                  <div
                    key={score._id}
                    className={`flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-white/5 hover:border-golf-500/20 transition-all duration-200 animate-slide-left delay-${Math.min(idx * 100, 500)}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-golf-500/10 flex items-center justify-center text-xs font-bold text-golf-400">
                        {scores.length - idx}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {new Date(score.datePlayed || score.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-white">{score.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="flex flex-col gap-5">

            {/* Charity */}
            <div className="glass-card p-6 animate-slide-right">
              <h2 className="text-lg font-semibold mb-4 pb-4 border-b border-white/5">Your Charity</h2>
              <div className="space-y-3">
                {charities.length === 0
                  ? <p className="text-slate-500 text-sm">No charities loaded.</p>
                  : charities.map(c => (
                    <div
                      key={c._id}
                      onClick={() => handleSelectCharity(c._id, c.name)}
                      className="glass-card-hover p-3.5 group"
                    >
                      <h3 className="font-semibold text-sm text-golf-400 group-hover:text-golf-300 mb-1 transition-colors">{c.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Next Draw Card */}
            <div className="glass-card p-6 bg-gradient-to-br from-golf-900/80 to-golf-card border-golf-500/20 animate-slide-right delay-100">
              <h2 className="text-lg font-semibold mb-1">Next Draw</h2>
              <p className="text-4xl font-bold tracking-tight mb-1">
                {30} <span className="text-base font-normal text-slate-400">days</span>
              </p>

              {/* Progress */}
              <div className="mt-4 mb-1">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Score Progress</span>
                  <span>{scores.length} / 5</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-golf-500 h-2 rounded-full progress-bar-fill transition-all duration-1000"
                    style={{ width: `${drawProgress}%` }}
                  />
                </div>
                {scores.length >= 5 && (
                  <p className="text-golf-400 text-xs mt-2 font-medium animate-fade-in">
                    ✅ Eligible for this month's draw!
                  </p>
                )}
              </div>

              {/* Latest draw results */}
              {latestDraw?.draw && (
                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-slate-400 mb-3">LAST DRAW — {latestDraw.draw.month}</p>
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {latestDraw.draw.drawnNumbers.map((num, i) => (
                      <span key={i} className="w-9 h-9 rounded-full bg-slate-800 border border-golf-500/30 flex items-center justify-center text-sm font-bold text-white">
                        {num}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    {latestDraw.winners.length > 0
                      ? `🏆 ${latestDraw.winners.length} winner${latestDraw.winners.length > 1 ? 's' : ''}!`
                      : 'No exact matches last month.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
