import React, { useState } from 'react';
import { Calendar, ChefHat, Clock, ShoppingBag, RefreshCw, Sparkles } from 'lucide-react';
import { Ingredient, Recipe } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { userKey } from '../state/userData';
import { localRecipes } from '../ai/recipeEngine';

interface WeeklyMealPlannerWidgetProps {
  currentIngredients: Ingredient[];
  recipes: Recipe[];
  onAddMissingToShoppingList: (ingredients: string[]) => void;
  onStartCooking?: (recipe: Recipe) => void;
}

interface DayPlan {
  day: string;
  lunch: Recipe;
  dinner: Recipe;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyMealPlannerWidget: React.FC<WeeklyMealPlannerWidgetProps> = ({ currentIngredients, onAddMissingToShoppingList, onStartCooking }) => {
  const [plan, setPlan] = usePersistentState<DayPlan[]>(userKey('weekPlan'), []);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exported, setExported] = useState(false);

  // Fourteen different on-device picks for the current pantry: lunch and dinner for each day
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const picks = await localRecipes(currentIngredients, {}, 14);
      if (picks.length) {
        setPlan(DAYS.map((day, i) => ({ day, lunch: picks[(i * 2) % picks.length], dinner: picks[(i * 2 + 1) % picks.length] })));
        setActiveDayIndex(0);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const missing = [...new Set(plan.flatMap((d) => [...d.lunch.missingIngredients, ...d.dinner.missingIngredients]))];
  const handleExportShopping = () => {
    onAddMissingToShoppingList(missing);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const activeDay = plan[activeDayIndex];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">7-Day Meal Planner</h3>
            <p className="text-xs text-slate-400">Lunch and dinner for the week, built from your {currentIngredients.length} fridge items.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !currentIngredients.length}
            className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{plan.length ? 'New plan' : 'Plan my week'}</span>
          </button>
          {missing.length > 0 && (
            <button
              onClick={handleExportShopping}
              className="px-3.5 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{exported ? 'Added to list' : `Add ${missing.length} missing`}</span>
            </button>
          )}
        </div>
      </div>

      {!activeDay ? (
        <div className="flex flex-col items-center text-center gap-2 py-8">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <p className="text-sm font-bold text-white">No plan yet</p>
          <p className="text-xs text-slate-400 max-w-sm">
            {currentIngredients.length ? 'Tap "Plan my week" to get 14 different meals that use what you have.' : 'Add a few items to your fridge first, then plan your week.'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {plan.map((d, idx) => (
              <button
                key={d.day}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors min-w-[56px] ${
                  activeDayIndex === idx ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {d.day.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {(
              [
                ['Lunch', activeDay.lunch, 'text-emerald-400'],
                ['Dinner', activeDay.dinner, 'text-teal-400'],
              ] as const
            ).map(([meal, r, tone]) => (
              <button
                key={meal}
                onClick={() => onStartCooking?.(r)}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-left space-y-1 hover:border-emerald-500/50 transition-colors"
              >
                <span className={`text-[10px] font-bold uppercase flex items-center gap-1 ${tone}`}>
                  <Clock className="w-3 h-3" /> {meal} · {r.prepTimeMinutes + r.cookTimeMinutes} min
                </span>
                <p className="font-bold text-slate-100 text-sm">
                  {r.emoji} {r.title}
                </p>
                <p className="text-slate-400">
                  {r.cuisine} · {r.calories} kcal{r.missingIngredients.length ? ` · needs ${r.missingIngredients.slice(0, 3).join(', ')}` : ''}
                </p>
                {onStartCooking && (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 pt-1">
                    <ChefHat className="w-3 h-3" /> Cook this
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
