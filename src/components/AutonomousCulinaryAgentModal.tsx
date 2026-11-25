import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap, CheckCircle2, X, Play, RotateCcw, Calendar, Layers, ArrowRight, TrendingDown, DollarSign, ShieldCheck, Send } from 'lucide-react';
import { EmptyResult } from './ui/EmptyResult';
import { AutonomousCulinaryAgentResult, Ingredient, Recipe } from '../types';
import { showToast, AI_OFFLINE_MESSAGE, noteIfFallback } from '../utils/toast';

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
  const [goalText, setGoalText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [agentResult, setAgentResult] = useState<AutonomousCulinaryAgentResult | null>(null);

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
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      noteIfFallback(res);
      const data = await res.json();
      setAgentResult(data);
    } catch (e) {
      showToast(AI_OFFLINE_MESSAGE);
      console.error(e);
    } finally {
      setIsRunning(false);
    }
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-on-surface leading-tight">Culinary OS</h3>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                Plans a week of meals from your pantry, using what expires first and keeping costs down.
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
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g. Plan this week's meals, waste nothing, stay under ₹2,500"
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none font-medium"
            />
          </div>

          <button
            onClick={handleRunAgent}
            disabled={isRunning || !goalText.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-surface-high text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{isRunning ? 'Running 12-Stage Loop...' : 'Execute Autonomous Plan'}</span>
          </button>
        </div>

        {agentResult ? (
        <>
        {/* 4 Agent Telemetry Metrics Strip */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-xs text-slate-400 font-bold block">PANTRY UTILIZATION</span>
            <strong className="text-emerald-400 text-base font-semibold">
              {agentResult.pantryUtilizationRate}%
            </strong>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">PROJECTED SAVINGS</span>
            <strong className="text-teal-400 text-base font-semibold">
              {agentResult.projectedWeeklySavings}
            </strong>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">WASTE REDUCTION</span>
            <strong className="text-teal-400 text-base font-semibold">
              {agentResult.projectedWasteReductionKg} kg
            </strong>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">WEEKLY GROCERY COST</span>
            <strong className="text-emerald-400 text-base font-semibold">
              {agentResult.weeklyCostEstimate}
            </strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Executive Summary */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs text-slate-200 leading-relaxed">
            <strong className="text-emerald-400 block mb-1">Agent Executive Summary:</strong>
            {agentResult.agentExecutiveSummary}
          </div>

          {/* 12-Stage Workflow Progress Grid */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white block">
              12-Stage Autonomous Execution Sequence
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {agentResult.stages.map((st) => (
                <div key={st.stageNumber} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-bold">STAGE {st.stageNumber}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {st.status}
                    </span>
                  </div>
                  <strong className="text-slate-200 block text-xs font-bold leading-tight">{st.title}</strong>
                  <p className="text-slate-400 text-xs line-clamp-2">{st.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Cyclical Meal Plan Output */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white block">
              Optimized 7-Day Autonomous Meal Plan
            </span>

            <div className="divide-y divide-slate-800/80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              {agentResult.sevenDayMealPlan.map((m) => (
                <div key={m.day} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-24 font-bold text-slate-400 shrink-0">{m.day}</span>
                    <div>
                      <strong className="text-white block font-bold">{m.mealName}</strong>
                      <span className="text-xs text-emerald-400">Rescues: {m.rescuedIngredient}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 text-xs">
                    <span>⏱{m.cookTime}</span>
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
              <span className="text-xs font-bold text-white block">
                Ingredient Cross-Reuse Matrix
              </span>
              <div className="space-y-2">
                {agentResult.ingredientCrossReuseGraph.map((g, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <strong className="text-emerald-300">{g.ingredient}</strong>
                      <span className="text-xs text-slate-400">Days: {g.usedInDays.join(', ')}</span>
                    </div>
                    <p className="text-xs text-slate-400">{g.savingsNote}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Consolidated Shopping List */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">
                  Consolidated Shopping List ({agentResult.consolidatedShoppingList.length} items)
                </span>
                {onSyncShoppingList && (
                  <button
                    onClick={() => onSyncShoppingList(agentResult.consolidatedShoppingList.map((i) => i.item))}
                    className="text-xs text-emerald-400 font-bold hover:underline"
                  >
                    + Sync to Smart List
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {agentResult.consolidatedShoppingList.map((s, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">{s.item} ({s.qty})</span>
                    <span className="font-mono text-emerald-400 font-bold">{s.estCost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </>
        ) : (
          <EmptyResult title="Your agent is ready" hint="Describe a goal above and run it. The plan is built from what is in your pantry right now." />
        )}
      </motion.div>
    </div>
  );
};
