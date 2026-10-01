import React, { useState } from 'react';
import { Utensils, CheckCircle2, X, ArrowRight, Zap } from 'lucide-react';

interface SubRecipeModalProps {
  missingIngredient: string;
  onClose: () => void;
}

const DIY_SUB_RECIPES: Record<string, { title: string; ingredients: string[]; instructions: string[] }> = {
  'teriyaki sauce': {
    title: 'DIY Teriyaki Sauce from Scratch',
    ingredients: ['1/4 cup Soy Sauce', '2 tbsp Brown Sugar', '1 tsp Garlic Powder', '1 tsp Ground Ginger', '1 tbsp Cornstarch + 2 tbsp Water'],
    instructions: ['Whisk soy sauce, sugar, garlic, and ginger in a saucepan.', 'Bring to boil, stir in cornstarch slurry until thickened (2 min).'],
  },
  'taco seasoning': {
    title: 'DIY Tex-Mex Taco Seasoning',
    ingredients: ['1 tbsp Chili Powder', '1.5 tsp Cumin', '1 tsp Salt', '1 tsp Black Pepper', '1/2 tsp Garlic Powder', '1/2 tsp Paprika'],
    instructions: ['Combine all ground spices in a jar and shake well.', 'Use 2 tbsp per pound of protein.'],
  },
  'buttermilk': {
    title: 'Instant DIY Buttermilk Substitute',
    ingredients: ['1 cup Milk (Whole or Plant)', '1 tbsp Lemon Juice or White Vinegar'],
    instructions: ['Add lemon juice to milk and let sit at room temp for 5 minutes until slightly curdled.'],
  },
  'mayonnaise': {
    title: 'Emulsified Quick Mayo',
    ingredients: ['1 Egg Yolk', '3/4 cup Neutral Vegetable Oil', '1 tsp Dijon Mustard', '1 tsp Lemon Juice'],
    instructions: ['Whisk egg yolk, mustard, and lemon juice.', 'Slowly drizzle oil while whisking vigorously until thick emulsion forms.'],
  },
};

export const SubRecipeModal: React.FC<SubRecipeModalProps> = ({ missingIngredient, onClose }) => {
  const key = missingIngredient.toLowerCase();
  const subRecipe = DIY_SUB_RECIPES[key] || {
    title: `DIY Scratch Recipe: ${missingIngredient}`,
    ingredients: ['Basic Pantry Spices', 'Oil / Vinegar Base', 'Pantry Emulsifier'],
    instructions: [`Combine basic pantry staples to substitute for ${missingIngredient} without going to the store!`],
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-slate-100">
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Automated Sub-Recipe Creator
            </span>
            <h2 className="text-base font-extrabold text-white">
              Make {missingIngredient} from Scratch
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

      <div className="flex-1 max-w-3xl mx-auto p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <span>{subRecipe.title}</span>
          </h3>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Pantry Items:</p>
            <div className="flex flex-wrap gap-2">
              {subRecipe.ingredients.map((ing, i) => (
                <span key={i} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-amber-300">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instructions:</p>
            {subRecipe.instructions.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                <span className="font-bold text-amber-400">{i + 1}.</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
