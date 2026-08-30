import React from 'react';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function StatusBadge({ status, title, subtitle, details, onRefresh, isFetching }) {
  const isOk = status === 'ok' || status === true;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-xl backdrop-blur-sm transition-all hover:border-slate-700/80">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isOk
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isOk ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-base">{title}</h3>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isFetching}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        )}
      </div>

      {details && (
        <div className="mt-4 pt-4 border-t border-slate-800/60 font-mono text-xs text-slate-300 space-y-1.5">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">{key}</span>
              <span className="font-medium text-slate-200">
                {typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : String(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
