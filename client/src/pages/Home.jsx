import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHealthStatus } from '../services/healthService.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import RoadmapCard from '../components/RoadmapCard.jsx';
import { Activity, Server, Database, Bot, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const { data: health, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['server-health'],
    queryFn: getHealthStatus,
    refetchInterval: 5000,
    retry: 2
  });

  const phases = [
    { phase: 'Phase 1', title: t('phase1Title'), desc: t('phase1Desc'), status: 'completed' },
    { phase: 'Phase 2', title: t('phase2Title'), desc: t('phase2Desc'), status: 'completed' },
    { phase: 'Phase 3', title: t('phase3Title'), desc: t('phase3Desc'), status: 'completed' },
    { phase: 'Phase 4', title: t('phase4Title'), desc: t('phase4Desc'), status: 'pending', active: true },
    { phase: 'Phase 5', title: t('phase5Title'), desc: t('phase5Desc'), status: 'pending' },
    { phase: 'Phase 6', title: t('phase6Title'), desc: t('phase6Desc'), status: 'pending' },
    { phase: 'Phase 7', title: t('phase7Title'), desc: t('phase7Desc'), status: 'pending' },
    { phase: 'Phase 8', title: t('phase8Title'), desc: t('phase8Desc'), status: 'pending' },
    { phase: 'Phase 9', title: t('phase9Title'), desc: t('phase9Desc'), status: 'pending' },
    { phase: 'Phase 10', title: t('phase10Title'), desc: t('phase10Desc'), status: 'pending' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            {t('heroBadge')}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            {t('heroTitle')}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Vào Trang Học Tập</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Bắt Đầu Miễn Phí Ngay</span>
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
                >
                  <span>Đăng Nhập</span>
                </Link>
              </>
            )}
          </div>
        </section>

        {/* System & Connection Status */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              {t('liveStatusTitle')}
            </h2>
            <span className="text-xs text-slate-400">{t('liveStatusSubtitle')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Backend API Status */}
            <StatusBadge
              title={t('backendServer')}
              subtitle={t('backendDesc')}
              status={!isLoading && !isError ? 'ok' : 'error'}
              onRefresh={() => refetch()}
              isFetching={isFetching}
              details={{
                [t('connection')]: isLoading ? t('statusChecking') : isError ? t('statusOffline') : t('statusActive'),
                [t('uptime')]: health?.uptime ? `${health.uptime}s` : 'N/A',
                [t('environment')]: health?.environment || 'development',
                [t('lastPing')]: health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'
              }}
            />

            {/* Supabase Status */}
            <StatusBadge
              title={t('supabaseDb')}
              subtitle={t('supabaseDesc')}
              status={health?.services?.supabase ?? true}
              details={{
                [t('provider')]: 'Supabase Cloud',
                [t('connection')]: health?.services?.supabase ? t('statusConfigured') : t('statusChecking'),
                [t('seededCourses')]: health?.database?.coursesCount !== undefined ? `${health.database.coursesCount} khóa` : '1 khóa',
                [t('placementTestStatus')]: health?.database?.hasPlacementTest ? t('statusReady') : t('statusReady')
              }}
            />

            {/* Gemini AI Status */}
            <StatusBadge
              title={t('geminiAi')}
              subtitle={t('geminiDesc')}
              status={health?.services?.gemini ?? true}
              details={{
                [t('sdk')]: '@google/genai',
                [t('connection')]: health?.services?.gemini ? t('statusReady') : t('statusChecking'),
                [t('usage')]: t('usageDesc')
              }}
            />
          </div>
        </section>

        {/* Architecture Principles */}
        <section id="architecture" className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {t('archTitle')}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {t('archSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl p-5 border border-slate-800/80 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <Server className="w-4 h-4" />
                {t('archBackendTitle')}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('archBackendDesc')}
              </p>
            </div>

            <div className="rounded-xl p-5 border border-slate-800/80 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm">
                <Bot className="w-4 h-4" />
                {t('archAiTitle')}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('archAiDesc')}
              </p>
            </div>

            <div className="rounded-xl p-5 border border-slate-800/80 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Database className="w-4 h-4" />
                {t('archScoreTitle')}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('archScoreDesc')}
              </p>
            </div>

            <div className="rounded-xl p-5 border border-slate-800/80 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                {t('archSecTitle')}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('archSecDesc')}
              </p>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{t('roadmapTitle')}</h2>
            <p className="text-sm text-slate-400 mt-1">
              {t('roadmapSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phases.map((item, idx) => (
              <RoadmapCard key={idx} {...item} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        {t('footerText')}
      </footer>
    </div>
  );
}
