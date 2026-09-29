import React, { useState } from 'react';
import { Layers, Flame, Clock, Snowflake, Microwave, RefreshCw, X, Check, ArrowRight } from 'lucide-react';
import { Recipe } from '../types';

interface MealPrepBatchModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const MealPrepBatchModal: React.FC<MealPrepBatchModalProps> = ({ recipe, onClose }) => {
  const [servings, setServings] = useState(4); // 4 - 6 portions
  const [customPortionGram, setCustomPortionGram] = useState('1.5'); // e.g. 1.5 chicken breasts

  const multiplier = servings / (recipe.servings || 2);
  const customMultiplier = parseFloat(customPortionGram) > 0 ? parseFloat(customPortionGram) : 1;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-slate-100">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Batch-Cooking & Portion Recalculator
            </span>
            <h2 className="text-base font-extrabold text-white">
              Meal Prep Multiplier: {recipe.title}
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 bg-slate-800 text-slate-300 hover:bg-rose-500 hover:text-white rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
        {/* Section 1: Meal Prep Multiplier Controls */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>1. Batch-Cooking Portion Multiplier ({servings} Servings)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Scales all ingredient measurements proportionally for meal prepping ahead of time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[2, 4, 6, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setServings(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    servings === s
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {s} Servings ({s / (recipe.servings || 2)}x)
                </button>
              ))}
            </div>
          </div>

          {/* Scaled Ingredients Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recipe.matchedIngredients.map((ing, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-white">{ing}</span>
                <span className="font-mono text-emerald-400 font-extrabold">
                  {(multiplier * 100).toFixed(0)}g / {multiplier.toFixed(1)}x
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Dynamic Leftover Splitter */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <RefreshCw className="w-4 h-4 text-teal-400" />
            <span>2. Dynamic Odd Portion Leftover Splitter</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
            <label className="text-slate-400 font-semibold shrink-0">
              Odd Ingredient Amount Remaining (e.g., 1.5 units):
            </label>
            <input
              type="text"
              value={customPortionGram}
              onChange={(e) => setCustomPortionGram(e.target.value)}
              className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-center text-teal-400 font-bold focus:outline-none focus:border-teal-500"
            />
            <span className="text-slate-400">
              → Recipe dynamically scaled by <strong className="text-white">{customMultiplier.toFixed(2)}x</strong> to avoid leaving scraps!
            </span>
          </div>
        </div>

        {/* Section 3: Storage & Non-Soggy Reheating Instructions */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Snowflake className="w-4 h-4 text-cyan-400" />
            <span>3. Storage & Crispy Reheating Guidelines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-cyan-400 font-bold uppercase text-[10px] block">Fridge Storage (3-4 Days)</span>
              <p className="text-slate-300">
                Store in airtight glass Tupperware. Keep sauces separate in small condiment cups to avoid sogginess.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-amber-400 font-bold uppercase text-[10px] block">Air Fryer / Oven Reheating (Non-Soggy)</span>
              <p className="text-slate-300">
                Reheat at 375°F for 4-5 minutes in Air Fryer to restore crispiness instead of microwaving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
