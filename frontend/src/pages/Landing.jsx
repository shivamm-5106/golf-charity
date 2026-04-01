import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Target, Heart, ArrowRight, Users, Award, DollarSign, CheckCircle } from 'lucide-react';

function useCountUp(target, duration = 1500) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatCounter({ value, label, prefix = '', suffix = '' }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center animate-count-up">
      <p className="text-4xl md:text-5xl font-bold gradient-text-green mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-golf-dark overflow-x-hidden">
      {/* Hero Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-golf-500/8 blur-[140px] rounded-full animate-spin-slow" />
        <div className="absolute bottom-1/3 right-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto animate-fade-in-down">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-golf-500 flex items-center justify-center animate-pulse-glow">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">CharityLinks</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get Started <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="animate-fade-in">
          <div className="section-label">
            <Heart className="w-4 h-4" />
            Play standard. Win big. Give back.
          </div>
        </div>

        <h1 className="animate-fade-in delay-100 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-none max-w-5xl mx-auto">
          <span className="gradient-text">Elevate Your Game &</span>
          <br />
          <span className="text-golf-500">Make an Impact</span>
        </h1>

        <p className="animate-fade-in delay-200 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Track your golf scores, enter exclusive monthly draws, and support your favourite charities. The ultimate subscription for golfers who care.
        </p>

        <div className="animate-fade-in delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <Link to="/signup" className="btn-primary text-base px-8 py-3">
            Start Your Journey <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3">
            Sign In
          </Link>
        </div>

        {/* Animated Stats */}
        <div className="animate-fade-in delay-400 grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-28 py-10 border-y border-white/5">
          <StatCounter value={2840}  label="Active Members" suffix="+" />
          <StatCounter value={124500} label="Prize Pool Distributed" prefix="$" />
          <StatCounter value={18}   label="Charities Supported" />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-28">
          {[
            { icon: <Target />, title: 'Track Scores', desc: 'Log your last 5 games and watch your performance trend over time. Our smart FIFO system keeps your data fresh and relevant.', delay: 'delay-200' },
            { icon: <Trophy />, title: 'Monthly Draws', desc: "Every month we run a fair algorithmic prize pool. Your scores are your lottery numbers — 5 matches and you're holding a jackpot.", delay: 'delay-300' },
            { icon: <Heart />, title: 'Charitable Impact', desc: 'A meaningful percentage of every membership goes directly to the charity you choose at signup. Giving made effortless.', delay: 'delay-400' },
          ].map(({ icon, title, desc, delay }) => (
            <div key={title} className={`glass-card-hover p-7 animate-fade-in ${delay} group`}>
              <div className="w-12 h-12 bg-golf-500/10 rounded-xl flex items-center justify-center text-golf-400 mb-6 group-hover:scale-110 group-hover:bg-golf-500 group-hover:text-white transition-all duration-300 animate-float">
                {icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <section className="mb-28 text-center">
          <div className="section-label mx-auto mb-12">
            <Award className="w-4 h-4" />
            How It Works
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-golf-500/40 to-transparent" />
            {[
              { step: '01', title: 'Join', desc: 'Sign up and choose your monthly or yearly membership.' },
              { step: '02', title: 'Pick a Charity', desc: 'Browse our curated list and choose your cause.' },
              { step: '03', title: 'Log Scores', desc: 'Submit your scores after each round (up to 5 at a time).' },
              { step: '04', title: 'Win & Give', desc: 'Draws run monthly. Match numbers, claim prizes, give back.' },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className={`animate-fade-in delay-${i * 100 + 200} flex flex-col items-center text-center`}>
                <div className="relative z-10 w-20 h-20 rounded-2xl glass-card flex flex-col items-center justify-center mb-5 group border border-golf-500/20 hover:border-golf-500/60 transition-colors">
                  <span className="text-xs font-bold text-golf-500 mb-1">{step}</span>
                  <span className="text-xl font-bold">{title}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[180px]">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="glass-card p-12 text-center relative overflow-hidden animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-br from-golf-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="flex -space-x-3">
                {['JK','AM','SB','RD'].map(initials => (
                  <div key={initials} className="w-10 h-10 rounded-full bg-golf-500/20 border-2 border-golf-dark flex items-center justify-center text-xs font-bold text-golf-400 ring-1 ring-golf-500/20">
                    {initials}
                  </div>
                ))}
              </div>
              <p className="ml-4 text-slate-400 text-sm self-center">Join 2,800+ members already playing</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Ready to tee off?</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Your first subscription includes full access to our platform - no setup fees, no hidden charges.</p>
            <Link to="/signup" className="btn-primary text-base px-10 py-3.5">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex justify-center gap-6 mt-8 text-xs text-slate-500">
              {['Cancel anytime', 'No credit card storage', 'Instant access'].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-golf-500" />{item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} CharityLinks. Built with ❤️ and golf.</p>
      </footer>
    </div>
  );
}
