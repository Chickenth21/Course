import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BookOpen, PenLine, History, Sparkles, Volume2,
  Loader2, RotateCcw, Award, Clock, Lightbulb,
  CheckCircle2, Wand2, ArrowRight, AlertCircle, X
} from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PageTransition from '../components/PageTransition.jsx';
import GeminiFeedbackCard from '../components/practice/GeminiFeedbackCard.jsx';
import { practiceService } from '../services/practiceService.js';
import { apiRequest } from '../services/api.js';

// ── Constants ─────────────────────────────────────────────────────────────
const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const LEVEL_META = {
  A1: { label: 'A1 · Sơ cấp', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  A2: { label: 'A2 · Cơ bản', color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/30' },
  B1: { label: 'B1 · Trung cấp', color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/30' },
  B2: { label: 'B2 · Cao cấp', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
};
const SCORE_COLOR = (s) => s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : 'text-rose-400';
// ── Error Toast ───────────────────────────────────────────────────────────
function ErrorToast({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="fixed top-20 right-4 z-50 flex items-start gap-3 bg-rose-950/90 border border-rose-500/40 text-rose-200 text-sm px-4 py-3 rounded-2xl shadow-2xl max-w-sm backdrop-blur-sm"
    >
      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-rose-400 hover:text-white cursor-pointer">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ── Tiny Components ────────────────────────────────────────────────────────
function LevelBadge({ level }) {
  const m = LEVEL_META[level] || LEVEL_META.A2;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${m.bg} ${m.color}`}>
      {level}
    </span>
  );
}

function WordHint({ hint }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 font-mono transition-colors cursor-pointer"
      >
        {hint.word}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 z-20 bg-slate-800 border border-white/15 rounded-xl p-3 shadow-2xl w-52"
          >
            <div className="font-bold text-amber-400 text-xs">{hint.word}</div>
            <div className="text-slate-200 text-xs mt-0.5">{hint.meaning}</div>
            {hint.example && <div className="text-slate-400 italic text-[10px] mt-1">"{hint.example}"</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GeminiLoadingCard({ message = 'Gemini đang tạo đề bài...' }) {
  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-8 text-center space-y-4">
      <div className="relative inline-flex">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-400 border-2 border-[#0d1424] animate-ping" />
      </div>
      <p className="text-sm font-semibold text-indigo-300">{message}</p>
      <div className="flex items-center justify-center gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

// ── Generate Topic Button ──────────────────────────────────────────────────
function GenerateTopicSection({ type, level, onLevelChange, onTopicGenerated, isGenerating }) {
  const isTranslation = type === 'reading_translation';
  const accent = isTranslation ? 'from-sky-600 to-indigo-600' : 'from-violet-600 to-purple-600';
  const accentText = isTranslation ? 'text-sky-400' : 'text-violet-400';
  const accentBorder = isTranslation ? 'border-sky-500/30 bg-sky-950/20' : 'border-violet-500/30 bg-violet-950/20';

  return (
    <div className={`rounded-2xl border ${accentBorder} p-5 space-y-4`}>
      <div className="flex items-center gap-2">
        <Wand2 className={`w-4 h-4 ${accentText}`} />
        <span className={`text-xs font-black uppercase tracking-wider ${accentText}`}>
          Gemini Tạo Đề Bài
        </span>
        <span className="ml-auto text-[10px] text-slate-500">Chọn cấp độ của bạn</span>
      </div>

      {/* Level selector */}
      <div className="grid grid-cols-4 gap-2">
        {LEVELS.map(lv => {
          const m = LEVEL_META[lv];
          const active = level === lv;
          return (
            <button
              key={lv}
              onClick={() => onLevelChange(lv)}
              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                active
                  ? `${m.bg} ${m.color} scale-105`
                  : 'border-white/10 bg-slate-900 text-slate-400 hover:border-white/20'
              }`}
            >
              {lv}
            </button>
          );
        })}
      </div>

      <button
        onClick={onTopicGenerated}
        disabled={isGenerating}
        className={`w-full py-3 rounded-xl bg-gradient-to-r ${accent} text-white text-sm font-black flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all shadow-lg disabled:opacity-60`}
      >
        {isGenerating ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Gemini đang tạo đề...</>
        ) : (
          <><Wand2 className="w-4 h-4" /> Tạo Đề Bài Ngẫu Nhiên</>
        )}
      </button>

      <p className="text-[10px] text-slate-500 text-center">
        Mỗi lần bấm, Gemini sẽ tạo một đề bài hoàn toàn mới ✨
      </p>
    </div>
  );
}

