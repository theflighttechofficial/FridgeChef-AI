import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  DollarSign,
  ShieldCheck,
  Send
} from 'lucide-react';
import { AutonomousCulinaryAgentResult, Ingredient, Recipe } from '../types';

interface AutonomousCulinaryAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: Ingredient[];
  onStartCookingRecipe?: (recipe: Recipe) => void;
  onSyncShoppingList?: (items: string[]) => void;
}

export const AutonomousCulinaryAgentModal: React.FC<AutonomousCulinaryAgentModalProps> = ({
  isOpen,
  onClose,
  availableIngredients,
  onStartCookingRecipe,
  onSyncShoppingList,
}) => {
  const [goalText, setGoalText] = useState(
    'Plan my meals for this week while minimizing food waste and keeping groceries below ₹2,500.'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [agentResult, setAgentResult] = useState<AutonomousCulinaryAgentResult>({
    goal: 'Plan my meals for this week while minimizing food waste and keeping groceries below ₹2,500.',
    agentStatus: 'OPTIMIZED & EXECUTABLE',
    projectedWeeklySavings: '₹1,180',
    projectedWasteReductionKg: 4.8,
    weeklyCostEstimate: '₹2,140',
    pantryUtilizationRate: 92,
    stages: [
      { stageNumber: 1, title: 'Pantry Inventory Audited', detail: '14 active items cataloged across 4 fridge microclimates.', status: 'Completed' },
      { stageNumber: 2, title: 'Expiry Matrix Calculated', detail: 'Flagged spinach & chicken for immediate 48-hour rescue.', status: 'Completed' },
      { stageNumber: 3, title: 'Household Taste Vectors Synthesized', detail: 'Weighted for high protein, low sodium, and spicy aromatics.', status: 'Completed' },
      { stageNumber: 4, title: '7-Day Cyclical Menu Generated', detail: 'Zero duplicate meals; all balanced with high protein & fiber.', status: 'Completed' },
      { stageNumber: 5, title: 'Ingredient Cross-Reuse Optimized', detail: 'Rice, spinach, and roasted aromatics reused across 4 dinners.', status: 'Completed' },
      { stageNumber: 6, title: 'Nutritional Equilibrium Verified', detail: 'Average 126g protein, 28g fiber, 2,150 kcal daily.', status: 'Completed' },
      { stageNumber: 7, title: 'Cost Arbitrage Enforced', detail: 'Total grocery spend capped at ₹2,140 (under ₹2,500 ceiling).', status: 'Completed' },
      { stageNumber: 8, title: 'Consolidated Shopping List Built', detail: 'Only 5 missing items needed; 68% sourced from existing pantry.', status: 'Completed' },
      { stageNumber: 9, title: 'Cooking Order Scheduled', detail: 'Batch grain cooking on Sunday saves 1.5 hrs of weeknight prep.', status: 'Completed' },
      { stageNumber: 10, title: 'Voice Guidance Ready', detail: 'All 7 meals mapped to step-by-step hands-free voice audio.', status: 'Ready' },
      { stageNumber: 11, title: 'Leftover Repurposing Engine Active', detail: 'Day 3 leftover chicken auto-transforms into Day 4 skillet wrap.', status: 'Ready' },
      { stageNumber: 12, title: 'Continuous Feedback Learning Armed', detail: 'Every star rating will adapt future macro & seasoning weights.', status: 'Ready' },
    ],
    sevenDayMealPlan: [
      { day: 'Monday', mealName: 'Garlic Chicken & Spinach Skillet', cookTime: '20 min', rescuedIngredient: 'Fresh Spinach & Chicken', protein: '38g', calories: 480 },
      { day: 'Tuesday', mealName: 'Spiced Lentil, Paneer & Cumin Bowl', cookTime: '25 min', rescuedIngredient: 'Brown Lentils', protein: '32g', calories: 510 },
      { day: 'Wednesday', mealName: 'Sesame Edamame & Egg Fried Quinoa', cookTime: '15 min', rescuedIngredient: 'Edamame & Eggs', protein: '30g', calories: 460 },
      { day: 'Thursday', mealName: 'Crispy Herb Chicken & Roasted Veggies', cookTime: '22 min', rescuedIngredient: 'Monday Chicken Fond', protein: '36g', calories: 490 },
      { day: 'Friday', mealName: 'Mediterranean Chickpea & Tomato Ragout', cookTime: '18 min', rescuedIngredient: 'Tomatoes & Herbs', protein: '26g', calories: 440 },
      { day: 'Saturday', mealName: 'High-Protein Tofu & Broccoli Flash Wok', cookTime: '14 min', rescuedIngredient: 'Pre-cut Greens', protein: '34g', calories: 420 },
      { day: 'Sunday', mealName: 'Slow-Simmered Sunday Curry & Fluffy Rice', cookTime: '35 min', rescuedIngredient: 'Whole Spices & Yogurt', protein: '42g', calories: 580 },
    ],
    ingredientCrossReuseGraph: [
      { ingredient: 'Baby Spinach', usedInDays: ['Monday', 'Tuesday', 'Friday'], savingsNote: 'Bought 1 bulk bunch, zero leaves wasted.' },
      { ingredient: 'Chicken Breast', usedInDays: ['Monday', 'Thursday'], savingsNote: 'Prep once, sear fresh twice.' },
      { ingredient: 'Basmati Rice', usedInDays: ['Monday', 'Wednesday', 'Sunday'], savingsNote: '1 batch cook, 3 rapid dinners.' },
    ],
    consolidatedShoppingList: [
      { item: 'Chicken Breast (800g)', qty: '800g', estCost: '₹340' },
      { item: 'Paneer / Tofu (400g)', qty: '400g', estCost: '₹160' },
      { item: 'Fresh Broccoli & Cabbage', qty: '1 kg', estCost: '₹80' },
      { item: 'Greek Yogurt (400g)', qty: '400g', estCost: '₹95' },
      { item: 'Brown Lentils (500g)', qty: '500g', estCost: '₹65' },
    ],
    agentExecutiveSummary:
      'Autonomous plan achieves 92% pantry utilization, saves ₹1,180 in avoided food waste, and meets all personal macro and taste constraints while keeping grocery spending at ₹2,140.',
  });

  if (!isOpen) return null;

  const handleRunAgent = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/autonomous-agent-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalText,
          availableIngredients: availableIngredients.map((i) => i.name),
          budget: 2500,
        }),
      });
      const data = await res.json();
      setAgentResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
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
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Autonomous Culinary Operating System</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  AUTONOMOUS AGENT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                12-Stage Autonomous Loop: Auditing → Expiry → Meal Planning → Ingredient Reuse → Nutrition → Cost Arbitrage → Guidance.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal Input & Agent Runner Bar */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 w-full flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="State your culinary objective..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none font-medium"
            />
          </div>

          <button
            onClick={handleRunAgent}
            disabled={isRunning}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{isRunning ? 'Running 12-Stage Loop...' : 'Execute Autonomous Plan'}</span>
          </button>
        </div>

        {/* 4 Agent Telemetry Metrics Strip */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">PANTRY UTILIZATION</span>
            <strong className="text-emerald-400 font-mono text-base font-black">
              {agentResult.pantryUtilizationRate}%
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">PROJECTED SAVINGS</span>
            <strong className="text-teal-400 font-mono text-base font-black">
              {agentResult.projectedWeeklySavings}
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">WASTE REDUCTION</span>
            <strong className="text-purple-400 font-mono text-base font-black">
              {agentResult.projectedWasteReductionKg} kg
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">WEEKLY GROCERY COST</span>
            <strong className="text-cyan-400 font-mono text-base font-black">
              {agentResult.weeklyCostEstimate}
            </strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Executive Summary */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs text-slate-200 leading-relaxed">
            <strong className="text-emerald-400 block mb-1">🤖 Agent Executive Summary:</strong>
            {agentResult.agentExecutiveSummary}
          </div>

          {/* 12-Stage Workflow Progress Grid */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              12-Stage Autonomous Execution Sequence
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {agentResult.stages.map((st) => (
                <div key={st.stageNumber} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold">STAGE {st.stageNumber}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {st.status}
                    </span>
                  </div>
                  <strong className="text-slate-200 block text-[11px] font-bold leading-tight">{st.title}</strong>
                  <p className="text-slate-400 text-[10px] line-clamp-2">{st.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Cyclical Meal Plan Output */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Optimized 7-Day Autonomous Meal Plan
            </span>

            <div className="divide-y divide-slate-800/80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              {agentResult.sevenDayMealPlan.map((m) => (
                <div key={m.day} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-24 font-bold text-slate-400 font-mono shrink-0">{m.day}</span>
                    <div>
                      <strong className="text-white block font-bold">{m.mealName}</strong>
                      <span className="text-[11px] text-emerald-400">Rescues: {m.rescuedIngredient}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                    <span>⏱️ {m.cookTime}</span>
                    <span className="text-emerald-400">{m.protein} protein</span>
                    <span>{m.calories} kcal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Reuse Graph & Consolidated Shopping List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ingredient Cross-Reuse Graph */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Ingredient Cross-Reuse Matrix
              </span>
              <div className="space-y-2">
                {agentResult.ingredientCrossReuseGraph.map((g, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <strong className="text-emerald-300">{g.ingredient}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">Days: {g.usedInDays.join(', ')}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{g.savingsNote}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Consolidated Shopping List */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase tracking-wider">
                  Consolidated Shopping List ({agentResult.consolidatedShoppingList.length} items)
                </span>
                {onSyncShoppingList && (
                  <button
                    onClick={() => onSyncShoppingList(agentResult.consolidatedShoppingList.map((i) => i.item))}
                    className="text-[10px] text-emerald-400 font-bold hover:underline"
                  >
                    + Sync to Smart List
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {agentResult.consolidatedShoppingList.map((s, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">{s.item} ({s.qty})</span>
                    <span className="font-mono text-emerald-400 font-bold">{s.estCost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
