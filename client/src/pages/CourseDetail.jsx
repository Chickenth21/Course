import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { courseService } from '../services/courseService.js';
import Header from '../components/Header.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { BorderBeam } from '../components/ui/border-beam.jsx';
import { Card } from '../components/ui/card.jsx';
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
  GraduationCap
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
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
          <Card className="p-8 max-w-md bg-slate-900 border-white/10">
            <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-white">Không tìm thấy khóa học</h2>
            <Link to="/courses" className="mt-4 inline-block">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">
                Quay lại danh sách khóa học
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header />

      <PageTransition className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Back Link */}
        <Link to="/courses">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer -ml-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Tất Cả Khóa Học</span>
          </Button>
        </Link>

        {/* Course Header Banner with BorderBeam */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-4">
          <BorderBeam size={100} duration={8} colorFrom="#6366f1" colorTo="#8b5cf6" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 uppercase text-xs font-bold">
                CEFR {course.level}
              </Badge>
              <span className="text-xs text-slate-400 font-medium">
                {modules.length} Module &bull; {modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Bài học
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {course.description}
            </p>
          </div>
        </section>

        {/* Modules & Lessons Hierarchy */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Nội Dung Khóa Học</span>
            </h2>
          </div>

          <div className="space-y-6">
            {modules.map((module, mIdx) => (
              <Card
                key={module.id || mIdx}
                className="p-6 space-y-4 bg-slate-900/60 border-white/10 shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                      Module {module.order_index || mIdx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {module.title}
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs text-slate-400 border-white/10">
                    {module.lessons?.length || 0} bài học
                  </Badge>
                </div>

                {/* Lessons inside Module */}
                <div className="grid grid-cols-1 gap-3">
                  {module.lessons?.map((lesson, lIdx) => (
                    <Link
                      key={lesson.id || lIdx}
                      to={`/lessons/${lesson.id}`}
                      className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-slate-950/60 hover:bg-slate-800/60 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer"
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
                        <span className="text-xs text-slate-400 hidden sm:flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.duration_minutes || 15} phút
                        </span>
                        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white transition-all shadow-sm">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </PageTransition>
    </div>
  );
}
