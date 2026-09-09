import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { assessmentService } from '../services/assessmentService.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { Progress } from '../components/ui/progress.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card } from '../components/ui/card.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../components/ui/dialog.jsx';
import {
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  BrainCircuit,
  Sparkles
} from 'lucide-react';

export default function Assessment() {
  const { t } = useLanguage();
  const { updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins in seconds
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch placement test questions
  const { data: testData, isLoading, isError } = useQuery({
    queryKey: ['placement-test'],
    queryFn: () => assessmentService.getPlacementTest(),
    staleTime: Infinity
  });

  const test = testData?.data;
  const questions = test?.questions || [];
  const currentQuestion = questions[currentIndex];

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitTest();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (option) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const handleSubmitTest = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await assessmentService.submitTest(test.id, answers);
      const resultData = res.data;

      // Update user current level in local state
      updateUserProfile({ current_level: resultData.estimatedLevel });

      // Navigate to results page with result state
      navigate(`/assessment/result/${resultData.submissionId}`, {
        state: { result: resultData, testTitle: test.title }
      });
    } catch (err) {
      setSubmitError(err.message || 'Lỗi khi nộp bài thi. Vui lòng thử lại.');
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Đang chuẩn bị đề thi AI...</span>
        </div>
      </div>
    );
  }

  if (isError || !test || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 text-center space-y-4 max-w-md bg-slate-900/80 border-white/10">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Không tìm thấy bài kiểm tra</h2>
            <p className="text-sm text-slate-400">Vui lòng kiểm tra lại dữ liệu bài thi trong hệ thống.</p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
            >
              Về Trang Học Tập
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <Header />

      <PageTransition className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col justify-between space-y-8">
        {/* Test Top Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                <BrainCircuit className="w-3 h-3" />
                <span>Diagnostic Assessment</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {test.title}
              </h1>
            </div>

            {/* Timer & Count */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm font-bold text-amber-400 shadow-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <Button
                onClick={() => setShowConfirmModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                <span>Nộp Bài ({answeredCount}/{questions.length})</span>
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Tiến độ: <strong className="text-white font-mono">{answeredCount}</strong> / {questions.length} câu</span>
              <span className="text-amber-400 font-bold font-mono">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-slate-900" />
          </div>
        </div>

        {/* Question Card with AnimatePresence */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id || currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl border border-slate-800 bg-[#0d1424] p-6 sm:p-10 shadow-2xl space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs font-bold">
                    Câu {currentIndex + 1} / {questions.length}
                  </span>
                  <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-xs">
                    {currentQuestion.skill}
                  </Badge>
                  <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs font-mono">
                    CEFR {currentQuestion.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3.5">
                {currentQuestion.options?.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option)}
                      className={`flex items-center justify-between p-4 sm:p-5 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer active:scale-[0.99] ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/5 ring-1 ring-amber-500'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-sm sm:text-base leading-relaxed">{option}</span>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <Button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            variant="outline"
            className="w-full sm:w-auto px-5 py-2 rounded-xl border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 text-xs font-semibold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Câu Trước</span>
          </Button>

          {/* Question Grid Dots */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-md">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(answers[q.id]);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 shadow-md scale-105'
                      : isAnswered
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {currentIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 cursor-pointer active:scale-95"
            >
              <span>Câu Tiếp</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowConfirmModal(true)}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>Nộp Bài Thi</span>
            </Button>
          )}
        </div>
      </PageTransition>

      {/* Confirmation Dialog via shadcn */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md bg-[#0d1424] border-slate-800 text-slate-100 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <DialogHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-white text-center">
              Xác Nhận Nộp Bài Thi
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-400 text-center leading-relaxed">
              Bạn đã hoàn thành <strong className="text-amber-400 font-mono">{answeredCount}/{questions.length}</strong> câu hỏi. AI sẽ phân tích và xếp lớp CEFR ngay lập tức.
            </DialogDescription>
          </DialogHeader>

          {submitError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {submitError}
            </div>
          )}

          <DialogFooter className="flex flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              disabled={submitting}
              className="flex-1 rounded-xl border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer"
            >
              Tiếp Tục
            </Button>
            <Button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 cursor-pointer active:scale-95"
            >
              {submitting ? 'Đang chấm điểm...' : 'Xác Nhận Nộp'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
