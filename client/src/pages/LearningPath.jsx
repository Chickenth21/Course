import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningPathService } from '../services/learningPathService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import Header from '../components/Header.jsx';
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
  Layers
} from 'lucide-react';

export default function LearningPath() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const [updatingItemId, setUpdatingItemId] = useState(null);

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

  const getSkillColor = (skill) => {
    switch (skill) {
      case 'Grammar':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Vocabulary':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'Reading':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Listening':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Top Header Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-purple-950/40 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span>Google Gemini AI Personalized Curriculum</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Lộ Trình Học Tập Cá Nhân Hóa
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {path?.summary || 'Giáo trình được tối ưu riêng biệt dựa trên kết quả bài kiểm tra và điểm yếu cần cải thiện của bạn.'}
              </p>
            </div>

            <button
              onClick={() => regenerateMutation.mutate()}
              disabled={regenerateMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all hover:border-indigo-500/50 shadow-lg shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${regenerateMutation.isPending ? 'animate-spin' : ''}`} />
              <span>{regenerateMutation.isPending ? 'AI đang tạo lại...' : 'Tạo Lại Cùng AI'}</span>
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                {path?.current_level || user?.current_level || 'A1'}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Trình độ bắt đầu</span>
                <span className="text-sm font-semibold text-slate-200">CEFR {path?.current_level || 'A1'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm shrink-0">
                {path?.target_level || user?.target_level || 'B2'}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mục tiêu hướng tới</span>
                <span className="text-sm font-semibold text-slate-200">CEFR {path?.target_level || 'B2'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                {completionPercentage}%
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Tiến độ hoàn thành</span>
                  <span>{completedCount}/{totalCount} bài</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Roadmap */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              Các Bước Học Tập Đề Xuất
            </h2>
            <span className="text-xs text-slate-400">Bấm vào trạng thái để đánh dấu tiến độ hoàn thành</span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
              {items.map((item, idx) => {
                const isCompleted = item.status === 'completed';
                const isInProgress = item.status === 'in_progress';

                return (
                  <div
                    key={item.id || idx}
                    className={`relative rounded-2xl border transition-all p-6 shadow-xl ${
                      isCompleted
                        ? 'border-emerald-500/30 bg-slate-900/50 hover:border-emerald-500/50'
                        : isInProgress
                        ? 'border-indigo-500/50 bg-indigo-950/20 shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    {/* Step Circle Node */}
                    <div
                      className={`absolute -left-[30px] sm:-left-[38px] top-6 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold shadow-md ${
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
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getSkillColor(item.skill)}`}>
                            {item.skill}
                          </span>
                          <span className="text-xs font-mono font-semibold text-slate-400">
                            Bước {item.order_index || idx + 1}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-100">
                          {item.topic}
                        </h3>

                        {item.reason && (
                          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2 max-w-2xl">
                            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">
                              <strong>Lý do AI đề xuất:</strong> {item.reason}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status Toggle & CTA */}
                      <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          disabled={updatingItemId === item.id}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                            isCompleted
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : isInProgress
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Đã hoàn thành</span>
                            </>
                          ) : isInProgress ? (
                            <>
                              <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Đang học</span>
                            </>
                          ) : (
                            <>
                              <CircleDashed className="w-3.5 h-3.5" />
                              <span>Chưa học</span>
                            </>
                          )}
                        </button>

                        <Link
                          to="/dashboard"
                          className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                          title="Vào học bài này"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center space-y-4">
              <Compass className="w-10 h-10 text-slate-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-200">Chưa có lộ trình nào được tạo</h3>
                <p className="text-xs text-slate-400">Bấm nút bên dưới để AI phân tích và xây dựng lộ trình học cho bạn.</p>
              </div>
              <button
                onClick={() => regenerateMutation.mutate()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
              >
                Tạo Lộ Trình Cùng AI Ngay
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
