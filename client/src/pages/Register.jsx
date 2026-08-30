import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Target, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import Header from '../components/Header.jsx';

export default function Register() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    targetLevel: 'B2'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Đăng ký tài khoản thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const cefrLevels = [
    { level: 'A1', label: 'A1 - Sơ cấp' },
    { level: 'A2', label: 'A2 - Cơ bản' },
    { level: 'B1', label: 'B1 - Trung cấp' },
    { level: 'B2', label: 'B2 - Khá tốt' },
    { level: 'C1', label: 'C1 - Nâng cao' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header Card */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              {t('registerTitle')}
            </h2>
            <p className="text-sm text-slate-400">
              {t('registerSubtitle')}
            </p>
          </div>

          {/* Form */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  {t('fullNameLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('emailPlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={t('passwordPlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Target CEFR Level */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                  {t('targetLevelLabel')}
                </label>
                <select
                  value={formData.targetLevel}
                  onChange={(e) => setFormData({ ...formData, targetLevel: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  {cefrLevels.map((item) => (
                    <option key={item.level} value={item.level} className="bg-slate-900 text-slate-100">
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>{t('authLoading')}</span>
                ) : (
                  <>
                    <span>{t('registerButton')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
              {t('alreadyAccount')}{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                {t('loginNow')}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
