import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/courseService.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import Header from '../components/Header.jsx';
import {
  BookOpen,
  Sparkles,
  Clock,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Banner */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Thư Viện Khóa Học Chuẩn CEFR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Khóa Học Tiếng Anh Toàn Diện
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Hệ thống bài học được thiết kế có cấu trúc từ cơ bản đến nâng cao, tích hợp giải thích chi tiết, từ vựng và bài tập thực hành.
          </p>

          {/* Level Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {lvl === 'ALL' ? 'Tất Cả' : `CEFR ${lvl}`}
              </button>
            ))}
          </div>
        </section>

        {/* Courses Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
            ))
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-6 hover:border-indigo-500/50 transition-all shadow-xl hover:-translate-y-1 backdrop-blur-sm group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      Trình độ {course.level}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Tự học
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Giáo trình chuẩn hóa</span>
                  <Link
                    to={`/courses/${course.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md transition-all group-hover:scale-105"
                  >
                    <span>Vào Khóa Học</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 rounded-3xl border border-dashed border-slate-800 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">Không có khóa học nào cho cấp độ đã chọn.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
