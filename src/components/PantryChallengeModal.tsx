import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  Dice5,
  Play,
  X,
  Target,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';
import { Ingredient, PantryChallengeScore, Recipe } from '../types';

interface PantryChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: Ingredient[];
  onStartCookingRecipe: (recipe: Recipe) => void;
}

export const PantryChallengeModal: React.FC<PantryChallengeModalProps> = ({
  isOpen,
  onClose,
  availableIngredients,
  onStartCookingRecipe,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    availableIngredients.slice(0, 4).map((i) => i.name)
  );
  const [isJudging, setIsJudging] = useState(false);
  const [challengeResult, setChallengeResult] = useState<PantryChallengeScore | null>({
    challengeDishTitle: 'Crispy Pan-Seared Pantry Medley',
    ingredientUtilization: 94,
    creativity: 87,
    nutrition: 82,
    wasteReduction: 96,
    difficulty: 61,
    xpEarned: 380,
    badgeUnlocked: 'Zero-Waste Prodigy',
    feedbackQuote:
      'Outstanding pantry arbitrage! You utilized 94% of your selected items and rescued 2 perishable goods in under 20 minutes.',
    cookTimeMinutes: 18,
  });

  if (!isOpen) return null;

  const toggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== name));
    } else {
      setSelectedIngredients([...selectedIngredients, name]);
    }
  };

  const handleRandomRoll = () => {
    const shuffled = [...availableIngredients].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, Math.min(4, shuffled.length)).map((i) => i.name);
    setSelectedIngredients(picked);
  };

  const handleRunChallenge = async () => {
    if (selectedIngredients.length < 2) return;
    setIsJudging(true);
    try {
      const res = await fetch('/api/pantry-challenge-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedIngredients,
          userDishIdea: 'Creative Zero-Waste Pantry Creation',
        }),
      });
      const data = await res.json();
      setChallengeResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsJudging(false);
    }
  };

  const handleCookChallengeDish = () => {
    if (!challengeResult) return;
    const challengeRecipe: Recipe = {
      id: `pantry-challenge-${Date.now()}`,
      title: challengeResult.challengeDishTitle,
      description: challengeResult.feedbackQuote,
      prepTimeMinutes: 5,
      cookTimeMinutes: challengeResult.cookTimeMinutes,
      calories: 460,
      difficulty: 'Medium',
      cuisine: 'Pantry Fusion',
      dietaryTags: ['Zero-Waste', 'Challenge Dish'],
      matchedIngredients: selectedIngredients,
      missingIngredients: [],
      macros: { protein: '30g', carbs: '38g', fat: '14g' },
      steps: [
        {
          stepNumber: 1,
          instruction: `Prep selected ingredients (${selectedIngredients.join(', ')}). Cut into uniform bite sizes for even caramelization.`,
          timerSeconds: 120,
        },
        {
          stepNumber: 2,
          instruction: 'Heat a heavy skillet with 1 tsp oil over medium-high. Sear the primary proteins and dense aromatics for 6 minutes.',
          timerSeconds: 360,
        },
        {
          stepNumber: 3,
          instruction: 'Fold in quick-cooking vegetables and pantry grains; season with salt, pepper, and pantry spices for 3 minutes.',
          timerSeconds: 180,
        },
        {
          stepNumber: 4,
          instruction: 'Kill the heat, garnish with fresh herbs, and serve your challenge creation immediately.',
          timerSeconds: 60,
        },
      ],
    };
    onStartCookingRecipe(challengeRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  “Cook With What You Have” Challenge
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  GAMIFIED PANTRY ARENA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Turn random pantry items into a scored culinary showdown. Earn XP, maintain cooking streaks & unlock badges.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gamification Stats Strip */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 font-bold font-mono">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>5-DAY STREAK 🔥</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-300 font-bold font-mono">
              <Award className="w-4 h-4 text-purple-400" />
              <span>LEVEL 4 PANTRY ALCHEMIST</span>
            </div>
          </div>

          <button
            onClick={handleRandomRoll}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Dice5 className="w-3.5 h-3.5 text-amber-400" />
            <span>Random Mystery Roll</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Step 1: Select 3-5 Pantry Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Select 3–5 Ingredients from Your Fridge:</span>
                <span className="text-[10px] text-amber-400 font-mono">
                  ({selectedIngredients.length} Selected)
                </span>
              </span>
              <span className="text-[11px] text-slate-400">Must pick at least 3</span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              {availableIngredients.map((ing) => {
                const isSelected = selectedIngredients.includes(ing.name);
                return (
                  <button
                    key={ing.id}
                    onClick={() => toggleIngredient(ing.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{ing.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleRunChallenge}
              disabled={isJudging || selectedIngredients.length < 2}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/25 hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>{isJudging ? 'AI Culinary Jury Scoring...' : 'Submit Challenge to AI Jury'}</span>
            </button>
          </div>

          {/* Step 2: Live Scoring & Radar Breakdown */}
          {challengeResult && !isJudging && (
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">
                    JURY JUDGMENT DISH
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-white">
                    {challengeResult.challengeDishTitle}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 italic">
                    "{challengeResult.feedbackQuote}"
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                    +{challengeResult.xpEarned} XP AWARDED
                  </span>
                  <span className="block text-[10px] text-purple-300 font-mono mt-1">
                    Unlocked: 🏆 {challengeResult.badgeUnlocked}
                  </span>
                </div>
              </div>

              {/* 5 Deep Scoring Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
                    <span>UTILIZATION</span>
                    <strong className="text-emerald-400 font-mono">{challengeResult.ingredientUtilization}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${challengeResult.ingredientUtilization}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
                    <span>CREATIVITY</span>
                    <strong className="text-purple-400 font-mono">{challengeResult.creativity}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: `${challengeResult.creativity}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
                    <span>NUTRITION</span>
                    <strong className="text-teal-400 font-mono">{challengeResult.nutrition}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: `${challengeResult.nutrition}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
                    <span>WASTE REDUCED</span>
                    <strong className="text-cyan-400 font-mono">{challengeResult.wasteReduction}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${challengeResult.wasteReduction}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
                    <span>DIFFICULTY</span>
                    <strong className="text-amber-400 font-mono">{challengeResult.difficulty}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${challengeResult.difficulty}%` }} />
                  </div>
                </div>
              </div>

              {/* 1-Click Cook Trigger */}
              <button
                onClick={handleCookChallengeDish}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Cook This Challenge Meal (Hands-Free Step-by-Step)</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
