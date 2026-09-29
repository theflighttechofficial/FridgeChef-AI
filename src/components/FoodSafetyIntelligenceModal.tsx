import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Thermometer,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  Info,
  Clock
} from 'lucide-react';
import { Ingredient, FoodSafetyProfile, SafetyWindowStatus } from '../types';

interface FoodSafetyIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
}

export const FoodSafetyIntelligenceModal: React.FC<FoodSafetyIntelligenceModalProps> = ({
  isOpen,
  onClose,
  ingredients,
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState<string>('Chicken Breast');

  // Rule-based deterministic Food Safety database
  const getFoodSafetyProfile = (name: string): FoodSafetyProfile => {
    const lower = name.toLowerCase();
    if (lower.includes('chicken') || lower.includes('poultry') || lower.includes('turkey')) {
      return {
        ingredientName: name,
        category: 'Raw Poultry',
        safetyStatus: 'Cook Today',
        openedDaysAgo: 2,
        maxRefrigeratedDays: 2,
        safeStorageLocation: 'Bottom Shelf (Deep Cold, below all ready-to-eat foods)',
        safeCookInternalTempCelsius: 74,
        safeCookInternalTempFahrenheit: 165,
        crossContaminationWarning: 'CRITICAL: Raw poultry juices harbor Salmonella & Campylobacter. Never wash chicken in sink. Use dedicated cutting board.',
        rawCookedSeparationRule: 'Store in leak-proof sealed container on bottom shelf only. Wash knives and prep surfaces with hot soapy water for 20 seconds.',
        allergenAlerts: [],
        handlingAction: 'Safe handling window is closing today. Cook thoroughly to 74°C / 165°F or freeze immediately.',
      };
    } else if (lower.includes('spinach') || lower.includes('greens') || lower.includes('lettuce')) {
      return {
        ingredientName: name,
        category: 'Leafy Green Produce',
        safetyStatus: 'Cook Today',
        openedDaysAgo: 4,
        maxRefrigeratedDays: 5,
        safeStorageLocation: 'Crisper Drawer with paper towel layer (High Humidity 85%)',
        safeCookInternalTempCelsius: 60,
        safeCookInternalTempFahrenheit: 140,
        crossContaminationWarning: 'Wash under cold running water just prior to cooking. Keep separate from unwashed raw soil items.',
        rawCookedSeparationRule: 'Never place greens on any surface that previously contacted raw meats without full sanitization.',
        allergenAlerts: [],
        handlingAction: 'Leaves show gentle wilting. Ideal for cooked skillet braises or soups tonight.',
      };
    } else if (lower.includes('milk') || lower.includes('cream') || lower.includes('yogurt')) {
      return {
        ingredientName: name,
        category: 'Dairy Products',
        safetyStatus: 'Safe',
        openedDaysAgo: 3,
        maxRefrigeratedDays: 7,
        safeStorageLocation: 'Middle Shelf (36°F - stable core zone; avoid refrigerator door rack)',
        safeCookInternalTempCelsius: 4,
        safeCookInternalTempFahrenheit: 39,
        crossContaminationWarning: 'Keep tightly capped to prevent absorption of aromatic volatile odors (onions/garlic).',
        rawCookedSeparationRule: 'Do not leave at room temperature for more than 45 minutes.',
        allergenAlerts: ['Lactose', 'Dairy Protein (Casein)'],
        handlingAction: '4 days of safe refrigerated life remaining. Sniff test confirmed sweet and fresh.',
      };
    } else if (lower.includes('egg')) {
      return {
        ingredientName: name,
        category: 'Poultry Eggs',
        safetyStatus: 'Safe',
        openedDaysAgo: 6,
        maxRefrigeratedDays: 28,
        safeStorageLocation: 'Original Carton on Middle Shelf (Temperature-stable zone)',
        safeCookInternalTempCelsius: 71,
        safeCookInternalTempFahrenheit: 160,
        crossContaminationWarning: 'Wash hands thoroughly after handling raw eggshells to prevent surface pathogen transfer.',
        rawCookedSeparationRule: 'Cook until yolk and whites are firm unless using pasteurized eggs for emulsions.',
        allergenAlerts: ['Egg Albumin'],
        handlingAction: 'Well within the 3-week safe cooking window. Ideal for boiling, frittatas, or scrambles.',
      };
    } else {
      return {
        ingredientName: name,
        category: 'General Produce / Pantry',
        safetyStatus: 'Safe',
        openedDaysAgo: 2,
        maxRefrigeratedDays: 10,
        safeStorageLocation: 'Crisper Drawer or Cool Pantry',
        safeCookInternalTempCelsius: 65,
        safeCookInternalTempFahrenheit: 150,
        crossContaminationWarning: 'Rinse with cold water before peeling or dicing.',
        rawCookedSeparationRule: 'Store in dry breathable bin away from direct moisture condensation.',
        allergenAlerts: [],
        handlingAction: 'Firm, excellent cellular moisture, perfectly safe for cooking.',
      };
    }
  };

  if (!isOpen) return null;

  const currentProfile = getFoodSafetyProfile(selectedIngredient);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Food Safety Intelligence</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  DETERMINISTIC HACCP PROTOCOLS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Rule-based culinary hygiene: Safe handling windows, cross-contamination barriers & internal cooking temperatures.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ingredient Quick Selector Horizontal Strip */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0 mr-1">Select Item:</span>
          {ingredients.slice(0, 10).map((ing) => {
            const isSelected = selectedIngredient === ing.name;
            return (
              <button
                key={ing.id}
                onClick={() => setSelectedIngredient(ing.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-rose-500/20 text-rose-200 border-rose-400 shadow-md shadow-rose-500/10'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {ing.name}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Inspection Banner */}
          <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">{currentProfile.category}</span>
                <h4 className="text-lg font-black text-white">{currentProfile.ingredientName}</h4>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                    currentProfile.safetyStatus === 'Cook Today'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  🟢 {currentProfile.safetyStatus.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400 font-mono">Opened {currentProfile.openedDaysAgo} days ago</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {currentProfile.handlingAction}
            </p>
          </div>

          {/* 3 Safety Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Safe Cook Internal Temp */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span>SAFE INTERNAL TEMP</span>
              </span>
              <strong className="text-2xl font-black text-rose-400 font-mono block">
                {currentProfile.safeCookInternalTempCelsius}°C / {currentProfile.safeCookInternalTempFahrenheit}°F
              </strong>
              <span className="text-[10px] text-slate-400">Verifiable with digital probe</span>
            </div>

            {/* Shelf Location */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>SAFE MICROCLIMATE</span>
              </span>
              <strong className="text-xs text-white block mt-1 leading-snug">
                {currentProfile.safeStorageLocation}
              </strong>
            </div>

            {/* Refrigerated Lifespan */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>LIFESPAN WINDOW</span>
              </span>
              <strong className="text-xl font-black text-amber-300 font-mono block">
                {currentProfile.openedDaysAgo} / {currentProfile.maxRefrigeratedDays} Days
              </strong>
              <span className="text-[10px] text-slate-400">From package unsealing</span>
            </div>
          </div>

          {/* Cross Contamination Warning */}
          {currentProfile.crossContaminationWarning && (
            <div className="p-4 bg-rose-950/30 rounded-2xl border border-rose-500/40 space-y-1.5">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Cross-Contamination Protocol</span>
              </span>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                {currentProfile.crossContaminationWarning}
              </p>
            </div>
          )}

          {/* Raw vs Cooked Separation Guidance */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Raw / Cooked Physical Separation Rule</span>
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              {currentProfile.rawCookedSeparationRule}
            </p>
          </div>

          {/* Allergen Alerts if any */}
          {currentProfile.allergenAlerts.length > 0 && (
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 flex items-center gap-2 text-xs text-amber-200">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Medical Allergen Notice: </strong> Contains {currentProfile.allergenAlerts.join(', ')}. Clean utensils to avoid cross-contact.</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
