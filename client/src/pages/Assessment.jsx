import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assessmentService } from '../services/assessmentService.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import {
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
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
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Đang tải bài thi...</span>
        </div>
      </div>
    );
  }

  if (isError || !test || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-xl font-bold">Không tìm thấy bài kiểm tra</h2>
            <p className="text-sm text-slate-400">Vui lòng chạy script seed để khởi tạo câu hỏi thi trong database.</p>
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col justify-between space-y-8">
        {/* Test Top Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                Placement Assessment
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">
                {test.title}
              </h1>
            </div>

            {/* Timer & Count */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm font-bold text-amber-400 shadow-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Nộp Bài ({answeredCount}/{questions.length})</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Tiến độ: {answeredCount} / {questions.length} câu đã trả lời</span>
              <span className="text-indigo-400 font-bold">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-bold">
                  Câu {currentIndex + 1} / {questions.length}
                </span>
                <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                  {currentQuestion.skill}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-400 text-xs font-semibold">
                  CEFR {currentQuestion.difficulty}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-relaxed">
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
                    className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border text-left text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm sm:text-base">{option}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Câu Trước</span>
          </button>

          {/* Question Grid Dots */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-md">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(answers[q.id]);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md'
                      : isAnswered
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Câu Tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp Bài Thi</span>
            </button>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Xác Nhận Nộp Bài Thi</h3>
              <p className="text-xs text-slate-400">
                Bạn đã hoàn thành <strong className="text-indigo-400">{answeredCount}/{questions.length}</strong> câu hỏi. Bạn có chắc chắn muốn nộp bài để AI chấm điểm và ước tính trình độ CEFR?
              </p>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                {submitError}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Tiếp Tục Làm Bài
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? 'Đang chấm điểm...' : 'Xác Nhận Nộp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
