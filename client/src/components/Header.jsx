import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Layers, Globe, LogIn, UserPlus, LogOut, User, LayoutDashboard, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              {t('brandName')}
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {t('phase1Badge')}
            </span>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden md:flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  <span>{t('navDashboard')}</span>
                </Link>
                <Link
                  to="/learning-path"
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-4 h-4 text-violet-400" />
                  <span>Lộ trình AI</span>
                </Link>
                <Link
                  to="/courses"
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Khóa học</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/#architecture"
                  className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4 text-indigo-400" />
                  {t('navArchitecture')}
                </Link>
                <Link
                  to="/#roadmap"
                  className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-violet-400" />
                  {t('navRoadmap')}
                </Link>
              </>
            )}
          </nav>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-all hover:border-indigo-500/50 shadow-sm"
            title="Chuyển đổi ngôn ngữ / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold hidden sm:inline">
              {language === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
            </span>
            <span className="font-semibold sm:hidden">
              {language === 'vi' ? 'VI' : 'EN'}
            </span>
          </button>

          {/* User / Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
              >
                <span className="hidden sm:inline">{user?.full_name || 'Học viên'}</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 text-[10px]">
                  {user?.current_level || 'A1'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title={t('navLogout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-slate-800 pl-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                {t('navLogin')}
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {t('navRegister')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
