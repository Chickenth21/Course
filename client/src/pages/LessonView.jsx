import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonService } from '../services/lessonService.js';
import { exerciseService } from '../services/exerciseService.js';
import Header from '../components/Header.jsx';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Check,
  Send,
  Trophy,
  Award
} from 'lucide-react';

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('theory'); // 'theory', 'vocabulary', 'exercises'
  const [exerciseAnswers, setExerciseAnswers] = useState({});
  const [exerciseResults, setExerciseResults] = useState({});
  const [checkingExerciseId, setCheckingExerciseId] = useState(null);
  const [completedModal, setCompletedModal] = useState(false);

  // Fetch lesson details
  const { data: lessonData, isLoading, isError } = useQuery({
    queryKey: ['lesson-details', id],
    queryFn: () => lessonService.getLessonById(id)
  });

  // Complete lesson mutation
  const completeMutation = useMutation({
    mutationFn: () => lessonService.completeLesson(id, 100),
    onSuccess: () => {
      queryClient.invalidateQueries(['lesson-details', id]);
      queryClient.invalidateQueries(['available-courses']);
      setCompletedModal(true);
    }
  });

  const lesson = lessonData?.data;
  const content = lesson?.content || {};
  const objectives = lesson?.objectives || [];
  const vocabulary = content?.vocabulary || [];
  const examples = content?.examples || [];
  const exercises = lesson?.exercises || [];
  const isCompleted = lesson?.userProgress?.status === 'completed';

  // Pronunciation via Web Speech API
  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Submit single exercise
  const handleCheckExercise = async (exerciseId) => {
    const answer = exerciseAnswers[exerciseId];
    if (!answer) return;

    setCheckingExerciseId(exerciseId);
    try {
      const res = await exerciseService.submitAnswer(exerciseId, answer);
      setExerciseResults((prev) => ({
        ...prev,
        [exerciseId]: res.data
      }));
    } catch (err) {
      alert(err.message || 'Lỗi khi kiểm tra câu trả lời');
    } finally {
      setCheckingExerciseId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Đang tải bài học...</span>
        </div>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6 text-center space-y-4">
          <div>
            <h2 className="text-xl font-bold">Không tìm thấy bài học</h2>
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

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay Lại Khóa Học</span>
        </button>

        {/* Lesson Top Header */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-purple-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  CEFR {lesson.level}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {lesson.duration_minutes || 15} phút
                </span>
                {isCompleted && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã hoàn thành
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {lesson.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {lesson.description}
              </p>
            </div>

            <button
              onClick={() => completeMutation.mutate()}
              disabled={isCompleted || completeMutation.isPending}
              className={`px-5 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 hover:scale-105'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCompleted ? 'Đã Hoàn Thành' : completeMutation.isPending ? 'Đang lưu...' : 'Hoàn Thành Bài Học'}</span>
            </button>
          </div>

          {/* Objectives */}
          {objectives.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                🎯 Mục tiêu bài học:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'theory'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Lý Thuyết &amp; Ví Dụ</span>
          </button>

          {vocabulary.length > 0 && (
            <button
              onClick={() => setActiveTab('vocabulary')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'vocabulary'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Từ Vựng Cốt Lõi ({vocabulary.length})</span>
            </button>
          )}

          {exercises.length > 0 && (
            <button
              onClick={() => setActiveTab('exercises')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'exercises'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Bài Tập Thực Hành ({exercises.length})</span>
            </button>
          )}
        </div>

        {/* Tab 1: Theory & Examples */}
        {activeTab === 'theory' && (
          <div className="space-y-8">
            {/* Explanation */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-sm">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Kiến Thức Trọng Tâm
              </h2>
              <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
                {content.explanation || 'Nội dung giải thích đang được cập nhật.'}
              </div>
            </div>

            {/* Examples */}
            {examples.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-sm">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  Ví Dụ Minh Họa
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3 group hover:border-indigo-500/30 transition-all"
                    >
                      <span className="text-sm font-semibold text-slate-200">
                        {ex}
                      </span>
                      <button
                        onClick={() => speakWord(ex)}
                        className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors shrink-0"
                        title="Phát âm câu ví dụ"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Vocabulary Cards */}
        {activeTab === 'vocabulary' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vocabulary.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 shadow-lg hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-white">
                        {item.word}
                      </h3>
                      {item.type && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {item.type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 mt-1 font-medium">
                      {item.meaning}
                    </p>
                  </div>

                  <button
                    onClick={() => speakWord(item.word)}
                    className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all"
                    title="Nghe phát âm chuẩn"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Interactive Exercises */}
        {activeTab === 'exercises' && (
          <div className="space-y-6">
            {exercises.map((ex, idx) => {
              const result = exerciseResults[ex.id];
              const isChecking = checkingExerciseId === ex.id;
              const selectedAnswer = exerciseAnswers[ex.id];

              return (
                <div
                  key={ex.id || idx}
                  className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xl transition-all ${
                    result?.isCorrect
                      ? 'border-emerald-500/30 bg-slate-900/60'
                      : result && !result.isCorrect
                      ? 'border-rose-500/30 bg-slate-900/60'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Bài tập {idx + 1} &bull; {ex.skill || 'Grammar'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                      CEFR {ex.difficulty || 'A1'}
                    </span>
                  </div>

                  {ex.instructions && (
                    <p className="text-xs text-indigo-300 font-semibold">
                      {ex.instructions}
                    </p>
                  )}

                  <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
                    {ex.question}
                  </h3>

                  {/* Multiple Choice Options */}
                  {ex.type === 'multiple_choice' || (ex.options && ex.options.length > 0) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ex.options?.map((opt, oIdx) => {
                        const isSelected = selectedAnswer === opt;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => setExerciseAnswers({ ...exerciseAnswers, [ex.id]: opt })}
                            className={`flex items-center gap-3 p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Fill in blank text input */
                    <input
                      type="text"
                      placeholder="Nhập câu trả lời của bạn..."
                      value={selectedAnswer || ''}
                      onChange={(e) => setExerciseAnswers({ ...exerciseAnswers, [ex.id]: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  )}

                  {/* Check Answer Button & Result Feedback */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                      onClick={() => handleCheckExercise(ex.id)}
                      disabled={!selectedAnswer || isChecking}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isChecking ? 'Đang kiểm tra...' : 'Kiểm Tra Đáp Án'}</span>
                    </button>

                    {result && (
                      <div className="flex items-center gap-2">
                        {result.isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            Chính xác!
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                            <XCircle className="w-4 h-4" />
                            Chưa đúng! Đáp án đúng: {result.correctAnswer}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Explanation reveal */}
                  {result && result.explanation && (
                    <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-slate-300 space-y-1">
                      <span className="font-bold text-indigo-300 block">💡 Giải thích:</span>
                      <p className="leading-relaxed">{result.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Completion Modal */}
      {completedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-slate-900 p-8 space-y-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <Trophy className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Xuất Sắc! 🎉</h3>
              <p className="text-xs text-slate-300">
                Bạn đã hoàn thành bài học <strong>"{lesson.title}"</strong>. Tiến độ học tập đã được ghi nhận tự động vào tài khoản của bạn!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCompletedModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Ở Lại Bài Học
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Tiếp Tục Học</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
