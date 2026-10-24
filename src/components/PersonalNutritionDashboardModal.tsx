import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Heart, TrendingUp, AlertTriangle, Zap, CheckCircle2, X, Apple, Salad, Flame, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { cookLog } from '../state/userData';
import { EmptyResult } from './ui/EmptyResult';

interface PersonalNutritionDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBalancingMeal: (mealTitle: string) => void;
}

export const PersonalNutritionDashboardModal: React.FC<PersonalNutritionDashboardModalProps> = ({
  isOpen,
  onClose,
  onSelectBalancingMeal,
}) => {
  const log = cookLog.use();
  const week = useMemo(() => {
    const since = Date.now() - 7 * 86400000;
    const meals = log.filter((m) => Date.parse(m.at) >= since);
    const days = new Set(meals.map((m) => m.at.slice(0, 10))).size || 1;
    const sum = (k: 'calories' | 'protein' | 'carbs' | 'fat') => meals.reduce((t, m) => t + (m[k] || 0), 0);
    const per = (k: 'calories' | 'protein' | 'carbs' | 'fat') => Math.round(sum(k) / days);
    const macroCals = sum('protein') * 4 + sum('carbs') * 4 + sum('fat') * 9 || 1;
    const share = {
      protein: Math.round(((sum('protein') * 4) / macroCals) * 100),
      carbs: Math.round(((sum('carbs') * 4) / macroCals) * 100),
      fat: Math.round(((sum('fat') * 9) / macroCals) * 100),
    };
    const ingredients = new Set(meals.flatMap((m) => m.ingredients.map((i) => i.toLowerCase())));
    const cuisines = new Set(meals.map((m) => m.cuisine));
    return { meals, days, calories: per('calories'), protein: per('protein'), carbs: per('carbs'), fat: per('fat'), share, diversity: ingredients.size, cuisines: cuisines.size };
  }, [log]);

  // Simple, explainable checks on what was actually cooked this week
  const diagnosis = useMemo(() => {
    const { share, diversity, meals } = week;
    if (share.protein < 15)
      return { headline: 'Protein is on the low side this week.', action: 'Add a dal, paneer, egg or bean dish to the next few meals.', meals: ['Chana Masala', 'Moong Dal', 'Paneer Bhurji', 'Black Bean Tacos'] };
    if (share.fat > 40)
      return { headline: 'A rich, fat-heavy week.', action: 'Balance with something lighter: soups, salads or steamed dishes.', meals: ['Rasam', 'Vegetable Soup', 'Greek Salad', 'Steamed Fish'] };
    if (diversity < Math.max(6, meals.length * 2))
      return { headline: 'You are rotating the same few ingredients.', action: 'Try a dish built around a vegetable or legume you have not cooked yet.', meals: ['Avial', 'Ratatouille', 'Rajma', 'Stir Fry'] };
    return { headline: 'A well-balanced week. Keep it up.', action: 'Your macros and variety look healthy. Explore a new cuisine for fun.', meals: ['Pho', 'Shakshuka', 'Bibimbap', 'Khichdi'] };
  }, [week]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Personal Nutrition Dashboard</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  METABOLIC PROFILE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Your last 7 days, from the meals you cooked.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!week.meals.length ? (
          <EmptyResult
            title="No meals logged yet"
            hint="Every recipe you start cooking is logged here on your device. Cook a few meals and your weekly nutrition picture will appear."
            icon={<Activity className="w-6 h-6" />}
          />
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-extrabold">
                <Heart className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{diagnosis.headline}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{diagnosis.action}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Meals cooked (7 days)', value: week.meals.length, tone: 'text-cyan-400' },
                { label: 'Calories per day', value: week.calories, tone: 'text-amber-400' },
                { label: 'Protein per day', value: `${week.protein}g`, tone: 'text-emerald-400' },
                { label: 'Different ingredients', value: week.diversity, tone: 'text-purple-400' },
              ].map((c) => (
                <div key={c.label} className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{c.label}</span>
                  <strong className={`text-xl font-black font-mono mt-0.5 block ${c.tone}`}>{c.value}</strong>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Where your calories came from</span>
              {(
                [
                  ['Protein', week.share.protein, `${week.protein}g/day`, 'bg-emerald-400'],
                  ['Carbs', week.share.carbs, `${week.carbs}g/day`, 'bg-amber-400'],
                  ['Fat', week.share.fat, `${week.fat}g/day`, 'bg-rose-400'],
                ] as const
              ).map(([name, pct, amount, tone]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">{name}</span>
                    <span className="font-mono text-slate-400">
                      {amount} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-slate-500">Estimated from the recipes you cooked across {week.cuisines} cuisine{week.cuisines === 1 ? '' : 's'}.</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-teal-500/30 space-y-2">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Salad className="w-3.5 h-3.5 text-teal-400" />
                <span>Ideas to balance it out</span>
              </span>
              {diagnosis.meals.map((meal) => (
                <button
                  key={meal}
                  onClick={() => {
                    onSelectBalancingMeal(meal);
                    onClose();
                  }}
                  className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-teal-400/60 transition-colors flex items-center justify-between text-left text-xs font-bold text-white"
                >
                  <span>{meal}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
