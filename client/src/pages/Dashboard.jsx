import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiRequest } from '../services/api.js';
import Header from '../components/Header.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { BorderBeam } from '../components/ui/border-beam.jsx';
import { NumberTicker } from '../components/ui/number-ticker.jsx';
import { Progress } from '../components/ui/progress.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card } from '../components/ui/card.jsx';
import {
  Sparkles,
  Flame,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Compass,
  Clock,
  Layers,
  CheckCircle2,
  GraduationCap
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
  const progressPercentage = pathItems.length > 0 ? Math.round((completedPathItems / pathItems.length) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header />

      <PageTransition className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/70 via-slate-900/80 to-purple-950/50 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Học tập cùng AI Gemini</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                {t('welcomeBack')}{' '}
                <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                  {user?.full_name || 'Học viên'}
                </span>
                ! 👋
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                {t('dashboardSubtitle')}
              </p>
            </div>

            {/* Quick Level & Streak Badges */}
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Card className="p-4 text-center min-w-[110px] bg-slate-900/80 border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('currentLevelTitle')}
                </span>
                <span className="text-2xl font-black text-indigo-400 mt-1 block">
                  {user?.current_level || 'A1'}
                </span>
              </Card>

              <Card className="p-4 text-center min-w-[110px] bg-slate-900/80 border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('targetLevelTitle')}
                </span>
                <span className="text-2xl font-black text-violet-400 mt-1 block">
                  {user?.target_level || 'B2'}
                </span>
              </Card>

              <Card className="p-4 text-center min-w-[110px] bg-slate-900/80 border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('studyStreakTitle')}
                </span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span className="text-2xl font-black text-amber-400">
                    <NumberTicker value={user?.streak_count || 0} />
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Learning Path Summary Widget with BorderBeam */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <BorderBeam size={100} duration={10} colorFrom="#6366f1" colorTo="#8b5cf6" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10">
                <Compass className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px]">
                    Lộ trình AI Cá nhân hóa
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Đã hoàn thành <span className="font-bold text-white">{completedPathItems}</span>/{pathItems.length} bước
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {learningPath?.summary ? 'Lộ trình phát triển năng lực tiếng Anh' : 'Tạo lộ trình học tập tối ưu cùng AI'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {learningPath?.summary || 'AI Gemini sẽ tự động đo lường năng lực và sắp xếp bài học phù hợp với mục tiêu của bạn.'}
                </p>

                {pathItems.length > 0 && (
                  <div className="pt-2 max-w-md space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Tiến độ tổng thể</span>
                      <span className="font-bold text-indigo-400">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-slate-800" />
                  </div>
                )}
              </div>
            </div>

            <Link to="/learning-path" className="shrink-0">
              <Button
                size="lg"
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Xem Chi Tiết Lộ Trình</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Placement Test CTA Card */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/25 via-slate-900/60 to-slate-900/40 p-6 md:p-8 shadow-xl backdrop-blur-xl">
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

            <Link to="/assessment" className="shrink-0">
              <Button
                size="lg"
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>{t('startPlacementBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Courses Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>{t('myCoursesTitle')}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t('availableCoursesDesc')}
              </p>
            </div>
            <Link to="/courses">
              <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 text-xs">
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 rounded-3xl bg-slate-900/40 border border-white/10 animate-pulse"></div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="p-6 space-y-4 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px] font-bold uppercase">
                        CEFR {course.level}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Tự do
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      1 Module &bull; 1 Bài học
                    </span>
                    <Link to={`/courses/${course.id}`}>
                      <Button
                        size="sm"
                        className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{t('startLearningBtn')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-slate-400 text-sm bg-slate-900/20">
              <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              Chưa có khóa học nào sẵn sàng. Hãy chạy lệnh seed để tải danh sách khóa học.
            </div>
          )}
        </section>
      </PageTransition>
    </div>
  );
}
