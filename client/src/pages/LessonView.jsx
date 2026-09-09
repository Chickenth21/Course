import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { lessonService } from '../services/lessonService.js';
import { exerciseService } from '../services/exerciseService.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { Card } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../components/ui/tabs.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../components/ui/dialog.jsx';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  Lightbulb,
  Check,
  Send,
  Trophy,
  GraduationCap
} from 'lucide-react';

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('theory');
  const [exerciseAnswers, setExerciseAnswers] = useState({});
  const [exerciseResults, setExerciseResults] = useState({});
  const [checkingExerciseId, setCheckingExerciseId] = useState(null);
  const [completedModal, setCompletedModal] = useState(false);
  const [speakingWord, setSpeakingWord] = useState(null);

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
      setSpeakingWord(text);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingWord(null);
      utterance.onerror = () => setSpeakingWord(null);
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
      console.error(err);
    } finally {
      setCheckingExerciseId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b16] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono">Đang tải giáo trình...</span>
        </div>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="p-8 text-center space-y-4 max-w-md rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-xl font-bold text-white">Không tìm thấy bài học</h2>
            <p className="text-xs text-slate-400">Bài học có thể chưa được kích hoạt hoặc không tồn tại.</p>
            <Button
              onClick={() => navigate('/courses')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Về Danh Sách Khóa Học
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <Header />

      <PageTransition className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Back navigation */}
        <Button
          variant="ghost"
          onClick={() => navigate('/courses')}
          size="sm"
          className="text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Quay Lại Thư Viện Khóa Học</span>
        </Button>

        {/* Lesson Top Header Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1424] p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 uppercase text-[10px] font-bold font-mono">
                  CEFR {lesson.level}
                </Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {lesson.duration_minutes || 15} phút
                </span>
                {isCompleted && (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Đã hoàn thành
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {lesson.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {lesson.description}
              </p>
            </div>

            <Button
              onClick={() => completeMutation.mutate()}
              disabled={isCompleted || completeMutation.isPending}
              className={`rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 h-11 px-5 cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/10 active:scale-95'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCompleted ? 'Đã Hoàn Thành' : completeMutation.isPending ? 'Đang lưu...' : 'Đánh Dấu Hoàn Thành'}</span>
            </Button>
          </div>

          {/* Objectives */}
          {objectives.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                🎯 Mục tiêu bài học:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Tab Navigation with shadcn Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl h-auto gap-1">
            <TabsTrigger
              value="theory"
              className="rounded-lg py-2 px-4 text-xs font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 text-slate-400 cursor-pointer transition-all"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span>Lý Thuyết & Phản Xạ</span>
            </TabsTrigger>

            {vocabulary.length > 0 && (
              <TabsTrigger
                value="vocabulary"
                className="rounded-lg py-2 px-4 text-xs font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 text-slate-400 cursor-pointer transition-all"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                <span>Từ Vựng & Âm Vị ({vocabulary.length})</span>
              </TabsTrigger>
            )}

            {exercises.length > 0 && (
              <TabsTrigger
                value="exercises"
                className="rounded-lg py-2 px-4 text-xs font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 text-slate-400 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Thực Hành Động ({exercises.length})</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Tab 1: Theory & Examples */}
          <TabsContent value="theory" className="space-y-8 mt-0 outline-none">
            <Card className="p-6 sm:p-8 space-y-4 bg-slate-900/60 border-white/10 shadow-xl backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span>Kiến Thức Trọng Tâm</span>
              </h2>
              <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-950/70 p-6 rounded-2xl border border-white/5">
                {content.explanation || 'Nội dung giải thích đang được cập nhật.'}
              </div>
            </Card>

            {/* Examples */}
            {examples.length > 0 && (
              <Card className="p-6 sm:p-8 space-y-4 bg-slate-900/60 border-white/10 shadow-xl backdrop-blur-sm">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span>Ví Dụ Minh Họa</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {examples.map((ex, idx) => {
                    const isSpeaking = speakingWord === ex;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-white/10 bg-slate-950/60 flex items-center justify-between gap-3 group hover:border-indigo-500/40 transition-all"
                      >
                        <span className="text-sm font-semibold text-slate-200">
                          {ex}
                        </span>
                        <button
                          onClick={() => speakWord(ex)}
                          className={`p-2 rounded-xl border transition-all shrink-0 cursor-pointer active:scale-95 ${
                            isSpeaking
                              ? 'bg-indigo-500 text-white border-indigo-400 animate-pulse'
                              : 'bg-white/5 text-slate-400 border-white/5 hover:text-indigo-300 hover:bg-indigo-500/10'
                          }`}
                          title="Phát âm câu ví dụ"
                          aria-label="Phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Tab 2: Vocabulary Cards */}
          <TabsContent value="vocabulary" className="mt-0 outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vocabulary.map((item, idx) => {
                const isSpeaking = speakingWord === item.word;
                return (
                  <Card
                    key={idx}
                    className="p-5 space-y-3 bg-slate-900/60 border-white/10 shadow-lg hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                            {item.word}
                          </h3>
                          {item.type && (
                            <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/15 text-indigo-300 border-indigo-500/30">
                              {item.type}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-300 mt-1.5 font-medium">
                          {item.meaning}
                        </p>
                      </div>

                      <button
                        onClick={() => speakWord(item.word)}
                        className={`p-2.5 rounded-xl border transition-all shrink-0 cursor-pointer active:scale-95 ${
                          isSpeaking
                            ? 'bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/30'
                            : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border-indigo-500/30'
                        }`}
                        title="Nghe phát âm chuẩn"
                        aria-label="Nghe phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Tab 3: Interactive Exercises */}
          <TabsContent value="exercises" className="space-y-6 mt-0 outline-none">
            {exercises.map((ex, idx) => {
              const result = exerciseResults[ex.id];
              const isChecking = checkingExerciseId === ex.id;
              const selectedAnswer = exerciseAnswers[ex.id];

              return (
                <Card
                  key={ex.id || idx}
                  className={`p-6 sm:p-8 space-y-6 shadow-xl transition-all ${
                    result?.isCorrect
                      ? 'border-emerald-500/40 bg-slate-900/80 shadow-emerald-500/5'
                      : result && !result.isCorrect
                      ? 'border-rose-500/40 bg-slate-900/80 shadow-rose-500/5'
                      : 'border-white/10 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Bài tập {idx + 1} &bull; {ex.skill || 'Grammar'}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-300 border-white/10 uppercase">
                      CEFR {ex.difficulty || 'A1'}
                    </Badge>
                  </div>

                  {ex.instructions && (
                    <p className="text-xs text-indigo-300 font-semibold">
                      {ex.instructions}
                    </p>
                  )}

                  <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
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
                            className={`flex items-center gap-3 p-4 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer active:scale-[0.99] ${
                              isSelected
                                ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                                : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/20'
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
                      className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  )}

                  {/* Check Answer Button & Result Feedback */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Button
                      onClick={() => handleCheckExercise(ex.id)}
                      disabled={!selectedAnswer || isChecking}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isChecking ? 'Đang kiểm tra...' : 'Kiểm Tra Đáp Án'}</span>
                    </Button>

                    {result && (
                      <div className="flex items-center gap-2">
                        {result.isCorrect ? (
                          <Badge variant="outline" className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border-emerald-500/30 px-3 py-1.5 rounded-xl">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Chính xác!
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs font-bold text-rose-400 bg-rose-500/10 border-rose-500/30 px-3 py-1.5 rounded-xl">
                            <XCircle className="w-4 h-4 mr-1.5" />
                            Chưa đúng! Đáp án: {result.correctAnswer}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Explanation reveal */}
                  {result && result.explanation && (
                    <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-slate-300 space-y-1">
                      <span className="font-bold text-indigo-300 block">💡 Giải thích chi tiết:</span>
                      <p className="leading-relaxed">{result.explanation}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </PageTransition>

      {/* Completion Modal using shadcn Dialog */}
      <Dialog open={completedModal} onOpenChange={setCompletedModal}>
        <DialogContent className="max-w-md bg-slate-900 border-emerald-500/30 text-slate-100 p-8 rounded-3xl shadow-2xl text-center">
          <DialogHeader className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
            <DialogTitle className="text-2xl font-extrabold text-white text-center">
              Xuất Sắc! 🎉
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-300 text-center leading-relaxed">
              Bạn đã hoàn thành bài học <strong>"{lesson.title}"</strong>. Tiến độ học tập đã được ghi nhận tự động vào hồ sơ của bạn!
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setCompletedModal(false)}
              className="flex-1 rounded-xl border-white/10 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
            >
              Ở Lại Bài Học
            </Button>
            <Button
              onClick={() => navigate('/courses')}
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
            >
              <span>Tiếp Tục Học</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
