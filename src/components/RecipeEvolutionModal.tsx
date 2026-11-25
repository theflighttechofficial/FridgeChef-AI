import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Flame, ShieldCheck, Zap, TrendingDown, DollarSign, Utensils, Clock, CheckCircle2, X, Play, ArrowRight, Layers, ChefHat } from 'lucide-react';
import { Recipe, RecipeEvolutionSet, RecipeEvolutionItem, EvolutionType } from '../types';
import { showToast, AI_OFFLINE_MESSAGE, noteIfFallback } from '../utils/toast';

interface RecipeEvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseRecipe: Recipe;
  onStartCookingEvolution: (recipe: Recipe) => void;
}

export const RecipeEvolutionModal: React.FC<RecipeEvolutionModalProps> = ({
  isOpen,
  onClose,
  baseRecipe,
  onStartCookingEvolution,
}) => {
  const [selectedEvolutionId, setSelectedEvolutionId] = useState<EvolutionType>('higher-protein');
  const [isLoading, setIsLoading] = useState(false);
  const [evolutionData, setEvolutionData] = useState<RecipeEvolutionSet | null>(null);

  useEffect(() => {
    if (isOpen && baseRecipe) {
      fetchEvolutions();
    }
  }, [isOpen, baseRecipe]);

  const fetchEvolutions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/evolve-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseRecipe }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      noteIfFallback(res);
      const data = await res.json();
      setEvolutionData(data);
    } catch (e) {
      showToast(AI_OFFLINE_MESSAGE);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentEvolution =
    evolutionData?.evolutions.find((e) => e.id === selectedEvolutionId) ||
    evolutionData?.evolutions[0];

  const handleCookThis = (item: RecipeEvolutionItem) => {
    const morphedRecipe: Recipe = {
      ...baseRecipe,
      id: `evolved-${item.id}-${Date.now()}`,
      title: item.title,
      description: item.tagline,
      cookTimeMinutes: item.cookTimeMinutes,
      calories: item.calories,
      macros: item.macros,
      steps: item.steps,
    };
    onStartCookingEvolution(morphedRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 tool-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="tool-panel max-w-5xl"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-high border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-on-surface leading-tight">Recipe evolution</h3>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                Six ways to change a recipe: more protein, lighter, spicier, fancier, cheaper or faster.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Base Recipe Anchor Strip */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-bold">Base Recipe:</span>
            <strong className="text-white font-bold">{baseRecipe.title}</strong>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>{baseRecipe.calories} kcal</span>
            <span>•</span>
            <span className="text-emerald-400">{baseRecipe.macros?.protein || '26g'} protein</span>
            <span>•</span>
            <span>{baseRecipe.cookTimeMinutes} mins</span>
          </div>
        </div>

        {/* 6 Evolution Variant Selection Tabs */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'higher-protein' as const, label: 'Higher Protein', icon: '', color: 'emerald' },
            { id: 'lower-calorie' as const, label: 'Lower Calorie', icon: '', color: 'teal' },
            { id: 'more-spicy' as const, label: 'More Spicy', icon: '', color: 'rose' },
            { id: 'restaurant-style' as const, label: 'Restaurant Style', icon: '', color: 'purple' },
            { id: 'budget-version' as const, label: 'Budget Version', icon: '', color: 'amber' },
            { id: '15-minute' as const, label: '15-Minute Flash', icon: '', color: 'cyan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedEvolutionId(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                selectedEvolutionId === tab.id
                  ? 'bg-teal-500/20 text-teal-200 border-teal-400 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-sm font-bold text-white">Evolving Culinary Genetic Code...</h4>
              <p className="text-xs text-slate-400">Computing ingredient swaps, macro balance & pan techniques.</p>
            </div>
          ) : currentEvolution ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Evolutionary Comparison & Modifications (2 cols) */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-teal-400 block">
                        EVOLVED VARIATION
                      </span>
                      <h4 className="text-base sm:text-lg font-semibold text-white mt-0.5">
                        {currentEvolution.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">{currentEvolution.tagline}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                      {currentEvolution.costEstimate}
                    </span>
                  </div>

                  {/* Macro Comparison Grid: Base vs Evolved */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block font-bold">PROTEIN</span>
                      <strong className="text-sm text-emerald-400 block mt-0.5">
                        {currentEvolution.macros.protein}
                      </strong>
                      <span className="text-xs text-slate-500">was {baseRecipe.macros?.protein || '26g'}</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block font-bold">CALORIES</span>
                      <strong className="text-sm text-amber-400 block mt-0.5">
                        {currentEvolution.calories} kcal
                      </strong>
                      <span className="text-xs text-slate-500">was {baseRecipe.calories} kcal</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block font-bold">COOK TIME</span>
                      <strong className="text-sm text-emerald-400 block mt-0.5">
                        {currentEvolution.cookTimeMinutes} mins
                      </strong>
                      <span className="text-xs text-slate-500">was {baseRecipe.cookTimeMinutes} mins</span>
                    </div>
                  </div>
                </div>

                {/* Key Evolutionary Modifications */}
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-teal-400" />
                    <span>Evolutionary Recipe Modifications</span>
                  </span>
                  <div className="space-y-2">
                    {currentEvolution.modifications.map((mod, i) => (
                      <div key={i} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                        <span className="text-teal-400 font-bold">+{i + 1}</span>
                        <span>{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secret Ingredient & Chef Technique */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-bold">
                      SECRET INGREDIENT ADDITION
                    </span>
                    <strong className="text-xs text-teal-300 font-bold block mt-1">
                      {currentEvolution.secretIngredient}
                    </strong>
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-bold">
                      CHEF'S TECHNIQUE NOTE
                    </span>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">
                      {currentEvolution.chefNote}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Evolved Cooking Sequence & 1-Click Cook (1 col) */}
              <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold text-white block mb-3">
                    Evolved Step Sequence
                  </span>
                  <div className="space-y-2.5">
                    {currentEvolution.steps.map((st) => (
                      <div key={st.stepNumber} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-xs space-y-1">
                        <div className="flex justify-between items-center text-xs text-teal-400 font-bold">
                          <span>STEP {st.stepNumber}</span>
                          {st.timerSeconds && <span>⏱{Math.round(st.timerSeconds / 60)} min</span>}
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{st.instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleCookThis(currentEvolution)}
                  className="w-full py-3 bg-surface-high text-white font-semibold text-xs rounded-xl shadow-lg shadow-teal-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Cook This Evolved Version Now</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};
