import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Droplets, DollarSign, TrendingDown, Globe, ShieldCheck, CheckCircle2, X, Award, Zap, BarChart3 } from 'lucide-react';
import { SustainabilityMetrics } from '../types';

interface FoodWasteCarbonCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoodWasteCarbonCalculatorModal: React.FC<FoodWasteCarbonCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [metrics] = useState<SustainabilityMetrics>({
    foodRescuedKg: 3.8,
    estimatedMoneySavedRupees: 1240,
    foodWasteAvoidedKg: 4.6,
    co2AvoidedKg: 8.2,
    waterSavedLiters: 2900,
    householdSustainabilityScore: 84,
    scoreBreakdown: {
      wasteDiversionScore: 91,
      localSeasonalityScore: 85,
      resourceEfficiencyScore: 88,
      compostingPackagingScore: 72,
    },
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
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Food Waste Carbon & Water Calculator</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  CLIMATE CULINARY ARBITRAGE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audited planetary footprint reductions derived from pantry item rescues and zero-waste cooking.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sustainability Score Ribbon */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex flex-col items-center justify-center font-mono">
              <span className="text-2xl font-black text-emerald-400 leading-none">{metrics.householdSustainabilityScore}</span>
              <span className="text-[10px] text-slate-400 font-bold">/100</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold tracking-wider">
                COMMUNITY RANK: TOP 6% ZERO-WASTE HOMES
              </span>
              <h4 className="text-base font-extrabold text-white">Household Sustainability Score</h4>
              <p className="text-xs text-slate-300">
                You prevent 82% more food spoilage than the average urban refrigerator.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              ECO-CHEF CERTIFIED
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key 5 Impact Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">FOOD RESCUED</span>
              <strong className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">
                {metrics.foodRescuedKg} kg
              </strong>
              <span className="text-[10px] text-slate-500">This Month</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">MONEY SAVED</span>
              <strong className="text-xl font-black text-teal-400 font-mono mt-0.5 block">
                ₹{metrics.estimatedMoneySavedRupees}
              </strong>
              <span className="text-[10px] text-slate-500">Unspoiled grocery value</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">WASTE AVOIDED</span>
              <strong className="text-xl font-black text-cyan-400 font-mono mt-0.5 block">
                {metrics.foodWasteAvoidedKg} kg
              </strong>
              <span className="text-[10px] text-slate-500">Diverted from landfill</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">CO₂ AVOIDED</span>
              <strong className="text-xl font-black text-purple-400 font-mono mt-0.5 block">
                {metrics.co2AvoidedKg} kg
              </strong>
              <span className="text-[10px] text-slate-500">Methane emissions saved</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">WATER SAVED</span>
              <strong className="text-xl font-black text-blue-400 font-mono mt-0.5 block">
                {metrics.waterSavedLiters.toLocaleString()} L
              </strong>
              <span className="text-[10px] text-slate-500">Embedded agricultural H₂O</span>
            </div>
          </div>

          {/* Detailed Sustainability Pillars */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Sustainability Pillar Breakdown
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>Waste Diversion Rate</span>
                  <span className="font-mono text-emerald-400">{metrics.scoreBreakdown.wasteDiversionScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${metrics.scoreBreakdown.wasteDiversionScore}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 pt-1">91% of items entering your fridge are cooked before expiration.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>Resource & Water Efficiency</span>
                  <span className="font-mono text-cyan-400">{metrics.scoreBreakdown.resourceEfficiencyScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${metrics.scoreBreakdown.resourceEfficiencyScore}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 pt-1">One-skillet low-energy cooking saves 2,900 L embedded water.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>Local Seasonality Index</span>
                  <span className="font-mono text-purple-400">{metrics.scoreBreakdown.localSeasonalityScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: `${metrics.scoreBreakdown.localSeasonalityScore}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 pt-1">85% of scanned produce matches active regional crop cycles.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>Packaging & Plastic Avoidance</span>
                  <span className="font-mono text-amber-400">{metrics.scoreBreakdown.compostingPackagingScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${metrics.scoreBreakdown.compostingPackagingScore}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 pt-1">High pantry usage avoids single-use plastic takeout containers.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
