import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, Flame, ShieldCheck, TrendingDown, DollarSign, CloudSun, Zap, Play, ArrowRight, Layers, CheckCircle2, RefreshCw } from 'lucide-react';
import { AutonomousDecision, HouseholdMemoryProfile, Ingredient, Recipe } from '../types';
import { showToast, AI_OFFLINE_MESSAGE, noteIfFallback } from '../utils/toast';

interface AutonomousMealDecisionWidgetProps {
  ingredients: Ingredient[];
  memoryProfile: HouseholdMemoryProfile;
  onStartCookingRecipe: (recipe: Recipe) => void;
}

export const AutonomousMealDecisionWidget: React.FC<AutonomousMealDecisionWidgetProps> = ({
  ingredients,
  memoryProfile,
  onStartCookingRecipe,
}) => {
  const [isComputing, setIsComputing] = useState(false);
  // Nothing is decided until the person asks; the pick comes from their own fridge
  const [decision, setDecision] = useState<AutonomousDecision | null>(null);
  const hour = new Date().getHours();
  const mealNow = hour < 11 ? 'Breakfast' : hour < 16 ? 'Lunch' : hour < 19 ? 'Snack' : 'Dinner';
  const clockNow = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const handleRunDecisionEngine = async () => {
    setIsComputing(true);
    try {
      const res = await fetch('/api/autonomous-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentIngredients: ingredients,
          memoryProfile: memoryProfile,
          context: {
            time: `${mealNow} (${clockNow})`,
            timeAvailable: '30 mins'
          }
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      noteIfFallback(res);
      const data = await res.json();
      if (data.recommendedMeal) {
        setDecision(data.recommendedMeal);
      }
    } catch (e) {
      showToast(AI_OFFLINE_MESSAGE);
      console.error(e);
    } finally {
      setIsComputing(false);
    }
  };

  const handleStartCooking = () => {
    if (!decision) return;
    const recipeToCook: Recipe = {
      id: `auto-${Date.now()}`,
      title: decision.title,
      description: decision.briefWhy,
      prepTimeMinutes: 8,
      cookTimeMinutes: decision.cookTimeMinutes,
      calories: decision.calories,
      difficulty: decision.difficulty,
      cuisine: decision.cuisine,
      dietaryTags: ['High-Protein', 'Gluten-Free'],
      matchedIngredients: decision.expiringIngredientsUsed,
      missingIngredients: [],
      macros: {
        protein: `${decision.proteinGrams}g`,
        carbs: '42g',
        fat: '14g'
      },
      steps: decision.steps
    };
    onStartCookingRecipe(recipeToCook);
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Autonomous Meal Decision Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                WHAT TO COOK RIGHT NOW
              </span>
            </div>
            <p className="text-xs text-slate-400">
              No endless browsing. Multi-variable AI computes the single optimal dinner right now.
            </p>
          </div>
        </div>

        {/* Ambient Kitchen Context & Re-evaluate button */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{mealNow} ({clockNow})</span>
          </div>

          <button
            onClick={handleRunDecisionEngine}
            disabled={isComputing}
            className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isComputing ? 'animate-spin' : ''}`} />
            <span>{isComputing ? 'Deciding...' : decision ? 'Decide again' : 'Decide for me'}</span>
          </button>
        </div>
      </div>

      {/* Decision Algorithm Pipeline Diagram */}
      <div className="my-4 py-2 px-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 overflow-x-auto no-scrollbar flex items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <span className="text-rose-400 font-bold shrink-0">⏳ Expiring Items (35%)</span>
        <span>→</span>
        <span className="text-purple-400 font-bold shrink-0">Taste & Spice (25%)</span>
        <span>→</span>
        <span className="text-amber-400 font-bold shrink-0">⏱Time Budget (15%)</span>
        <span>→</span>
        <span className="text-emerald-400 font-bold shrink-0">Nutrition Target (15%)</span>
        <span>→</span>
        <span className="text-cyan-400 font-bold shrink-0">Energy & Temp (10%)</span>
      </div>

      {/* Main Autonomous Recommendation Card */}
      {!decision ? (
        <div className="relative z-10 rounded-2xl bg-slate-950/60 p-6 text-center space-y-3">
          <p className="text-sm text-slate-300">
            Not sure what to cook? FridgeChef weighs what is expiring, your tastes and the time of day, and picks one {mealNow.toLowerCase()} for you.
          </p>
          <button
            onClick={handleRunDecisionEngine}
            disabled={isComputing}
            className="h-11 px-6 rounded-full bg-emerald-300 text-emerald-950 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isComputing ? 'animate-spin' : ''}`} />
            {isComputing ? 'Deciding...' : 'Decide for me'}
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-extrabold text-white">{decision.title}</h4>
              </div>
              <p className="text-xs text-slate-300 mt-1">{decision.briefWhy}</p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 whitespace-nowrap self-start">
              {decision.cuisine}
            </span>
          </div>

          {/* 5 Crucial Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">COOK TIME</span>
              <strong className="text-xs text-white font-mono flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-amber-400" />
                {decision.cookTimeMinutes} mins
              </strong>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">PROTEIN</span>
              <strong className="text-xs text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                {decision.proteinGrams}g
              </strong>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">EST. COST</span>
              <strong className="text-xs text-teal-400 font-mono flex items-center gap-1 mt-0.5">
                <DollarSign className="w-3 h-3" />
                {decision.estimatedCost}
              </strong>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">WASTE PREVENTED</span>
              <strong className="text-xs text-purple-400 font-mono flex items-center gap-1 mt-0.5">
                <TrendingDown className="w-3 h-3" />
                ~{decision.preventedWasteGrams}g
              </strong>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">SPICE LEVEL</span>
              <strong className="text-xs text-rose-400 font-mono flex items-center gap-1 mt-0.5">
                <Flame className="w-3 h-3" />
                {decision.spiceLevel}
              </strong>
            </div>
          </div>

          {/* Expiring Ingredients Rescued */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-rose-400 font-bold shrink-0">Rescuing Expiring:</span>
            <div className="flex flex-wrap gap-1.5">
              {decision.expiringIngredientsUsed.map((ing, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[11px] border border-rose-500/30">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Why the AI Chose This Right Now & 1-Click Launch */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-2">
              Why the AI Picked This Right Now
            </span>
            <div className="space-y-2">
              {decision.decisionFactors.slice(0, 3).map((factor, idx) => (
                <div key={idx} className="text-xs bg-slate-900 p-2 rounded-xl border border-slate-800/60">
                  <div className="flex justify-between items-center text-[10px] text-indigo-400 font-mono font-bold">
                    <span>{factor.factor}</span>
                    <span className="text-slate-400">{factor.impact}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{factor.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartCooking}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start Cooking This Now (Hands-Free)</span>
          </button>
        </div>
      </div>
      )}
    </div>
  );
};
