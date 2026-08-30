import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  BrainCircuit,
  Compass,
  Sparkles
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
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md">
            <Trophy className="w-12 h-12 text-indigo-400 mx-auto" />
            <h2 className="text-xl font-bold">Kết quả bài thi</h2>
            <p className="text-xs text-slate-400">Bạn đã hoàn thành bài kiểm tra đầu vào.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
            >
              Về Trang Học Tập
            </button>
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

  const getLevelColor = (lvl) => {
    switch (lvl) {
      case 'C1':
      case 'C2':
        return 'from-amber-500 to-yellow-400 text-amber-950 border-amber-400/50';
      case 'B2':
        return 'from-violet-600 to-indigo-500 text-white border-indigo-400/50';
      case 'B1':
        return 'from-indigo-600 to-cyan-500 text-white border-cyan-400/50';
      case 'A2':
        return 'from-emerald-600 to-teal-500 text-white border-emerald-400/50';
      default:
        return 'from-slate-700 to-slate-600 text-white border-slate-500/50';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Top Celebration Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 p-8 sm:p-12 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Đánh Giá Năng Lực Hoàn Tất</span>
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Kết Quả Trình Độ Của Bạn
            </h1>
            <p className="text-sm text-slate-400">
              {testTitle}
            </p>
          </div>

          {/* CEFR Badge & Score */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 flex flex-col items-center min-w-[200px] shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Trình Độ CEFR Ước Tính
              </span>
              <div
                className={`mt-3 w-20 h-20 rounded-2xl bg-gradient-to-tr ${getLevelColor(
                  estimatedLevel
                )} flex items-center justify-center font-black text-3xl shadow-lg border`}
              >
                {estimatedLevel}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 flex flex-col items-center min-w-[200px] shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Điểm Số Đạt Được
              </span>
              <div className="mt-3 text-3xl font-black text-white">
                {totalScore} <span className="text-base text-slate-500 font-normal">/ {totalQuestions}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 mt-1">
                Độ chính xác: {percentage}%
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Khám Phá Lộ Trình Học Cá Nhân Hóa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors flex items-center gap-2 border border-slate-700/60"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Về Bảng Điều Khiển</span>
            </Link>
          </div>
        </section>

        {/* Skill Proficiency Breakdown */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Đánh Giá Chi Tiết Theo Kỹ Năng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(skillScores).map(([skill, score]) => (
              <div
                key={skill}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-200">{skill}</span>
                  <span className="font-mono text-sm font-extrabold text-indigo-400">{score}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      score >= 75
                        ? 'bg-emerald-500'
                        : score >= 50
                        ? 'bg-indigo-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <span className="text-[11px] text-slate-400 block">
                  {score >= 75 ? 'Thành thạo tốt' : score >= 50 ? 'Cần củng cố thêm' : 'Cần ôn tập kỹ'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Question-by-Question Review */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-violet-400" />
              Xem Lại Chi Tiết Câu Hỏi &amp; Lời Giải
            </h2>
            <span className="text-xs text-slate-400">Bấm vào câu hỏi để xem lời giải thích chi tiết</span>
          </div>

          <div className="space-y-3">
            {questionReview.map((q, idx) => {
              const isExpanded = expandedQuestion === q.id;
              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    q.is_correct
                      ? 'border-emerald-500/30 bg-slate-900/40'
                      : 'border-rose-500/30 bg-slate-900/40'
                  }`}
                >
                  <button
                    onClick={() => toggleQuestionExpand(q.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-slate-800/40 transition-colors"
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
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {q.skill} &bull; {q.difficulty}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-100">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                          q.is_correct
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {q.is_correct ? 'Chính xác' : 'Chưa đúng'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Explanation */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-3 font-sans text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">
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

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">
                            Đáp án chính xác:
                          </span>
                          <span className="font-semibold text-emerald-400 mt-1 block">
                            {q.correct_answer}
                          </span>
                        </div>
                      </div>

                      {q.explanation && (
                        <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-slate-300 space-y-1">
                          <span className="font-bold text-indigo-300 text-xs block">
                            💡 Giải thích ngữ pháp:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
