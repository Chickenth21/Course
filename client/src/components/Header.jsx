import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Layers,
  Globe,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  Compass,
  GraduationCap,
  PenLine
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Badge } from './ui/badge.jsx';

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard, color: 'text-indigo-400' },
        { to: '/learning-path', label: 'Lộ trình AI', icon: Compass, color: 'text-violet-400' },
        { to: '/courses', label: 'Khóa học', icon: BookOpen, color: 'text-emerald-400' },
        { to: '/practice', label: 'Luyện Viết & Dịch', icon: PenLine, color: 'text-sky-400' }
      ]
    : [
        { to: '/#architecture', label: t('navArchitecture'), icon: Layers, color: 'text-indigo-400' },
        { to: '/#roadmap', label: t('navRoadmap'), icon: BookOpen, color: 'text-violet-400' }
      ];

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
          aria-label="EngVantage AI Trang chủ"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-amber-500 p-[1px] shadow-lg shadow-indigo-950 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b1120] rounded-[11px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              EngVantage <span className="text-amber-400 text-sm font-semibold">AI</span>
            </span>
            <Badge variant="outline" className="hidden sm:inline-flex bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] py-0 px-2 font-medium">
              CEFR Adaptive
            </Badge>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden md:flex items-center gap-1" aria-label="Điều hướng chính">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'text-white bg-white/10 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 rounded-xl border border-indigo-500/40 bg-indigo-500/10 -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-all hover:border-indigo-500/50 shadow-sm active:scale-95"
            title="Chuyển đổi ngôn ngữ / Switch Language"
            aria-label="Đổi ngôn ngữ"
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
            <div className="flex items-center gap-2 sm:gap-3 border-l border-white/10 pl-2 sm:pl-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all active:scale-95 shadow-sm"
              >
                <span className="hidden sm:inline">{user?.full_name || 'Học viên'}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 text-[10px] font-bold">
                  {user?.current_level || 'A1'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all active:scale-90"
                title={t('navLogout')}
                aria-label={t('navLogout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-white/10 pl-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-xs font-medium transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                {t('navLogin')}
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
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
