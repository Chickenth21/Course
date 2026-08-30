import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/courseService.js';
import Header from '../components/Header.jsx';
import {
  BookOpen,
  Layers,
  Clock,
  PlayCircle,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: courseData, isLoading, isError } = useQuery({
    queryKey: ['course-detail', id],
    queryFn: () => courseService.getCourseById(id)
  });

  const course = courseData?.data;
  const modules = course?.modules || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Đang tải thông tin khóa học...</span>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6 text-center space-y-4">
          <div>
            <h2 className="text-xl font-bold">Không tìm thấy khóa học</h2>
            <Link to="/courses" className="mt-4 inline-block px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
              Quay lại danh sách khóa học
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Back Link */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Tất Cả Khóa Học</span>
        </Link>

        {/* Course Header Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-purple-950/40 p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              CEFR {course.level}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {modules.length} Module &bull; {modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Bài học
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            {course.title}
          </h1>

          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            {course.description}
          </p>
        </section>

        {/* Modules & Lessons Hierarchy */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Nội Dung Khóa Học
          </h2>

          <div className="space-y-6">
            {modules.map((module, mIdx) => (
              <div
                key={module.id || mIdx}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                      Module {module.order_index || mIdx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                      {module.title}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {module.lessons?.length || 0} bài học
                  </span>
                </div>

                {/* Lessons inside Module */}
                <div className="grid grid-cols-1 gap-3">
                  {module.lessons?.map((lesson, lIdx) => (
                    <Link
                      key={lesson.id || lIdx}
                      to={`/lessons/${lesson.id}`}
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/40 hover:border-indigo-500/40 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                          {lesson.order_index || lIdx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-slate-500 hidden sm:flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.duration_minutes || 15} phút
                        </span>
                        <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white transition-colors">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
