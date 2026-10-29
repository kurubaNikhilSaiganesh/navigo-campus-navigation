import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Lock, Mail, Eye, EyeOff, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function DemoLoginModal({ isOpen, onClose }) {
  const { loginDemo, theme } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = loginDemo(email, password);
      setIsLoading(false);
      if (result.success) {
        onClose();
      } else {
        setErrorMessage(result.error || 'Invalid credentials. Please use the demonstration accounts.');
      }
    }, 200);
  };

  const handleFillDemo = (demoType) => {
    setErrorMessage('');
    if (demoType === 'faculty') {
      setEmail('faculty@meridian.demo');
      setPassword('faculty123');
    } else if (demoType === 'admin') {
      setEmail('admin@meridian.demo');
      setPassword('admin123');
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md page-enter"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-login-title"
    >
      <div
        className="rounded-xl p-6 sm:p-8 max-w-md w-full border backdrop-blur-2xl shadow-2xl relative"
        style={{
          background: isDark ? 'rgba(18, 18, 24, 0.97)' : 'rgba(255, 255, 255, 0.97)',
          borderColor: 'var(--glass-border-strong)',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(244, 180, 0, 0.1)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, var(--gold) 0%, #D97706 100%)' }}
            >
              <Lock size={18} className="text-white" />
            </div>
            <div>
              <h3 id="demo-login-title" className="font-display font-black text-xl text-[var(--text-primary)] tracking-tight">
                Demo Sign In
              </h3>
              <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
                Meridian Campus Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="glass-btn glass-btn-ghost rounded-lg w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Demo Credentials Quick-Select Pill Area */}
        <div className="mb-5 p-3.5 rounded-lg glass-1 border border-[var(--glass-border)] space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--gold)] font-bold">
            <Sparkles size={13} />
            <span>EXPO DEMONSTRATION ACCOUNTS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('faculty')}
              className="text-left p-2.5 rounded-lg border transition-all text-xs group hover:scale-[1.02] active:scale-98"
              style={{
                background: 'rgba(244, 180, 0, 0.08)',
                borderColor: 'rgba(244, 180, 0, 0.25)',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                  <UserCheck size={13} className="text-[var(--gold)]" />
                  Faculty Demo
                </span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--gold)] font-bold">Click</span>
              </div>
              <p className="font-mono text-[9px] text-[var(--text-muted)] truncate">faculty@meridian.demo</p>
              <p className="font-mono text-[9px] text-[var(--text-subtle)]">pass: faculty123</p>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="text-left p-2.5 rounded-lg border transition-all text-xs group hover:scale-[1.02] active:scale-98"
              style={{
                background: 'rgba(59, 130, 246, 0.08)',
                borderColor: 'rgba(59, 130, 246, 0.25)',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                  <ShieldCheck size={13} className="text-blue-400" />
                  Admin Demo
                </span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-blue-400 font-bold">Click</span>
              </div>
              <p className="font-mono text-[9px] text-[var(--text-muted)] truncate">admin@meridian.demo</p>
              <p className="font-mono text-[9px] text-[var(--text-subtle)]">pass: admin123</p>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg border flex items-center gap-2.5 text-xs font-medium bg-red-500/10 border-red-500/30 text-red-400 animate-shake">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@meridian.demo or admin@meridian.demo"
                className="w-full glass-input pl-11 pr-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-xs"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="faculty123 or admin123"
                className="w-full glass-input pl-11 pr-11 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-xs"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <p className="font-mono text-[9px] text-[var(--text-muted)] leading-relaxed">
            * Frontend-only demonstration authentication. Never enter real production credentials.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 glass-btn glass-btn-ghost rounded-lg py-2.5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 glass-btn glass-btn-primary rounded-lg py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
