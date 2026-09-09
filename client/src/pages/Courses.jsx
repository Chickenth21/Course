import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { courseService } from '../services/courseService.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import Header from '../components/Header.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { Card } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import {
  BookOpen,
  Sparkles,
  Clock,
  Layers,
  ArrowRight,
  Filter,
  GraduationCap
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
  const { t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses-list'],
    queryFn: () => courseService.getAllCourses()
  });

  const courses = coursesData?.data || [];

  const filteredCourses = selectedLevel === 'ALL'
    ? courses
    : courses.filter((c) => c.level === selectedLevel);

  const levels = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header />

      <PageTransition className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Banner */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Thư Viện Khóa Học Chuẩn CEFR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Khóa Học Tiếng Anh Toàn Diện
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Hệ thống bài học được thiết kế có cấu trúc từ cơ bản đến nâng cao, tích hợp giải thích chi tiết, từ vựng và bài tập thực hành.
          </p>

          {/* Level Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {levels.map((lvl) => (
              <Button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                variant={selectedLevel === lvl ? 'default' : 'outline'}
                size="sm"
                className={`rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {lvl === 'ALL' ? 'Tất Cả' : `CEFR ${lvl}`}
              </Button>
            ))}
          </div>
        </section>

        {/* Courses Grid */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-slate-900/40 border border-white/10 animate-pulse"></div>
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
                <motion.div key={course.id} variants={itemVariants}>
                  <Card className="h-full p-6 flex flex-col justify-between space-y-6 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 group">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs font-bold uppercase">
                          Trình độ {course.level}
                        </Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Tự do
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        Giáo trình chuẩn hóa
                      </span>
                      <Link to={`/courses/${course.id}`}>
                        <Button
                          size="sm"
                          className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md transition-all group-hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Vào Khóa Học</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-16 rounded-3xl border border-dashed border-white/10 text-center space-y-3 bg-slate-900/20">
              <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-400">Không tìm thấy khóa học nào cho cấp độ đã chọn.</p>
            </div>
          )}
        </section>
      </PageTransition>
    </div>
  );
}
