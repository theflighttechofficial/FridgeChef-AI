import React, { useState } from 'react';
import { Flame, Trophy, Sparkles, Clock, ShieldAlert, Award, Play, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { Ingredient, Recipe } from '../types';

interface IronChefGameModalProps {
  currentIngredients: Ingredient[];
  onStartCooking: (recipe: Recipe) => void;
  onClose: () => void;
}

export const IronChefGameModal: React.FC<IronChefGameModalProps> = ({
  currentIngredients,
  onStartCooking,
  onClose,
}) => {
  const [xpPoints, setXpPoints] = useState(1250);
  const [streakDays, setStreakDays] = useState(5);
  const [isChallengeActive, setIsChallengeActive] = useState(false);

  // Randomly select 3 ingredients as Mystery Box items
  const mysteryItems = currentIngredients.length >= 3
    ? currentIngredients.slice(0, 3)
    : [
        { id: 'm1', name: 'Baby Spinach', category: 'Produce' as const, freshness: 'Use Soon' as const },
        { id: 'm2', name: 'Eggs', category: 'Dairy & Eggs' as const, freshness: 'Use Soon' as const },
        { id: 'm3', name: 'Cheddar Cheese', category: 'Dairy & Eggs' as const, freshness: 'Fresh' as const },
      ];

  // Generated Mystery Box Challenge Recipe
  const mysteryRecipe: Recipe = {
    id: 'iron-chef-mystery-1',
    title: `Iron Chef Mystery: ${mysteryItems.map((i) => i.name).join(' & ')} Skillet`,
    description: 'A high-stakes zero-waste challenge dish crafted exclusively using your mystery box items!',
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    calories: 380,
    difficulty: 'Hard',
    dietaryTags: ['Zero-Waste', 'Keto', 'Gluten-Free'],
    cuisine: 'Iron Chef Special',
    matchedIngredients: mysteryItems.map((i) => i.name),
    missingIngredients: [],
    macros: { protein: '32g', carbs: '4g', fat: '26g' },
    steps: [
      { stepNumber: 1, instruction: `Preheat skillet over high flame. Saute ${mysteryItems[0]?.name || 'veggies'} for 2 minutes.` },
      { stepNumber: 2, instruction: `Crack ${mysteryItems[1]?.name || 'eggs'} directly into skillet and fold gently.` },
      { stepNumber: 3, instruction: `Top with shredded ${mysteryItems[2]?.name || 'cheese'}, melt under broiler, and serve!` },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-slate-100">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Gamified Zero-Waste Arena
            </span>
            <h2 className="text-base font-extrabold text-white">
              "Iron Chef" Mystery Box Challenge
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold font-mono">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400">{xpPoints} XP</span>
            <span className="text-slate-600">|</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-rose-400">{streakDays} Day Streak</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 text-slate-300 hover:bg-rose-500 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Arena */}
      <div className="flex-1 max-w-4xl mx-auto p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
        {/* Banner Alert */}
        <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/30 p-6 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>Strict Rules: External Ingredients Locked Out!</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Cook a meal using ONLY these 3 mystery items from your fridge scan.
          </h1>
          <p className="text-xs text-slate-400">
            Completing this challenge prevents food waste, awards +250 Profile XP, and extends your Zero-Waste Streak!
          </p>
        </div>

        {/* 3 Mystery Box Items Display */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Your Scanned Mystery Box Ingredients
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mysteryItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-900 border-2 border-amber-500/40 p-4 rounded-2xl space-y-2 shadow-xl hover:border-amber-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
                    {item.freshness || 'Use Soon'}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white">{item.name}</h4>
                <p className="text-[11px] text-slate-400">{item.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Achievements Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Unlockable Badges on Completion:</span>
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-medium">
              🏆 Zero-Waste Hero (+250 XP)
            </span>
            <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-medium">
              ⚡ Mystery Box Master
            </span>
            <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-medium">
              🧪 Culinary Alchemist
            </span>
          </div>
        </div>

        {/* Start CTA */}
        <button
          onClick={() => {
            onStartCooking(mysteryRecipe);
            onClose();
          }}
          className="w-full py-4 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Accept Challenge & Start Cooking ({mysteryRecipe.title})</span>
        </button>
      </div>
    </div>
  );
};
