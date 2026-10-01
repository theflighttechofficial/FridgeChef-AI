import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence, Variants, MotionConfig } from 'framer-motion';
import { Reveal } from './components/Reveal';
import { LogoMark } from './components/Logo';
import { IntroShowreel } from './components/IntroShowreel';
import { LegalPage } from './components/LegalPage';
import { ContactPage, ThanksPage, NotFoundPage } from './components/StaticPages';
import { ConsentBanner } from './components/ConsentBanner';
import { setPageMeta } from './utils/seo';
import { track } from './utils/analytics';
import { Toaster } from './components/Toaster';
import { showToast, noteIfFallback } from './utils/toast';
import { Navbar } from './components/Navbar';
import { FridgeScanner } from './components/FridgeScanner';
import { SidebarFilter } from './components/SidebarFilter';
import { RecipeCard } from './components/RecipeCard';

import { BioEnvironmentBar } from './components/BioEnvironmentBar';
import { KitchenSoundscapePlayer } from './components/KitchenSoundscapePlayer';

import { EcologyArbitrageWidget } from './components/EcologyArbitrageWidget';

import { PantryEmergencyMode } from './components/PantryEmergencyMode';
import { EnergyApplianceRouter } from './components/EnergyApplianceRouter';
import { TupperwareTrackerWidget } from './components/TupperwareTrackerWidget';
import { FamilyPantrySyncWidget } from './components/FamilyPantrySyncWidget';

import { ExpirationSimulatorWidget } from './components/ExpirationSimulatorWidget';
import { HouseholdChoreLeaderboardWidget } from './components/HouseholdChoreLeaderboardWidget';
import { IOSDynamicIsland } from './components/IOSDynamicIsland';
import { AndroidMaterialYouFAB } from './components/AndroidMaterialYouFAB';
import { PantryHealthNotificationBanner } from './components/PantryHealthNotificationBanner';

import { HouseholdMemoryBanner } from './components/HouseholdMemoryBanner';
import { FridgeDigitalTwin } from './components/FridgeDigitalTwin';
import { AutonomousMealDecisionWidget } from './components/AutonomousMealDecisionWidget';
import { ContextAwareCookingBar } from './components/ContextAwareCookingBar';

import {
  Ingredient,
  Recipe,
  ShoppingItem,
  FilterOptions,
  PresetFridge,
  HouseholdMemoryProfile,
  SmartFridgeSensors,
  CookingTimeBudget,
  CookingMoodMode,
  CookingSkillAdaptationLevel,
} from './types';

import {
  INITIAL_PRESET_FRIDGES,
  INITIAL_RECIPES,
  INITIAL_SHOPPING_LIST,
  DEFAULT_HOUSEHOLD_MEMORY,
} from './data/sampleData';
import { usePersistentState } from './hooks/usePersistentState';

import { Utensils, RefreshCw, ChefHat, Bookmark } from 'lucide-react';

// Code-split: modals and non-default tabs load on demand to keep the initial bundle small
const StepByStepCookingModal = lazy(() => import('./components/StepByStepCookingModal').then((m) => ({ default: m.StepByStepCookingModal })));
const ShoppingListTab = lazy(() => import('./components/ShoppingListTab').then((m) => ({ default: m.ShoppingListTab })));
const MolecularLabTab = lazy(() => import('./components/MolecularLabTab').then((m) => ({ default: m.MolecularLabTab })));
const ARPlatingGuideModal = lazy(() => import('./components/ARPlatingGuideModal').then((m) => ({ default: m.ARPlatingGuideModal })));
const IronChefGameModal = lazy(() => import('./components/IronChefGameModal').then((m) => ({ default: m.IronChefGameModal })));
const AcousticSensoryLab = lazy(() => import('./components/AcousticSensoryLab').then((m) => ({ default: m.AcousticSensoryLab })));
const NeuroGastronomyModal = lazy(() => import('./components/NeuroGastronomyModal').then((m) => ({ default: m.NeuroGastronomyModal })));
const WeeklyMealPlannerWidget = lazy(() => import('./components/WeeklyMealPlannerWidget').then((m) => ({ default: m.WeeklyMealPlannerWidget })));
const GourmetSommelierWidget = lazy(() => import('./components/GourmetSommelierWidget').then((m) => ({ default: m.GourmetSommelierWidget })));
const HouseholdMemoryEngineModal = lazy(() => import('./components/HouseholdMemoryEngineModal').then((m) => ({ default: m.HouseholdMemoryEngineModal })));
const ReceiptScannerModal = lazy(() => import('./components/ReceiptScannerModal').then((m) => ({ default: m.ReceiptScannerModal })));
const IngredientSubstitutionLab = lazy(() => import('./components/IngredientSubstitutionLab').then((m) => ({ default: m.IngredientSubstitutionLab })));
const RecipeEvolutionModal = lazy(() => import('./components/RecipeEvolutionModal').then((m) => ({ default: m.RecipeEvolutionModal })));
const ChefPersonaEngineModal = lazy(() => import('./components/ChefPersonaEngineModal').then((m) => ({ default: m.ChefPersonaEngineModal })));
const PantryChallengeModal = lazy(() => import('./components/PantryChallengeModal').then((m) => ({ default: m.PantryChallengeModal })));
const WhyThisRecipeModal = lazy(() => import('./components/WhyThisRecipeModal').then((m) => ({ default: m.WhyThisRecipeModal })));
const GroceryPriceIntelligenceModal = lazy(() => import('./components/GroceryPriceIntelligenceModal').then((m) => ({ default: m.GroceryPriceIntelligenceModal })));
const PersonalNutritionDashboardModal = lazy(() => import('./components/PersonalNutritionDashboardModal').then((m) => ({ default: m.PersonalNutritionDashboardModal })));
const FoodWasteCarbonCalculatorModal = lazy(() => import('./components/FoodWasteCarbonCalculatorModal').then((m) => ({ default: m.FoodWasteCarbonCalculatorModal })));
const SmartFridgeSensorModal = lazy(() => import('./components/SmartFridgeSensorModal').then((m) => ({ default: m.SmartFridgeSensorModal })));
const FoodSafetyIntelligenceModal = lazy(() => import('./components/FoodSafetyIntelligenceModal').then((m) => ({ default: m.FoodSafetyIntelligenceModal })));
const DinnerForEveryoneModal = lazy(() => import('./components/DinnerForEveryoneModal').then((m) => ({ default: m.DinnerForEveryoneModal })));
const NaturalConversationalKitchenModal = lazy(() => import('./components/NaturalConversationalKitchenModal').then((m) => ({ default: m.NaturalConversationalKitchenModal })));
const RecipeKnowledgeGraphModal = lazy(() => import('./components/RecipeKnowledgeGraphModal').then((m) => ({ default: m.RecipeKnowledgeGraphModal })));
const ScientificValidationModal = lazy(() => import('./components/ScientificValidationModal').then((m) => ({ default: m.ScientificValidationModal })));
const PlatePhotoAnalysisModal = lazy(() => import('./components/PlatePhotoAnalysisModal').then((m) => ({ default: m.PlatePhotoAnalysisModal })));
const TastePreferenceLearningModal = lazy(() => import('./components/TastePreferenceLearningModal').then((m) => ({ default: m.TastePreferenceLearningModal })));
const EventCateringPlannerModal = lazy(() => import('./components/EventCateringPlannerModal').then((m) => ({ default: m.EventCateringPlannerModal })));
const PantryFinancialIntelligenceModal = lazy(() => import('./components/PantryFinancialIntelligenceModal').then((m) => ({ default: m.PantryFinancialIntelligenceModal })));
const AutonomousCulinaryAgentModal = lazy(() => import('./components/AutonomousCulinaryAgentModal').then((m) => ({ default: m.AutonomousCulinaryAgentModal })));

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

