import React from 'react';
import { Sparkles } from 'lucide-react';

/** Placeholder a tool shows until the person runs it, so nobody sees made-up results. */
export const EmptyResult: React.FC<{ title: string; hint: string; icon?: React.ReactNode }> = ({ title, hint, icon }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-6 py-14">
    <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center">
      {icon || <Sparkles className="w-6 h-6" />}
    </div>
    <h4 className="text-sm font-extrabold text-white">{title}</h4>
    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">{hint}</p>
  </div>
);
