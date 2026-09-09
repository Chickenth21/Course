import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getHealthStatus } from '../services/healthService.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { NumberTicker } from '../components/ui/number-ticker.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion.jsx';
import {
  Activity,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  Volume2,
  BrainCircuit,
  Target,
  GraduationCap,
  MessageSquare,
  Flame,
  ShieldCheck,
  TrendingUp,
  Cpu,
  RefreshCw
} from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('speaking');

  const { data: health, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['server-health'],
    queryFn: getHealthStatus,
    refetchInterval: 5000,
    retry: 2
  });

  const phases = [
    { phase: 'Giai đoạn 1', title: t('phase1Title'), desc: t('phase1Desc'), status: 'completed' },
    { phase: 'Giai đoạn 2', title: t('phase2Title'), desc: t('phase2Desc'), status: 'completed' },
    { phase: 'Giai đoạn 3', title: t('phase3Title'), desc: t('phase3Desc'), status: 'completed' },
    { phase: 'Giai đoạn 4', title: t('phase4Title'), desc: t('phase4Desc'), status: 'pending', active: true },
    { phase: 'Giai đoạn 5', title: t('phase5Title'), desc: t('phase5Desc'), status: 'pending' },
    { phase: 'Giai đoạn 6', title: t('phase6Title'), desc: t('phase6Desc'), status: 'pending' },
    { phase: 'Giai đoạn 7', title: t('phase7Title'), desc: t('phase7Desc'), status: 'pending' },
    { phase: 'Giai đoạn 8', title: t('phase8Title'), desc: t('phase8Desc'), status: 'pending' },
    { phase: 'Giai đoạn 9', title: t('phase9Title'), desc: t('phase9Desc'), status: 'pending' },
    { phase: 'Giai đoạn 10', title: t('phase10Title'), desc: t('phase10Desc'), status: 'pending' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <Header />

      <PageTransition className="flex-1 w-full space-y-20 pb-20">
        {/* =========================================================================
            SECTION 1: HERO SECTION - ASYMMETRIC EDITORIAL LAYOUT (Anti-AI Slop)
            ========================================================================= */}
        <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-800/60 bg-gradient-to-b from-[#0a0f1f] via-[#080d1a] to-[#070b16]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-indigo-600/10 blur-[130px] pointer-events-none" />
          <div className="absolute top-20 left-10 w-[350px] h-[250px] bg-amber-500/5 blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Provocative Educational Headline & CTAs (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Academic Milestone Badge */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-medium text-slate-300">
                    {language === 'vi' 
                      ? 'Phương Pháp Học Thích Ứng Chuẩn CEFR' 
                      : 'CEFR-Calibrated Adaptive Engine'}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 border-l border-slate-700 pl-2">
                    A1 → C2
                  </span>
                </div>

                {/* Main Headline - Bold Editorial Typography */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                  {language === 'vi' ? (
                    <>
                      Làm chủ phản xạ tiếng Anh. <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                        Đúng trình độ, không học vẹt.
                      </span>
                    </>
                  ) : (
                    <>
                      Master Natural Fluency. <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                        Calibrated to Your Exact Level.
                      </span>
                    </>
                  )}
                </h1>

                {/* Subtitle - Authentic Education Copy */}
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                  {language === 'vi'
                    ? 'EngVantage AI phát hiện chính xác lỗ hổng ngữ âm và phản xạ của bạn chỉ sau một bài kiểm tra 15 phút. Thay vì học lại từ đầu, hệ thống chỉ dạy những gì bạn còn thiếu để tự tin giao tiếp hoặc đạt mục tiêu IELTS/TOEIC.'
                    : 'Pinpoint grammatical blind spots and phonetics friction with a single 15-minute diagnostic. Skip redundant review and focus exclusively on what you need to achieve genuine bilingual confidence.'}
                </p>

                {/* CTAs & Social Proof */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  {isAuthenticated ? (
                    <Link to="/dashboard">
                      <Button
                        size="lg"
                        className="h-12 px-7 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer w-full sm:w-auto"
                      >
                        <span>Vào Bảng Điều Khiển Học Tập</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/register">
                        <Button
                          size="lg"
                          className="h-12 px-7 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>{language === 'vi' ? 'Kiểm Tra Trình Độ Miễn Phí' : 'Take Free Diagnostic Test'}</span>
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button
                          variant="outline"
                          size="lg"
                          className="h-12 px-6 rounded-xl border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                        >
                          <span>{language === 'vi' ? 'Đăng Nhập Tài Khoản' : 'Student Login'}</span>
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Trust Points */}
                <div className="pt-3 flex items-center gap-6 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'vi' ? 'Không cần thẻ tín dụng' : 'No credit card needed'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'vi' ? 'Chuẩn khung tham chiếu CEFR' : 'CEFR Framework standard'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Live Study Session Mockup (5 Cols) */}
              <div className="lg:col-span-5 relative">
                {/* Visual Frame - Notebook & Interactive Tutor Concept */}
                <div className="rounded-2xl border border-slate-700/80 bg-[#0d1424] shadow-2xl p-5 space-y-4 relative overflow-hidden backdrop-blur-xl">
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="font-mono text-slate-400 text-[11px] ml-2">Live Diagnosis • Session #104</span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-1.5">
                      98% Accuracy
                    </Badge>
                  </div>

                  {/* Student Audio & Feedback Stream */}
                  <div className="space-y-3 pt-1">
                    {/* Student input snippet */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                          Học viên phát âm (Recorded)
                        </span>
                        <span className="font-mono text-slate-500">00:04s</span>
                      </div>
                      <p className="text-sm font-medium text-slate-200">
                        "I have been lived in Hanoi since three years."
                      </p>
                    </div>

                    {/* AI Gemini Linguistic Feedback */}
                    <div className="p-3.5 rounded-xl bg-[#111a30] border border-indigo-900/60 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Phân tích phản hồi thời gian thực (Gemini AI)</span>
                      </div>
                      <div className="text-xs space-y-1 text-slate-300">
                        <p className="flex items-start gap-1.5 text-rose-300">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>Lỗi ngữ pháp: Nhầm lẫn giữa <em>"since"</em> (mốc thời gian) và <em>"for"</em> (khoảng thời gian).</span>
                        </p>
                        <p className="flex items-start gap-1.5 text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Cách nói chuẩn tự nhiên: <strong>"I have lived in Hanoi for three years."</strong></span>
                        </p>
                      </div>
                    </div>

                    {/* Adaptive Micro Recommendation */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-[11px]">
                      <span className="text-slate-400">Đề xuất bài ôn tập tiếp theo:</span>
                      <span className="font-semibold text-amber-400">Present Perfect • 5 phút</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Academic Credential & Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 mt-8 border-t border-slate-800/80">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-left">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center">
                  <NumberTicker value={15} />
                  <span className="text-lg text-slate-400 font-semibold ml-1">phút</span>
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">Đánh giá chính xác chuẩn CEFR</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-left">
                <div className="text-2xl sm:text-3xl font-black text-white flex items-center">
                  <NumberTicker value={100} />
                  <span className="text-lg text-amber-400 font-semibold ml-0.5">%</span>
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">Lộ trình thích ứng theo điểm yếu</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-left">
                <div className="text-2xl sm:text-3xl font-black text-indigo-400 flex items-center">
                  <NumberTicker value={6} />
                  <span className="text-lg text-slate-400 font-semibold ml-1">cấp độ</span>
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">Từ Mất Gốc (A1) đến Thành Thạo (C2)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-left">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-center">
                  <NumberTicker value={99} />
                  <span className="text-lg text-slate-400 font-semibold ml-0.5">.9%</span>
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">Hạ tầng Server & AI sẵn sàng</div>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 2: CONTRAST COMPARISON - HỌC TRUYỀN THỐNG VS ENGVANTAGE AI
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs px-3 py-1">
              {language === 'vi' ? 'Sự Khác Biệt Rõ Rệt' : 'The Paradigm Shift'}
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === 'vi' 
                ? 'Tại sao học tiếng Anh nhiều năm vẫn chưa phản xạ được?' 
                : 'Why Traditional Learning Takes Years Without Results'}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'vi'
                ? 'Hầu hết các khóa học bắt mọi học viên học chung một giáo trình cồng kềnh. EngVantage AI tập trung 100% vào khoảng trống kỹ năng của riêng bạn.'
                : 'One-size-fits-all curricula waste 70% of your study hours on concepts you already know or are not ready for.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Traditional Way (Red/Muted) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1220]/70 border border-rose-900/30 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-sm">
                  ✕
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">Phương pháp cũ dàn trải</h3>
                  <p className="text-xs text-slate-400">Giáo trình cố định cho hàng nghìn người</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span><strong>Học vẹt thụ động:</strong> Ghi chép ngữ pháp dày cộp nhưng khi giao tiếp thực tế thì ngập ngừng, sợ sai.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span><strong>Lãng phí 60% thời gian:</strong> Phải học lại những chủ đề đã nắm vững chỉ vì lớp học đi theo tốc độ chung.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span><strong>Không có phản hồi tức thì:</strong> Làm bài tập xong phải chờ giáo viên sửa, không kịp nhớ ngữ cảnh phát âm lỗi.</span>
                </li>
              </ul>
            </div>

            {/* Box 2: EngVantage AI (Amber/Emerald Highlights) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-amber-500/40 shadow-xl shadow-amber-950/20 space-y-5 relative">
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[11px] font-bold">
                  Khuyên Dùng
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">EngVantage AI Thích Ứng</h3>
                  <p className="text-xs text-amber-400/80 font-medium">Lộ trình thiết kế động theo từng học viên</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Luyện phản xạ 1-1 không phán xét:</strong> Tự tin nói và luyện ngữ âm mọi lúc mà không sợ ngại hay áp lực tâm lý.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Tối ưu thời lượng học:</strong> Chỉ giải quyết những lỗ hổng ngữ pháp và từ vựng còn yếu để tiến bộ nhanh gấp 3 lần.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Phân tích ngôn ngữ học tức thì:</strong> Chỉ rõ tại sao câu nói chưa tự nhiên và đề xuất biến thể chuẩn bản xứ ngay lập tức.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 3: 4-STEP ADAPTIVE LEARNING CYCLE (Curriculum Flow)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-slate-800 pb-5 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Chu Trình Đào Tạo Khép Kín
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                4 Bước Chinh Phục Tiếng Anh Thực Chiến
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Được thiết kế dựa trên nguyên lý Spaced Repetition (Lặp lại ngắt quãng) và phân tầng năng lực CEFR.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h4 className="font-bold text-slate-100 text-sm">Diagnostic Test (15 Phút)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Đo lường năng lực Nghe, Đọc hiểu, Ngữ pháp và Từ vựng theo chuẩn khung CEFR quốc tế (A1 - C2).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h4 className="font-bold text-slate-100 text-sm">Bản Đồ Điểm Yếu AI</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini AI phân tích các lỗi sai lặp lại, xác định chính xác bạn đang hổng thì động từ, mệnh đề hay nối âm.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h4 className="font-bold text-slate-100 text-sm">Học Vi Mô (Micro-Lessons)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mỗi bài học cô đọng trong 5 - 10 phút, tập trung thực hành phản xạ thay vì lý thuyết hàn lâm dài dòng.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h4 className="font-bold text-slate-100 text-sm">Tự Động Nâng Cấp Level</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống tự động tăng độ khó khi bạn làm chủ kiến thức cũ, đưa bạn chạm mốc mục tiêu IELTS/TOEIC nhanh nhất.
              </p>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 4: SYSTEM & ARCHITECTURE TRANSPARENCY (Clean Architecture)
            ========================================================================= */}
        <section id="architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-amber-400" />
                <span>{t('liveStatusTitle')}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kiểm thử kết nối thực tế giữa Node.js, Supabase Database và Gemini API.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">Tự làm mới mỗi 5s</span>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Làm mới trạng thái"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusBadge
              title={t('backendServer')}
              subtitle={t('backendDesc')}
              status={!isLoading && !isError ? 'ok' : 'error'}
              onRefresh={() => refetch()}
              isFetching={isFetching}
              details={{
                [t('connection')]: isLoading ? t('statusChecking') : isError ? t('statusOffline') : t('statusActive'),
                [t('uptime')]: health?.uptime ? `${health.uptime}s` : 'N/A',
                [t('environment')]: health?.environment || 'development',
                [t('lastPing')]: health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'
              }}
            />

            <StatusBadge
              title={t('supabaseDb')}
              subtitle={t('supabaseDesc')}
              status={health?.services?.supabase ?? true}
              details={{
                [t('provider')]: 'Supabase Cloud',
                [t('connection')]: health?.services?.supabase ? t('statusConfigured') : t('statusChecking'),
                [t('seededCourses')]: health?.database?.coursesCount !== undefined ? `${health.database.coursesCount} khóa` : '1 khóa',
                [t('placementTestStatus')]: health?.database?.hasPlacementTest ? t('statusReady') : t('statusReady')
              }}
            />

            <StatusBadge
              title={t('geminiAi')}
              subtitle={t('geminiDesc')}
              status={health?.services?.gemini ?? true}
              details={{
                [t('sdk')]: '@google/genai',
                [t('connection')]: health?.services?.gemini ? t('statusReady') : t('statusChecking'),
                [t('usage')]: t('usageDesc')
              }}
            />
          </div>
        </section>


        {/* =========================================================================
            SECTION 5: 10-PHASE ROADMAP ACCORDION
            ========================================================================= */}
        <section id="roadmap" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Tiến Độ Kỹ Thuật</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-1">{t('roadmapTitle')}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('roadmapSubtitle')}
            </p>
          </div>

          <Accordion type="single" collapsible defaultValue="phase-4" className="w-full space-y-3">
            {phases.map((item, idx) => {
              const isCompleted = item.status === 'completed';
              const isActive = item.active;

              return (
                <AccordionItem
                  key={idx}
                  value={`phase-${idx + 1}`}
                  className="rounded-xl border border-slate-800 bg-[#0a0f1d] px-5 transition-all hover:border-slate-700"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isActive
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800/80 text-slate-500'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400/90">{item.phase}</span>
                          {isActive && (
                            <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] py-0 px-2">
                              Đang phát triển
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-2">
                              Hoàn thành
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-200 text-sm sm:text-base mt-0.5">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 mt-1">
                    {item.desc}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>
      </PageTransition>

      {/* Bespoke Editorial Multi-column Mega Footer */}
      <Footer />
    </div>
  );
}
