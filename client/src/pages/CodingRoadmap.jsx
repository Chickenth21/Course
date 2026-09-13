import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { codingRoadmapService } from '../services/codingRoadmapService.js';
import { courseService } from '../services/courseService.js';
import Header from '../components/Header.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { Button } from '../components/ui/button.jsx';
import { Badge } from '../components/ui/badge.jsx';
import {
  Map, Sparkles, ChevronLeft, CheckCircle2, Circle,
  PlayCircle, Loader2, RefreshCw, Target, Clock,
  TrendingUp, BookOpen, ArrowRight, Zap, Star
} from 'lucide-react';

// ─── Skill level options ──────────────────────────────────────────────────────
const SKILL_LEVELS = [
  { value: 'beginner', label: 'Mới Bắt Đầu', desc: 'Chưa biết gì về chủ đề này', color: 'emerald', emoji: '🌱' },
  { value: 'intermediate', label: 'Trung Cấp', desc: 'Đã biết cơ bản, muốn nâng cao', color: 'amber', emoji: '🔥' },
  { value: 'advanced', label: 'Nâng Cao', desc: 'Có kinh nghiệm, muốn làm chủ hoàn toàn', color: 'indigo', emoji: '⚡' },
];

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500', ring: 'ring-emerald-500/40', label: 'Hoàn thành' },
  in_progress: { icon: PlayCircle, color: 'text-indigo-400', bg: 'bg-indigo-500', ring: 'ring-indigo-500/40', label: 'Đang học' },
  pending: { icon: Circle, color: 'text-slate-600', bg: 'bg-slate-700', ring: 'ring-slate-700/40', label: 'Chưa bắt đầu' },
};