// ── Translation Practice ───────────────────────────────────────────────────
function TranslationPanel() {
  const [level, setLevel] = useState('B1');
  const [topic, setTopic] = useState(null);
  const [userTranslation, setUserTranslation] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const usedTitles = useRef([]);

  const generateMut = useMutation({
    mutationFn: () => practiceService.generateTopic('reading_translation', level, usedTitles.current),
    onSuccess: (res) => {
      const t = res?.data;
      if (t) {
        if (t.title) usedTitles.current = [...usedTitles.current.slice(-4), t.title];
        setTopic(t);
        setUserTranslation('');
        setEvaluation(null);
      }
    },
    onError: (err) => setError(err?.message || 'Lỗi khi tạo đề bài. Vui lòng thử lại.')
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async () => {
    if (!userTranslation.trim() || !topic) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await apiRequest('/api/practice/submit-translation', {
        method: 'POST',
        body: JSON.stringify({
          topicId: topic.id || 'inline',
          userTranslation: userTranslation.trim(),
          _inlineTopic: {
            title: topic.title || 'AI Translation Practice',
            sourceText: topic.sourceText,
            referenceTranslation: topic.referenceTranslation || null,
            level: topic.level || level,
            type: 'reading_translation'
          }
        })
      });
      if (res?.data?.evaluation) setEvaluation(res.data.evaluation);
      else throw new Error(res?.message || 'Không nhận được kết quả chấm bài');
    } catch (e) {
      setError(e?.message || 'Lỗi khi chấm bài. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }, [userTranslation, topic, level]);

  const speak = (text) => {
    window.speechSynthesis?.cancel();
    setSpeakingId('speaking');
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.85;
    u.onend = () => setSpeakingId(null);
    u.onerror = () => setSpeakingId(null);
    window.speechSynthesis?.speak(u);
  };

  const wordCount = userTranslation.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AnimatePresence>{error && <ErrorToast message={error} onClose={() => setError(null)} />}</AnimatePresence>
      {/* Generate button */}
      <GenerateTopicSection
        type="reading_translation"
        level={level}
        onLevelChange={setLevel}
        onTopicGenerated={() => generateMut.mutate()}
        isGenerating={generateMut.isPending}
      />

      {/* Loading */}
      {generateMut.isPending && <GeminiLoadingCard message="Gemini đang soạn đoạn văn cho bạn..." />}

      {/* Topic + Practice Area */}
      <AnimatePresence mode="wait">
        {topic && !generateMut.isPending && (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Source text card */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1424] p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <LevelBadge level={topic.level || level} />
                    {topic.isAiGenerated && (
                      <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Gemini tạo
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-white">{topic.title}</h3>
                </div>
                <button
                  onClick={() => speak(topic.sourceText)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    speakingId === 'speaking'
                      ? 'bg-sky-500 text-white border-sky-400'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-sky-300 hover:bg-sky-500/10'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* English passage */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-sm text-slate-200 leading-relaxed font-medium">
                {topic.sourceText}
              </div>

              {/* Instructions */}
              {topic.instructions && (
                <div className="flex items-start gap-2 text-xs text-amber-400/80">
                  <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{topic.instructions}</span>
                </div>
              )}

              {/* Vocabulary hints */}
              {topic.vocabularyHints?.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gợi ý:</span>
                  {topic.vocabularyHints.map((h, i) => <WordHint key={i} hint={h} />)}
                </div>
              )}
            </div>

            {/* Input */}
            {!evaluation ? (
              <div className="rounded-2xl border border-white/10 bg-[#0d1424] p-5 space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  ✍️ Bản Dịch Tiếng Việt Của Bạn
                </label>
                <textarea
                  value={userTranslation}
                  onChange={e => setUserTranslation(e.target.value)}
                  placeholder="Nhập bản dịch tiếng Việt tại đây..."
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">{wordCount} từ</span>
                  <button
                    onClick={handleSubmit}
                    disabled={!userTranslation.trim() || isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 shadow-lg shadow-sky-500/15 transition-all"
                  >
                    {isSubmitting
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Gemini đang chấm...</>
                      : <><Sparkles className="w-3.5 h-3.5" /> Gemini Chấm Bài</>
                    }
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <GeminiFeedbackCard evaluation={evaluation} type="translation" />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEvaluation(null); setUserTranslation(''); }}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Dịch Lại
                  </button>
                  <button
                    onClick={() => generateMut.mutate()}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> Đề Mới
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!topic && !generateMut.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-white/10 p-12 text-center space-y-3"
          >
            <BookOpen className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">Chọn cấp độ và nhấn <strong className="text-sky-400">"Tạo Đề Bài"</strong> để bắt đầu</p>
            <p className="text-xs text-slate-600">Gemini AI sẽ tạo một đoạn văn mới hoàn toàn cho bạn</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Writing Practice ───────────────────────────────────────────────────────
function WritingPanel() {
  const [level, setLevel] = useState('B1');
  const [topic, setTopic] = useState(null);
  const [userEssay, setUserEssay] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const usedTitles = useRef([]);

  const generateMut = useMutation({
    mutationFn: () => practiceService.generateTopic('writing_essay', level, usedTitles.current),
    onSuccess: (res) => {
      const t = res?.data;
      if (t) {
        if (t.title) usedTitles.current = [...usedTitles.current.slice(-4), t.title];
        setTopic(t);
        setUserEssay('');
        setEvaluation(null);
      }
    },
    onError: (err) => setError(err?.message || 'Lỗi khi tạo đề bài. Vui lòng thử lại.')
  });

  const wordCount = userEssay.trim().split(/\s+/).filter(Boolean).length;
  const minWords = topic?.targetWordCount ? Math.floor(topic.targetWordCount * 0.6) : 50;
  const maxWords = topic?.targetWordCount ? Math.ceil(topic.targetWordCount * 1.5) : 300;
  const wordOk = wordCount >= minWords && wordCount <= maxWords;
  const wordColor = wordCount < minWords ? 'text-rose-400' : wordCount > maxWords ? 'text-amber-400' : 'text-emerald-400';

  const handleSubmit = useCallback(async () => {
    if (wordCount < 5 || !topic) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await apiRequest('/api/practice/submit-writing', {
        method: 'POST',
        body: JSON.stringify({
          topicId: topic.id || 'inline',
          userEssay: userEssay.trim(),
          _inlineTopic: {
            title: topic.title || 'AI Writing Practice',
            instructions: topic.instructions || '',
            level: topic.level || level,
            type: 'writing_essay'
          }
        })
      });
      if (res?.data?.evaluation) setEvaluation(res.data.evaluation);
      else throw new Error(res?.message || 'Không nhận được kết quả chấm bài');
    } catch (e) {
      setError(e?.message || 'Lỗi khi chấm bài. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }, [wordCount, topic, userEssay, level]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AnimatePresence>{error && <ErrorToast message={error} onClose={() => setError(null)} />}</AnimatePresence>
      <GenerateTopicSection
        type="writing_essay"
        level={level}
        onLevelChange={setLevel}
        onTopicGenerated={() => generateMut.mutate()}
        isGenerating={generateMut.isPending}
      />

      {generateMut.isPending && <GeminiLoadingCard message="Gemini đang soạn đề viết luận..." />}

      <AnimatePresence mode="wait">
        {topic && !generateMut.isPending && (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Prompt card */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-950/10 p-5 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <LevelBadge level={topic.level || level} />
                {topic.isAiGenerated && (
                  <span className="text-[10px] text-violet-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Gemini tạo
                  </span>
                )}
              </div>
              <h3 className="text-base font-black text-white">{topic.title}</h3>
              <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/15 text-sm text-slate-200 leading-relaxed">
                {topic.instructions}
              </div>
              {topic.targetWordCount && (
                <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  Số từ gợi ý: <strong className="text-violet-400">{minWords}–{maxWords} từ</strong>
                </p>
              )}
              {topic.vocabularyHints?.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Từ vựng gợi ý:
                  </span>
                  {topic.vocabularyHints.map((h, i) => (
                    <div key={i} className="group relative">
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/20 font-mono cursor-help">
                        {h.word}
                      </span>
                      <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover:block z-10 bg-slate-800 text-xs text-slate-200 p-2.5 rounded-xl border border-white/10 shadow-xl w-52">
                        <div className="font-bold text-violet-400">{h.word}</div>
                        <div className="text-slate-300">{h.meaning}</div>
                        {h.example && <div className="text-slate-400 italic mt-1">"{h.example}"</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!evaluation ? (
              <div className="rounded-2xl border border-white/10 bg-[#0d1424] p-5 space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  ✍️ Bài Viết Của Bạn (Tiếng Anh)
                </label>
                <textarea
                  value={userEssay}
                  onChange={e => setUserEssay(e.target.value)}
                  placeholder="Write your essay here in English..."
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-black font-mono ${wordColor}`}>{wordCount}</span>
                    <span className="text-xs text-slate-500">/ {minWords}–{maxWords} từ</span>
                    {wordOk && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={wordCount < 5}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-black flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 shadow-lg shadow-violet-500/15 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Gemini Chấm Bài
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <GeminiFeedbackCard evaluation={evaluation} type="writing" />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEvaluation(null); setUserEssay(''); }}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Viết Lại
                  </button>
                  <button
                    onClick={() => generateMut.mutate()}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> Đề Mới
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!topic && !generateMut.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-white/10 p-12 text-center space-y-3"
          >
            <PenLine className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">Chọn cấp độ và nhấn <strong className="text-violet-400">"Tạo Đề Bài"</strong> để bắt đầu</p>
            <p className="text-xs text-slate-600">Gemini AI sẽ tạo đề viết luận mới hoàn toàn, không bao giờ trùng lặp</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── History Panel ──────────────────────────────────────────────────────────
function HistorySkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-2xl border border-white/10 bg-[#0d1424] p-4 flex items-start gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-slate-800 rounded" />
            <div className="h-4 w-48 bg-slate-700 rounded" />
            <div className="h-3 w-64 bg-slate-800 rounded" />
          </div>
          <div className="w-12 h-8 bg-slate-800 rounded shrink-0" />
        </div>
      ))}
    </div>
  );
}

function HistoryPanel() {
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data: historyRes, isLoading } = useQuery({
    queryKey: ['practice-history', typeFilter],
    queryFn: () => practiceService.getHistory(typeFilter || null)
  });

  // Reset page when filter changes
  const handleFilter = (v) => { setTypeFilter(v); setPage(1); };

  const allHistory = historyRes?.data || [];
  const history = allHistory.slice(0, page * PAGE_SIZE);
  const hasMore = allHistory.length > page * PAGE_SIZE;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { v: '', label: 'Tất cả' },
          { v: 'reading_translation', label: '📖 Dịch Thuật' },
          { v: 'writing_essay', label: '✍️ Luyện Viết' }
        ].map(f => (
          <button
            key={f.v}
            onClick={() => handleFilter(f.v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === f.v
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
        {allHistory.length > 0 && (
          <span className="ml-auto text-xs text-slate-500">{allHistory.length} bài nộp</span>
        )}
      </div>

      {isLoading ? (
        <HistorySkeleton />
      ) : history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-700 mx-auto" />
          <p className="text-sm text-slate-400">Chưa có bài nộp nào. Hãy bắt đầu luyện tập!</p>
          <p className="text-xs text-slate-600">Nộp bài để xem lịch sử luyện tập tại đây</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map(item => {
            const isTranslation = item.submission_type === 'reading_translation';
            const sc = SCORE_COLOR(item.overall_score);
            return (
              <motion.div key={item.id} whileHover={{ scale: 1.005 }}>
                <div className="rounded-2xl border border-white/10 bg-[#0d1424] p-4 flex items-start gap-4 hover:border-white/20 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isTranslation ? 'bg-sky-500/15' : 'bg-violet-500/15'}`}>
                    {isTranslation
                      ? <BookOpen className="w-5 h-5 text-sky-400" />
                      : <PenLine className="w-5 h-5 text-violet-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${isTranslation ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' : 'bg-violet-500/15 text-violet-400 border-violet-500/30'}`}>
                        {isTranslation ? 'Dịch Thuật' : 'Luyện Viết'}
                      </span>
                      {item.cefr_band && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md border bg-amber-500/15 text-amber-400 border-amber-500/30 flex items-center gap-1">
                          <Award className="w-2.5 h-2.5" /> {item.cefr_band}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white truncate">
                      {item.practice_topics?.title
                        || (item.submission_type === 'reading_translation' ? '🤖 Gemini AI — Bài Dịch' : '🤖 Gemini AI — Bài Viết')}
                    </p>
                    {item.feedback_summary && (
                      <p className="text-xs text-slate-400 line-clamp-2">{item.feedback_summary}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className={`text-2xl font-black ${sc}`}>{item.overall_score}</div>
                    <div className="text-[10px] text-slate-500">điểm</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {/* Load more */}
          {hasMore && (
            <button
              onClick={() => setPage(p => p + 1)}
              className="w-full py-3 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-sm text-slate-300 font-bold cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              Xem thêm ({allHistory.length - history.length} bài)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'translation', label: 'Luyện Dịch Thuật', icon: BookOpen, color: 'sky' },
  { id: 'writing', label: 'Luyện Viết Essay', icon: PenLine, color: 'violet' },
  { id: 'history', label: 'Lịch Sử', icon: History, color: 'slate' }
];

const TAB_ACTIVE = {
  sky: 'border-sky-500 text-sky-400',
  violet: 'border-violet-500 text-violet-400',
  slate: 'border-slate-400 text-slate-300'
};

export default function PracticeHub() {
  const [activeTab, setActiveTab] = useState('translation');

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 font-sans">
      <Header />

      <PageTransition className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1424] p-6 sm:p-8">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-sky-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/20 shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Luyện Viết & Dịch <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">AI</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Gemini AI tạo đề bài • Chấm điểm • Phân tích lỗi chi tiết theo chuẩn CEFR
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                {[
                  { icon: Wand2, text: 'Gemini tạo đề ngẫu nhiên', c: 'text-violet-400' },
                  { icon: Sparkles, text: 'Chấm điểm AI tức thì', c: 'text-sky-400' },
                  { icon: Award, text: 'Đánh giá chuẩn CEFR', c: 'text-amber-400' }
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <f.icon className={`w-3.5 h-3.5 ${f.c}`} />
                    {f.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Custom Tab Bar */}
        <div className="flex gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-2xl">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  active
                    ? `bg-slate-800 border-b-2 ${TAB_ACTIVE[tab.color]}`
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'translation' && <TranslationPanel />}
            {activeTab === 'writing' && <WritingPanel />}
            {activeTab === 'history' && <HistoryPanel />}
          </motion.div>
        </AnimatePresence>
      </PageTransition>

      <Footer />
    </div>
  );
}
