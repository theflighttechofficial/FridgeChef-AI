import React, { useState } from 'react';
import { ShieldAlert, Flame, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { Recipe } from '../types';

interface PantryEmergencyModeProps {
  onStartCooking: (recipe: Recipe) => void;
}

const SURVIVAL_MEALS: Recipe[] = [
  {
    id: 'survival-1',
    title: 'Crisis Skillet: Crispy Soy & Garlic Fried Rice',
    description: 'Bare fridge survival recipe using leftover white rice, soy sauce, garlic, and a fried egg.',
    prepTimeMinutes: 2,
    cookTimeMinutes: 8,
    calories: 310,
    difficulty: 'Easy',
    dietaryTags: ['Emergency Mode', 'Budget', 'Fast'],
    cuisine: 'Bare Fridge Survival',
    matchedIngredients: ['Leftover Rice', 'Soy Sauce', 'Garlic', 'Egg'],
    missingIngredients: [],
    macros: { protein: '14g', carbs: '42g', fat: '10g' },
    steps: [
      { stepNumber: 1, instruction: 'Sauté minced garlic in 1 tsp oil until fragrant (1 min).' },
      { stepNumber: 2, instruction: 'Add cooked rice and soy sauce, tossing on high flame until edges crisp up.' },
      { stepNumber: 3, instruction: 'Push rice to edge, crack egg in center, fold together, and serve hot!' },
    ],
  },
  {
    id: 'survival-2',
    title: 'Emergency Mustard & Olive Oil Braised Cabbage',
    description: 'Transforms a single cabbage wedge and condiments into a caramelized, savory skillet meal.',
    prepTimeMinutes: 3,
    cookTimeMinutes: 10,
    calories: 220,
    difficulty: 'Easy',
    dietaryTags: ['Emergency Mode', 'Vegan', 'Keto'],
    cuisine: 'Bare Fridge Survival',
    matchedIngredients: ['Cabbage', 'Mustard', 'Olive Oil', 'Black Pepper'],
    missingIngredients: [],
    macros: { protein: '5g', carbs: '18g', fat: '12g' },
    steps: [
      { stepNumber: 1, instruction: 'Slice cabbage wedge into thick steaks.' },
      { stepNumber: 2, instruction: 'Sear in skillet with olive oil until golden brown on both sides.' },
      { stepNumber: 3, instruction: 'Whisk mustard with 2 tbsp water, pour over skillet to deglaze, and simmer 2 mins.' },
    ],
  },
];

export const PantryEmergencyMode: React.FC<PantryEmergencyModeProps> = ({ onStartCooking }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/40 p-5 rounded-2xl shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">Reverse Pantry Emergency Filter</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                BARE FRIDGE MODE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              One-tap crisis mode when your fridge is almost bare. Generates creative survival meals utilizing random condiments & dry staples.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
            isActive
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-slate-950 text-rose-400 border border-rose-500/40 hover:bg-rose-500/10'
          }`}
        >
          {isActive ? 'Emergency Filter ACTIVE' : 'Enable Emergency Bare Fridge Filter'}
        </button>
      </div>

      {isActive && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Available Emergency Survival Recipes:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SURVIVAL_MEALS.map((meal) => (
              <div key={meal.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <h5 className="text-sm font-extrabold text-white">{meal.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{meal.description}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    {meal.prepTimeMinutes + meal.cookTimeMinutes} min total
                  </span>
                  <button
                    onClick={() => onStartCooking(meal)}
                    className="px-3 py-1.5 bg-rose-500 text-slate-950 font-extrabold text-xs rounded-lg hover:bg-rose-400 transition-colors flex items-center gap-1"
                  >
                    <span>Cook Survival Meal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
