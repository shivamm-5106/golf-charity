import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-golf-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-golf-500/6 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 text-center max-w-lg animate-scale-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-golf-500/10 rounded-2xl flex items-center justify-center animate-float">
            <Trophy className="w-8 h-8 text-golf-400" />
          </div>
        </div>

        {/* 404 */}
        <div className="mb-6">
          <p className="text-[120px] font-black leading-none gradient-text-green animate-fade-in">
            404
          </p>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4 gradient-text animate-fade-in delay-100">
          Out of Bounds!
        </h1>
        <p className="text-slate-400 mb-10 leading-relaxed animate-fade-in delay-200">
          Looks like your ball landed somewhere it shouldn't have. This hole doesn't exist on our course.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-300">
          <Link to="/" className="btn-primary px-8 py-3 text-base">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/dashboard" className="btn-secondary px-8 py-3 text-base">
            Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
