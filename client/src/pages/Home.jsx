import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getHealthStatus } from '../services/healthService.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { BorderBeam } from '../components/ui/border-beam.jsx';
import { NumberTicker } from '../components/ui/number-ticker.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion.jsx';
import {
  Activity,
  Server,
  Database,
  Bot,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header />

      <PageTransition className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
        {/* Hero Section */}
        <section className="relative text-center space-y-6 max-w-4xl mx-auto pt-6 sm:pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold shadow-sm backdrop-blur-md"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>{t('heroBadge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent leading-tight sm:leading-none"
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Hero Action with BorderBeam */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative inline-flex p-1 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden mt-2"
          >
            <BorderBeam size={80} duration={8} colorFrom="#6366f1" colorTo="#a855f7" />
            <div className="flex flex-wrap items-center justify-center gap-3 p-2 relative z-10">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="h-12 px-7 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Vào Trang Học Tập</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="h-12 px-7 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Bắt Đầu Miễn Phí Ngay</span>
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 px-6 rounded-xl border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Đăng Nhập</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Live Metrics Counter Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center">
                <NumberTicker value={100} />%
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Lộ trình AI cá nhân</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-indigo-400 flex items-center justify-center">
                <NumberTicker value={500} />+
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Câu hỏi TOEIC/IELTS</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-violet-400 flex items-center justify-center">
                <NumberTicker value={6} />
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Cấp độ CEFR (A1-C2)</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-center justify-center">
                <NumberTicker value={99} />.9%
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Độ tin cậy hệ thống</span>
            </div>
          </div>
        </section>

        {/* System & Connection Status */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>{t('liveStatusTitle')}</span>
            </h2>
            <span className="text-xs text-slate-400">{t('liveStatusSubtitle')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <section id="architecture" className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-8 sm:p-10 backdrop-blur-xl space-y-8">
          <div>
            <Badge variant="outline" className="mb-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Kiến trúc chuẩn Clean Architecture
            </Badge>
            <h2 className="text-2xl font-bold text-slate-100">
              {t('archTitle')}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {t('archSubtitle')}
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={staggerItem} className="rounded-2xl p-6 border border-white/10 bg-slate-900/70 hover:border-indigo-500/40 transition-all space-y-3">
              <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-sm">
                <Server className="w-4 h-4" />
                <span>{t('archBackendTitle')}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('archBackendDesc')}
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="rounded-2xl p-6 border border-white/10 bg-slate-900/70 hover:border-violet-500/40 transition-all space-y-3">
              <div className="flex items-center gap-2.5 text-violet-400 font-bold text-sm">
                <Bot className="w-4 h-4" />
                <span>{t('archAiTitle')}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('archAiDesc')}
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="rounded-2xl p-6 border border-white/10 bg-slate-900/70 hover:border-emerald-500/40 transition-all space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>{t('archScoreTitle')}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('archScoreDesc')}
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="rounded-2xl p-6 border border-white/10 bg-slate-900/70 hover:border-sky-500/40 transition-all space-y-3">
              <div className="flex items-center gap-2.5 text-sky-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('archSecTitle')}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('archSecDesc')}
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Roadmap with shadcn Accordion */}
        <section id="roadmap" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold text-slate-100">{t('roadmapTitle')}</h2>
            <p className="text-sm text-slate-400 mt-1">
              {t('roadmapSubtitle')}
            </p>
          </div>

          <Accordion type="single" collapsible defaultValue="phase-4" className="w-full space-y-3">
            {phases.map((item, idx) => {
              const isCompleted = item.status === 'completed';
              const isActive = item.active;

              return (
                <AccordionItem
                  key={idx}
                  value={`phase-${idx + 1}`}
                  className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md px-6 transition-all hover:border-white/20"
                >
                  <AccordionTrigger className="py-5 hover:no-underline">
                    <div className="flex items-center gap-3.5 text-left">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isActive
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 animate-pulse'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400">{item.phase}</span>
                          {isActive && (
                            <Badge className="bg-indigo-500 text-white text-[10px] py-0 px-2">
                              Đang phát triển
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-2">
                              Hoàn thành
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-100 text-sm sm:text-base mt-0.5">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pt-1 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 mt-2">
                    {item.desc}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>
      </PageTransition>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-400 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">EngVantage AI Platform</span>
          </div>
          <p>{t('footerText')}</p>
        </div>
      </footer>
    </div>
  );
}
