import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { codeChallengeService } from '../services/codeChallengeService.js';
import { apiRequest } from '../services/api.js';
import Header from '../components/Header.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import {
  Code2, ChevronLeft, Send, CheckCircle2, XCircle,
  Lightbulb, Trophy, RefreshCw, BookOpen, ChevronDown,
  ChevronRight, Sparkles, Loader2, Clock, Eye, EyeOff,
  TrendingUp, AlertCircle, Terminal
} from 'lucide-react';

// Lazy-load Monaco to avoid large bundle impact
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

// ─── Difficulty badge colors ──────────────────────────────────────────────────
const DIFFICULTY_COLORS = {
  beginner: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  intermediate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  advanced: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

// ─── Score ring component ─────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#34d399' : score >= 65 ? '#f59e0b' : '#f87171';

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="rotate-[-90deg]" width="64" height="64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#1e293b" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={radius} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute text-sm font-extrabold" style={{ color }}>{score}</span>
    </div>
  );
}

// ─── AI Feedback Card ─────────────────────────────────────────────────────────
function AIFeedbackCard({ grade, onRetry }) {
  const [showReview, setShowReview] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-700/60 bg-[#0b1020] overflow-hidden"
    >
      {/* Header row */}
      <div className={`flex items-center justify-between p-4 border-b border-slate-800 ${grade.isPassed ? 'bg-emerald-950/30' : 'bg-rose-950/30'}`}>
        <div className="flex items-center gap-3">
          {grade.isPassed
            ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            : <XCircle className="w-5 h-5 text-rose-400" />}
          <div>
            <p className="text-sm font-bold text-white">
              {grade.isPassed ? 'Bài nộp đạt yêu cầu! 🎉' : 'Chưa đạt — thử lại nhé!'}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Lần nộp #{grade.attemptNumber} · {grade.isAiGraded ? '🤖 Chấm bởi Gemini AI' : '📊 Chấm tự động'}
            </p>
          </div>
        </div>
        <ScoreRing score={grade.score} />
      </div>

      <div className="p-4 space-y-4">
        {/* Overall feedback */}
        <p className="text-sm text-slate-300 leading-relaxed">{grade.feedback}</p>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {grade.strengths?.length > 0 && (
            <div className="rounded-xl bg-emerald-950/30 border border-emerald-900/40 p-3 space-y-1.5">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Điểm Mạnh
              </p>
              {grade.strengths.map((s, i) => (
                <p key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5">✓</span> {s}
                </p>
              ))}
            </div>
          )}
          {grade.improvements?.length > 0 && (
            <div className="rounded-xl bg-amber-950/30 border border-amber-900/40 p-3 space-y-1.5">
              <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Cần Cải Thiện
              </p>
              {grade.improvements.map((imp, i) => (
                <p key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">→</span> {imp}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Code Review (collapsible) */}
        {grade.codeReview && (
          <div>
            <button
              onClick={() => setShowReview(v => !v)}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
            >
              {showReview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showReview ? 'Ẩn phân tích code' : 'Xem phân tích chi tiết'}
            </button>
            <AnimatePresence>
              {showReview && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 overflow-hidden"
                >
                  <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3">
                    <p className="text-xs text-slate-300 leading-relaxed">{grade.codeReview}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Retry button */}
        {!grade.isPassed && (
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className="w-full border-amber-600/40 text-amber-400 hover:bg-amber-950/40 text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Thử Lại
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Lesson theory panel ──────────────────────────────────────────────────────
function LessonTheoryPanel({ lesson }) {
  const content = lesson?.content || {};
  const examples = content.examples || [];

  return (
    <div className="h-full overflow-y-auto space-y-5 pr-1">
      {/* Explanation */}
      {content.explanation && (
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-slate-100 prose-headings:font-bold
          prose-code:text-amber-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-xl
          prose-a:text-indigo-400 prose-strong:text-white prose-li:text-slate-300
          prose-p:text-slate-300 prose-p:leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content.explanation}
          </ReactMarkdown>
        </div>
      )}

      {/* Examples */}
      {examples.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> Ví Dụ Minh Hoạ
          </h4>
          {examples.map((ex, i) => (
            <div key={i} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <pre className="p-3 text-xs text-amber-300 overflow-x-auto leading-relaxed">
                <code>{ex.code}</code>
              </pre>
              {ex.output && (
                <div className="border-t border-slate-800 px-3 py-2 bg-slate-950">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Output: </span>
                  <span className="text-[11px] font-mono text-emerald-400">{ex.output}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Vocabulary / Key concepts */}
      {content.vocabulary?.length > 0 && (
        <div className="rounded-xl bg-indigo-950/20 border border-indigo-900/40 p-3 space-y-1.5">
          <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">📚 Từ Khoá</h4>
          <div className="flex flex-wrap gap-1.5">
            {content.vocabulary.map((v, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-indigo-900/40 text-indigo-300 border border-indigo-800/50">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Challenge Selector ───────────────────────────────────────────────────────
function ChallengeSelector({ challenges, selectedIndex, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {challenges.map((c, i) => (
        <button
          key={c.id}
          onClick={() => onSelect(i)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all ${
            i === selectedIndex
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : c.isPassed
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          {c.isPassed && <CheckCircle2 className="w-3 h-3" />}
          Bài {i + 1}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CodeLesson() {
  const { id: lessonId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [code, setCode] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [gradeResult, setGradeResult] = useState(null);
  const [activeTab, setActiveTab] = useState('theory'); // 'theory' | 'challenge'

  // Fetch lesson with module/course context
  const { data: lessonData, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => apiRequest(`/api/lessons/${lessonId}`)
  });

  // Fetch challenges for lesson
  const { data: challengesData, isLoading: challengesLoading } = useQuery({
    queryKey: ['code-challenges', lessonId],
    queryFn: () => codeChallengeService.getChallenges(lessonId)
  });

  const lesson = lessonData?.data;
  const challenges = challengesData?.data || [];
  const currentChallenge = challenges[selectedChallengeIdx];

  // Initialize editor with starter code when challenge changes
  const handleChallengeSelect = useCallback((idx) => {
    setSelectedChallengeIdx(idx);
    setCode(challenges[idx]?.starter_code || '');
    setGradeResult(null);
    setShowHints(false);
    setActiveTab('challenge');
  }, [challenges]);

  // Set initial code from first challenge
  React.useEffect(() => {
    if (challenges.length > 0 && !code) {
      setCode(challenges[0]?.starter_code || '');
    }
  }, [challenges]);

  // Submit code mutation
  const submitMutation = useMutation({
    mutationFn: () => codeChallengeService.submitCode(currentChallenge.id, code),
    onSuccess: (response) => {
      const data = response?.data;
      if (data?.grade) {
        setGradeResult(data.grade);
        queryClient.invalidateQueries({ queryKey: ['code-challenges', lessonId] });
      }
    },
    onError: (err) => {
      console.error('Submit error:', err);
    }
  });

  if (lessonLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b16]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Đang tải bài học...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 font-sans">
      <Header />

      <div className="flex-1 flex flex-col max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-6 gap-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-slate-300 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-400 font-medium">{lesson?.title}</span>
          {lesson?.language && (
            <Badge className="ml-1 bg-indigo-500/15 text-indigo-400 border-indigo-500/30 text-[10px] font-mono uppercase">
              {lesson.language === 'nodejs' ? 'Node.js' : 'JavaScript'}
            </Badge>
          )}
        </div>

        {/* Lesson title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{lesson?.title}</h1>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{lesson?.duration_minutes || 20} phút</span>
            <span>·</span>
            <span>{challenges.length} bài tập code</span>
          </div>
        </div>

        {/* ── Main Split Layout ─────────────────────────────────────────────── */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-5 min-h-0">

          {/* LEFT — Theory + Challenge tabs */}
          <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0b1020] overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-slate-800">
              {[
                { key: 'theory', label: 'Lý Thuyết', icon: BookOpen },
                { key: 'challenge', label: 'Bài Tập', icon: Code2 },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                    activeTab === key
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {key === 'challenge' && challenges.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-900/50 text-[10px] font-mono text-indigo-400">
                      {challenges.filter(c => c.isPassed).length}/{challenges.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
              {activeTab === 'theory' && lesson && <LessonTheoryPanel lesson={lesson} />}

              {activeTab === 'challenge' && (
                <div className="space-y-4">
                  {/* Challenge selector */}
                  {challenges.length > 1 && (
                    <ChallengeSelector
                      challenges={challenges}
                      selectedIndex={selectedChallengeIdx}
                      onSelect={handleChallengeSelect}
                    />
                  )}

                  {challengesLoading && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm py-8 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang tải bài tập...
                    </div>
                  )}

                  {currentChallenge && (
                    <div className="space-y-4">
                      {/* Challenge header */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`text-[10px] font-mono uppercase ${DIFFICULTY_COLORS[currentChallenge.difficulty] || DIFFICULTY_COLORS.beginner}`}>
                            {currentChallenge.difficulty}
                          </Badge>
                          {currentChallenge.isPassed && (
                            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                              <CheckCircle2 className="w-3 h-3 mr-1" />Đã đạt
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-white text-base">{currentChallenge.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{currentChallenge.description}</p>
                      </div>

                      {/* Concepts */}
                      {currentChallenge.concepts?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] text-slate-600 self-center">Concepts:</span>
                          {currentChallenge.concepts.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Hints toggle */}
                      {currentChallenge.hints?.length > 0 && (
                        <div>
                          <button
                            onClick={() => setShowHints(v => !v)}
                            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            {showHints ? 'Ẩn gợi ý' : `Xem ${currentChallenge.hints.length} gợi ý`}
                            <ChevronDown className={`w-3 h-3 transition-transform ${showHints ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {showHints && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 space-y-1 overflow-hidden"
                              >
                                {currentChallenge.hints.map((hint, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-amber-950/20 rounded-lg px-3 py-2 border border-amber-900/30">
                                    <span className="text-amber-400 font-bold">{i + 1}.</span>
                                    {hint}
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Best score */}
                      {currentChallenge.userBestScore !== null && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-800">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          Điểm cao nhất của bạn: <span className="font-bold text-amber-400">{currentChallenge.userBestScore}/100</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Grade result */}
                  {gradeResult && (
                    <AIFeedbackCard
                      grade={gradeResult}
                      onRetry={() => setGradeResult(null)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Monaco Editor */}
          <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0c1118] overflow-hidden min-h-[500px]">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#0b0f1a]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-[11px] font-mono text-slate-600">
                  {lesson?.language === 'nodejs' ? 'solution.js (Node.js)' : 'solution.js (ES6+)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(currentChallenge?.starter_code || '')}
                  className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
                  title="Reset về starter code"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            {/* Monaco editor */}
            <div className="flex-1 min-h-0">
              <Suspense fallback={
                <div className="h-full flex items-center justify-center text-slate-600 text-xs gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang tải editor...
                </div>
              }>
                <MonacoEditor
                  height="100%"
                  language="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  options={{
                    fontSize: 13,
                    fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", monospace',
                    fontLigatures: true,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    tabSize: 2,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                    scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                    overviewRulerLanes: 0,
                    renderLineHighlight: 'gutter',
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    formatOnPaste: true,
                    formatOnType: true,
                    suggest: { showKeywords: true },
                  }}
                />
              </Suspense>
            </div>

            {/* Submit bar */}
            <div className="p-3 border-t border-slate-800 bg-[#0b0f1a] flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Gemini AI sẽ chấm bài cho bạn</span>
              </div>
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending || !code?.trim() || !currentChallenge}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 h-9 rounded-xl gap-2 disabled:opacity-50 min-w-[130px]"
              >
                {submitMutation.isPending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang chấm...</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Nộp Bài</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
