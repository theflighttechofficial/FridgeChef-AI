import React, { useState } from 'react';
import { Calendar, ChefHat, Clock, ArrowRight, ShoppingBag, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import { Ingredient, Recipe } from '../types';

interface WeeklyMealPlannerWidgetProps {
  currentIngredients: Ingredient[];
  recipes: Recipe[];
  onAddMissingToShoppingList: (ingredients: string[]) => void;
}

interface DayPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  targetCalories: number;
  wasteReductionScore: number;
}

const DEFAULT_WEEKLY_PLAN: DayPlan[] = [
  {
    day: 'Monday',
    breakfast: 'Avocado & Blistered Tomato Sourdough Toast',
    lunch: 'Gourmet Mediterranean Power Bowl',
    dinner: 'Wok-Tossed Crispy Garlic Shrimp & Bok Choy',
    snack: 'Greek Yogurt with Honey & Berry Swirl',
    targetCalories: 1850,
    wasteReductionScore: 98,
  },
  {
    day: 'Tuesday',
    breakfast: 'Crispy Cheddar & Spinach Omelette',
    lunch: 'Air-Fryer Caramelized Miso Eggplant & Tofu',
    dinner: 'Instant Pot Barbacoa Shredded Beef Tacos',
    snack: 'Spiced Roasted Edamame',
    targetCalories: 1920,
    wasteReductionScore: 95,
  },
  {
    day: 'Wednesday',
    breakfast: 'Probiotic Kimchi & Scrambled Egg Bowl',
    lunch: 'Leftover Barbacoa Salad Bowl with Fresh Avocado',
    dinner: 'Pan-Seared Lemon Herbs Salmon Fillet',
    snack: 'Sliced Bell Pepper with Feta Dip',
    targetCalories: 1880,
    wasteReductionScore: 100,
  },
  {
    day: 'Thursday',
    breakfast: 'Greek Yogurt Parfait with Toasted Seeds',
    lunch: 'Miso Tofu & Shiitake Mushroom Warm Broth',
    dinner: 'Gourmet Mediterranean Power Bowl (Batch 2)',
    snack: 'Cherry Tomatoes & Cheddar Cubes',
    targetCalories: 1810,
    wasteReductionScore: 94,
  },
  {
    day: 'Friday',
    breakfast: 'Avocado & Poached Egg Bowl',
    lunch: 'Wok-Tossed Crispy Garlic Shrimp & Bok Choy',
    dinner: 'Air-Fryer Caramelized Miso Eggplant & Tofu',
    snack: 'Toasted Garlic Sourdough Crusts',
    targetCalories: 1890,
    wasteReductionScore: 97,
  },
  {
    day: 'Saturday',
    breakfast: 'Sourdough French Toast with Honey Drizzle',
    lunch: 'Gut-Healing Probiotic Kimchi & Avocado Bowl',
    dinner: 'Instant Pot Barbacoa Shredded Beef Plate',
    snack: 'Greek Yogurt Berry Bowl',
    targetCalories: 2050,
    wasteReductionScore: 92,
  },
  {
    day: 'Sunday',
    breakfast: 'Chef Special Fridge Cleanout Frittata',
    lunch: 'Pan-Seared Lemon Chicken & Broccoli Florets',
    dinner: 'Slow-Cooked Vegetable & Tofu Umami Broth',
    snack: 'Crispy Broccoli Chips',
    targetCalories: 1780,
    wasteReductionScore: 99,
  },
];

export const WeeklyMealPlannerWidget: React.FC<WeeklyMealPlannerWidgetProps> = ({
  currentIngredients,
  recipes,
  onAddMissingToShoppingList,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<DayPlan[]>(DEFAULT_WEEKLY_PLAN);
  const [exported, setExported] = useState(false);

  const activeDay = plan[activeDayIndex];

  const handleRegeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 800);
  };

  const handleExportShopping = () => {
    onAddMissingToShoppingList([
      'Feta Cheese',
      'Japanese Eggplant',
      'Chipotle in Adobo',
      'Shaoxing Wine',
      'Nori Seaweed Strips',
    ]);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">7-Day Zero-Waste AI Meal Planner</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                BATCH COOKING AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Automated 7-day culinary roadmap synchronized with your {currentIngredients.length} fridge items to eliminate food rot.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegeneratePlan}
            disabled={isGenerating}
            className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Optimize Schedule</span>
          </button>

          <button
            onClick={handleExportShopping}
            className="px-3.5 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{exported ? 'Exported to List!' : 'Export Missing Items'}</span>
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {plan.map((dayPlan, idx) => (
          <button
            key={dayPlan.day}
            onClick={() => setActiveDayIndex(idx)}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex flex-col items-center min-w-[72px] ${
              activeDayIndex === idx
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span>{dayPlan.day.slice(0, 3)}</span>
            <span className="text-[10px] opacity-80">{dayPlan.wasteReductionScore}% Efficient</span>
          </button>
        ))}
      </div>

      {/* Active Day Card */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-extrabold text-white">{activeDay.day} Culinary Schedule</h4>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Target: <strong className="text-emerald-400">{activeDay.targetCalories} kcal</strong></span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
              {activeDay.wasteReductionScore}% Zero-Waste Score
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Breakfast
            </span>
            <p className="font-bold text-slate-200">{activeDay.breakfast}</p>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Lunch
            </span>
            <p className="font-bold text-slate-200">{activeDay.lunch}</p>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-teal-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Dinner
            </span>
            <p className="font-bold text-slate-200">{activeDay.dinner}</p>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Snack
            </span>
            <p className="font-bold text-slate-200">{activeDay.snack}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
