import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { NumberTicker } from '../components/ui/number-ticker.jsx';
import { Progress } from '../components/ui/progress.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  BrainCircuit,
  Compass,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export default function AssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const result = location.state?.result;
  const testTitle = location.state?.testTitle || 'Bài Đánh Giá Trình Độ Tiếng Anh';

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="p-8 text-center space-y-4 max-w-md rounded-2xl bg-slate-900 border border-slate-800">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Kết quả bài thi</h2>
            <p className="text-xs text-slate-400">Bạn đã hoàn thành bài kiểm tra đầu vào.</p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Về Trang Học Tập
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const {
    totalScore,
    totalQuestions,
    percentage,
    estimatedLevel,
    skillScores = {},
    weakAreas = [],
    strongAreas = [],
    questionReview = []
  } = result;

  const toggleQuestionExpand = (qId) => {
    setExpandedQuestion((prev) => (prev === qId ? null : qId));
  };

  const getLevelGradient = (lvl) => {
    switch (lvl) {
      case 'C1':
      case 'C2':
        return 'from-amber-500 to-amber-600 text-slate-950 border-amber-300';
      case 'B2':
        return 'from-amber-400 to-amber-500 text-slate-950 border-amber-300';
      case 'B1':
        return 'from-indigo-600 to-indigo-700 text-white border-indigo-400';
      case 'A2':
        return 'from-emerald-600 to-teal-600 text-white border-emerald-400';
      default:
        return 'from-slate-700 to-slate-800 text-white border-slate-600';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <Header />

      <PageTransition className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Top Celebration Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1424] p-8 sm:p-12 shadow-2xl text-center space-y-8">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>Đánh Giá Năng Lực Chuẩn CEFR Hoàn Tất</span>
            </div>

            <div className="space-y-2 max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Chứng Nhận Trình Độ Học Viên
              </h1>
              <p className="text-sm text-slate-400">
                {testTitle}
              </p>
            </div>

            {/* CEFR Badge & Score with NumberTicker */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
              <div className="p-6 sm:p-8 flex flex-col items-center min-w-[200px] rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Khung CEFR Xác Nhận
                </span>
                <motion.div
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className={`mt-4 w-20 h-20 rounded-2xl bg-gradient-to-tr ${getLevelGradient(
                    estimatedLevel
                  )} flex items-center justify-center font-black text-3xl shadow-xl font-mono`}
                >
                  {estimatedLevel}
                </motion.div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col items-center min-w-[200px] rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Điểm Số Chuẩn Xác
                </span>
                <div className="mt-4 text-4xl font-black text-white flex items-baseline gap-1 font-mono">
                  <NumberTicker value={totalScore} />
                  <span className="text-base text-slate-400 font-normal">/ {totalQuestions}</span>
                </div>
                <Badge className="mt-2 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold text-xs font-mono">
                  Độ chính xác: <NumberTicker value={percentage} className="ml-1" />%
                </Badge>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/learning-path">
                <Button
                  size="lg"
                  className="h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>Khám Phá Lộ Trình Học Cá Nhân Hóa</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-6 rounded-xl border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  <span>Về Bảng Điều Khiển</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Skill Proficiency Breakdown */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>Đánh Giá Chi Tiết Theo Kỹ Năng</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(skillScores).map(([skill, score]) => (
              <div
                key={skill}
                className="p-5 space-y-3 rounded-2xl bg-[#0d1424] border border-slate-800 hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-200">{skill}</span>
                  <span className="font-mono text-sm font-extrabold text-amber-400">{score}%</span>
                </div>
                <Progress value={score} className="h-2 bg-slate-950" />
                <span className="text-[11px] text-slate-400 block">
                  {score >= 75 ? 'Thành thạo tốt' : score >= 50 ? 'Cần củng cố thêm' : 'Cần ôn tập kỹ'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Question-by-Question Review */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-amber-400" />
              <span>Xem Lại Chi Tiết Câu Hỏi & Lời Giải</span>
            </h2>
            <span className="text-xs text-slate-400">Bấm câu hỏi để xem giải thích</span>
          </div>

          <div className="space-y-3">
            {questionReview.map((q, idx) => {
              const isExpanded = expandedQuestion === q.id;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    q.is_correct
                      ? 'border-emerald-500/30 bg-[#0c1622]'
                      : 'border-rose-500/30 bg-[#160d14]'
                  }`}
                >
                  <button
                    onClick={() => toggleQuestionExpand(q.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {q.is_correct ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">
                            Câu {idx + 1}
                          </span>
                          <Badge className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 border-slate-700">
                            {q.skill} &bull; {q.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-slate-100">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                          q.is_correct
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {q.is_correct ? 'Chính xác' : 'Chưa đúng'}
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Explanation with AnimatePresence */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-5 border-t border-slate-800 bg-[#080d1a] space-y-3 font-sans text-xs sm:text-sm"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                              Đáp án bạn đã chọn:
                            </span>
                            <span
                              className={`font-semibold mt-1 block ${
                                q.is_correct ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {q.user_answer || '(Chưa chọn)'}
                            </span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                              Đáp án chính xác:
                            </span>
                            <span className="font-semibold text-emerald-400 mt-1 block">
                              {q.correct_answer}
                            </span>
                          </div>
                        </div>

                        {q.explanation && (
                          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-slate-300 space-y-1">
                            <span className="font-bold text-amber-400 text-xs block">
                              💡 Phân tích ngôn ngữ học AI:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}
