import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Flame,
  Sparkles,
  Zap,
  Wine,
  Users,
  Award,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { CookingTimeBudget, CookingMoodMode, CookingSkillAdaptationLevel } from '../types';

interface ContextAwareCookingBarProps {
  selectedTime: CookingTimeBudget;
  onSelectTime: (time: CookingTimeBudget) => void;
  selectedMood: CookingMoodMode;
  onSelectMood: (mood: CookingMoodMode) => void;
  skillLevel: CookingSkillAdaptationLevel;
  onSelectSkillLevel: (skill: CookingSkillAdaptationLevel) => void;
}

export const ContextAwareCookingBar: React.FC<ContextAwareCookingBarProps> = ({
  selectedTime,
  onSelectTime,
  selectedMood,
  onSelectMood,
  skillLevel,
  onSelectSkillLevel,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        {/* Time Budget */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Time:</span>
          </span>
          {(['5 min', '15 min', '30 min', '60+ min'] as CookingTimeBudget[]).map((time) => (
            <button
              key={time}
              onClick={() => onSelectTime(time)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                selectedTime === time
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Mood Mode */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mood:</span>
          </span>
          {[
            { id: 'Standard' as const, label: 'Everyday' },
            { id: 'Starving' as const, label: '🏃 Starving' },
            { id: 'Gourmet' as const, label: '🍷 Impress / Gourmet' },
            { id: 'Hosting' as const, label: '🥂 Hosting Guests' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMood(m.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                selectedMood === m.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Cooking Skill Adaptation */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Skill Level:</span>
          </span>
          {(['Beginner', 'Intermediate', 'Advanced'] as CookingSkillAdaptationLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => onSelectSkillLevel(level)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                skillLevel === level
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {level === 'Beginner' ? '🟢 Beginner' : level === 'Intermediate' ? '🟡 Intermediate' : '🔴 Advanced'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
