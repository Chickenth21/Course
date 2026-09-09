import React from 'react';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from './ui/card.jsx';

export default function StatusBadge({ status, title, subtitle, details, onRefresh, isFetching }) {
  const isOk = status === 'ok' || status === true;

  return (
    <Card className="relative overflow-hidden p-6 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/5 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isOk
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isOk ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {isOk && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-base group-hover:text-white transition-colors">{title}</h3>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isFetching}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95 disabled:opacity-50 border border-white/5"
            title="Refresh Status"
            aria-label="Làm mới trạng thái"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        )}
      </div>

      {details && (
        <div className="mt-5 pt-4 border-t border-white/10 font-mono text-xs text-slate-300 space-y-2">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-sans">{key}</span>
              <span className="font-medium text-slate-200">
                {typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : String(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
