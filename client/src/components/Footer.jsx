import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  Mail,
  ArrowRight,
  Shield,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function Footer() {
  const { language } = useLanguage();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const cefrLevels = [
    { code: 'A1 - A2', name: language === 'vi' ? 'Sơ cấp / Nền tảng' : 'Beginner / Elementary', desc: '1,500 Từ vựng' },
    { code: 'B1 - B2', name: language === 'vi' ? 'Trung cấp / Phản xạ' : 'Intermediate / Independent', desc: '4,000 Từ vựng' },
    { code: 'C1 - C2', name: language === 'vi' ? 'Cao cấp / Chuyên sâu' : 'Advanced / Mastery', desc: '8,000+ Học thuật' },
  ];

  return (
    <footer className="border-t border-slate-800/80 bg-[#080d1a] text-slate-300 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Main Multi-Column Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
          
          {/* Column 1 & 2: Brand Manifesto & Value Proposition */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-amber-500 p-[1px] shadow-lg shadow-indigo-950">
                <div className="w-full h-full bg-[#0b1120] rounded-[11px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
                  EngVantage <span className="text-amber-400 text-sm font-semibold">AI</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                  {language === 'vi' ? 'Học Tiếng Anh Thích Ứng & Phản Xạ' : 'Adaptive English Intelligence'}
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {language === 'vi' 
                ? 'Không học vẹt. Không học dàn trải. EngVantage AI định lượng lỗ hổng ngữ pháp, phát âm và phản xạ của bạn theo chuẩn CEFR quốc tế, thiết kế lộ trình tinh gọn để bạn làm chủ tiếng Anh thực chiến.'
                : 'Move beyond rote memorization. EngVantage AI diagnoses grammatical weaknesses, pronunciation, and fluency against CEFR benchmarks to build a streamlined, high-retention learning curve.'}
            </p>

            {/* Daily Academic Micro-Card */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0d1527]/80 text-xs space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  {language === 'vi' ? 'Từ vựng trọng tâm hôm nay' : "Today's Target Collocation"}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">CEFR C1</span>
              </div>
              <p className="font-medium text-slate-200">
                <span className="text-amber-300 font-semibold">"strike a chord"</span> /straɪk ə kɔːrd/
              </p>
              <p className="text-slate-400 text-[11px]">
                {language === 'vi' 
                  ? '→ Tạo được sự đồng cảm sâu sắc, chạm tới tâm can người nghe.' 
                  : '→ To cause someone to feel sympathy, emotion, or enthusiasm.'}
              </p>
            </div>
          </div>

          {/* Column 3: CEFR Mastery Pathway */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              {language === 'vi' ? 'Chuẩn CEFR Châu Âu' : 'CEFR Framework'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {cefrLevels.map((lvl) => (
                <li key={lvl.code} className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 transition-colors">
                  <div className="font-semibold text-slate-200">{lvl.code}</div>
                  <div className="text-[11px] text-slate-400">{lvl.name}</div>
                  <div className="text-[10px] text-amber-400/80 font-mono">{lvl.desc}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              {language === 'vi' ? 'Học Tập & Hệ Thống' : 'Learning Ecosystem'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/placement-test" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-between group">
                  <span>{language === 'vi' ? 'Kiểm tra năng lực (Placement Test)' : 'Diagnostic Placement Test'}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-between group">
                  <span>{language === 'vi' ? 'Thư viện khóa học & Module' : 'Curriculum & Modules'}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-between group">
                  <span>{language === 'vi' ? 'Bảng theo dõi tiến độ' : 'Personal Study Dashboard'}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <a href="#roadmap" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-between group">
                  <span>{language === 'vi' ? 'Lộ trình phát triển 10 Giai đoạn' : '10-Phase Roadmap'}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="#architecture" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-between group">
                  <span>{language === 'vi' ? 'Kiến trúc bảo mật Clean Arch' : 'Clean Architecture Specs'}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Academic Dispatch Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              {language === 'vi' ? 'Bản Tin Tiếng Anh Hàng Tuần' : 'Weekly Intelligence'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'vi'
                ? 'Nhận các phân tích lỗi ngữ pháp người Việt hay mắc và 5 collocations học thuật mỗi thứ Hai.'
                : 'Get deep-dives into common linguistic pitfalls and 5 high-yield C1 collocations every Monday.'}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@oxford.edu"
                  required
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full h-8 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <span>{language === 'vi' ? 'Nhận Bản Tin Miễn Phí' : 'Subscribe Free'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              {subscribed && (
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{language === 'vi' ? 'Đã đăng ký thành công!' : 'Subscribed successfully!'}</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Tech Badges & Integrity */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} EngVantage AI Platform.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400">
              {language === 'vi' ? 'Nền tảng đào tạo tiếng Anh cá nhân hóa thế hệ mới' : 'Next-gen Adaptive Language Training'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Clean Architecture</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Gemini 2.5 Engine</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
