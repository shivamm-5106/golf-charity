import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import {
  Users, Trophy, Heart, Clock, CheckCircle, XCircle,
  LogOut, LayoutDashboard, ShieldCheck, AlertCircle, TrendingUp
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { TableSkeleton } from '../components/Skeleton';

export default function Admin() {
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [pendingWinners, setPendingWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => { fetchAdminData(); }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setStats(data.data.overview);
      setPendingWinners(data.data.pendingApprovals);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (winnerId, status) => {
    setActionLoading(winnerId + status);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/admin/verify/winner/${winnerId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes: `Manually ${status} by admin.` })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast(`Winner ${status} successfully.`, status === 'approved' ? 'success' : 'info');
      await fetchAdminData();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-golf-dark flex relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-golf-500/4 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/4 blur-[100px] rounded-full pointer-events-none" />

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 bg-golf-card/40 border-r border-white/5 p-6 flex flex-col animate-slide-left relative z-10">
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-golf-500 flex items-center justify-center animate-pulse-glow">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Admin Panel</span>
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { icon: <LayoutDashboard />, label: 'Dashboard', active: true },
            { icon: <Users />, label: 'Users' },
            { icon: <Trophy />, label: 'Draws' },
            { icon: <Heart />, label: 'Charities' },
          ].map(({ icon, label, active }) => (
            <div key={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200
                ${active
                  ? 'bg-golf-500/10 text-golf-400 border border-golf-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <span className="w-4 h-4 shrink-0">{icon}</span> {label}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/5 pt-5 space-y-2">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-golf-500/20 flex items-center justify-center text-golf-400 text-sm font-bold uppercase shrink-0">
              {user?.name?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-200">
            <LayoutDashboard className="w-4 h-4" /> User Dashboard
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 w-full px-3 py-2 rounded-xl transition-all duration-200">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-8 overflow-auto relative z-10">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold mb-1 gradient-text">Control Center</h1>
          <p className="text-slate-400">Manage users, draws, and verify winners.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { icon: <Users className="w-6 h-6" />, label: 'Total Users',     value: stats?.users    ?? '—', color: 'text-blue-400',  bg: 'bg-blue-500/10',  delay: '' },
            { icon: <Trophy className="w-6 h-6" />, label: 'Draws Executed', value: stats?.draws    ?? '—', color: 'text-golf-400', bg: 'bg-golf-500/10', delay: 'delay-100' },
            { icon: <Heart className="w-6 h-6" />,  label: 'Charities',      value: stats?.charities ?? '—', color: 'text-pink-400', bg: 'bg-pink-500/10', delay: 'delay-200' },
          ].map(({ icon, label, value, color, bg, delay }) => (
            <div key={label} className={`glass-card-hover p-6 animate-fade-in ${delay}`}>
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center ${color} mb-4`}>{icon}</div>
              <p className="text-slate-400 text-sm mb-1">{label}</p>
              <p className="text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Winner Verification Table */}
        <div className="glass-card p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2.5">
                <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                </div>
                Winner Verifications
              </h2>
              <p className="text-slate-400 text-sm mt-1">Review and process pending winner claims.</p>
            </div>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              {pendingWinners.length} Pending
            </span>
          </div>

          {loading ? (
            <TableSkeleton rows={4} />
          ) : pendingWinners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-700/40 rounded-xl animate-fade-in">
              <CheckCircle className="w-12 h-12 text-golf-500/30 mb-4" />
              <p className="font-medium text-slate-300">All clear!</p>
              <p className="text-slate-500 text-sm mt-1">No pending verifications at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 text-left">
                    {['User', 'Draw Month', 'Match', 'Prize', 'Status', ''].map(h => (
                      <th key={h} className="pb-3 font-medium pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pendingWinners.map((winner, idx) => (
                    <tr key={winner._id} className={`hover:bg-white/2 transition-colors animate-fade-in delay-${Math.min(idx * 100, 500)}`}>
                      <td className="py-4 pr-4">
                        <p className="font-medium">{winner.userId?.name || '—'}</p>
                        <p className="text-slate-500 text-xs">{winner.userId?.email}</p>
                      </td>
                      <td className="py-4 pr-4 text-slate-300">{winner.drawId?.month || '—'}</td>
                      <td className="py-4 pr-4">
                        <span className="px-2.5 py-1 rounded-lg bg-golf-500/10 text-golf-400 font-bold text-xs border border-golf-500/20">
                          {winner.matchCount === 5 ? '🔥 5 Match' : winner.matchCount === 4 ? '4 Match' : '3 Match'}
                        </span>
                      </td>
                      <td className="py-4 pr-4 font-bold text-white">${winner.prizeAmount}</td>
                      <td className="py-4 pr-4">
                        <span className="flex items-center gap-1.5 text-yellow-400 text-xs">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={!!actionLoading}
                            onClick={() => handleVerify(winner._id, 'approved')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-golf-500/10 hover:bg-golf-500/20 text-golf-400 border border-golf-500/20 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-40"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {actionLoading === winner._id + 'approved' ? '...' : 'Approve'}
                          </button>
                          <button
                            disabled={!!actionLoading}
                            onClick={() => handleVerify(winner._id, 'rejected')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-40"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            {actionLoading === winner._id + 'rejected' ? '...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
