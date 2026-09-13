import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { courseService } from '../services/courseService.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import {
  BookOpen,
  Layers,
  Clock,
  PlayCircle,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Map,
  Code2
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
  const isCodingCourse = course?.category === 'coding';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b16] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono">Đang tải thông tin khóa học...</span>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6 text-center space-y-4">
          <div className="p-8 max-w-md rounded-2xl bg-slate-900 border border-slate-800">
            <GraduationCap className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-white">Không tìm thấy khóa học</h2>
            <Link to="/courses" className="mt-4 inline-block">
              <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
                Quay lại danh sách khóa học
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <Header />

      <PageTransition className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Back Link */}
        <Button
          onClick={() => navigate('/courses')}
          variant="ghost"
          size="sm"
          className="text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Quay Lại Thư Viện Khóa Học</span>
        </Button>

        {/* Course Header Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1424] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold text-xs font-mono uppercase">
                CEFR {course.level}
              </Badge>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Học tự do theo tốc độ cá nhân
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{modules.length} Modules giáo trình</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isCodingCourse ? 'Thực hành code thực tế' : 'Khung chuẩn quốc tế CEFR'}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* AI Roadmap button for coding courses */}
              {isCodingCourse && (
                <Link to={`/coding-roadmap/${course.id}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 px-5 rounded-xl border-indigo-600/50 text-indigo-400 hover:bg-indigo-950/40 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Map className="w-4 h-4" />
                    <span>Lộ Trình AI</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}

              {modules[0]?.lessons?.[0] && (
                <Link to={isCodingCourse
                  ? `/code-lessons/${modules[0].lessons[0].id}`
                  : `/lessons/${modules[0].lessons[0].id}`
                }>
                  <Button
                    size="lg"
                    className="h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Bắt Đầu Bài Đầu Tiên</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Modules & Lessons Curriculum Section */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Nội Dung Giáo Trình</span>
            </h2>
          </div>

          <div className="space-y-6">
            {modules.map((module, mIdx) => (
              <div
                key={module.id || mIdx}
                className="p-6 rounded-2xl border border-slate-800 bg-[#0d1424] space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                      Module {module.order_index || mIdx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {module.title}
                    </h3>
                  </div>
                  <Badge className="text-xs text-slate-400 bg-slate-900 border-slate-800 font-mono">
                    {module.lessons?.length || 0} bài học
                  </Badge>
                </div>

                {/* Lessons inside Module */}
                <div className="grid grid-cols-1 gap-3">
                  {module.lessons?.map((lesson, lIdx) => (
                    <Link
                      key={lesson.id || lIdx}
                      to={isCodingCourse ? `/code-lessons/${lesson.id}` : `/lessons/${lesson.id}`}
                      className="group flex items-center justify-between p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/80 hover:border-amber-500/40 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-xs font-bold group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shrink-0">
                          {lesson.order_index || lIdx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-slate-400 hidden sm:flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.duration_minutes || 15} phút
                        </span>
                        <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-amber-500 text-slate-400 group-hover:text-slate-950 transition-all shadow-sm">
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
      </PageTransition>

      <Footer />
    </div>
  );
}
