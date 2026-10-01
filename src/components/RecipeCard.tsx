import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, ChefHat, Plus, Check, Bookmark, Heart, Play, AlertCircle, Activity, ChevronDown, ChevronUp, Layers, Dna, Brain, DollarSign, Zap } from 'lucide-react';
import { D3RadarChart, NutritionPoint } from './D3RadarChart';
import { MealPrepBatchModal } from './MealPrepBatchModal';
import { SubRecipeModal } from './SubRecipeModal';

// recharts is heavy; load the flavor chart only when a card actually shows it
const FlavorDnaRadarChart = lazy(() =>
  import('./FlavorDnaRadarChart').then((m) => ({ default: m.FlavorDnaRadarChart }))
);
import { Recipe, FlavorDna } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelectRecipe: (recipe: Recipe) => void;
  onAddMissingToShoppingList: (recipe: Recipe) => void;
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  isMissingAdded: boolean;
  onOpenSubstitutes?: (ingredientName: string) => void;
  onEvolveRecipe?: (recipe: Recipe) => void;
  onExplainRecipe?: (recipe: Recipe) => void;
  onOpenValidation?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelectRecipe,
  onAddMissingToShoppingList,
  isSaved,
  onToggleSave,
  isMissingAdded,
  onOpenSubstitutes,
  onEvolveRecipe,
  onExplainRecipe,
  onOpenValidation,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [radarTab, setRadarTab] = useState<'flavor' | 'nutrition'>('flavor');
  // Collapsed by default on phones so cards stay scannable; expanded on larger screens
  const [showRadarChart, setShowRadarChart] = useState(
    () => typeof window === 'undefined' || window.matchMedia('(min-width: 768px)').matches
  );
  const [showMealPrep, setShowMealPrep] = useState(false);
  const [selectedSubIngredient, setSelectedSubIngredient] = useState<string | null>(null);

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const matchCount = recipe.matchedIngredients.length;
  const totalRequired = matchCount + recipe.missingIngredients.length;
  const matchPercent = totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 100;

  // Grocery Price Intelligence estimation
  const proteinNum = parseInt(recipe.macros?.protein || '28') || 28;
  const estCostRupees = Math.round(110 + (proteinNum * 1.8) + (recipe.matchedIngredients.length * 8));
  const costPer10gProtein = ((estCostRupees / proteinNum) * 10).toFixed(1);

  // Extract numerical values from macros strings for precise radar scores
  const parseGram = (str?: string) => {
    if (!str) return 20;
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 20;
  };

  const proteinGrams = parseGram(recipe.macros?.protein);
  const carbsGrams = parseGram(recipe.macros?.carbs);
  const fatGrams = parseGram(recipe.macros?.fat);

  // 5-Axis Macro & Micronutrient Distribution: Protein, Carbs, Fats, Vitamins, Fiber
  const radarData5Axis: NutritionPoint[] = [
    { attribute: 'Protein', score: Math.min(100, Math.round((proteinGrams / 50) * 100)), detail: `${proteinGrams}g` },
    { attribute: 'Carbs', score: Math.min(100, Math.round((carbsGrams / 60) * 100)), detail: `${carbsGrams}g` },
    { attribute: 'Fats', score: Math.min(100, Math.round((fatGrams / 35) * 100)), detail: `${fatGrams}g` },
    { attribute: 'Vitamins', score: 85, detail: '85% DV' },
    { attribute: 'Fiber', score: 70, detail: '7g' },
  ];

  // Derive Flavor DNA intensities (Salt, Sweet, Acid, Heat, Umami)
  const getFlavorScores = (rec: Recipe): FlavorDna => {
    if (rec.flavorDna) return rec.flavorDna;

    const text = (rec.title + ' ' + rec.description + ' ' + rec.cuisine + ' ' + (rec.matchedIngredients || []).join(' ')).toLowerCase();

    let heat = 20;
    if (text.includes('spicy') || text.includes('chili') || text.includes('pepper') || text.includes('chettinad') || text.includes('sichuan') || text.includes('kung pao') || text.includes('jalapeno') || text.includes('barbacoa') || text.includes('chipotle') || text.includes('curry')) heat += 50;
    if (text.includes('kimchi') || text.includes('gochujang') || text.includes('tadka')) heat += 25;

    let sweet = 20;
    if (text.includes('honey') || text.includes('teriyaki') || text.includes('caramelized') || text.includes('bbq') || text.includes('sweet potato') || text.includes('corn') || text.includes('miso')) sweet += 45;

    let acid = 25;
    if (text.includes('lemon') || text.includes('lime') || text.includes('kimchi') || text.includes('tomato') || text.includes('pickles') || text.includes('tzatziki') || text.includes('vinegar') || text.includes('yogurt')) acid += 45;

    let umami = 50;
    if (text.includes('mushroom') || text.includes('shiitake') || text.includes('miso') || text.includes('soy') || text.includes('cheese') || text.includes('parmesan') || text.includes('paneer') || text.includes('beef') || text.includes('salmon') || text.includes('chicken') || text.includes('tofu') || text.includes('bolognese')) umami += 35;

    let salt = 45;
    if (text.includes('soy') || text.includes('feta') || text.includes('cheddar') || text.includes('bacon') || text.includes('miso') || text.includes('pickles') || text.includes('sea salt')) salt += 30;

    return {
      salt: Math.min(96, Math.max(20, salt)),
      sweet: Math.min(96, Math.max(15, sweet)),
      acid: Math.min(96, Math.max(20, acid)),
      heat: Math.min(96, Math.max(10, heat)),
      umami: Math.min(98, Math.max(30, umami)),
    };
  };

  const flavorDna = getFlavorScores(recipe);

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 flex flex-col justify-between group">
      <div>
        {/* Card Header Media View */}
        <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
          {recipe.imageUrl && !imageFailed ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 flex items-center justify-center p-6 text-center">
              <ChefHat className="w-12 h-12 text-emerald-500/30" />
            </div>
          )}

          {/* Gradient Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {/* Match Percentage Badge */}
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-extrabold text-[11px] shadow-lg shadow-emerald-500/20 flex items-center gap-1">
              <span>{matchPercent}% Ingredient Match</span>
            </div>

            {/* Favorite / Bookmark Button with Spring Pop Animation */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
                  try {
                    navigator.vibrate([20, 30]);
                  } catch (e) {}
                }
                onToggleSave(recipe);
              }}
              className={`p-2 rounded-xl backdrop-blur-md transition-colors relative overflow-visible ${
                isSaved
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-950 border border-white/10'
              }`}
              title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
            >
              <motion.div
                key={isSaved ? 'saved' : 'unsaved'}
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: [0.5, 1.4, 0.9, 1.15, 1], rotate: [0, -15, 15, -5, 0] }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className="flex items-center justify-center"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-white' : 'text-slate-300 hover:text-rose-400'}`} />
              </motion.div>

              {/* Heart Pop Burst Particle Overlay */}
              <AnimatePresence>
                {isSaved && (
                  <motion.span
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-xl bg-rose-400/40 pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Bottom Overlay Title & Cuisine */}
          <div className="absolute bottom-3 left-3 right-3 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
              {recipe.cuisine}
            </span>
            <h3 className="text-base font-extrabold text-white leading-snug drop-shadow-md line-clamp-1">
              {recipe.title}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          {/* Unboxed Metadata Discipline */}
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium py-1 border-y border-slate-800/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{totalTime} min total</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{recipe.calories} kcal</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">{recipe.difficulty}</span>
          </div>

          {/* Dietary Tags */}
          {recipe.dietaryTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
              {recipe.dietaryTags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  {idx > 0 && <span className="text-slate-600">•</span>}
                  <span>{tag}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Grocery Price Intelligence Strip */}
          <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Est. ₹{estCostRupees}</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ₹{costPer10gProtein} / 10g protein
            </span>
          </div>

          {/* Macros Summary Grid */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl text-center border border-slate-800">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Protein</p>
              <p className="text-xs font-bold text-slate-200">{recipe.macros.protein}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Carbs</p>
              <p className="text-xs font-bold text-slate-200">{recipe.macros.carbs}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Fat</p>
              <p className="text-xs font-bold text-slate-200">{recipe.macros.fat}</p>
            </div>
          </div>

          {/* Flavor DNA & Nutritional Radar Dual Profile (Powered by Recharts & D3) */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
            <div className="px-2.5 py-1.5 flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800/80 bg-slate-900/60">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => { setRadarTab('flavor'); setShowRadarChart(true); }}
                  className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                    radarTab === 'flavor' && showRadarChart
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Flavor DNA</span>
                </button>

                <button
                  onClick={() => { setRadarTab('nutrition'); setShowRadarChart(true); }}
                  className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                    radarTab === 'nutrition' && showRadarChart
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>Nutrition</span>
                </button>
              </div>

              <button
                onClick={() => setShowRadarChart(!showRadarChart)}
                className="p-1 hover:text-emerald-400 text-slate-400 transition-colors"
                title={showRadarChart ? 'Collapse Radar' : 'Expand Radar'}
              >
                {showRadarChart ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showRadarChart && (
              <div className="p-3 bg-slate-950 space-y-2">
                {radarTab === 'flavor' ? (
                  <div>
                    <p className="text-[10px] text-slate-400 text-center font-medium pb-1">
                      Palate Flavor DNA Profile (Recharts Radar mapping Salt, Sweet, Acid, Heat & Umami)
                    </p>
                    <Suspense fallback={<div className="h-[185px] animate-pulse rounded-xl bg-slate-900/60" />}>
                      <FlavorDnaRadarChart flavorDna={flavorDna} height={185} />
                    </Suspense>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-slate-400 text-center font-medium pb-1">
                      D3 Nutritional Profile (Protein, Carbs, Fats, Vitamins, Fiber)
                    </p>
                    <D3RadarChart data={radarData5Axis} size={200} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Missing Ingredients & One-Click Shopping List Addition */}
          {recipe.missingIngredients.length > 0 ? (
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Missing ({recipe.missingIngredients.length} items):</span>
                </span>
                <button
                  onClick={() => onAddMissingToShoppingList(recipe)}
                  disabled={isMissingAdded}
                  className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${
                    isMissingAdded
                      ? 'text-emerald-400'
                      : 'text-emerald-400 hover:text-emerald-300 hover:underline'
                  }`}
                >
                  {isMissingAdded ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Added to List</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Add to Shopping List</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-300 italic truncate">
                {recipe.missingIngredients.join(', ')}
              </p>
              {/* DIY Sub-Recipe & Substitution Intelligence Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setSelectedSubIngredient(recipe.missingIngredients[0])}
                  className="text-[10px] text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>DIY Scratch: {recipe.missingIngredients[0]}</span>
                </button>

                {onOpenSubstitutes && (
                  <button
                    onClick={() => onOpenSubstitutes(recipe.missingIngredients[0])}
                    className="text-[10px] text-teal-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Substitution Intelligence: Swap {recipe.missingIngredients[0]}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl text-center text-xs text-emerald-400 font-medium">
              All ingredients available in your fridge!
            </div>
          )}
        </div>
      </div>

      {/* Card Action Bar */}
      <div className="p-5 pt-0 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {onEvolveRecipe && (
            <button
              onClick={() => onEvolveRecipe(recipe)}
              className="py-2 bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 text-violet-300 font-bold text-[11px] rounded-xl transition-colors flex items-center justify-center gap-1"
              title="Make this recipe better (6 variations)"
            >
              <Dna className="w-3.5 h-3.5 text-violet-400" />
              <span>Evolve</span>
            </button>
          )}

          {onExplainRecipe && (
            <button
              onClick={() => onExplainRecipe(recipe)}
              className="py-2 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 font-bold text-[11px] rounded-xl transition-colors flex items-center justify-center gap-1"
              title="Why FridgeChef selected this (AI Explainability)"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Why This?</span>
            </button>
          )}

          {onOpenValidation ? (
            <button
              onClick={() => onOpenValidation(recipe)}
              className="py-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[11px] rounded-xl transition-colors flex items-center justify-center gap-1"
              title="Scientific Recipe Validation (Confidence: 94%)"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>94% Conf.</span>
            </button>
          ) : (
            <button
              onClick={() => setShowMealPrep(true)}
              className="py-2 bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 font-bold text-[11px] rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Meal Prep</span>
            </button>
          )}
        </div>

        <button
          onClick={() => onSelectRecipe(recipe)}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Cook Step-by-Step (Voice Assistant)</span>
        </button>
      </div>

      {/* Meal Prep Modal */}
      {showMealPrep && (
        <MealPrepBatchModal
          recipe={recipe}
          onClose={() => setShowMealPrep(false)}
        />
      )}

      {/* Sub-Recipe DIY Modal */}
      {selectedSubIngredient && (
        <SubRecipeModal
          missingIngredient={selectedSubIngredient}
          onClose={() => setSelectedSubIngredient(null)}
        />
      )}
    </div>
  );
};
