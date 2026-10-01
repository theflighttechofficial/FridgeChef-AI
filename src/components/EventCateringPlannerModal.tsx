import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Users, DollarSign, Clock, ShoppingBag, CheckCircle2, X, Play, Calendar, ChefHat, Zap } from 'lucide-react';
import { EventCateringPlanResult, Ingredient } from '../types';
import { showToast, AI_OFFLINE_MESSAGE, noteIfFallback } from '../utils/toast';

interface EventCateringPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: Ingredient[];
  onAddMissingToShoppingList?: (items: string[]) => void;
}

export const EventCateringPlannerModal: React.FC<EventCateringPlannerModalProps> = ({
  isOpen,
  onClose,
  availableIngredients,
  onAddMissingToShoppingList,
}) => {
  const [guestCount, setGuestCount] = useState(8);
  const [budget, setBudget] = useState(2500);
  const [cuisine, setCuisine] = useState('Indian');
  const [vegCount, setVegCount] = useState(3);
  const [nonVegCount, setNonVegCount] = useState(5);
  const [prepTimeHours, setPrepTimeHours] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const [cateringPlan, setCateringPlan] = useState<EventCateringPlanResult>({
    menuCourses: [
      {
        courseName: 'Appetizer',
        title: 'Charred Spiced Paneer & Vegetable Skewers',
        description: 'Smoky tandoori marinated bites finished with chaat masala',
        scaledPortions: '16 skewers (2 per guest)',
        keyIngredients: ['Paneer', 'Bell Peppers', 'Onions', 'Yogurt', 'Chaat Masala'],
      },
      {
        courseName: 'Main Dish (Non-Veg)',
        title: 'Slow-Simmered Murgh Makhani (Butter Chicken)',
        description: 'Velvety fenugreek and tomato gravy with charred chicken thighs',
        scaledPortions: '5 generous portions (1.2 kg total)',
        keyIngredients: ['Chicken Thighs', 'Tomatoes', 'Butter', 'Cream', 'Kasuri Methi'],
      },
      {
        courseName: 'Main Dish (Veg)',
        title: 'Smoky Dal Bukhara & Charred Palak Paneer',
        description: 'Slow-cooked black lentils simmered with ginger & cream',
        scaledPortions: '3 generous portions (800g total)',
        keyIngredients: ['Black Urad Dal', 'Spinach', 'Paneer', 'Garlic', 'Ghee'],
      },
      {
        courseName: 'Accompaniment',
        title: 'Fragrant Jeera Basmati Rice & Fluffy Garlic Naan',
        description: 'Toasted cumin basmati rice and warm herb flatbreads',
        scaledPortions: '8 portions (800g raw rice yield)',
        keyIngredients: ['Basmati Rice', 'Cumin Seeds', 'Flour', 'Garlic Butter'],
      },
    ],
    totalEstimatedCost: '₹2,140',
    procurementShoppingList: [
      { item: 'Chicken Thighs (1 kg)', qty: '1 kg', estCost: '₹320', category: 'Poultry' },
      { item: 'Paneer (500g)', qty: '500g', estCost: '₹210', category: 'Dairy' },
      { item: 'Cooking Cream & Butter', qty: '1 unit each', estCost: '₹180', category: 'Dairy' },
      { item: 'Basmati Rice (1 kg)', qty: '1 kg', estCost: '₹120', category: 'Pantry' },
      { item: 'Tomatoes & Onions', qty: '2 kg', estCost: '₹90', category: 'Produce' },
    ],
    prepTimeline: [
      {
        timeMarker: 'T-minus 120m',
        action: 'Marinate chicken & paneer skewers. Rinse and soak basmati rice and black lentils.',
        chefTip: 'Early salting draws moisture for a deeper crust.',
      },
      {
        timeMarker: 'T-minus 75m',
        action: 'Begin tomato-fenugreek butter gravy. Simmer over low heat to reduce acidity.',
        chefTip: 'Cover to avoid stove splatters.',
      },
      {
        timeMarker: 'T-minus 35m',
        action: 'Bake/sear appetizers and simmer jeera rice on low steam.',
        chefTip: 'Rest cooked proteins 5 minutes before serving.',
      },
      {
        timeMarker: 'T-minus 10m',
        action: 'Warm serving platters, chop fresh cilantro, reheat gravies to steaming.',
        chefTip: 'Never serve hot curries onto cold ceramic plates.',
      },
    ],
    servingSchedule: [
      { time: '00:00', action: 'Serve welcome drinks and warm paneer skewers.' },
      { time: '+00:30', action: 'Buffet / family-style main course spread with steaming jeera rice.' },
      { time: '+01:15', action: 'Digestive cardamom tea or sweet fruit compote.' },
    ],
    cateringProTip:
      'Cook both curries in parallel using identical aromatic bases (onion-ginger-garlic paste) to cut prep time by 40%.',
  });

  if (!isOpen) return null;

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/event-catering-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestCount,
          budget,
          currency: '₹',
          cuisine,
          vegCount,
          nonVegCount,
          prepTimeHours,
          availableIngredients: availableIngredients.map((i) => i.name),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      noteIfFallback(res);
      const data = await res.json();
      setCateringPlan(data);
    } catch (e) {
      showToast(AI_OFFLINE_MESSAGE);
      console.error(e);
    } finally {
      setIsLoading(false);
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
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
              <PartyPopper className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Event & Guest Mode (AI Catering Planner)</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  HOSPITALITY LOGISTICS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Turn your home kitchen into a professional catering operation: Menus, prep timelines, scaled portions & cooking schedules.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Controls Strip */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-6 gap-3 items-end text-xs">
          <div>
            <label className="font-bold text-slate-400 block mb-1">Guests</label>
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-400 block mb-1">Budget (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value) || 500)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-400 block mb-1">Cuisine</label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white font-bold"
            >
              <option value="Indian">Indian Royal</option>
              <option value="Mediterranean">Mediterranean Mezze</option>
              <option value="Asian Fusion">Asian Fusion</option>
              <option value="Italian Trattoria">Italian Trattoria</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-400 block mb-1">Veg / Non-Veg</label>
            <div className="flex gap-1">
              <input
                type="number"
                title="Veg"
                value={vegCount}
                onChange={(e) => setVegCount(parseInt(e.target.value) || 0)}
                className="w-1/2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-emerald-400 font-mono font-bold text-center"
              />
              <input
                type="number"
                title="Non-Veg"
                value={nonVegCount}
                onChange={(e) => setNonVegCount(parseInt(e.target.value) || 0)}
                className="w-1/2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-rose-400 font-mono font-bold text-center"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-400 block mb-1">Prep Time</label>
            <select
              value={prepTimeHours}
              onChange={(e) => setPrepTimeHours(parseInt(e.target.value) || 2)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-white font-bold"
            >
              <option value={1}>1 Hour (Rush)</option>
              <option value={2}>2 Hours (Standard)</option>
              <option value={3}>3 Hours (Leisurely)</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>{isLoading ? 'Planning...' : 'Generate Plan'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Menu Spread Courses */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white uppercase tracking-wider">
                Scaled Event Menu ({guestCount} Guests • Est. Spend {cateringPlan.totalEstimatedCost})
              </span>
              <span className="text-amber-400 font-mono text-[11px]">Under ₹{budget} Budget</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cateringPlan.menuCourses.map((c, i) => (
                <div key={i} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                      {c.courseName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.scaledPortions}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Prep Timeline (T-Minus Schedule) */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Kitchen Prep Timeline (T-Minus Execution Order)
            </span>

            <div className="space-y-2">
              {cateringPlan.prepTimeline.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold shrink-0 text-[10px]">
                    {item.timeMarker}
                  </span>
                  <div>
                    <strong className="text-slate-200 block">{item.action}</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Chef tip: {item.chefTip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Serving Schedule & Procurement List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Serving Schedule */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Serving Schedule</span>
              <div className="space-y-1.5">
                {cateringPlan.servingSchedule.map((s, i) => (
                  <div key={i} className="flex justify-between text-xs p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-mono text-amber-400 font-bold">{s.time}</span>
                    <span className="text-slate-300">{s.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procurement Checklist */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase tracking-wider">Procurement ({cateringPlan.procurementShoppingList.length} items)</span>
                {onAddMissingToShoppingList && (
                  <button
                    onClick={() => onAddMissingToShoppingList(cateringPlan.procurementShoppingList.map((i) => i.item))}
                    className="text-[10px] text-amber-400 font-bold hover:underline"
                  >
                    + Add to Shopping List
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {cateringPlan.procurementShoppingList.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">{item.item}</span>
                    <span className="font-mono text-amber-300">{item.estCost}</span>
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