// ─── Roadmap Step Card ────────────────────────────────────────────────────────
function RoadmapStep({ step, index, onUpdateStatus }) {
  const cfg = STATUS_CONFIG[step.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="flex gap-4"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-full ${cfg.bg} ring-4 ${cfg.ring} flex items-center justify-center shrink-0 shadow-lg z-10`}>
          <StatusIcon className="w-4 h-4 text-white" />
        </div>
        <div className={`flex-1 w-0.5 mt-1 ${step.status === 'completed' ? 'bg-emerald-600/40' : 'bg-slate-800'}`} />
      </div>

      {/* Step content */}
      <div className={`flex-1 mb-6 rounded-2xl border transition-all duration-200 p-4 space-y-3 ${
        step.status === 'in_progress'
          ? 'bg-indigo-950/30 border-indigo-700/50 shadow-lg shadow-indigo-900/20'
          : step.status === 'completed'
            ? 'bg-emerald-950/20 border-emerald-900/40 opacity-80'
            : 'bg-[#0d1424] border-slate-800 hover:border-slate-700'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-slate-600 uppercase">Bước {step.order_index}</span>
              {step.priority === 'high' && (
                <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[10px] gap-1">
                  <Star className="w-2.5 h-2.5" /> Ưu tiên cao
                </Badge>
              )}
              <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
            </div>
            <h3 className="font-bold text-white text-sm">{step.topic}</h3>
          </div>
        </div>

        {/* Description */}
        {step.description && (
          <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
        )}

        {/* Why this step */}
        {step.reason && (
          <div className="flex items-start gap-1.5 text-xs text-slate-500 italic">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
            {step.reason}
          </div>
        )}

        {/* Concepts */}
        {step.concepts?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {step.concepts.map((c, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-500 border border-slate-700">
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {/* Start/Continue lesson */}
          {step.lesson?.id && step.status !== 'completed' && (
            <Link to={`/code-lessons/${step.lesson.id}`}>
              <Button
                size="sm"
                className={`h-7 px-3 text-[11px] font-bold rounded-lg gap-1.5 ${
                  step.status === 'in_progress'
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <PlayCircle className="w-3 h-3" />
                {step.status === 'in_progress' ? 'Tiếp tục học' : 'Bắt đầu'}
              </Button>
            </Link>
          )}

          {/* Lesson info */}
          {step.lesson && (
            <span className="text-[11px] text-slate-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {step.lesson.duration_minutes} phút
            </span>
          )}

          {/* Status control */}
          <div className="ml-auto flex items-center gap-1">
            {step.status === 'pending' && (
              <button
                onClick={() => onUpdateStatus(step.id, 'in_progress')}
                className="text-[10px] text-slate-600 hover:text-indigo-400 transition-colors font-medium"
              >
                Đánh dấu đang học
              </button>
            )}
            {step.status === 'in_progress' && (
              <button
                onClick={() => onUpdateStatus(step.id, 'completed')}
                className="text-[10px] text-slate-600 hover:text-emerald-400 transition-colors font-medium"
              >
                Đánh dấu hoàn thành ✓
              </button>
            )}
            {step.status === 'completed' && (
              <button
                onClick={() => onUpdateStatus(step.id, 'pending')}
                className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Progress Summary ─────────────────────────────────────────────────────────
function ProgressSummary({ steps, estimatedWeeks }) {
  const total = steps.length;
  const completed = steps.filter(s => s.status === 'completed').length;
  const inProgress = steps.filter(s => s.status === 'in_progress').length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-sm">Tiến Trình Tổng Thể</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ước tính ~{estimatedWeeks} tuần để hoàn thành</p>
        </div>
        <span className="text-2xl font-extrabold text-white">{pct}<span className="text-sm text-slate-500">%</span></span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Hoàn thành', value: completed, color: 'text-emerald-400' },
          { label: 'Đang học', value: inProgress, color: 'text-indigo-400' },
          { label: 'Còn lại', value: total - completed - inProgress, color: 'text-slate-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl bg-slate-900/60 border border-slate-800 py-2">
            <p className={`text-lg font-extrabold ${color}`}>{value}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Generate Form ────────────────────────────────────────────────────────────
function GenerateRoadmapForm({ courseTitle, onGenerate, isGenerating }) {
  const [goal, setGoal] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    onGenerate({ goal, skillLevel });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="rounded-3xl border border-indigo-900/50 bg-gradient-to-b from-indigo-950/40 to-[#0d1424] p-8 space-y-8 shadow-2xl shadow-indigo-900/20">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Tạo Lộ Trình Cá Nhân</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Gemini AI sẽ phân tích mục tiêu của bạn và tạo lộ trình học tập<br />
            tối ưu cho khóa <span className="text-indigo-300 font-semibold">{courseTitle}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              Mục Tiêu Của Bạn *
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ví dụ: Tôi muốn xây dựng REST API với Node.js, hiểu async/await và triển khai lên production..."
              rows={3}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-200 placeholder-slate-600 text-sm resize-none outline-none transition-all"
            />
          </div>

          {/* Skill level selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Trình Độ Hiện Tại
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SKILL_LEVELS.map(({ value, label, desc, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSkillLevel(value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    skillLevel === value
                      ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xl mb-1">{emoji}</div>
                  <div className="text-xs font-bold text-white">{label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!goal.trim() || isGenerating}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm gap-2 shadow-lg shadow-indigo-900/30 disabled:opacity-50 transition-all"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Gemini đang tạo lộ trình...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Tạo Lộ Trình Học Tập</>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CodingRoadmap() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [regenerating, setRegenerating] = useState(false);

  // Load course info
  const { data: courseData } = useQuery({
    queryKey: ['course-detail', courseId],
    queryFn: () => courseService.getCourseById(courseId),
    staleTime: 5 * 60 * 1000
  });

  // Load existing roadmap
  const { data: roadmapData, isLoading } = useQuery({
    queryKey: ['coding-roadmap', courseId],
    queryFn: () => codingRoadmapService.getRoadmap(courseId)
  });

  const course = courseData?.data;
  const roadmap = roadmapData?.data;
  const steps = roadmap?.steps || [];

  // Generate roadmap mutation
  const generateMutation = useMutation({
    mutationFn: ({ goal, skillLevel }) => codingRoadmapService.generateRoadmap(courseId, { goal, skillLevel }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-roadmap', courseId] });
      setRegenerating(false);
    }
  });

  // Update step status mutation
  const updateStepMutation = useMutation({
    mutationFn: ({ stepId, status }) => codingRoadmapService.updateStepStatus(stepId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-roadmap', courseId] });
    }
  });

  const showGenerateForm = !roadmap || regenerating;

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 font-sans">
      <Header />

      <PageTransition className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Back navigation */}
        <Button
          onClick={() => navigate(`/courses/${courseId}`)}
          variant="ghost"
          size="sm"
          className="text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại khóa học
        </Button>

        {/* Page header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Map className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Lộ Trình Học Tập Cá Nhân
            </h1>
            <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 text-[10px] font-mono">
              AI-Powered
            </Badge>
          </div>
          {course && (
            <p className="text-sm text-slate-400">
              Khóa học: <span className="text-slate-200 font-semibold">{course.title}</span>
            </p>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Đang tải lộ trình...</span>
          </div>
        )}

        {/* Generate form */}
        {!isLoading && showGenerateForm && (
          <GenerateRoadmapForm
            courseTitle={course?.title || 'khóa học'}
            onGenerate={({ goal, skillLevel }) => generateMutation.mutate({ goal, skillLevel })}
            isGenerating={generateMutation.isPending}
          />
        )}

        {/* Roadmap view */}
        {!isLoading && roadmap && !regenerating && (
          <div className="space-y-6">
            {/* AI Summary banner */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900/60 border border-indigo-800/40 p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Gemini AI Phân Tích</p>
                <p className="text-sm text-slate-300 leading-relaxed">{roadmap.ai_summary}</p>
                <p className="text-[11px] text-slate-600">
                  Trình độ: <span className="text-slate-400 font-medium capitalize">{roadmap.current_skill_level}</span>
                  {roadmap.goal && <> · Mục tiêu: <span className="text-slate-400 font-medium">{roadmap.goal}</span></>}
                </p>
              </div>
            </div>

            {/* Progress summary */}
            <ProgressSummary steps={steps} estimatedWeeks={roadmap.estimated_weeks} />

            {/* Steps timeline */}
            <div className="space-y-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  Các Bước Học ({steps.length} bước)
                </h2>
                <button
                  onClick={() => setRegenerating(true)}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 transition-colors font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Tạo lại lộ trình
                </button>
              </div>

              <div className="pl-2">
                {steps.map((step, idx) => (
                  <RoadmapStep
                    key={step.id}
                    step={step}
                    index={idx}
                    isLast={idx === steps.length - 1}
                    onUpdateStatus={(stepId, status) =>
                      updateStepMutation.mutate({ stepId, status })
                    }
                  />
                ))}
              </div>

              {/* Completion message */}
              {steps.length > 0 && steps.every(s => s.status === 'completed') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-gradient-to-r from-emerald-950/50 to-indigo-950/50 border border-emerald-800/50 p-6 text-center space-y-2"
                >
                  <div className="text-3xl">🎉</div>
                  <h3 className="font-extrabold text-white">Xuất sắc! Bạn đã hoàn thành lộ trình!</h3>
                  <p className="text-sm text-slate-400">Hãy tạo lộ trình mới với mục tiêu thách thức hơn.</p>
                  <Button
                    onClick={() => setRegenerating(true)}
                    className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5" /> Tạo Lộ Trình Mới
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </PageTransition>
    </div>
  );
}
