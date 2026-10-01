import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingDown, PieChart, AlertTriangle, ShieldCheck, CheckCircle2, X, Receipt, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { PantryFinancialAudit } from '../types';

interface PantryFinancialIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PantryFinancialIntelligenceModal: React.FC<PantryFinancialIntelligenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [financialAudit] = useState<PantryFinancialAudit>({
    monthlyTotalSpendRupees: 7640,
    categorySpending: {
      protein: 2840,
      produce: 1920,
      dairy: 1140,
      snacks: 980,
      grains: 760,
    },
    spoilageLossMonthlyRupees: 620,
    wasteReductionTargetRupees: 180,
    repeatedlyUnusedItems: [
      {
        name: 'Fresh Cilantro / Coriander',
        category: 'Produce',
        timesBought: 4,
        timesWasted: 3,
        lossEstimateRupees: 120,
        preventionTip: 'Blend leftover stems into a quick green chutney freezer puck with green chiles & salt.',
      },
      {
        name: 'Cooking Cream (200ml)',
        category: 'Dairy',
        timesBought: 3,
        timesWasted: 2,
        lossEstimateRupees: 160,
        preventionTip: 'Freeze in silicone ice cube trays for instant 1-cube pan sauce enrichment.',
      },
      {
        name: 'Fresh Mint Leaves',
        category: 'Produce',
        timesBought: 3,
        timesWasted: 2,
        lossEstimateRupees: 80,
        preventionTip: 'Dry in microwave for 90 seconds between paper towels to make homemade dried spearmint.',
      },
      {
        name: 'Plain Greek Yogurt',
        category: 'Dairy',
        timesBought: 4,
        timesWasted: 1,
        lossEstimateRupees: 95,
        preventionTip: 'Strain through cheesecloth for labneh spread or whisk into pancake batter.',
      },
    ],
  });

  if (!isOpen) return null;

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
              <Receipt className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Pantry Financial Intelligence</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  EXPENDITURE & SPOILAGE AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                “Where is my grocery money going?” Identify monthly spending distributions & arrest recurring spoilage leaks.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spoilage Loss Alert Ribbon */}
        <div className="p-5 bg-gradient-to-r from-rose-950/50 via-slate-950 to-rose-950/50 border-b border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
            <div>
              <strong className="text-rose-200 text-sm font-extrabold block">
                ₹{financialAudit.spoilageLossMonthlyRupees} / month lost to expired groceries
              </strong>
              <p className="text-rose-300/90 leading-snug">
                Produce & dairy items left uneaten account for 8.1% of your total grocery budget.
              </p>
            </div>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 font-mono font-bold text-xs border border-rose-500/30 shrink-0">
            ACTIONABLE RECOVERY ACTIVE
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Category Spending Breakdown Bars */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white uppercase tracking-wider">
                Monthly Grocery Spend Distribution (Total: ₹{financialAudit.monthlyTotalSpendRupees})
              </span>
              <span className="font-mono text-emerald-400">30-Day Rolling Audit</span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Proteins & Poultry', amount: financialAudit.categorySpending.protein, pct: 37, color: 'bg-emerald-400' },
                { label: 'Fresh Vegetables & Produce', amount: financialAudit.categorySpending.produce, pct: 25, color: 'bg-teal-400' },
                { label: 'Dairy & Eggs', amount: financialAudit.categorySpending.dairy, pct: 15, color: 'bg-cyan-400' },
                { label: 'Snacks & Condiments', amount: financialAudit.categorySpending.snacks, pct: 13, color: 'bg-amber-400' },
                { label: 'Grains & Pulses', amount: financialAudit.categorySpending.grains, pct: 10, color: 'bg-purple-400' },
              ].map((cat) => (
                <div key={cat.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.label}</span>
                    <span className="font-mono text-white font-bold">
                      ₹{cat.amount} ({cat.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Repeatedly Unused & Spoiled Items */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white uppercase tracking-wider">
                Repeat Spoilage Offender Culprits ({financialAudit.repeatedlyUnusedItems.length} Identified)
              </span>
              <span className="text-xs text-slate-400">AI Zero-Waste Prevention Hacks</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {financialAudit.repeatedlyUnusedItems.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-white text-xs font-bold block">{item.name}</strong>
                      <span className="text-[10px] text-slate-400">{item.category}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      Wasted {item.timesWasted} of {item.timesBought}x (-₹{item.lossEstimateRupees})
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-emerald-300 space-y-0.5">
                    <span className="font-bold block text-[10px] text-emerald-400 uppercase">PREVENTION HACK:</span>
                    <p className="leading-snug text-slate-300">{item.preventionTip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
