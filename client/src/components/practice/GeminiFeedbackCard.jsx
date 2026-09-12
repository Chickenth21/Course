import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  Star,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Zap,
  Award,
  Target,
  MessageSquare
} from 'lucide-react';
import { Card } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';


// ---- Score Bar ----------------------------------------------------------
function ScoreBar({ label, score, colorFrom = 'from-indigo-500', colorTo = 'to-violet-500' }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-300">{label}</span>
        <span className="text-xs font-black text-white">{score}<span className="text-slate-500 font-normal">/100</span></span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${colorFrom} ${colorTo}`}
        />
      </div>
    </div>
  );
}

// ---- Main Component -----------------------------------------------------
export default function GeminiFeedbackCard({ evaluation, type = 'translation' }) {
  const [showErrors, setShowErrors] = useState(false);
  const [showPolished, setShowPolished] = useState(false);

  if (!evaluation) return null;

  const isTranslation = type === 'translation';
  const isAiGraded = evaluation.isAiGraded !== false;

  // Score color mapping
  const getScoreColor = (s) =>
    s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : 'text-rose-400';

  const overallScore = evaluation.overallScore ?? 0;
  const overallColor = getScoreColor(overallScore);

  const errors = isTranslation
    ? (evaluation.errors || [])
    : (evaluation.sentenceErrors || []);

  const polishedText = isTranslation
    ? evaluation.bestTranslation
    : evaluation.polishedEssay;

  const criteriaScores = isTranslation
    ? [
        { label: 'Độ Chính Xác', score: evaluation.accuracyScore ?? 0, from: 'from-indigo-500', to: 'to-blue-500' },
        { label: 'Tính Trôi Chảy', score: evaluation.fluencyScore ?? 0, from: 'from-violet-500', to: 'to-purple-500' },
        { label: 'Ngữ Pháp TV', score: evaluation.grammarScore ?? 0, from: 'from-emerald-500', to: 'to-teal-500' }
      ]
    : [
        { label: 'Nội Dung Đề Bài', score: evaluation.criteriaScores?.taskAchievement ?? 0, from: 'from-indigo-500', to: 'to-blue-500' },
        { label: 'Mạch Lạc & Kết Nối', score: evaluation.criteriaScores?.coherenceAndCohesion ?? 0, from: 'from-violet-500', to: 'to-purple-500' },
        { label: 'Từ Vựng', score: evaluation.criteriaScores?.lexicalResource ?? 0, from: 'from-amber-500', to: 'to-orange-500' },
        { label: 'Ngữ Pháp Tiếng Anh', score: evaluation.criteriaScores?.grammaticalAccuracy ?? 0, from: 'from-emerald-500', to: 'to-teal-500' }
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-4"
    >
      {/* Header banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Phân Tích Của Gemini AI</h3>
            {!isAiGraded && (
              <span className="text-[10px] text-amber-400 font-semibold">⚡ Chế độ Offline (Phân tích cơ bản)</span>
            )}
          </div>
        </div>
        {!isTranslation && evaluation.cefrBand && (
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-xs font-black px-3 py-1">
            <Award className="w-3.5 h-3.5 mr-1.5" />
            CEFR {evaluation.cefrBand}
          </Badge>
        )}
        {!isTranslation && evaluation.wordCount > 0 && (
          <span className="text-xs text-slate-400 font-mono">{evaluation.wordCount} từ</span>
        )}
      </div>

      {/* Overall Score + Criteria Scores */}
      <Card className="p-5 sm:p-6 bg-slate-900/70 border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Big score circle */}
          <div className="relative flex flex-col items-center">
            <svg width={100} height={100} className="-rotate-90">
              <circle cx={50} cy={50} r={40} stroke="#1e293b" strokeWidth={8} fill="none" />
              <circle
                cx={50} cy={50} r={40}
                stroke="currentColor"
                strokeWidth={8}
                fill="none"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={(2 * Math.PI * 40) - (overallScore / 100) * (2 * Math.PI * 40)}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${overallColor}`}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className={`text-2xl font-black ${overallColor}`}>{overallScore}</div>
              <div className="text-[9px] text-slate-500 font-mono uppercase">Tổng điểm</div>
            </div>
          </div>

          {/* Criteria bars */}
          <div className="flex-1 w-full space-y-3">
            {criteriaScores.map((c) => (
              <ScoreBar key={c.label} label={c.label} score={c.score} colorFrom={c.from} colorTo={c.to} />
            ))}
          </div>
        </div>

        {/* Feedback summary */}
        {evaluation.feedback && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
              <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">{evaluation.feedback}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Strengths & Weaknesses (writing only) */}
      {!isTranslation && (evaluation.strengths?.length > 0 || evaluation.weaknesses?.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {evaluation.strengths?.length > 0 && (
            <Card className="p-4 space-y-3 bg-emerald-950/30 border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">Điểm Mạnh</span>
              </div>
              <ul className="space-y-2">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <Star className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {evaluation.weaknesses?.length > 0 && (
            <Card className="p-4 space-y-3 bg-amber-950/30 border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-400">
                <Target className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">Cần Cải Thiện</span>
              </div>
              <ul className="space-y-2">
                {evaluation.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* Error Breakdown (collapsible) */}
      {errors.length > 0 && (
        <Card className="overflow-hidden border-white/10 bg-slate-900/60">
          <button
            onClick={() => setShowErrors(!showErrors)}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-black text-white">
                Phân Tích Lỗi Sai Chi Tiết
              </span>
              <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[10px] font-bold px-2">
                {errors.length} lỗi
              </Badge>
            </div>
            {showErrors
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />
            }
          </button>

          <AnimatePresence>
            {showErrors && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-white/10"
              >
                <div className="p-4 sm:p-5 space-y-4">
                  {errors.map((err, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/20 space-y-3">
                      {/* Error type badge (writing) */}
                      {err.errorType && (
                        <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[10px] font-bold uppercase px-2">
                          {err.errorType}
                        </Badge>
                      )}
                      {/* Original segment */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                          {isTranslation ? 'Câu gốc (English)' : 'Câu của bạn'}
                        </span>
                        <p className="text-sm text-slate-300 italic">
                          "{err.originalSegment || err.originalSentence}"
                        </p>
                      </div>
                      {/* User translation / correction */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {isTranslation && err.userTranslation && (
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                            <span className="text-[10px] font-semibold text-rose-400 uppercase">Bạn dịch</span>
                            <p className="text-xs text-slate-300">"{err.userTranslation}"</p>
                          </div>
                        )}
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                          <span className="text-[10px] font-semibold text-emerald-400 uppercase">
                            {isTranslation ? 'Đề xuất dịch' : 'Câu đã sửa'}
                          </span>
                          <p className="text-xs text-slate-300">
                            "{err.suggestedCorrection || err.correctedSentence}"
                          </p>
                        </div>
                      </div>
                      {/* Explanation */}
                      <div className="flex items-start gap-2 text-xs text-indigo-300">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-400" />
                        <span>{err.explanation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* Polished Version (collapsible) */}
      {polishedText && !polishedText.startsWith('(Vui lòng') && (
        <Card className="overflow-hidden border-white/10 bg-slate-900/60">
          <button
            onClick={() => setShowPolished(!showPolished)}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-black text-white">
                {isTranslation ? 'Bản Dịch Mẫu Chuẩn' : 'Bài Viết Lại Chuẩn Bản Ngữ'}
              </span>
            </div>
            {showPolished
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />
            }
          </button>

          <AnimatePresence>
            {showPolished && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-white/10"
              >
                <div className="p-4 sm:p-5">
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                      {polishedText}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* Actionable Advice */}
      {evaluation.actionableAdvice?.length > 0 && (
        <Card className="p-5 bg-gradient-to-br from-amber-950/30 to-orange-950/20 border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">Lời Khuyên Cải Thiện</span>
          </div>
          <ul className="space-y-2.5">
            {evaluation.actionableAdvice.map((advice, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </motion.div>
  );
}
