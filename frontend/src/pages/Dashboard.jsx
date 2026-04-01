import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, PlusCircle, Target, Award, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [subStatus, setSubStatus] = useState('loading');
  const [scores, setScores] = useState([]);
  const [scoreInput, setScoreInput] = useState('');
  const [charities, setCharities] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [latestDraw, setLatestDraw] = useState(null);
  
  useEffect(() => {
    fetchSub();
  }, []);

  const fetchSub = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/subscription/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if(data.success) {
        setSubStatus(data.data.status);
        if(data.data.status === 'active') {
          fetchDashboardData();
        }
      }
    } catch(e) {
      console.error("Sub check error");
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Get Scores
      const scoreRes = await fetch('http://localhost:5000/api/v1/score', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const scoreData = await scoreRes.json();
      if(scoreData.success) setScores(scoreData.data);

      // Get Charities
      const charityRes = await fetch('http://localhost:5000/api/v1/charity', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const charityData = await charityRes.json();
      if(charityData.success) setCharities(charityData.data);

      // Get Latest Draw
      const drawRes = await fetch('http://localhost:5000/api/v1/draw/results', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const drawData = await drawRes.json();
      if(drawData.success && drawData.data) setLatestDraw(drawData.data);
      
    } catch(e) {
      console.error(e);
    }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if(!scoreInput || scoreInput < 1 || scoreInput > 45) return;
    
    setLoadingAction(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/score', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parseInt(scoreInput) })
      });
      if(res.ok) {
        setScoreInput('');
        fetchDashboardData();
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSelectCharity = async (charityId) => {
    try {
       await fetch('http://localhost:5000/api/v1/charity/select', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId })
      });
      alert('Charity Preference Saved!');
    } catch(err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (subStatus === 'loading') {
    return <div className="min-h-screen bg-golf-dark flex items-center justify-center"><div className="w-10 h-10 border-4 border-golf-500 border-t-transparent animate-spin rounded-full"></div></div>;
  }

  return (
    <div className="min-h-screen bg-golf-dark p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-golf-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <nav className="flex justify-between items-center max-w-7xl mx-auto mb-12 relative z-10">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
           <User className="text-golf-500"/>
           Hello, {user?.name || 'Golfer'}
        </h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" /><span>Logout</span>
        </button>
      </nav>

      {subStatus !== 'active' ? (
        <div className="max-w-3xl mx-auto text-center mt-20 p-12 glass-card">
          <Award className="w-16 h-16 text-golf-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">You're almost on the green!</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Active subscription required to enter scores, pick your charity, and participate in monthly draws.</p>
          <button onClick={() => navigate('/subscribe')} className="btn-primary flex items-center gap-2 mx-auto">
             Get Subscription <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          
          {/* Scores Column */}
          <div className="glass-card p-6 col-span-1 md:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-white/5 pb-4 w-full"><Target className="text-golf-500" /> Score Tracker</h2>
            </div>
            
            <form onSubmit={handleScoreSubmit} className="flex gap-4 mb-8">
              <input 
                 type="number" min="1" max="45" 
                 value={scoreInput} onChange={(e)=>setScoreInput(e.target.value)}
                 className="input-field flex-1" placeholder="Enter Score (1-45)" required 
              />
              <button disabled={loadingAction} className="btn-primary flex items-center gap-2">
                 {loadingAction ? '...' : <><PlusCircle className="w-5 h-5" /> Add Score</>}
              </button>
            </form>

            <div className="flex-1 space-y-3">
              {scores.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed border-slate-700/50 rounded-xl p-8">
                  <p className="text-slate-500">No scores added yet. Start playing!</p>
                </div>
              ) : (
                scores.map((score, idx) => (
                  <div key={score._id} className="bg-slate-800/40 p-4 rounded-lg flex justify-between items-center border border-white/5">
                    <span className="text-slate-400 text-sm">Play #{scores.length - idx}</span>
                    <span className="text-2xl font-bold text-white">{score.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column (Charity & Next Draw) */}
          <div className="flex flex-col gap-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 border-b border-white/5 pb-4">Your Charity</h2>
              <div className="space-y-4">
                {charities.length === 0 ? <p className="text-sm text-slate-500">No charities loaded.</p> : charities.map(c => (
                  <div key={c._id} className="p-3 bg-slate-800/40 rounded-xl border border-white/5 cursor-pointer hover:border-golf-500/50 transition-colors" onClick={() => handleSelectCharity(c._id)}>
                    <h3 className="font-semibold text-sm mb-1 text-golf-400">{c.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card p-6 bg-gradient-to-br from-golf-900 to-golf-card border-golf-500/20 shadow-golf-500/10 shadow-2xl">
              <h2 className="text-xl font-semibold mb-2">Next Draw</h2>
              <p className="text-4xl font-bold text-white mb-2 tracking-tight">30 Days</p>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-2 mt-4">
                 <div className="bg-golf-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((scores.length / 5) * 100, 100)}%` }}></div>
              </div>
              <p className="text-slate-400 text-sm mb-6">{scores.length}/5 scores required</p>

              {latestDraw && latestDraw.draw ? (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-golf-400 mb-2">LAST MONTH: {latestDraw.draw.month}</h3>
                  <div className="flex gap-2 justify-center mb-3">
                    {latestDraw.draw.drawnNumbers.map((num, i) => (
                      <span key={i} className="w-8 h-8 rounded-full bg-slate-800 border border-golf-500/30 flex items-center justify-center text-sm font-bold">{num}</span>
                    ))}
                  </div>
                  <p className="text-xs text-center text-slate-400">
                    {latestDraw.winners.length > 0 ? `🏆 ${latestDraw.winners.length} Winners!` : 'No exact matches.'}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

        </main>
      )}
    </div>
  );
}
