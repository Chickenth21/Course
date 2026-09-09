import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { learningPathService } from '../services/learningPathService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import Header from '../components/Header.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { AnimatedBeam } from '../components/ui/animated-beam.jsx';
import { NumberTicker } from '../components/ui/number-ticker.jsx';
import { Progress } from '../components/ui/progress.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card } from '../components/ui/card.jsx';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  CircleDashed,
  PlayCircle,
  RefreshCw,
  Target,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function LearningPath() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const [updatingItemId, setUpdatingItemId] = useState(null);

  // AnimatedBeam refs
  const beamContainerRef = useRef(null);
  const startNodeRef = useRef(null);
  const aiNodeRef = useRef(null);
  const targetNodeRef = useRef(null);

  // Fetch active learning path
  const { data: pathData, isLoading, isError, refetch } = useQuery({
    queryKey: ['active-learning-path'],
    queryFn: () => learningPathService.getActivePath(),
    staleTime: 1000 * 60 * 5
  });

  // Regenerate mutation
  const regenerateMutation = useMutation({
    mutationFn: () => learningPathService.generatePath(),
    onSuccess: (newData) => {
      queryClient.setQueryData(['active-learning-path'], newData);
    }
  });

  // Update item status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ itemId, status }) => learningPathService.updateItemStatus(itemId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['active-learning-path']);
      setUpdatingItemId(null);
    }
  });

  const path = pathData?.data;
  const items = path?.items || [];

  const completedCount = items.filter((item) => item.status === 'completed').length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleStatus = (itemId, currentStatus) => {
    setUpdatingItemId(itemId);
    let nextStatus = 'in_progress';
    if (currentStatus === 'in_progress') nextStatus = 'completed';
    else if (currentStatus === 'completed') nextStatus = 'pending';

    updateStatusMutation.mutate({ itemId, status: nextStatus });
  };

  const getSkillBadgeVariant = (skill) => {
    switch (skill) {
      case 'Grammar':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'Vocabulary':
        return 'bg-violet-500/15 text-violet-300 border-violet-500/30';
      case 'Reading':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Listening':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header />

      <PageTransition className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Top Header Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-purple-950/50 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span>Google Gemini AI Personalized Curriculum</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Lộ Trình Học Tập Cá Nhân Hóa
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {path?.summary || 'Giáo trình được AI tối ưu riêng biệt dựa trên năng lực và điểm cần hoàn thiện của bạn.'}
              </p>
            </div>

            <Button
              onClick={() => regenerateMutation.mutate()}
              disabled={regenerateMutation.isPending}
              variant="outline"
              size="lg"
              className="rounded-2xl border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all hover:border-indigo-500/50 shadow-lg shrink-0 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 mr-2 ${regenerateMutation.isPending ? 'animate-spin' : ''}`} />
              <span>{regenerateMutation.isPending ? 'AI đang xử lý...' : 'Tạo Lại Cùng AI'}</span>
            </Button>
          </div>

          {/* AI Workflow Beam Visualizer */}
          <div
            ref={beamContainerRef}
            className="relative mt-8 p-6 rounded-2xl border border-white/10 bg-slate-950/70 flex items-center justify-between overflow-hidden"
          >
            {/* Start Level Node */}
            <div ref={startNodeRef} className="z-10 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-900 border border-white/10 shadow-lg text-center min-w-[90px]">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                {path?.current_level || user?.current_level || 'A1'}
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Trình độ gốc</span>
            </div>

            {/* Central AI Brain Node */}
            <div ref={aiNodeRef} className="z-10 flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-gradient-to-tr from-indigo-900/80 to-violet-900/80 border border-indigo-500/40 shadow-2xl text-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 text-indigo-200 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-[11px] font-bold text-white">Gemini 2.5 Flash</span>
              <span className="text-[9px] text-indigo-300">Bộ phối hợp lộ trình</span>
            </div>

            {/* Target Level Node */}
            <div ref={targetNodeRef} className="z-10 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-900 border border-white/10 shadow-lg text-center min-w-[90px]">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs">
                {path?.target_level || user?.target_level || 'B2'}
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Mục tiêu</span>
            </div>

            {/* Animated Beams */}
            <AnimatedBeam
              containerRef={beamContainerRef}
              fromRef={startNodeRef}
              toRef={aiNodeRef}
              duration={3.5}
              gradientStartColor="#6366f1"
              gradientStopColor="#8b5cf6"
            />
            <AnimatedBeam
              containerRef={beamContainerRef}
              fromRef={aiNodeRef}
              toRef={targetNodeRef}
              duration={3.5}
              delay={1.5}
              gradientStartColor="#8b5cf6"
              gradientStopColor="#10b981"
            />
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                <NumberTicker value={completionPercentage} />%
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-300 block">Tiến độ khóa học</span>
                <span className="text-xs text-slate-400">{completedCount}/{totalCount} mục đã hoàn thành</span>
              </div>
            </div>

            <div className="w-full sm:max-w-xs space-y-1.5">
              <Progress value={completionPercentage} className="h-2 bg-slate-900" />
            </div>
          </div>
        </section>

        {/* Timeline Roadmap */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>Các Bước Học Tập Đề Xuất</span>
            </h2>
            <span className="text-xs text-slate-400">Bấm trạng thái để đánh dấu tiến độ hoàn thành</span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-3xl bg-slate-900/40 border border-white/10 animate-pulse"></div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
              {items.map((item, idx) => {
                const isCompleted = item.status === 'completed';
                const isInProgress = item.status === 'in_progress';

                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`relative rounded-3xl border transition-all p-6 shadow-xl backdrop-blur-xl ${
                      isCompleted
                        ? 'border-emerald-500/30 bg-slate-900/50 hover:border-emerald-500/50'
                        : isInProgress
                        ? 'border-indigo-500/50 bg-indigo-950/20 shadow-indigo-500/10'
                        : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                    }`}
                  >
                    {/* Step Circle Node */}
                    <div
                      className={`absolute -left-[30px] sm:-left-[38px] top-6 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold shadow-md transition-transform hover:scale-110 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 ring-4 ring-slate-950'
                          : isInProgress
                          ? 'bg-indigo-600 text-white ring-4 ring-slate-950 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 ring-4 ring-slate-950'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getSkillBadgeVariant(item.skill)}`}>
                            {item.skill}
                          </Badge>
                          <span className="text-xs font-mono font-semibold text-slate-400">
                            Bước {item.order_index || idx + 1}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-100">
                          {item.topic}
                        </h3>

                        {item.reason && (
                          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 flex items-start gap-2.5 max-w-2xl">
                            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">
                              <strong className="text-indigo-300">Lý do AI đề xuất:</strong> {item.reason}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status Toggle & CTA */}
                      <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
                        <Button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          disabled={updatingItemId === item.id}
                          variant="outline"
                          size="sm"
                          className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : isInProgress
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                              <span>Đã hoàn thành</span>
                            </>
                          ) : isInProgress ? (
                            <>
                              <PlayCircle className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                              <span>Đang học</span>
                            </>
                          ) : (
                            <>
                              <CircleDashed className="w-3.5 h-3.5 mr-1.5" />
                              <span>Chưa học</span>
                            </>
                          )}
                        </Button>

                        <Link to="/courses">
                          <Button
                            size="icon"
                            className="w-9 h-9 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all active:scale-95 cursor-pointer"
                            title="Đến bài học"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center space-y-4 bg-slate-900/20">
              <Compass className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-200">Chưa có lộ trình nào được tạo</h3>
                <p className="text-xs text-slate-400">Bấm nút bên dưới để AI phân tích và xây dựng lộ trình học cho bạn.</p>
              </div>
              <Button
                onClick={() => regenerateMutation.mutate()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg cursor-pointer"
              >
                Tạo Lộ Trình Cùng AI Ngay
              </Button>
            </div>
          )}
        </section>
      </PageTransition>
    </div>
  );
}
