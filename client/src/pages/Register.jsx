import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Target, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import Header from '../components/Header.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { BorderBeam } from '../components/ui/border-beam.jsx';
import { Card } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Register method tabs: 'email' | 'google'
  const [authMethod, setAuthMethod] = useState('email');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetLevel, setTargetLevel] = useState('B2');

  const [googleEmail, setGoogleEmail] = useState('');
  const [googleFullName, setGoogleFullName] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cefrLevels = [
    { level: 'A1', label: 'A1 - Mới bắt đầu' },
    { level: 'A2', label: 'A2 - Cơ bản' },
    { level: 'B1', label: 'B1 - Trung cấp (Giao tiếp tốt)' },
    { level: 'B2', label: 'B2 - Khá giỏi (Học tập & Làm việc)' },
    { level: 'C1', label: 'C1 - Nâng cao (Thành thạo)' }
  ];

  // Submit Standard Registration
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        fullName,
        email,
        password,
        targetLevel
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Đăng ký tài khoản thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Google Registration
  const handleGoogleRegister = async (e) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ Gmail hợp lệ');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle({
        email: googleEmail,
        fullName: googleFullName || googleEmail.split('@')[0],
        targetLevel
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Đăng ký bằng Google thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header />

      <PageTransition className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-6">
          {/* Header Card */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 mx-auto flex items-center justify-center shadow-lg shadow-violet-500/25">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Tạo Tài Khoản Học Viên Mới
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Khởi đầu hành trình làm chủ tiếng Anh với sự đồng hành của AI
            </p>
          </div>

          {/* Register Container with BorderBeam */}
          <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 overflow-hidden">
            <BorderBeam size={80} duration={8} colorFrom="#8b5cf6" colorTo="#6366f1" />

            <div className="relative z-10 space-y-6">
              {/* Method Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setError('');
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Đăng ký bằng Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('google');
                    setError('');
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMethod === 'google'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>Đăng ký nhanh Gmail</span>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Mode 1: Email + Password Registration Form */}
              {authMethod === 'email' && (
                <form onSubmit={handleEmailRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Họ và tên của bạn
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Địa chỉ Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Mật khẩu (tối thiểu 6 ký tự)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-violet-400" />
                      Mục tiêu trình độ CEFR muốn đạt tới
                    </label>
                    <select
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer"
                    >
                      {cefrLevels.map((item) => (
                        <option key={item.level} value={item.level} className="bg-slate-900 text-slate-100">
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer active:scale-95"
                  >
                    {loading ? (
                      <span>Đang tạo tài khoản...</span>
                    ) : (
                      <>
                        <span>Tạo Tài Khoản & Bắt Đầu</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Mode 2: Google Gmail Registration Form */}
              {authMethod === 'google' && (
                <form onSubmit={handleGoogleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Địa chỉ Gmail của bạn
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        placeholder="your.name@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Họ và tên hiển thị (tùy chọn)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={googleFullName}
                        onChange={(e) => setGoogleFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-violet-400" />
                      Mục tiêu trình độ CEFR muốn đạt tới
                    </label>
                    <select
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer"
                    >
                      {cefrLevels.map((item) => (
                        <option key={item.level} value={item.level} className="bg-slate-900 text-slate-100">
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer active:scale-95"
                  >
                    {loading ? (
                      <span>Đang kết nối...</span>
                    ) : (
                      <>
                        <span>Đăng Ký & Vào Học Ngay</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Bottom Login Link */}
              <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
                Đã có tài khoản?{' '}
                <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
