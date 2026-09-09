import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { courseService } from '../services/courseService.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import {
  BookOpen,
  Clock,
  Layers,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
};

export default function Courses() {
  const { t, language } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses-list'],
    queryFn: () => courseService.getAllCourses()
  });

  const courses = coursesData?.data || [];

  const filteredCourses = selectedLevel === 'ALL'
    ? courses
    : courses.filter((c) => c.level === selectedLevel);

  const levels = [
    { code: 'ALL', label: language === 'vi' ? 'Tất cả cấp độ' : 'All Levels' },
    { code: 'A1', label: 'A1 • Beginner' },
    { code: 'A2', label: 'A2 • Elementary' },
    { code: 'B1', label: 'B1 • Intermediate' },
    { code: 'B2', label: 'B2 • Upper-Int' },
    { code: 'C1', label: 'C1 • Advanced' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <Header />

      <PageTransition className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Academic Header Banner */}
        <section className="text-left border-b border-slate-800 pb-8 pt-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Giáo Trình Tiếng Anh Khung Châu Âu' : 'CEFR Standard Curriculum'}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {language === 'vi' ? 'Thư Viện Khóa Học Nền Tảng' : 'Academic Course Catalog'}
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed mt-2">
                {language === 'vi'
                  ? 'Mỗi khóa học được thiết kế theo module ngắn gọn, kết hợp phân tích ngữ âm AI và bài tập phản xạ để tối ưu hóa khả năng ghi nhớ dài hạn.'
                  : 'Structured micro-modules combining phonetics, contextual grammar, and immediate AI evaluation for maximum retention.'}
              </p>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              {filteredCourses.length} {language === 'vi' ? 'khóa học sẵn sàng' : 'courses calibrated'}
            </div>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {levels.map((lvl) => {
              const isActive = selectedLevel === lvl.code;
              return (
                <button
                  key={lvl.code}
                  onClick={() => setSelectedLevel(lvl.code)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {lvl.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Courses Grid */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  className="rounded-2xl border border-slate-800 bg-[#0d1424] p-6 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[11px] font-bold">
                        CEFR {course.level}
                      </Badge>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {language === 'vi' ? 'Tự do tốc độ' : 'Self-paced'}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {course.title}
                    </h2>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400/80" />
                      1 Module &bull; 1 Bài học
                    </span>

                    <Link to={`/courses/${course.id}`}>
                      <Button
                        size="sm"
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
                      >
                        <span>{t('startLearningBtn')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-16 text-center text-slate-400 bg-slate-900/20 space-y-3">
              <GraduationCap className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm font-medium text-slate-300">
                {language === 'vi' ? 'Không có khóa học nào cho cấp độ này.' : 'No courses found for this CEFR level.'}
              </p>
              <button
                onClick={() => setSelectedLevel('ALL')}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                {language === 'vi' ? 'Xem tất cả khóa học' : 'View all levels'}
              </button>
            </div>
          )}
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}
