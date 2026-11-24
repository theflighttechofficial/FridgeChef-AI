import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Droplets, DollarSign, TrendingDown, Globe, ShieldCheck, CheckCircle2, X, Award, Zap, BarChart3 } from 'lucide-react';
import { cookLog } from '../state/userData';
import { EmptyResult } from './ui/EmptyResult';

interface FoodWasteCarbonCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Rough per-item averages used for the estimates (household produce/dairy portions)
const KG_PER_ITEM = 0.15;
const CO2_PER_KG = 2.5;
const WATER_PER_KG = 1000;
const RUPEES_PER_KG = 180;

export const FoodWasteCarbonCalculatorModal: React.FC<FoodWasteCarbonCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const log = cookLog.use();
  const impact = useMemo(() => {
    const since = Date.now() - 30 * 86400000;
    const meals = log.filter((m) => Date.parse(m.at) >= since);
    const used = meals.reduce((t, m) => t + m.ingredients.length, 0);
    const kg = +(used * KG_PER_ITEM).toFixed(1);
    return {
      meals: meals.length,
      used,
      kg,
      co2: +(kg * CO2_PER_KG).toFixed(1),
      water: Math.round(kg * WATER_PER_KG),
      money: Math.round(kg * RUPEES_PER_KG),
    };
  }, [log]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 tool-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="tool-panel max-w-4xl"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-high border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-on-surface leading-tight">Carbon calculator</h3>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                What cooking from your own fridge saved this month.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!impact.meals ? (
          <EmptyResult
            title="Nothing to count yet"
            hint="Cook with what is already in your fridge and FridgeChef estimates the food, money, CO₂ and water you saved this month."
            icon={<Leaf className="w-6 h-6" />}
          />
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Food used up', value: `${impact.kg} kg`, note: `${impact.used} items in ${impact.meals} meals`, tone: 'text-emerald-400' },
                { label: 'Money kept', value: `₹${impact.money.toLocaleString('en-IN')}`, note: 'Groceries not thrown out', tone: 'text-teal-400' },
                { label: 'CO₂ avoided', value: `${impact.co2} kg`, note: 'From food not wasted', tone: 'text-teal-400' },
                { label: 'Water saved', value: `${impact.water.toLocaleString()} L`, note: 'Used to grow that food', tone: 'text-emerald-400' },
              ].map((c) => (
                <div key={c.label} className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-bold block">{c.label}</span>
                  <strong className={`text-xl font-semibold mt-0.5 block ${c.tone}`}>{c.value}</strong>
                  <span className="text-xs text-slate-500">{c.note}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Estimates for the last 30 days, assuming about {KG_PER_ITEM * 1000} g per pantry item cooked, {CO2_PER_KG} kg CO₂ and {WATER_PER_KG.toLocaleString()} L of water per kg of food.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
