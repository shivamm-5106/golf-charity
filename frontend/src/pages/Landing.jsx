import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Target, Heart } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-golf-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-golf-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-golf-500" />
          <span className="text-xl font-bold tracking-tight">CharityLinks</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-golf-400 transition-colors">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-golf-500/10 text-golf-400 text-sm font-medium mb-8 border border-golf-500/20">
          <Heart className="w-4 h-4" />
          <span>Play standard. Win big. Give back.</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Elevate Your Game & <span className="text-golf-500">Make an Impact</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12">
          Track your golf scores, enter exclusive monthly draws, and support your favorite charities. The ultimate subscription for golfers who care.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link to="/signup" className="btn-primary text-lg w-full sm:w-auto">Start Your Journey</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-32 text-left">
          <FeatureCard 
            icon={<Target />}
            title="Track Scores"
            desc="Keep your recent scores updated and watch your progress over time."
          />
          <FeatureCard 
            icon={<Trophy />}
            title="Monthly Draws"
            desc="Every submission enters you into massive algorithmic prize pools."
          />
          <FeatureCard 
            icon={<Heart />}
            title="Charitable Impact"
            desc="A percentage of your membership goes automatically to your chosen charity."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-card p-6 group hover:-translate-y-2 transition-transform duration-300">
      <div className="w-12 h-12 bg-golf-500/10 rounded-xl flex items-center justify-center text-golf-400 mb-6 group-hover:scale-110 group-hover:bg-golf-500 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
