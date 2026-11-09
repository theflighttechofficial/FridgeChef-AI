import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, ChefHat, Check, Heart, Play, AlertCircle, Activity, ChevronDown, ChevronUp, Layers, Dna, Brain, MoreVertical } from 'lucide-react';
import { D3RadarChart, NutritionPoint } from './D3RadarChart';
import { MealPrepBatchModal } from './MealPrepBatchModal';
import { SubRecipeModal } from './SubRecipeModal';

// recharts is heavy; load the flavor chart only when a card actually shows it
const FlavorDnaRadarChart = lazy(() =>
  import('./FlavorDnaRadarChart').then((m) => ({ default: m.FlavorDnaRadarChart }))
);
import { Recipe, FlavorDna } from '../types';

// Cover art when a recipe has no photo: an emoji for the dish and a colour from its cuisine,
// so a list of recipes doesn't look like the same picture repeated
const DISH_EMOJI: [RegExp, string][] = [
  [/biryani|pulao|fried rice|risotto|paella|jollof|rice|congee|khichdi|pongal/i, '🍚'],
  [/ramen|noodle|pho|laksa|udon|soba|pad thai|chow mein|thukpa|hakka|pancit/i, '🍜'],
  [/pasta|spaghetti|penne|lasagna|carbonara|gnocchi|mac and cheese|bolognese/i, '🍝'],
  [/pizza|flatbread/i, '🍕'], [/burger/i, '🍔'], [/taco|fajita|quesadilla|burrito|enchilada/i, '🌮'],
  [/wrap|roll|shawarma|kathi|banh mi|sandwich/i, '🌯'], [/salad|tabbouleh|fattoush|slaw/i, '🥗'],
  [/soup|stew|chowder|broth|jjigae|rasam|sambar|dal|harira|borscht/i, '🍲'], [/curry|masala|korma|vindaloo|tikka|makhani/i, '🍛'],
  [/salmon|fish|cod|tuna|ilish|ceviche/i, '🐟'], [/shrimp|prawn|crab|mussel|clam/i, '🦐'],
  [/steak|beef|lamb|mutton|kebab|kofta|bulgogi/i, '🥩'], [/chicken|wings|karaage/i, '🍗'], [/pork|bacon|sausage/i, '🥓'],
  [/egg|omelette|shakshuka|frittata|bhurji/i, '🍳'], [/tofu|edamame/i, '🥢'], [/paneer|cheese/i, '🧀'],
  [/dosa|idli|pancake|crepe|paratha|roti/i, '🥞'], [/cake|halwa|kheer|pudding|ladoo|dessert|brownie|pie/i, '🍮'],
  [/smoothie|lassi|chai|tea|coffee/i, '🥤'], [/eggplant|baingan|aubergine/i, '🍆'], [/potato|aloo/i, '🥔'],
];
const recipeArt = (recipe: Recipe) => {
  const text = `${recipe.title} ${recipe.description}`;
  const emoji = recipe.emoji || DISH_EMOJI.find(([re]) => re.test(text))?.[1] || '🍽️';
  let hash = 0;
  for (const ch of recipe.cuisine || recipe.title) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return { emoji, hue: hash };
};

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
  const [showDetails, setShowDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMealPrep, setShowMealPrep] = useState(false);
  const [selectedSubIngredient, setSelectedSubIngredient] = useState<string | null>(null);

  const art = recipeArt(recipe);
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const matchCount = recipe.matchedIngredients.length;
  const totalRequired = matchCount + recipe.missingIngredients.length;
  const matchPercent = totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 100;
  const basics = recipe.assumedIngredients || [];

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

  const menu = [
    onExplainRecipe && { label: 'Why this recipe?', icon: Brain, run: () => onExplainRecipe(recipe) },
    onEvolveRecipe && { label: 'Make it better', icon: Dna, run: () => onEvolveRecipe(recipe) },
    onOpenValidation && { label: 'Check the food science', icon: Activity, run: () => onOpenValidation(recipe) },
    { label: 'Meal prep for the week', icon: Layers, run: () => setShowMealPrep(true) },
  ].filter(Boolean) as { label: string; icon: typeof Brain; run: () => void }[];

  return (
    <div className="cv-auto relative bg-slate-900 rounded-[1.75rem] overflow-hidden flex flex-col group">
      {/* Cover */}
      <div className="relative h-36 w-full overflow-hidden">
        {recipe.imageUrl && !imageFailed ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full relative" style={{ background: `linear-gradient(135deg, oklch(42% 0.09 ${art.hue}), oklch(26% 0.05 ${art.hue}))` }}>
            <span aria-hidden="true" className="absolute right-6 top-1/2 -translate-y-1/2 text-7xl rotate-[-8deg] drop-shadow-xl">
              {art.emoji}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 h-7 px-3 rounded-full bg-emerald-200 text-emerald-950 font-semibold text-xs flex items-center">{matchPercent}% match</div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            try {
              navigator.vibrate?.(15);
            } catch {}
            onToggleSave(recipe);
          }}
          className={`absolute top-2 right-2 w-11 h-11 grid place-items-center rounded-full ${isSaved ? 'bg-rose-500 text-white' : 'bg-black/35 text-white'}`}
          aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
          aria-pressed={isSaved}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 flex-1">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">{recipe.cuisine}</p>
          <h3 className="text-lg font-semibold text-white leading-snug line-clamp-2">{recipe.title}</h3>
          <p className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {totalTime} min
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> {recipe.calories} kcal
            </span>
            <span>{recipe.difficulty}</span>
          </p>
        </div>

        {/* What you have, what is assumed, what you need */}
        <ul className="space-y-1.5 text-sm">
          {matchCount > 0 && (
            <li className="flex gap-2 text-slate-200">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              <span className="line-clamp-1">
                {matchCount} from your fridge: {recipe.matchedIngredients.join(', ')}
              </span>
            </li>
          )}
          {basics.length > 0 && (
            <li className="flex gap-2 text-slate-400">
              <ChefHat className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="line-clamp-1">Kitchen basics: {basics.join(', ')}</span>
            </li>
          )}
          {!!recipe.substitutions?.length && (
            <li className="flex gap-2 text-slate-400">
              <Layers className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{recipe.substitutions.map((sub) => `${sub.use} for ${sub.missing}`).join(', ')}</span>
            </li>
          )}
          {recipe.missingIngredients.length > 0 && (
            <li className="flex gap-2 items-start text-amber-200/90">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
              <span className="flex-1 line-clamp-1">Need: {recipe.missingIngredients.join(', ')}</span>
              <button
                onClick={() => onAddMissingToShoppingList(recipe)}
                disabled={isMissingAdded}
                className="shrink-0 text-xs font-semibold text-emerald-300 disabled:text-emerald-400/70"
              >
                {isMissingAdded ? 'Added' : 'Add to list'}
              </button>
            </li>
          )}
        </ul>

        {/* Details on demand */}
        {showDetails && (
          <div className="space-y-3 pt-1">
            <p className="text-sm text-slate-300 leading-relaxed">{recipe.description}</p>
            {recipe.dietaryTags.length > 0 && <p className="text-xs text-emerald-400/90">{recipe.dietaryTags.join(' · ')}</p>}
            <div className="grid grid-cols-3 gap-2 text-center">
              {(
                [
                  ['Protein', recipe.macros.protein],
                  ['Carbs', recipe.macros.carbs],
                  ['Fat', recipe.macros.fat],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-950 py-2">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">{k}</p>
                  <p className="text-sm font-semibold text-slate-200">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-1 p-1 rounded-full bg-slate-950 w-fit">
              {(['flavor', 'nutrition'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setRadarTab(t)}
                  className={`h-8 px-3 rounded-full text-xs font-semibold ${radarTab === t ? 'bg-secondary-container text-on-secondary-container' : 'text-slate-400'}`}
                >
                  {t === 'flavor' ? 'Flavour profile' : 'Nutrition'}
                </button>
              ))}
            </div>
            {radarTab === 'flavor' ? (
              <Suspense fallback={<div className="h-[185px] animate-pulse rounded-xl bg-slate-950/60" />}>
                <FlavorDnaRadarChart flavorDna={flavorDna} height={185} />
              </Suspense>
            ) : (
              <D3RadarChart data={radarData5Axis} size={200} />
            )}
            {recipe.missingIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedSubIngredient(recipe.missingIngredients[0])} className="h-9 px-3 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200 state-layer">
                  Make {recipe.missingIngredients[0]} from scratch
                </button>
                {onOpenSubstitutes && (
                  <button onClick={() => onOpenSubstitutes(recipe.missingIngredients[0])} className="h-9 px-3 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200 state-layer">
                    Swap {recipe.missingIngredients[0]}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button
          onClick={() => onSelectRecipe(recipe)}
          className="flex-1 h-12 bg-emerald-300 text-emerald-950 font-semibold text-sm rounded-full flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-emerald-950" />
          <span>Cook step by step</span>
        </button>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-12 h-12 grid place-items-center rounded-full border border-slate-700 text-slate-200 state-layer"
          aria-label={showDetails ? 'Hide details' : 'Show details'}
          aria-expanded={showDetails}
        >
          {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-12 h-12 grid place-items-center rounded-full border border-slate-700 text-slate-200 state-layer" aria-label="More actions" aria-expanded={menuOpen}>
            <MoreVertical className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.ul
                  initial={{ opacity: 0, scale: 0.92, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 bottom-14 z-20 w-60 py-2 rounded-2xl bg-surface-high shadow-2xl origin-bottom-right"
                  role="menu"
                >
                  {menu.map((m) => (
                    <li key={m.label}>
                      <button
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          m.run();
                        }}
                        className="w-full h-12 px-4 flex items-center gap-3 text-sm text-on-surface state-layer"
                      >
                        <m.icon className="w-5 h-5 text-on-surface-variant" /> {m.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              </>
            )}
          </AnimatePresence>
        </div>
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
