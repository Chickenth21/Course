import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';

export default function GoogleAuthButton({ mode = 'login', targetLevel = 'B2' }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleClick = () => {
    setShowPrompt(true);
  };

  const handleQuickGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ Gmail hợp lệ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loginWithGoogle({
        email,
        fullName: fullName || email.split('@')[0],
        targetLevel
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Đăng nhập với Google thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {!showPrompt ? (
        <button
          type="button"
          onClick={handleGoogleClick}
          className="w-full py-3 px-4 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-800 text-slate-100 font-semibold text-sm transition-all flex items-center justify-center gap-3 hover:border-slate-600 shadow-md"
        >
          {/* Google SVG Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>
            {mode === 'register' ? 'Đăng ký nhanh bằng Google / Gmail' : 'Tiếp tục với Google / Gmail'}
          </span>
        </button>
      ) : (
        <form onSubmit={handleQuickGoogleSubmit} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Nhập Gmail của bạn:
            </span>
            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              className="text-[11px] text-slate-500 hover:text-slate-300"
            >
              Đóng
            </button>
          </div>

          {error && (
            <div className="text-[11px] text-rose-400 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
              {error}
            </div>
          )}

          <input
            type="email"
            required
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            autoFocus
          />

          {mode === 'register' && (
            <input
              type="text"
              placeholder="Họ và tên của bạn (tùy chọn)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Đang kết nối...' : 'Xác Nhận & Đăng Nhập Ngay'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