type SiteRoute = 'app' | 'terms' | 'privacy' | 'contact' | 'thanks' | 'notfound';

const readRoute = (): SiteRoute => {
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') return 'notfound';
  const h = window.location.hash;
  if (!h || h === '#' || h === '#/') return 'app';
  const known: Record<string, SiteRoute> = {
    '#/terms': 'terms',
    '#/privacy': 'privacy',
    '#/contact': 'contact',
    '#/thanks': 'thanks',
  };
  if (known[h]) return known[h];
  // In-page anchors (no leading slash) belong to the app; unknown #/routes are 404s
  return h.startsWith('#/') ? 'notfound' : 'app';
};

const TAB_META: Record<string, [string, string]> = {
  scan: ['Fridge Scanner', 'Photograph your fridge and FridgeChef lists what is inside and what to use first.'],
  recipes: ['Recipes', 'Recipes built from the ingredients already in your fridge, filtered by diet, time and cuisine.'],
  saved: ['Saved Recipes', 'Recipes you bookmarked in FridgeChef, kept on this device.'],
  shopping: ['Shopping List', 'Your FridgeChef shopping list, filled from missing recipe ingredients.'],
  molecular: ['Food Science Lab', 'Flavour chemistry, sizzle sounds and spoilage timing for the food in your fridge.'],
};

const DEFAULT_FILTERS: FilterOptions = {
  dietary: [],
  maxPrepTime: 60,
  difficulty: 'All',
  cuisine: 'All',
  searchQuery: '',
  sortBy: 'match',
};

