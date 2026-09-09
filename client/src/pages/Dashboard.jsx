import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiRequest } from '../services/api.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { NumberTicker } from '../components/ui/number-ticker.jsx';
import { Progress } from '../components/ui/progress.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
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
  GraduationCap,
  Target
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

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
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <Header />

      <PageTransition className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Academic Student Identity Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1424] p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Hồ Sơ Năng Lực Học Viên</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                {t('welcomeBack')}{' '}
                <span className="text-amber-400">
                  {user?.full_name || 'Học viên'}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                {language === 'vi'
                  ? 'Theo dõi tiến trình hấp thu ngữ âm, mở rộng từ vựng học thuật và mức độ làm chủ các cấp độ chuẩn CEFR.'
                  : 'Monitor phonetics accuracy, academic vocabulary expansion, and progress toward your target CEFR tier.'}
              </p>
            </div>

            {/* Academic Metrics Pods */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="p-4 text-center min-w-[110px] rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('currentLevelTitle')}
                </span>
                <span className="text-2xl font-black text-amber-400 mt-1 block font-mono">
                  {user?.current_level || 'A1'}
                </span>
              </div>

              <div className="p-4 text-center min-w-[110px] rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('targetLevelTitle')}
                </span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block font-mono">
                  {user?.target_level || 'B2'}
                </span>
              </div>

              <div className="p-4 text-center min-w-[110px] rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('studyStreakTitle')}
                </span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span className="text-2xl font-black text-white font-mono">
                    <NumberTicker value={user?.streak_count || 0} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Path Summary Widget */}
        <section className="rounded-3xl border border-slate-800 bg-[#0a0f1d] p-6 md:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px] font-bold">
                    Lộ Trình Thích Ứng Cá Nhân
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">
                    Hoàn thành <strong className="text-amber-400">{completedPathItems}</strong>/{pathItems.length} mốc
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {learningPath?.summary ? 'Lộ trình phát triển năng lực cá nhân hóa' : 'Tạo lộ trình thích ứng cùng Gemini AI'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {learningPath?.summary || 'Hệ thống định lượng chính xác kỹ năng còn yếu để đề xuất bài học 5-10 phút phù hợp nhất.'}
                </p>

                {pathItems.length > 0 && (
                  <div className="pt-2 max-w-md space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>Tiến độ tổng thể</span>
                      <span className="font-bold text-amber-400">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-slate-900" />
                  </div>
                )}
              </div>
            </div>

            <Link to="/learning-path" className="shrink-0">
              <Button
                size="lg"
                className="h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/10 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Xem Chi Tiết Lộ Trình</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Diagnostic Assessment Banner */}
        <section className="rounded-3xl border border-slate-800 bg-[#0d1527] p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
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
                className="h-11 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>{t('startPlacementBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Courses Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>{t('myCoursesTitle')}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t('availableCoursesDesc')}
              </p>
            </div>
            <Link to="/courses">
              <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 text-xs">
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-6 rounded-2xl border border-slate-800 bg-[#0d1424] space-y-4 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-bold uppercase">
                        CEFR {course.level}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        Tự do
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400/80" />
                      1 Module &bull; 1 Bài học
                    </span>
                    <Link to={`/courses/${course.id}`}>
                      <Button
                        size="sm"
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-500/10"
                      >
                        <span>{t('startLearningBtn')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400 text-sm bg-slate-900/20">
              <GraduationCap className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              Chưa có khóa học nào sẵn sàng.
            </div>
          )}
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}
