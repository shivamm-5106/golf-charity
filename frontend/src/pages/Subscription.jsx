import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Check, Shield } from 'lucide-react';
import { api, jsonAuthHeaders } from '../lib/api';

export default function Subscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = useAuthStore(state => state.token);

  const handleSubscribe = async (plan) => {
    setLoading(true);
    setError('');
    try {
      // Mock Stripe Checkout Initiation
      await api('/subscription/checkout', {
        method: 'POST',
        headers: jsonAuthHeaders(token),
        body: JSON.stringify({ plan })
      });
      
      // Simulate Stripe Success Webhook directly for UX testing purposes:
      await api('/subscription/mock-success', {
        method: 'POST',
        headers: jsonAuthHeaders(token),
        body: JSON.stringify({ plan })
      });

      // Redirect to dashboard explicitly assuming success
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-golf-dark py-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-golf-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Club</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Unlock the ability to track scores, automatically enter the massive monthly draw, and support incredible golf-related charities.
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-lg mb-8 text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Monthly Plan */}
        <div className="glass-card p-8 flex flex-col relative">
          <h3 className="text-2xl font-semibold mb-2">Monthly Member</h3>
          <p className="text-slate-400 text-sm mb-6">Flexible entry to all platform features.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">$10</span>
            <span className="text-slate-500">/month</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <Feature item="Unlimited score tracking" />
            <Feature item="Entry to Monthly Algorithmic Draws" />
            <Feature item="Automatic giving to a charity of choice" />
            <Feature item="Cancel anytime" />
          </ul>

          <button 
            disabled={loading}
            onClick={() => handleSubscribe('monthly')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-slate-700"
          >
            {loading ? 'Processing...' : 'Go Monthly'}
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="glass-card p-8 flex flex-col relative border-golf-500">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-golf-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Most Popular
          </div>
          <h3 className="text-2xl font-semibold mb-2">Annual Pass</h3>
          <p className="text-slate-400 text-sm mb-6">Save $20 instantly with yearly commitment.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">$100</span>
            <span className="text-slate-500">/year</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <Feature item="Everything in Monthly" />
            <Feature item="2 Months Free automatically applied" />
            <Feature item="Priority Support" />
            <Feature item="Higher chance weighting in some draws" />
          </ul>

          <button 
             disabled={loading}
             onClick={() => handleSubscribe('yearly')}
             className="w-full btn-primary"
          >
            {loading ? 'Processing...' : 'Subscribe Annually'}
          </button>
        </div>
      </div>
      
      <div className="max-w-md mx-auto mt-12 flex items-center justify-center gap-2 text-slate-500 text-sm">
        <Shield className="w-4 h-4" />
        <span>Secure checkout powered by Mock Stripe.</span>
      </div>
    </div>
  );
}

function Feature({ item }) {
  return (
    <li className="flex items-start gap-3 text-slate-300">
      <Check className="w-5 h-5 text-golf-500 shrink-0 mt-0.5" />
      <span className="text-sm">{item}</span>
    </li>
  );
}
