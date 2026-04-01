import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-golf-400" />,
  error:   <AlertCircle className="w-5 h-5 text-red-400" />,
  info:    <Info       className="w-5 h-5 text-blue-400" />,
};

const STYLES = {
  success: 'bg-golf-card border-golf-500/30',
  error:   'bg-golf-card border-red-500/30',
  info:    'bg-golf-card border-blue-500/30',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`animate-toast-in pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl shadow-black/40 backdrop-blur-md max-w-sm ${STYLES[t.type]}`}
          >
            <span className="shrink-0 mt-0.5">{ICONS[t.type]}</span>
            <p className="text-sm font-medium text-white flex-1">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-500 hover:text-white transition-colors shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx.toast;
}
