import React from 'react';
import { Check, CircleDashed } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function RoadmapCard({ phase, title, desc, status = 'pending', active = false }) {
  const { t } = useLanguage();
  const isDone = status === 'completed';

  return (
    <div
      className={`relative rounded-xl p-5 border transition-all ${
        active
          ? 'bg-indigo-950/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
          : isDone
          ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
          : 'bg-slate-900/20 border-slate-800/40 opacity-75'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
            isDone
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : active
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse'
              : 'bg-slate-800/60 text-slate-500 border border-slate-700/40'
          }`}
        >
          {isDone ? (
            <Check className="w-4 h-4" />
          ) : (
            <CircleDashed className="w-3.5 h-3.5" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              {phase}
            </span>
            {active && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {t('inProgress')}
              </span>
            )}
            {isDone && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t('completed')}
              </span>
            )}
          </div>
          <h4 className="font-semibold text-slate-200 text-sm mt-0.5">{title}</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