// Skip items already on the list (case-insensitive) so repeated adds don't create duplicates
const mergeShoppingItems = (existing: ShoppingItem[], incoming: ShoppingItem[]) => {
  const seen = new Set(existing.filter((i) => !i.checked).map((i) => i.name.trim().toLowerCase()));
  const fresh = incoming.filter((i) => {
    const key = i.name.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return fresh.length ? [...existing, ...fresh] : existing;
};

// Normalize AI step payloads; drop empty steps so the cooking modal never renders blanks
const normalizeSteps = (steps: any[] | undefined) =>
  (Array.isArray(steps) ? steps : [])
    .filter((st) => st && typeof st.instruction === 'string' && st.instruction.trim())
    .map((st, sIdx) => ({
      stepNumber: st.stepNumber || sIdx + 1,
      instruction: st.instruction,
      timerSeconds: st.timerSeconds || undefined,
      keyIngredients: st.keyIngredients || [],
      chefTip: st.chefTip,
    }));

const ModalFallback = () => (
  <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center" role="status" aria-label="Loading">
    <div className="w-10 h-10 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin" />
  </div>
);

// Placeholder shaped like a RecipeCard, shown while new recipes are being generated
const RecipeCardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-800/70" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-2/3 rounded bg-slate-800" />
      <div className="h-3 w-full rounded bg-slate-800/70" />
      <div className="h-3 w-5/6 rounded bg-slate-800/70" />
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="h-10 rounded-lg bg-slate-800/70" />
        <div className="h-10 rounded-lg bg-slate-800/70" />
        <div className="h-10 rounded-lg bg-slate-800/70" />
      </div>
      <div className="h-10 rounded-xl bg-slate-800 mt-3" />
    </div>
  </div>
);

const SectionFallback = () => (
  <div className="h-40 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
);

export default function App() {
  // Navigation State - Default to 'scan' as the primary tab
  // Hash routes for standalone pages. Any unknown path or #/route shows the 404 page.
  const [route, setRoute] = useState<SiteRoute>(readRoute);
  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Intro showreel plays once per browser session
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return sessionStorage.getItem('fridgechef.introSeen') !== '1';
    } catch {
      return true;
    }
  });
  const dismissIntro = useCallback(() => {
    try {
      sessionStorage.setItem('fridgechef.introSeen', '1');
    } catch {}
    setShowIntro(false);
  }, []);

  const [activeTab, setActiveTab] = useState<'scan' | 'recipes' | 'shopping' | 'saved' | 'molecular'>('scan');

  // Per-view title/description + anonymous page view (only sent with consent)
  useEffect(() => {
    if (route !== 'app') return;
    if (showIntro) {
      setPageMeta('FridgeChef', 'Photograph your fridge and FridgeChef suggests a meal from what you already have, then talks you through cooking it.');
      track('page_view', { page: 'intro' });
      return;
    }
    const [title, description] = TAB_META[activeTab];
    setPageMeta(title, description);
    track('page_view', { page: activeTab });
  }, [activeTab, showIntro, route]);

  // Modals
  const [isIronChefOpen, setIsIronChefOpen] = useState(false);
  const [isARPlatingOpen, setIsARPlatingOpen] = useState(false);
  const [isNeuroOpen, setIsNeuroOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isSubstitutionsModalOpen, setIsSubstitutionsModalOpen] = useState(false);
  const [substitutionTargetIngredient, setSubstitutionTargetIngredient] = useState('Parmesan Cheese');

  // New Modals State
  const [evolvingRecipe, setEvolvingRecipe] = useState<Recipe | null>(null);
  const [explainabilityRecipe, setExplainabilityRecipe] = useState<Recipe | null>(null);
  const [isChefPersonaOpen, setIsChefPersonaOpen] = useState(false);
  const [isPantryChallengeOpen, setIsPantryChallengeOpen] = useState(false);
  const [isBudgetModeOpen, setIsBudgetModeOpen] = useState(false);

  // Features 11-16 Modals State
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isCarbonModalOpen, setIsCarbonModalOpen] = useState(false);
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [isFoodSafetyModalOpen, setIsFoodSafetyModalOpen] = useState(false);
  const [isDinnerForEveryoneOpen, setIsDinnerForEveryoneOpen] = useState(false);
  const [isKitchenVoiceOpen, setIsKitchenVoiceOpen] = useState(false);

  // Features 17-25 Modals & Context States
  const [isKnowledgeGraphOpen, setIsKnowledgeGraphOpen] = useState(false);
  const [validationRecipe, setValidationRecipe] = useState<Recipe | null>(null);
  const [isPlateAnalysisOpen, setIsPlateAnalysisOpen] = useState(false);
  const [isTasteModalOpen, setIsTasteModalOpen] = useState(false);
  const [isCateringModalOpen, setIsCateringModalOpen] = useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [isAutonomousAgentOpen, setIsAutonomousAgentOpen] = useState(false);

  // Context-Aware Cooking Settings
  const [selectedTimeBudget, setSelectedTimeBudget] = useState<CookingTimeBudget>('30 min');
  const [selectedMoodMode, setSelectedMoodMode] = useState<CookingMoodMode>('Standard');
  const [cookingSkillLevel, setCookingSkillLevel] = useState<CookingSkillAdaptationLevel>('Intermediate');

  // IoT Sensor Telemetry State
  const [sensorsState, setSensorsState] = useState<SmartFridgeSensors>({
    temperatureCelsius: 3.8,
    humidityPercent: 84,
    doorState: 'Closed',
    doorOpenDurationSeconds: 14,
    doorOpenCountToday: 4,
    isAnomalyActive: false,
    anomalyMessage: 'Temperature normal',
    shelfWeightSensorKg: 12.4,
    gasOdorIndexPpm: 12,
    ethyleneGasLevelPpm: 0.8,
    lastSyncTimestamp: 'Just now',
  });

  const toggleSensorAnomaly = () => {
    setSensorsState((prev) => ({
      ...prev,
      isAnomalyActive: !prev.isAnomalyActive,
      temperatureCelsius: !prev.isAnomalyActive ? 8.1 : 3.8,
      doorState: !prev.isAnomalyActive ? 'Ajar' : 'Closed',
      anomalyMessage: !prev.isAnomalyActive
        ? 'Fridge temperature increased from 3.8°C → 8.1°C for 27 minutes.'
        : 'Temperature normal',
    }));
  };

  // Household Memory Engine State
  const [memoryProfile, setMemoryProfile] = useState<HouseholdMemoryProfile>(DEFAULT_HOUSEHOLD_MEMORY);

  // Core Data States
  const [presetFridges] = useState<PresetFridge[]>(INITIAL_PRESET_FRIDGES);
  const [currentIngredients, setCurrentIngredients] = useState<Ingredient[]>(
    INITIAL_PRESET_FRIDGES[0]?.ingredients || []
  );
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [savedRecipes, setSavedRecipes] = usePersistentState<Recipe[]>('fridgechef.savedRecipes', []);
  const [shoppingList, setShoppingList] = usePersistentState<ShoppingItem[]>('fridgechef.shoppingList', INITIAL_SHOPPING_LIST);

  // Cooking Modal State
  const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);

  // Added Missing Items Tracker
  const [addedShoppingRecipeIds, setAddedShoppingRecipeIds] = useState<string[]>([]);

  // Loading States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);

  // Filter Options State
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  // Handle Preset Fridge Selection
  const handleSelectPreset = (preset: PresetFridge) => {
    setCurrentIngredients(preset.ingredients);
  };

  // Handle AI Photo Analysis (Calls Server-Side Gemini API)
  const handleAnalyzeImage = async (imageBase64: string, extraNote?: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-fridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, extraPrompt: extraNote }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze fridge photo');
      }
      noteIfFallback(response);

      const data = await response.json();

      if (data.detectedIngredients && data.detectedIngredients.length > 0) {
        const formattedIngredients: Ingredient[] = data.detectedIngredients.map(
          (item: any, idx: number) => ({
            id: `ai-${Date.now()}-${idx}`,
            name: item.name,
            category: item.category || 'Produce',
            freshness: item.freshness || 'Fresh',
            quantity: item.quantity || '1 item',
            confidence: item.confidence || 0.9,
          })
        );
        setCurrentIngredients(formattedIngredients);
      }

      if (data.suggestedRecipes && data.suggestedRecipes.length > 0) {
        const formattedRecipes: Recipe[] = data.suggestedRecipes.map(
          (rec: any, idx: number) => ({
            id: `ai-recipe-${Date.now()}-${idx}`,
            title: rec.title,
            description: rec.description,
            prepTimeMinutes: rec.prepTimeMinutes || 15,
            cookTimeMinutes: rec.cookTimeMinutes || 15,
            calories: rec.calories || 400,
            difficulty: rec.difficulty || 'Easy',
            dietaryTags: rec.dietaryTags || [],
            cuisine: rec.cuisine || 'Global',
            matchedIngredients: rec.matchedIngredients || [],
            missingIngredients: rec.missingIngredients || [],
            macros: rec.macros || { protein: '25g', carbs: '30g', fat: '15g' },
            servings: rec.servings || 2,
            chefTip: rec.chefTip || 'Enjoy cooking!',
            imageUrl: INITIAL_RECIPES[idx % INITIAL_RECIPES.length]?.imageUrl,
            steps: normalizeSteps(rec.steps),
          })
        );

        const validRecipes = formattedRecipes.filter((r) => r.title);
        if (validRecipes.length) {
          setRecipes(validRecipes);
          setActiveTab('recipes');
        }
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      showToast("Couldn't read that photo. Check your connection or try a clearer picture.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Recipes from Current Ingredient List + Filters
  const handleGenerateRecipesFromIngredients = async () => {
    setIsGeneratingRecipes(true);
    try {
      const ingredientNames = currentIngredients.map((i) => i.name);
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredientNames,
          dietary: filters.dietary,
          maxPrepTime: filters.maxPrepTime,
          difficulty: filters.difficulty === 'All' ? undefined : filters.difficulty,
          cuisine: filters.cuisine === 'All' ? undefined : filters.cuisine,
          regionalTaxonomy: [
            'North Indian (Mughlai, Butter/Kadai Gravies, Palak Paneer, Dal Makhani)',
            'South Indian (Chettinad Pepper Fry, Malabar Coconut, Keralite Stew, Hyderabadi Dum)',
            'American (Southern BBQ, New England Coastal, Tex-Mex Smash & Diner Bowls)',
            'Pan-Asian (Japanese Washoku/Katsu, Thai Street Red/Green Curry, Chinese Sichuan, Korean Bunsik)'
          ],
          taxonomyRequirement: 'Explicitly categorize recipes into distinct regional taxonomy buckets (North Indian, South Indian, American, Pan-Asian: Japanese/Thai/Chinese/Korean) to guarantee balanced cuisine discovery with both vegetarian and non-vegetarian ingredient pairings.',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate customized recipes');
      }
      noteIfFallback(response);

      const data = await response.json();

      if (data.recipes && data.recipes.length > 0) {
        const formattedRecipes: Recipe[] = data.recipes.map((rec: any, idx: number) => ({
          id: rec.id || `gen-${Date.now()}-${idx}`,
          title: rec.title,
          description: rec.description,
          prepTimeMinutes: rec.prepTimeMinutes || 12,
          cookTimeMinutes: rec.cookTimeMinutes || 15,
          calories: rec.calories || 420,
          difficulty: rec.difficulty || 'Easy',
          dietaryTags: rec.dietaryTags || filters.dietary,
          cuisine: rec.cuisine || 'Chef Special',
          matchedIngredients: rec.matchedIngredients || ingredientNames.slice(0, 4),
          missingIngredients: rec.missingIngredients || [],
          macros: rec.macros || { protein: '28g', carbs: '25g', fat: '18g' },
          servings: rec.servings || 2,
          chefTip: rec.chefTip || 'Cook with fresh organic ingredients for best flavor.',
          imageUrl: INITIAL_RECIPES[idx % INITIAL_RECIPES.length]?.imageUrl,
          steps: normalizeSteps(rec.steps),
        }));

        const validRecipes = formattedRecipes.filter((r) => r.title);
        if (validRecipes.length) {
          setRecipes(validRecipes);
          setActiveTab('recipes');
        }
      }
    } catch (err) {
      console.error('Error generating recipes:', err);
      showToast("Couldn't generate new recipes right now. Showing the current list.");
    } finally {
      setIsGeneratingRecipes(false);
    }
  };

  // Handle Receipt -> Pantry AI import
  const handleImportReceiptFromAI = (newIngredients: Ingredient[]) => {
    setCurrentIngredients((prev) => {
      const existingNames = new Set(prev.map(i => i.name.toLowerCase()));
      const filteredNew = newIngredients.filter(i => !existingNames.has(i.name.toLowerCase()));
      return [...filteredNew, ...prev];
    });
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate([20, 40, 20]);
      } catch (e) {}
    }
  };

  // Add Missing Ingredients to Shopping List
  const handleAddMissingToShoppingList = (recipe: Recipe) => {
    if (recipe.missingIngredients.length === 0 || addedShoppingRecipeIds.includes(recipe.id)) return;

    const newItems: ShoppingItem[] = recipe.missingIngredients.map((item, idx) => ({
      id: `shop-${Date.now()}-${idx}`,
      name: item,
      quantity: '1 package',
      category: 'Pantry',
      addedFromRecipe: recipe.title,
      checked: false,
      addedAt: new Date().toISOString().split('T')[0],
    }));

    setShoppingList((prev) => mergeShoppingItems(prev, newItems));
    setAddedShoppingRecipeIds((prev) => [...prev, recipe.id]);
  };

  const handleAddCustomIngredientNamesToShoppingList = useCallback((ingredientNames: string[]) => {
    const newItems: ShoppingItem[] = ingredientNames.map((item, idx) => ({
      id: `shop-${Date.now()}-${idx}`,
      name: item,
      quantity: '1 package',
      category: 'Pantry',
      addedFromRecipe: '7-Day AI Meal Planner',
      checked: false,
      addedAt: new Date().toISOString().split('T')[0],
    }));

    setShoppingList((prev) => mergeShoppingItems(prev, newItems));
  }, []);

  // Save / Bookmark Recipe
  const handleToggleSaveRecipe = (recipe: Recipe) => {
    setSavedRecipes((prev) =>
      prev.some((r) => r.id === recipe.id) ? prev.filter((r) => r.id !== recipe.id) : [...prev, recipe]
    );
  };

  const savedRecipeIds = useMemo(() => new Set(savedRecipes.map((r) => r.id)), [savedRecipes]);

  // Filtered & Sorted Recipes Computation
  const filteredRecipes = useMemo(() => {
    const listToFilter = activeTab === 'saved' ? savedRecipes : recipes;

    return listToFilter
      .filter((recipe) => {
        if (filters.dietary.length > 0) {
          const satisfiesDietary = filters.dietary.every((req) =>
            recipe.dietaryTags.some((t) => t.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(t.toLowerCase()))
          );
          if (!satisfiesDietary) return false;
        }

        const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
        if (filters.maxPrepTime > 0 && filters.maxPrepTime < 60 && totalTime > filters.maxPrepTime) {
          return false;
        }

        if (filters.difficulty !== 'All' && recipe.difficulty !== filters.difficulty) {
          return false;
        }

        if (filters.cuisine !== 'All' && !recipe.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())) {
          return false;
        }

        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesTitle = recipe.title.toLowerCase().includes(q);
          const matchesDesc = recipe.description.toLowerCase().includes(q);
          const matchesCuisine = recipe.cuisine.toLowerCase().includes(q);
          const matchesIng = recipe.matchedIngredients.some((i) => i.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesCuisine && !matchesIng) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'match') {
          return b.matchedIngredients.length - a.matchedIngredients.length;
        } else if (filters.sortBy === 'time') {
          return (
            a.prepTimeMinutes + a.cookTimeMinutes - (b.prepTimeMinutes + b.cookTimeMinutes)
          );
        } else if (filters.sortBy === 'calories') {
          return a.calories - b.calories;
        }
        return 0;
      });
  }, [recipes, savedRecipes, activeTab, filters]);

  // Shopping List Handlers
  const handleToggleCheckShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleRemoveShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddCustomShoppingItem = (name: string, category: string, quantity: string) => {
    const newItem: ShoppingItem = {
      id: `custom-shop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      category,
      quantity,
      checked: false,
      addedAt: new Date().toISOString().split('T')[0],
    };
    setShoppingList((prev) => [...prev, newItem]);
  };

  const handleClearCheckedShopping = () => {
    setShoppingList((prev) => prev.filter((i) => !i.checked));
  };

  if (route !== 'app') {
    return (
      <>
        {route === 'terms' || route === 'privacy' ? (
          <LegalPage doc={route} />
        ) : route === 'contact' ? (
          <ContactPage />
        ) : route === 'thanks' ? (
          <ThanksPage />
        ) : (
          <NotFoundPage />
        )}
        <ConsentBanner />
      </>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
    <AnimatePresence>{showIntro && <IntroShowreel onContinue={dismissIntro} />}</AnimatePresence>
    <Toaster />
    <ConsentBanner />
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pt-12 md:pt-0">
      {/* Floating iOS Dynamic Island */}
      <IOSDynamicIsland
        activeTab={activeTab}
        currentIngredientsCount={currentIngredients.length}
        sensorAnomaly={sensorsState.isAnomalyActive}
        onOpenSensorModal={() => setIsSensorModalOpen(true)}
      />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shoppingListCount={shoppingList.length}
        savedCount={savedRecipes.length}
        onQuickScanClick={() => setActiveTab('scan')}
        onOpenIronChefModal={() => setIsIronChefOpen(true)}
        onOpenARPlatingModal={() => setIsARPlatingOpen(true)}
        onOpenNeuroModal={() => setIsNeuroOpen(true)}
        onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        onOpenReceiptModal={() => setIsReceiptModalOpen(true)}
        onOpenSubstitutionsModal={() => setIsSubstitutionsModalOpen(true)}
        onOpenChefPersonaModal={() => setIsChefPersonaOpen(true)}
        onOpenPantryChallengeModal={() => setIsPantryChallengeOpen(true)}
        onOpenBudgetModeModal={() => setIsBudgetModeOpen(true)}
        onOpenNutritionModal={() => setIsNutritionModalOpen(true)}
        onOpenCarbonModal={() => setIsCarbonModalOpen(true)}
        onOpenSensorModal={() => setIsSensorModalOpen(true)}
        onOpenFoodSafetyModal={() => setIsFoodSafetyModalOpen(true)}
        onOpenDinnerForEveryoneModal={() => setIsDinnerForEveryoneOpen(true)}
        onOpenKitchenVoiceModal={() => setIsKitchenVoiceOpen(true)}
        onOpenKnowledgeGraphModal={() => setIsKnowledgeGraphOpen(true)}
        onOpenPlateAnalysisModal={() => setIsPlateAnalysisOpen(true)}
        onOpenTasteModal={() => setIsTasteModalOpen(true)}
        onOpenCateringModal={() => setIsCateringModalOpen(true)}
        onOpenFinancialModal={() => setIsFinancialModalOpen(true)}
        onOpenAutonomousAgentModal={() => setIsAutonomousAgentOpen(true)}
      />

      {/* Main Body Content Container - Full Width Page Extension & Responsive Screen Optimization */}
      <main className="flex-1 w-full px-3 sm:px-6 lg:px-12 py-6 pb-24 md:pb-10 space-y-6">
        {/* Pantry Health Expiration Notification Alert Banner */}
        <PantryHealthNotificationBanner
          ingredients={currentIngredients}
          onStartCookingFromAlert={() => setActiveTab('recipes')}
        />

        {/* 🧠 Household Memory Engine Proactive Insight Banner */}
        <HouseholdMemoryBanner
          memoryProfile={memoryProfile}
          onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        />

        <AnimatePresence mode="wait">
          {/* Tab 1: Fridge Scanner */}
          {activeTab === 'scan' && (
            <motion.div
              key="tab-scan"
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Primary Fridge Scanner: Snap Your Open Fridge. Let AI cook the perfect meal. */}
              <FridgeScanner
                presetFridges={presetFridges}
                currentIngredients={currentIngredients}
                onIngredientsChange={setCurrentIngredients}
                onAnalyzeImage={handleAnalyzeImage}
                onSelectPreset={handleSelectPreset}
                onGenerateRecipes={handleGenerateRecipesFromIngredients}
                isAnalyzing={isAnalyzing || isGeneratingRecipes}
              />

              {/* 🤖 Autonomous Meal Decision Engine: What Should Be Cooked Right Now? */}
              <Reveal>
                <AutonomousMealDecisionWidget
                  ingredients={currentIngredients}
                  memoryProfile={memoryProfile}
                  onStartCookingRecipe={(rec) => setCookingRecipe(rec)}
                />
              </Reveal>

              {/* 🧊 Flagship Fridge Digital Twin */}
              <Reveal>
                <FridgeDigitalTwin
                  ingredients={currentIngredients}
                  onSelectIngredientToCook={(ingName) => {
                    setFilters((prev) => ({ ...prev, searchQuery: ingName }));
                    setActiveTab('recipes');
                  }}
                />
              </Reveal>
              <Reveal>
                <PantryEmergencyMode onStartCooking={setCookingRecipe} />
              </Reveal>

              {/* Bio-Sync, Soundscape & Energy Appliance Bar Pushed Below Emergency Filter */}
              <Reveal>
                <BioEnvironmentBar />
              </Reveal>
              <Reveal>
                <KitchenSoundscapePlayer />
              </Reveal>
              <Reveal>
                <EnergyApplianceRouter />
              </Reveal>

              <Reveal>
                <TupperwareTrackerWidget />
              </Reveal>
              <Reveal>
                <FamilyPantrySyncWidget />
              </Reveal>
              <Reveal>
                <ExpirationSimulatorWidget />
              </Reveal>
              <Reveal>
                <HouseholdChoreLeaderboardWidget />
              </Reveal>
              <Reveal>
                <Suspense fallback={<SectionFallback />}>
                  <AcousticSensoryLab />
                </Suspense>
              </Reveal>
              <Reveal>
                <EcologyArbitrageWidget />
              </Reveal>
            </motion.div>
          )}

        {/* Tab 2 & 4: Recipe Discovery & Saved Recipes */}
        {(activeTab === 'recipes' || activeTab === 'saved') && (
          <motion.div
            key="tab-recipes"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                  <Utensils className="w-7 h-7 text-emerald-400" />
                  <span>
                    {activeTab === 'saved' ? 'Your Saved Recipes' : 'Discovered Culinary Recipes'}
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Matched against {currentIngredients.length} ingredients from your fridge stash.
                </p>
              </div>

              {activeTab === 'recipes' && (
                <button
                  onClick={handleGenerateRecipesFromIngredients}
                  disabled={isGeneratingRecipes}
                  className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 self-start sm:self-auto disabled:opacity-50 btn-sheen"
                >
                  <RefreshCw className={`w-4 h-4 ${isGeneratingRecipes ? 'animate-spin' : ''}`} />
                  <span>Regenerate AI Recipes</span>
                </button>
              )}
            </div>

            {/* Context-Aware Cooking Settings Bar */}
            <ContextAwareCookingBar
              selectedTime={selectedTimeBudget}
              onSelectTime={setSelectedTimeBudget}
              selectedMood={selectedMoodMode}
              onSelectMood={setSelectedMoodMode}
              skillLevel={cookingSkillLevel}
              onSelectSkillLevel={setCookingSkillLevel}
            />

            {/* Layout: Sidebar Filter (4 cols) + Grid (8 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
              <div className="lg:col-span-4 xl:col-span-3">
                <SidebarFilter
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={resetFilters}
                  totalRecipesCount={filteredRecipes.length}
                />
              </div>

              <div className="lg:col-span-8 xl:col-span-9">
                {(isGeneratingRecipes || isAnalyzing) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 min-[2200px]:grid-cols-4 gap-4 sm:gap-6" aria-busy="true" aria-label="Generating recipes">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <RecipeCardSkeleton key={i} />
                    ))}
                  </div>
                ) : activeTab === 'saved' && savedRecipes.length === 0 ? (
                  <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                    <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
                    <h3 className="text-lg font-bold text-white">No saved recipes yet</h3>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto">
                      Tap the bookmark on any recipe card to keep it here. Saved recipes stay on this device.
                    </p>
                    <button
                      onClick={() => setActiveTab('recipes')}
                      className="px-4 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs rounded-xl"
                    >
                      Browse recipes
                    </button>
                  </div>
                ) : filteredRecipes.length === 0 ? (
                  <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                    <ChefHat className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-lg font-bold text-white">No recipes match your filters!</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try unchecking dietary restrictions or expanding max prep time in the filter sidebar.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <motion.div
                    key={`${activeTab}-${filters.sortBy}-${filters.difficulty}-${filters.cuisine}-${filters.dietary.join(',')}-${filters.searchQuery}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 min-[2200px]:grid-cols-4 gap-4 sm:gap-6"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredRecipes.map((recipe) => (
                        <motion.div
                          key={recipe.id}
                          variants={itemVariants}
                          layout
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        >
                          <RecipeCard
                            recipe={recipe}
                            onSelectRecipe={setCookingRecipe}
                            onAddMissingToShoppingList={handleAddMissingToShoppingList}
                            isSaved={savedRecipeIds.has(recipe.id)}
                            onToggleSave={handleToggleSaveRecipe}
                            isMissingAdded={addedShoppingRecipeIds.includes(recipe.id)}
                            onOpenSubstitutes={(ingName) => {
                              setSubstitutionTargetIngredient(ingName);
                              setIsSubstitutionsModalOpen(true);
                            }}
                            onEvolveRecipe={(r) => setEvolvingRecipe(r)}
                            onExplainRecipe={(r) => setExplainabilityRecipe(r)}
                            onOpenValidation={(r) => setValidationRecipe(r)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>

            {/* AI Weekly Meal Planner & Gourmet Beverage Sommelier */}
            <Reveal>
            <Suspense fallback={<SectionFallback />}>
              <WeeklyMealPlannerWidget
                currentIngredients={currentIngredients}
                recipes={recipes}
                onAddMissingToShoppingList={handleAddCustomIngredientNamesToShoppingList}
              />
              <GourmetSommelierWidget />
            </Suspense>
            </Reveal>

            {/* Global Status Bars below recipe discovery */}
            <Reveal className="pt-6 border-t border-slate-800 space-y-6">
              <BioEnvironmentBar />
              <KitchenSoundscapePlayer />
              <EnergyApplianceRouter />
            </Reveal>
          </motion.div>
        )}

        {/* Tab 3: Molecular & Physics Lab */}
        {activeTab === 'molecular' && (
          <motion.div
            key="tab-molecular"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <Suspense fallback={<SectionFallback />}>
              <MolecularLabTab currentIngredients={currentIngredients} />
              <AcousticSensoryLab />
            </Suspense>
          </motion.div>
        )}

        {/* Tab 5: Shopping List */}
        {activeTab === 'shopping' && (
          <motion.div
            key="tab-shopping"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <Suspense fallback={<SectionFallback />}>
              <ShoppingListTab
                items={shoppingList}
                onToggleCheck={handleToggleCheckShoppingItem}
                onRemoveItem={handleRemoveShoppingItem}
                onAddItem={handleAddCustomShoppingItem}
                onClearChecked={handleClearCheckedShopping}
                onClearAll={() => setShoppingList([])}
              />
            </Suspense>
            <Reveal>
              <EcologyArbitrageWidget />
            </Reveal>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Android Material You Floating Action Button */}
      <AndroidMaterialYouFAB
        onQuickSnapClick={() => setActiveTab('scan')}
        onOpenIronChefModal={() => setIsIronChefOpen(true)}
        onOpenEmergencyPantry={() => setActiveTab('scan')}
        onOpenReceiptModal={() => setIsReceiptModalOpen(true)}
        onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        onOpenChefPersonaModal={() => setIsChefPersonaOpen(true)}
        onOpenPantryChallengeModal={() => setIsPantryChallengeOpen(true)}
        onOpenBudgetModeModal={() => setIsBudgetModeOpen(true)}
        onOpenKitchenVoiceModal={() => setIsKitchenVoiceOpen(true)}
        onOpenNutritionModal={() => setIsNutritionModalOpen(true)}
        onOpenFoodSafetyModal={() => setIsFoodSafetyModalOpen(true)}
        onOpenAutonomousAgentModal={() => setIsAutonomousAgentOpen(true)}
        onOpenKnowledgeGraphModal={() => setIsKnowledgeGraphOpen(true)}
        onOpenPlateAnalysisModal={() => setIsPlateAnalysisOpen(true)}
      />

      <Suspense fallback={<ModalFallback />}>
      {/* 🧠 Recipe Knowledge Graph Modal */}
      {isKnowledgeGraphOpen && (
        <RecipeKnowledgeGraphModal
          isOpen
          onClose={() => setIsKnowledgeGraphOpen(false)}
          onSelectRecipeNode={(title) => {
            setFilters((prev) => ({ ...prev, searchQuery: title.split(' ')[0] }));
            setActiveTab('recipes');
          }}
        />
      )}

      {/* 🔬 AI Recipe Scientific Validation Modal */}
      {validationRecipe && (
        <ScientificValidationModal
          isOpen={!!validationRecipe}
          onClose={() => setValidationRecipe(null)}
          recipe={validationRecipe}
        />
      )}

      {/* 📷 Plate Photo -> Food & Plating Analysis Modal */}
      {isPlateAnalysisOpen && (
        <PlatePhotoAnalysisModal
          isOpen
          onClose={() => setIsPlateAnalysisOpen(false)}
        />
      )}

      {/* 🧠 Taste Preference Learning Model Modal */}
      {isTasteModalOpen && (
        <TastePreferenceLearningModal
          isOpen
          onClose={() => setIsTasteModalOpen(false)}
          recentMealTitle={recipes[0]?.title || 'Garlic Chicken & Spinach Skillet'}
        />
      )}

      {/* 🎉 Event / Guest Mode Catering Planner Modal */}
      {isCateringModalOpen && (
        <EventCateringPlannerModal
          isOpen
          onClose={() => setIsCateringModalOpen(false)}
          availableIngredients={currentIngredients}
          onAddMissingToShoppingList={(items) => handleAddCustomIngredientNamesToShoppingList(items)}
        />
      )}

      {/* 🧾 Pantry Financial Intelligence Modal */}
      {isFinancialModalOpen && (
        <PantryFinancialIntelligenceModal
          isOpen
          onClose={() => setIsFinancialModalOpen(false)}
        />
      )}

      {/* 🤖 Autonomous Culinary Operating System Agent Modal */}
      {isAutonomousAgentOpen && (
        <AutonomousCulinaryAgentModal
          isOpen
          onClose={() => setIsAutonomousAgentOpen(false)}
          availableIngredients={currentIngredients}
          onStartCookingRecipe={(rec) => setCookingRecipe(rec)}
          onSyncShoppingList={(items) => handleAddCustomIngredientNamesToShoppingList(items)}
        />
      )}

      {/* 📊 Personal Nutrition Dashboard Modal */}
      {isNutritionModalOpen && (
        <PersonalNutritionDashboardModal
          isOpen
          onClose={() => setIsNutritionModalOpen(false)}
          onSelectBalancingMeal={(meal) => {
            setFilters((prev) => ({ ...prev, searchQuery: meal.split(' ')[0] }));
            setActiveTab('recipes');
          }}
        />
      )}

      {/* 🌍 Food Waste Carbon & Water Calculator Modal */}
      {isCarbonModalOpen && (
        <FoodWasteCarbonCalculatorModal
          isOpen
          onClose={() => setIsCarbonModalOpen(false)}
        />
      )}

      {/* 🌡️ Smart Fridge Sensor IoT Hub Modal */}
      {isSensorModalOpen && (
        <SmartFridgeSensorModal
          isOpen
          onClose={() => setIsSensorModalOpen(false)}
          sensors={sensorsState}
          onToggleAnomaly={toggleSensorAnomaly}
        />
      )}

      {/* ⚖️ Food Safety Intelligence Modal */}
      {isFoodSafetyModalOpen && (
        <FoodSafetyIntelligenceModal
          isOpen
          onClose={() => setIsFoodSafetyModalOpen(false)}
          ingredients={currentIngredients}
        />
      )}

      {/* 🧑🤝🧑 Multi-Person Household: "Dinner for Everyone" Modal */}
      {isDinnerForEveryoneOpen && (
        <DinnerForEveryoneModal
          isOpen
          onClose={() => setIsDinnerForEveryoneOpen(false)}
          availableIngredients={currentIngredients}
          onStartCookingRecipe={(rec) => setCookingRecipe(rec)}
        />
      )}

      {/* 🗣️ Natural Conversational Kitchen Voice Agent Modal */}
      {isKitchenVoiceOpen && (
        <NaturalConversationalKitchenModal
          isOpen
          onClose={() => setIsKitchenVoiceOpen(false)}
          availableIngredients={currentIngredients}
          onStartCookingRecipe={(rec) => setCookingRecipe(rec)}
        />
      )}

      {/* 🧠 Household Memory Engine Modal */}
      {isMemoryModalOpen && (
        <HouseholdMemoryEngineModal
          isOpen
          onClose={() => setIsMemoryModalOpen(false)}
          memoryProfile={memoryProfile}
          onUpdateProfile={(updated) => setMemoryProfile(updated)}
          currentIngredients={currentIngredients}
        />
      )}

      {/* 📸 Receipt -> Pantry AI Modal */}
      {isReceiptModalOpen && (
        <ReceiptScannerModal
          isOpen
          onClose={() => setIsReceiptModalOpen(false)}
          onImportToFridge={(newItems) => handleImportReceiptFromAI(newItems)}
        />
      )}

      {/* 🧬 Ingredient Substitution Intelligence Modal / Drawer */}
      {isSubstitutionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto">
            <IngredientSubstitutionLab
              currentIngredients={currentIngredients}
              initialTargetIngredient={substitutionTargetIngredient}
              onClose={() => setIsSubstitutionsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 🧪 Recipe Evolution Engine Modal (Make This Recipe Better) */}
      {evolvingRecipe && (
        <RecipeEvolutionModal
          isOpen={!!evolvingRecipe}
          onClose={() => setEvolvingRecipe(null)}
          baseRecipe={evolvingRecipe}
          onStartCookingEvolution={(morphed) => setCookingRecipe(morphed)}
        />
      )}

      {/* 🧠 "Why This Recipe?" AI Explainability Modal */}
      {explainabilityRecipe && (
        <WhyThisRecipeModal
          isOpen={!!explainabilityRecipe}
          onClose={() => setExplainabilityRecipe(null)}
          recipe={explainabilityRecipe}
        />
      )}

      {/* 👨🍳 Chef Persona Engine Modal (10 Master Styles) */}
      {isChefPersonaOpen && (
        <ChefPersonaEngineModal
          isOpen
          onClose={() => setIsChefPersonaOpen(false)}
          availableIngredients={currentIngredients}
          onStartCookingRecipe={(rec) => setCookingRecipe(rec)}
        />
      )}

      {/* 🎯 "Cook With What You Have" Pantry Challenge Modal */}
      {isPantryChallengeOpen && (
        <PantryChallengeModal
          isOpen
          onClose={() => setIsPantryChallengeOpen(false)}
          availableIngredients={currentIngredients}
          onStartCookingRecipe={(rec) => setCookingRecipe(rec)}
        />
      )}

      {/* 💰 Grocery Price Intelligence & Budget Mode Modal */}
      {isBudgetModeOpen && (
        <GroceryPriceIntelligenceModal
          isOpen
          onClose={() => setIsBudgetModeOpen(false)}
          availableIngredients={currentIngredients}
          onStartCookingRecipe={(rec) => setCookingRecipe(rec)}
          onAddMissingToShoppingList={(items) => handleAddCustomIngredientNamesToShoppingList(items)}
        />
      )}

      {/* Full Screen Step-by-Step Hands-Free Cooking Modal */}
      {cookingRecipe && (
        <StepByStepCookingModal
          recipe={cookingRecipe}
          skillLevel={cookingSkillLevel}
          onClose={() => setCookingRecipe(null)}
        />
      )}

      {/* Gamified Iron Chef Mystery Box Modal */}
      {isIronChefOpen && (
        <IronChefGameModal
          currentIngredients={currentIngredients}
          onStartCooking={setCookingRecipe}
          onClose={() => setIsIronChefOpen(false)}
        />
      )}

      {/* AR Plating Guide Modal */}
      {isARPlatingOpen && (
        <ARPlatingGuideModal
          recipeTitle={recipes[0]?.title || 'Gourmet Dish'}
          onClose={() => setIsARPlatingOpen(false)}
        />
      )}

      {/* Neuro-Gastronomy & Time Machine Modal */}
      {isNeuroOpen && (
        <NeuroGastronomyModal
          currentIngredients={currentIngredients}
          onStartCooking={setCookingRecipe}
          onClose={() => setIsNeuroOpen(false)}
        />
      )}

      </Suspense>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-500 py-6 text-xs mt-12">
        <div className="w-full px-3 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 flex items-center gap-2">
            <LogoMark className="w-6 h-6 shrink-0" />
            FridgeChef. Suggestions are AI-generated, so check allergens and food safety yourself.
          </p>
          <nav className="flex items-center gap-5">
            <a href="#/contact" className="hover:text-slate-200">Contact</a>
            <a href="#/terms" className="hover:text-slate-200">Terms</a>
            <a href="#/privacy" className="hover:text-slate-200">Privacy</a>
            <button onClick={() => window.dispatchEvent(new Event('fridgechef:open-consent'))} className="hover:text-slate-200">
              Cookie settings
            </button>
            <span>&copy; 2026 FridgeChef</span>
          </nav>
        </div>
      </footer>
    </div>
    </MotionConfig>
  );
}
