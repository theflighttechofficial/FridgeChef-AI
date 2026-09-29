import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingDown,
  ShieldCheck,
  Users,
  Sparkles,
  ShoppingBag,
  Play,
  X,
  Plus,
  RefreshCw,
  Clock,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { Ingredient, BudgetMealPlanResult, Recipe } from '../types';

interface GroceryPriceIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: Ingredient[];
  onStartCookingRecipe: (recipe: Recipe) => void;
  onAddMissingToShoppingList?: (items: string[]) => void;
}

export const GroceryPriceIntelligenceModal: React.FC<GroceryPriceIntelligenceModalProps> = ({
  isOpen,
  onClose,
  availableIngredients,
  onStartCookingRecipe,
  onAddMissingToShoppingList,
}) => {
  const [targetBudget, setTargetBudget] = useState(500);
  const [partySize, setPartySize] = useState(4);
  const [currency, setCurrency] = useState<'₹' | '$' | '€'>('₹');
  const [isLoading, setIsLoading] = useState(false);

  const [budgetPlan, setBudgetPlan] = useState<BudgetMealPlanResult>({
    recipeTitle: 'Spiced Lentil, Chicken & Spinach Family Skillet',
    totalEstimatedCost: '₹368',
    costPerServing: '₹92',
    proteinPerServingGrams: 42,
    caloriesPerServing: 618,
    costPer10gProtein: '₹21.9',
    groceryBreakdown: [
      { item: 'Chicken Breast (400g)', qty: '400g', cost: '₹180', source: 'To Buy' },
      { item: 'Baby Spinach', qty: '1 bunch', cost: '₹30', source: 'Pantry (Free)' },
      { item: 'Brown Lentils', qty: '200g', cost: '₹38', source: 'To Buy' },
      { item: 'Basmati Rice', qty: '400g', cost: '₹60', source: 'Pantry (Free)' },
      { item: 'Tomatoes & Onions', qty: '4 pcs', cost: '₹40', source: 'To Buy' },
      { item: 'Cooking Spices & Oil', qty: 'Staple', cost: '₹20', source: 'Pantry (Free)' },
    ],
    strategyHighlight:
      'Stretches poultry 1:1 with nutritious brown lentils to deliver 42g protein per person for under ₹92 per plate.',
    steps: [
      { stepNumber: 1, instruction: 'Rinse lentils and simmer in 3 cups water until tender (15 mins).', timerSeconds: 900 },
      { stepNumber: 2, instruction: 'Sauté chopped onions and diced chicken in oil until browned.', timerSeconds: 360 },
      { stepNumber: 3, instruction: 'Combine cooked lentils, chicken, tomatoes, and spinach in one large pot; simmer for 6 minutes.', timerSeconds: 360 },
      { stepNumber: 4, instruction: 'Serve warm over steamed fluffy rice with fresh lime wedges.', timerSeconds: 60 },
    ],
  });

  if (!isOpen) return null;

  const handleComputeBudgetPlan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/budget-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetBudget,
          currency,
          partySize,
          availableIngredients: availableIngredients.map((i) => i.name),
        }),
      });
      const data = await res.json();
      setBudgetPlan(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCook = () => {
    const budgetRecipe: Recipe = {
      id: `budget-${Date.now()}`,
      title: budgetPlan.recipeTitle,
      description: budgetPlan.strategyHighlight,
      prepTimeMinutes: 10,
      cookTimeMinutes: 24,
      calories: budgetPlan.caloriesPerServing,
      difficulty: 'Easy',
      cuisine: 'Budget Frugal Gourmet',
      dietaryTags: ['Budget Optimized', 'High-Protein'],
      matchedIngredients: availableIngredients.map((i) => i.name),
      missingIngredients: budgetPlan.groceryBreakdown.filter((i) => i.source === 'To Buy').map((i) => i.item),
      macros: {
        protein: `${budgetPlan.proteinPerServingGrams}g`,
        carbs: '64g',
        fat: '16g',
      },
      steps: budgetPlan.steps,
    };
    onStartCookingRecipe(budgetRecipe);
    onClose();
  };

  const toBuyItems = budgetPlan.groceryBreakdown.filter((i) => i.source === 'To Buy');

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
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Grocery Price Intelligence & Budget Mode
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  MACRO-COST ARBITRAGE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                “Feed 4 people under ₹500.” AI engineers maximum protein & caloric density under strict price constraints.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Budget Constraint Controls */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Target Budget</label>
            <div className="flex rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-slate-800 text-slate-300 text-xs px-2.5 font-bold outline-none border-r border-slate-700"
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
              </select>
              <input
                type="number"
                value={targetBudget}
                onChange={(e) => setTargetBudget(parseInt(e.target.value) || 100)}
                className="w-full bg-transparent px-3 py-2 text-xs font-mono font-bold text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">People to Feed</label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <Users className="w-4 h-4 text-emerald-400" />
              <input
                type="number"
                min={1}
                max={12}
                value={partySize}
                onChange={(e) => setPartySize(parseInt(e.target.value) || 1)}
                className="w-full bg-transparent text-xs font-mono font-bold text-white outline-none"
              />
              <span className="text-slate-400">servings</span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <button
              onClick={handleComputeBudgetPlan}
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Synthesizing Budget Plan...' : `Optimize for ${currency}${targetBudget} (${partySize} People)`}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key 4 Metric Badges: Cost, Protein, Calories, and COST / 10g PROTEIN */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">TOTAL ESTIMATED COST</span>
              <strong className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                {budgetPlan.totalEstimatedCost}
              </strong>
              <span className="text-[10px] text-slate-500">Under {currency}{targetBudget} limit</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">COST PER SERVING</span>
              <strong className="text-lg font-black text-teal-400 font-mono mt-0.5 block">
                {budgetPlan.costPerServing}
              </strong>
              <span className="text-[10px] text-slate-500">Per person</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">PROTEIN / SERVING</span>
              <strong className="text-lg font-black text-purple-400 font-mono mt-0.5 block">
                {budgetPlan.proteinPerServingGrams}g
              </strong>
              <span className="text-[10px] text-slate-500">{budgetPlan.caloriesPerServing} kcal</span>
            </div>

            {/* Crucial requested metric: Cost per 10g protein */}
            <div className="p-4 bg-gradient-to-b from-emerald-950/40 to-slate-950 rounded-2xl border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
              <span className="text-[10px] text-emerald-300 font-bold uppercase block">
                COST / 10g PROTEIN ⚡
              </span>
              <strong className="text-lg font-black text-white font-mono mt-0.5 block">
                {budgetPlan.costPer10gProtein}
              </strong>
              <span className="text-[10px] text-emerald-400 font-bold">Ultra-efficient ratio</span>
            </div>
          </div>

          {/* Dish Title & Strategy */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">RECOMMENDED BUDGET DISH</span>
            <h4 className="text-base font-extrabold text-white">{budgetPlan.recipeTitle}</h4>
            <p className="text-xs text-slate-300 mt-1">{budgetPlan.strategyHighlight}</p>
          </div>

          {/* Itemized Grocery Breakdown Table */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs font-bold text-white uppercase">
              <span>Itemized Grocery & Pantry Allocation</span>
              <span className="text-[10px] text-slate-400 font-mono">PANTRY VS TO-BUY</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-48 overflow-y-auto">
              {budgetPlan.groceryBreakdown.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-white">{item.item}</strong>
                    <span className="text-[10px] text-slate-400 ml-2">({item.qty})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.source.includes('Free')
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.source}
                    </span>
                    <span className="font-mono text-slate-200 font-bold w-14 text-right">{item.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {toBuyItems.length > 0 && onAddMissingToShoppingList && (
            <button
              onClick={() => onAddMissingToShoppingList(toBuyItems.map((i) => i.item))}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add {toBuyItems.length} Missing Items to Shopping List</span>
            </button>
          )}

          <button
            onClick={handleCook}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Cook Budget Meal Plan</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
