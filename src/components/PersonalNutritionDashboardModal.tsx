import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Heart, TrendingUp, AlertTriangle, Zap, CheckCircle2, X, Apple, Salad, Flame, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { WeeklyNutritionProfile, Recipe } from '../types';

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
  const [profile] = useState<WeeklyNutritionProfile>({
    weeklyAverages: {
      calories: 2150,
      proteinGrams: 128,
      carbsGrams: 165,
      fatGrams: 58,
      fiberGrams: 14,
      sodiumMg: 2100,
      sugarGrams: 28,
    },
    mealDiversityCount: 19,
    micronutrients: [
      { name: 'Dietary Fiber', amount: '14g / 30g', recommendedDailyPercent: 47, status: 'Low' },
      { name: 'Iron', amount: '16mg / 18mg', recommendedDailyPercent: 88, status: 'Optimal' },
      { name: 'Potassium', amount: '3,200mg / 3,500mg', recommendedDailyPercent: 91, status: 'Optimal' },
      { name: 'Vitamin C', amount: '85mg / 90mg', recommendedDailyPercent: 94, status: 'Optimal' },
      { name: 'Calcium', amount: '920mg / 1,000mg', recommendedDailyPercent: 92, status: 'Optimal' },
    ],
    dailyHistory: [
      { day: 'Mon', calories: 2100, proteinGrams: 132, carbsGrams: 160, fatGrams: 55, fiberGrams: 12, sodiumMg: 2050, sugarGrams: 26 },
      { day: 'Tue', calories: 2250, proteinGrams: 140, carbsGrams: 170, fatGrams: 62, fiberGrams: 15, sodiumMg: 2200, sugarGrams: 30 },
      { day: 'Wed', calories: 2050, proteinGrams: 120, carbsGrams: 155, fatGrams: 54, fiberGrams: 11, sodiumMg: 1980, sugarGrams: 22 },
      { day: 'Thu', calories: 2300, proteinGrams: 135, carbsGrams: 180, fatGrams: 60, fiberGrams: 16, sodiumMg: 2150, sugarGrams: 32 },
      { day: 'Fri', calories: 2180, proteinGrams: 126, carbsGrams: 162, fatGrams: 57, fiberGrams: 13, sodiumMg: 2080, sugarGrams: 27 },
      { day: 'Sat', calories: 2020, proteinGrams: 118, carbsGrams: 150, fatGrams: 52, fiberGrams: 17, sodiumMg: 1900, sugarGrams: 24 },
      { day: 'Sun', calories: 2150, proteinGrams: 125, carbsGrams: 178, fatGrams: 66, fiberGrams: 14, sodiumMg: 2340, sugarGrams: 35 },
    ],
    diagnosis: {
      headline: 'Your week is protein-heavy but fiber-light.',
      observation:
        'You are crushing your protein target (avg 128g/day), but fiber intake is sitting at 14g vs the 30g daily baseline. Gut microbiome diversity can be improved with prebiotic legumes and leafy crucifers.',
      recommendedAction:
        'Incorporate 1 legume-rich or whole chia/flax dinner tonight to boost dietary fiber by +14g without displacing protein.',
      balancingMealSuggestions: [
        'Spiced Green Lentil & Sautéed Kale Bowl (+16g Fiber)',
        'Warm Chickpea, Spinach & Cumin Stew (+14g Fiber)',
        'Chia, Berry & Toasted Almond Overnight Oats (+11g Fiber)',
      ],
    },
  });

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
                Beyond the radar chart: Macro & micronutrient tracking, weekly rolling averages & imbalance corrections.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Proactive AI Diagnosis Banner */}
        <div className="p-5 bg-gradient-to-r from-amber-950/40 via-slate-950 to-amber-950/40 border-b border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-sm font-extrabold">{profile.diagnosis.headline}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{profile.diagnosis.observation}</p>
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-200">
            <strong>Recommended Correction: </strong>
            <span>{profile.diagnosis.recommendedAction}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">WEEKLY AVG CALORIES</span>
              <strong className="text-xl font-black text-amber-400 font-mono mt-0.5 block">
                {profile.weeklyAverages.calories}
              </strong>
              <span className="text-[10px] text-slate-500">Target: 2,200 kcal</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">DAILY PROTEIN AVG</span>
              <strong className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">
                {profile.weeklyAverages.proteinGrams}g
              </strong>
              <span className="text-[10px] text-emerald-400 font-bold">116% of daily goal</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30">
              <span className="text-[10px] text-rose-300 font-bold uppercase block">DAILY FIBER AVG </span>
              <strong className="text-xl font-black text-rose-400 font-mono mt-0.5 block">
                {profile.weeklyAverages.fiberGrams}g
              </strong>
              <span className="text-[10px] text-rose-400 font-bold">47% of 30g target</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">MEAL DIVERSITY SCORE</span>
              <strong className="text-xl font-black text-cyan-400 font-mono mt-0.5 block">
                {profile.mealDiversityCount}
              </strong>
              <span className="text-[10px] text-slate-500">Unique plant/protein sources</span>
            </div>
          </div>

          {/* Micronutrient Progress Bars */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Essential Micronutrients & Electrolytes
            </span>
            <div className="space-y-3">
              {profile.micronutrients.map((m) => (
                <div key={m.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">{m.name}</span>
                    <span className="font-mono text-slate-400">
                      {m.amount} ({m.recommendedDailyPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        m.status === 'Low' ? 'bg-rose-500' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, m.recommendedDailyPercent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corrective Meal Recommendations */}
          <div className="bg-gradient-to-r from-teal-950/40 via-slate-950 to-emerald-950/40 p-5 rounded-2xl border border-teal-500/30 space-y-3">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              <span>Corrective Balancing Meals Recommended by AI</span>
            </span>
            <div className="space-y-2">
              {profile.diagnosis.balancingMealSuggestions.map((meal) => (
                <button
                  key={meal}
                  onClick={() => {
                    onSelectBalancingMeal(meal);
                    onClose();
                  }}
                  className="w-full p-3 bg-slate-900/90 hover:bg-slate-850 rounded-xl border border-slate-800 hover:border-teal-400/60 transition-all flex items-center justify-between text-left text-xs font-bold text-white group"
                >
                  <div className="flex items-center gap-2">
                    <Salad className="w-4 h-4 text-emerald-400" />
                    <span>{meal}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-teal-400 group-hover:translate-x-1 transition-transform">
                    <span>View Recipe</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
