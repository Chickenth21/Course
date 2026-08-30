import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiRequest } from '../services/api.js';
import Header from '../components/Header.jsx';
import {
  Sparkles,
  Trophy,
  Flame,
  Target,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  BrainCircuit,
  Compass,
  Clock,
  Layers,
  CircleDashed
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Fetch courses from server
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['available-courses'],
    queryFn: () => apiRequest('/api/courses'),
    retry: 1
  });

  // Fetch learning path summary
  const { data: pathData } = useQuery({
    queryKey: ['dashboard-learning-path'],
    queryFn: () => apiRequest('/api/learning-path'),
    retry: 1
  });

  const courses = coursesData?.data || [];
  const learningPath = pathData?.data;
  const pathItems = learningPath?.items || [];
  const completedPathItems = pathItems.filter((i) => i.status === 'completed').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/40 p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Học tập cùng AI Gemini</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {t('welcomeBack')} {user?.full_name || 'Học viên'}! 👋
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {t('dashboardSubtitle')}
              </p>
            </div>

            {/* Quick Level Badges */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center min-w-[100px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('currentLevelTitle')}
                </span>
                <span className="text-2xl font-black text-indigo-400 mt-1 block">
                  {user?.current_level || 'A1'}
                </span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center min-w-[100px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('targetLevelTitle')}
                </span>
                <span className="text-2xl font-black text-violet-400 mt-1 block">
                  {user?.target_level || 'B2'}
                </span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center min-w-[100px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('studyStreakTitle')}
                </span>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span className="text-2xl font-black text-amber-400">
                    {user?.streak_count || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Path Summary Widget */}
        <section className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-slate-900/60 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Lộ trình AI Cá nhân hóa
                  </span>
                  <span className="text-xs text-slate-400">
                    Đã hoàn thành {completedPathItems}/{pathItems.length} bước
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">
                  {learningPath?.summary ? 'Lộ trình phát triển năng lực tiếng Anh' : 'Tạo lộ trình học tập tối ưu cùng AI'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {learningPath?.summary || 'AI Gemini sẽ tổng hợp điểm số và tạo ra giáo trình học tập dành riêng cho bạn.'}
                </p>
              </div>
            </div>

            <Link
              to="/learning-path"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 shrink-0"
            >
              <span>Xem Chi Tiết Lộ Trình</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Placement Test CTA Card */}
        <section className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900/80 to-slate-900/60 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-amber-200">
                  {t('placementNoticeTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {t('placementNoticeDesc')}
                </p>
              </div>
            </div>

            <Link
              to="/assessment"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 shrink-0"
            >
              <span>{t('startPlacementBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Courses Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                {t('myCoursesTitle')}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t('availableCoursesDesc')}
              </p>
            </div>
          </div>

          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-indigo-500/40 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                        CEFR {course.level}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Tự do
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">1 Module &bull; 1 Bài học</span>
                    <button
                      className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>{t('startLearningBtn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-sm">
              Chưa có khóa học nào. Hãy chạy lệnh seed để tải danh sách khóa học.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
