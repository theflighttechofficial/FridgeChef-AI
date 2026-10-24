import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, Flame, ShieldCheck, CheckCircle2, X, Play, ArrowRight, UserCheck, Layers, ChefHat, Zap } from 'lucide-react';
import { EmptyResult } from './ui/EmptyResult';
import { DinnerMember, DinnerForEveryoneResult, Ingredient, Recipe } from '../types';
import { getAccount } from '../auth/account';
import { usePersistentState } from '../hooks/usePersistentState';
import { userKey } from '../state/userData';
import { showToast, AI_OFFLINE_MESSAGE, noteIfFallback } from '../utils/toast';

interface DinnerForEveryoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: Ingredient[];
  onStartCookingRecipe: (recipe: Recipe) => void;
}

// Starts with just the account holder; more people can be added from the strip below
const selfMember = (): DinnerMember => {
  const account = getAccount();
  return {
    id: 'self',
    name: account?.name || 'You',
    role: 'Self',
    avatar: '',
    dietaryPreference: account?.dietary.length ? account.dietary.join(', ') : 'No restrictions',
    spiceTolerance: 'Level 3/5 (Medium)',
    dislikedIngredients: [],
    medicalAllergens: [],
    healthGoals: 'Balanced',
  };
};

const PREFERENCES = ['No restrictions', 'Vegetarian', 'Vegan', 'High Protein', 'Low Sodium', 'Kid-Friendly', 'Gluten-Free'];

export const DinnerForEveryoneModal: React.FC<DinnerForEveryoneModalProps> = ({
  isOpen,
  onClose,
  availableIngredients,
  onStartCookingRecipe,
}) => {
  const [members, setMembers] = usePersistentState<DinnerMember[]>(userKey('dinnerMembers'), [selfMember()]);
  const [newName, setNewName] = useState('');
  const [newPref, setNewPref] = useState(PREFERENCES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [dinnerPlan, setDinnerPlan] = useState<DinnerForEveryoneResult | null>(null);

  if (!isOpen) return null;

  const handleSynthesize = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/household-dinner-for-everyone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members,
          availableIngredients: availableIngredients.map((i) => i.name),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      noteIfFallback(res);
      const data = await res.json();
      setDinnerPlan(data);
    } catch (e) {
      showToast(AI_OFFLINE_MESSAGE);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCookDinnerForEveryone = () => {
    if (!dinnerPlan) return;
    const combinedRecipe: Recipe = {
      id: `dinner-everyone-${Date.now()}`,
      title: dinnerPlan.baseRecipeTitle,
      description: dinnerPlan.tagline,
      prepTimeMinutes: 10,
      cookTimeMinutes: dinnerPlan.cookTimeMinutes,
      calories: 520,
      difficulty: 'Medium',
      cuisine: 'Multi-Dietary Harmony Fusion',
      dietaryTags: ['Multi-Profile', 'Dietary Inclusive'],
      matchedIngredients: dinnerPlan.sharedBaseIngredients,
      missingIngredients: [],
      macros: { protein: '34g', carbs: '48g', fat: '12g' },
      steps: dinnerPlan.steps,
      chefTip: dinnerPlan.harmonyReason,
    };
    onStartCookingRecipe(combinedRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Multi-Person Household Profiles & “Dinner for Everyone”
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                  DIETARY CONFLICT RESOLVER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Add everyone you are cooking for and get ONE dinner that works for all of them.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Household Member Chips Strip */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs shrink-0"
              >
                <div>
                  <strong className="text-white block font-bold leading-tight">{m.name}</strong>
                  <span className="text-[10px] text-purple-300 font-mono">{m.dietaryPreference}</span>
                </div>
                {m.id !== 'self' && (
                  <button onClick={() => setMembers(members.filter((x) => x.id !== m.id))} aria-label={`Remove ${m.name}`} className="p-1 text-slate-500 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newName.trim()) return;
                setMembers([...members, { ...selfMember(), id: `m-${Date.now()}`, name: newName.trim(), role: 'Family', dietaryPreference: newPref }]);
                setNewName('');
              }}
              className="flex items-center gap-1.5 shrink-0"
            >
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Add person"
                className="w-24 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
              <select value={newPref} onChange={(e) => setNewPref(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-[11px] text-slate-300 outline-none">
                {PREFERENCES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <button type="submit" className="px-2.5 py-2 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-bold">+</button>
            </form>
          </div>

          <button
            onClick={handleSynthesize}
            disabled={isLoading}
            className="shrink-0 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Resolving Dietary Matrix...' : dinnerPlan ? 'Rebuild meal' : 'Build meal'}</span>
          </button>
        </div>

        {dinnerPlan ? (
        <>
        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Harmony Score Banner */}
          <div className="p-5 bg-gradient-to-r from-purple-950/40 via-slate-950 to-indigo-950/40 rounded-2xl border border-purple-500/30 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                  UNIFIED HARMONY ARCHITECTURE
                </span>
                <h4 className="text-base sm:text-lg font-black text-white">{dinnerPlan.baseRecipeTitle}</h4>
                <p className="text-xs text-slate-300">{dinnerPlan.tagline}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl font-black font-mono text-purple-400">{dinnerPlan.harmonyScore}%</span>
                <span className="block text-[10px] text-slate-400 uppercase font-mono">DIETARY HARMONY</span>
              </div>
            </div>

            <p className="text-xs text-purple-200/90 bg-purple-950/30 p-2.5 rounded-xl border border-purple-900/40 leading-relaxed">
              <strong>Diplomatic Strategy:</strong> {dinnerPlan.harmonyReason}
            </p>
          </div>

          {/* Individual Member Modular Modifications (3 Columns) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Individual Member Plates (Cooked in Parallel with Shared Base)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dinnerPlan.memberModifications.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <div>
                        <strong className="text-white text-sm font-extrabold">{item.memberName}'s Plate</strong>
                        <span className="text-[10px] text-slate-400 block">{item.memberDietary}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                        {item.spiceAdjustment}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-purple-300">{item.personalizedDishName}</h5>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      {item.modifications.map((mod, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{item.macros.protein} protein</span>
                    <span>{item.macros.carbs} carbs</span>
                    <span>{item.macros.fat} fat</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unified Cooking Steps Sequence */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Unified Cooking Steps (Single Pan Base + 2-Minute Parallel Finishing)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dinnerPlan.steps.map((st) => (
                <div key={st.stepNumber} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-purple-400 font-mono font-bold">
                    <span>STEP {st.stepNumber}</span>
                    {st.timerSeconds && <span>⏱{Math.round(st.timerSeconds / 60)} min</span>}
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{st.instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 1-Click Launch Button */}
          <button
            onClick={handleCookDinnerForEveryone}
            className="w-full py-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Cook “Dinner for Everyone” (Guided Voice Session)</span>
          </button>
        </div>
        </>
        ) : (
          <EmptyResult title="One dinner for the whole table" hint="Add the people you are cooking for, then build a meal that fits everyone." />
        )}
      </motion.div>
    </div>
  );
};
