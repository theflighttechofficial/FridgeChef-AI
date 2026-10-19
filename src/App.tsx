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
import { showToast } from './utils/toast';
import { AppShell } from './components/shell/AppShell';
import { buildTools } from './components/shell/tools';
import { analyzeFridgePhoto, generateRecipes, localRecipes, RecipeSource } from './ai/recipeEngine';
import { recordTaste } from './ml/tasteModel';
import { cuisineMatches } from './ml/data/schema';
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
  AppTab,
} from './types';

import {
  INITIAL_PRESET_FRIDGES,
  INITIAL_RECIPES,
  INITIAL_SHOPPING_LIST,
  DEFAULT_HOUSEHOLD_MEMORY,
} from './data/sampleData';
import { usePersistentState } from './hooks/usePersistentState';

import { RefreshCw, ChefHat, Bookmark, Cpu, Cloud, Sparkles } from 'lucide-react';

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
const SettingsPage = lazy(() => import('./components/SettingsPage').then((m) => ({ default: m.SettingsPage })));
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
  settings: ['Settings', 'Choose your AI provider, add your own API key and tune the on-device recipe model.'],
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

const ModalFallback = () => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" role="status" aria-label="Loading">
    <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-300 animate-spin" />
  </div>
);

// Placeholder shaped like a RecipeCard, shown while new recipes are being generated
const RecipeCardSkeleton = () => (
  <div className="bg-slate-900 rounded-3xl overflow-hidden animate-pulse">
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
  <div className="h-40 rounded-3xl bg-slate-900/60 animate-pulse" />
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

  // Intro showreel plays only on first launch (stored on the device)
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return localStorage.getItem('fridgechef.introSeen') !== '1';
    } catch {
      return true;
    }
  });
  // Count the intro as seen once it has been shown, even if the app is closed mid-way
  useEffect(() => {
    if (!showIntro) return;
    try {
      localStorage.setItem('fridgechef.introSeen', '1');
    } catch {}
  }, [showIntro]);
  const dismissIntro = useCallback(() => {
    try {
      localStorage.setItem('fridgechef.introSeen', '1');
    } catch {}
    setShowIntro(false);
  }, []);

  const [activeTab, setActiveTab] = useState<AppTab>('scan');

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
  const [recipeSource, setRecipeSource] = useState<RecipeSource | 'sample'>('sample');
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

  // Photo -> ingredients (+ recipes). Cloud AI reads the photo; the on-device model fills in
  // recipes when the AI returned ingredients only.
  const handleAnalyzeImage = async (imageBase64: string, extraNote?: string) => {
    setIsAnalyzing(true);
    try {
      const { detectedIngredients, suggestedRecipes } = await analyzeFridgePhoto(imageBase64, extraNote);
      if (!detectedIngredients.length) {
        showToast("No food spotted in that photo. Try a closer, brighter shot or add items by hand.", 'info');
        return;
      }
      setCurrentIngredients(detectedIngredients);
      const withImages = suggestedRecipes.map((r, idx) => ({ ...r, imageUrl: INITIAL_RECIPES[idx % INITIAL_RECIPES.length]?.imageUrl }));
      if (withImages.length) {
        setRecipes(withImages);
        setRecipeSource('ai');
      } else {
        setRecipes(await localRecipes(detectedIngredients, filters));
        setRecipeSource('local-model');
      }
      setActiveTab('recipes');
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      showToast(err?.message || "Couldn't read that photo. Check your connection or try a clearer picture.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Recipes for the current pantry + filters: cloud AI first, on-device model as fallback
  const handleGenerateRecipesFromIngredients = async (forceLocal = false) => {
    if (!currentIngredients.length) {
      showToast('Add a few ingredients first.', 'info');
      return;
    }
    setIsGeneratingRecipes(true);
    try {
      const result = forceLocal
        ? { recipes: await localRecipes(currentIngredients, filters), source: 'local-model' as const, notice: undefined }
        : await generateRecipes(currentIngredients, filters);
      if (result.notice) showToast(result.notice, 'info');
      if (result.recipes.length) {
        setRecipes(result.source === 'ai' ? result.recipes.map((r, idx) => ({ ...r, imageUrl: INITIAL_RECIPES[idx % INITIAL_RECIPES.length]?.imageUrl })) : result.recipes);
        setRecipeSource(result.source);
        setActiveTab('recipes');
      } else {
        showToast('No recipes fit those filters. Try loosening them.', 'info');
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
    const wasSaved = savedRecipes.some((r) => r.id === recipe.id);
    recordTaste(recipe, wasSaved ? 0 : 1);
    setSavedRecipes((prev) => (wasSaved ? prev.filter((r) => r.id !== recipe.id) : [...prev, recipe]));
  };

  // Starting to cook a recipe is a strong "I like this" signal for the on-device taste model
  const handleStartCooking = (recipe: Recipe) => {
    recordTaste(recipe, 1);
    setCookingRecipe(recipe);
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

        if (!cuisineMatches(recipe, filters.cuisine)) {
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

  const tools = buildTools({
    agent: () => setIsAutonomousAgentOpen(true),
    voice: () => setIsKitchenVoiceOpen(true),
    graph: () => setIsKnowledgeGraphOpen(true),
    taste: () => setIsTasteModalOpen(true),
    memory: () => setIsMemoryModalOpen(true),
    neuro: () => setIsNeuroOpen(true),
    personas: () => setIsChefPersonaOpen(true),
    challenge: () => setIsPantryChallengeOpen(true),
    ironChef: () => setIsIronChefOpen(true),
    substitutes: () => setIsSubstitutionsModalOpen(true),
    plating: () => setIsARPlatingOpen(true),
    plate: () => setIsPlateAnalysisOpen(true),
    catering: () => setIsCateringModalOpen(true),
    dinnerForEveryone: () => setIsDinnerForEveryoneOpen(true),
    nutrition: () => setIsNutritionModalOpen(true),
    safety: () => setIsFoodSafetyModalOpen(true),
    sensors: () => setIsSensorModalOpen(true),
    carbon: () => setIsCarbonModalOpen(true),
    budget: () => setIsBudgetModeOpen(true),
    financials: () => setIsFinancialModalOpen(true),
    receipt: () => setIsReceiptModalOpen(true),
  });

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
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      shoppingListCount={shoppingList.filter((i) => !i.checked).length}
      savedCount={savedRecipes.length}
      tools={tools}
    >
      {/* Main Body Content Container - Full Width Page Extension & Responsive Screen Optimization */}
      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-2 pb-10 space-y-6">
        {/* Pantry Health Expiration Notification Alert Banner */}
        {activeTab !== 'settings' && (<>
        <PantryHealthNotificationBanner
          ingredients={currentIngredients}
          onStartCookingFromAlert={() => setActiveTab('recipes')}
        />

        {/* 🧠 Household Memory Engine Proactive Insight Banner */}
        <HouseholdMemoryBanner
          memoryProfile={memoryProfile}
          onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        />
        </>)}

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
                onGenerateRecipes={() => handleGenerateRecipesFromIngredients()}
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
            {/* Header: what this list is, where it came from, regenerate */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                  {activeTab === 'saved' ? 'Saved recipes' : 'Cook tonight'}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <span>Matched against {currentIngredients.length} ingredients in your fridge</span>
                  {activeTab === 'recipes' && (
                    <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-semibold">
                      {recipeSource === 'local-model' ? <Cpu className="w-3.5 h-3.5" /> : recipeSource === 'ai' ? <Cloud className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                      {recipeSource === 'local-model' ? 'On-device model' : recipeSource === 'ai' ? 'Cloud AI' : 'Featured'}
                    </span>
                  )}
                </div>
              </div>

              {activeTab === 'recipes' && (
                <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => handleGenerateRecipesFromIngredients(true)}
                    disabled={isGeneratingRecipes}
                    className="h-12 px-5 rounded-full border border-slate-700 text-emerald-300 font-semibold text-sm flex items-center gap-2 state-layer disabled:opacity-50"
                    title="Instant, offline suggestions from the model built into the app"
                  >
                    <Cpu className="w-5 h-5" />
                    <span>On-device</span>
                  </button>
                  <button
                    onClick={() => handleGenerateRecipesFromIngredients()}
                    disabled={isGeneratingRecipes}
                    className="h-12 px-6 rounded-full bg-emerald-300 text-emerald-950 font-semibold text-sm flex items-center gap-2 disabled:opacity-50 btn-sheen"
                  >
                    <RefreshCw className={`w-5 h-5 ${isGeneratingRecipes ? 'animate-spin' : ''}`} />
                    <span>New ideas</span>
                  </button>
                </div>
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
                  <div className="p-12 text-center bg-slate-900 rounded-[1.75rem] space-y-4">
                    <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
                    <h3 className="text-lg font-bold text-white">No saved recipes yet</h3>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto">
                      Tap the bookmark on any recipe card to keep it here. Saved recipes stay on this device.
                    </p>
                    <button
                      onClick={() => setActiveTab('recipes')}
                      className="h-10 px-5 bg-emerald-300 text-emerald-950 font-semibold text-sm rounded-full"
                    >
                      Browse recipes
                    </button>
                  </div>
                ) : filteredRecipes.length === 0 ? (
                  <div className="p-12 text-center bg-slate-900 rounded-[1.75rem] space-y-4">
                    <ChefHat className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-lg font-semibold text-white">No recipes match your filters</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try unchecking dietary restrictions or expanding max prep time in the filter sidebar.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="h-10 px-5 bg-secondary-container text-on-secondary-container font-semibold text-sm rounded-full"
                    >
                      Clear filters
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
                            onSelectRecipe={handleStartCooking}
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
            <Reveal className="pt-6 space-y-6">
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
        {/* Settings: AI engine, own API key, on-device model, colours */}
        {activeTab === 'settings' && (
          <motion.div
            key="tab-settings"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
          >
            <Suspense fallback={<SectionFallback />}>
              <SettingsPage onTryLocalModel={() => handleGenerateRecipesFromIngredients(true)} />
            </Suspense>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

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

      {/* Footer: legal links for the website (Settings carries them in the app) */}
      <footer className="hidden md:block text-on-surface-variant py-8 text-xs">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2">
            <LogoMark className="w-6 h-6 shrink-0" />
            FridgeChef. Suggestions are AI-generated, so check allergens and food safety yourself.
          </p>
          <nav className="flex items-center gap-5">
            <a href="#/contact" className="hover:text-on-surface">Contact</a>
            <a href="#/terms" className="hover:text-on-surface">Terms</a>
            <a href="#/privacy" className="hover:text-on-surface">Privacy</a>
            <button onClick={() => window.dispatchEvent(new Event('fridgechef:open-consent'))} className="hover:text-on-surface">
              Cookie settings
            </button>
            <span>&copy; 2026 FridgeChef</span>
          </nav>
        </div>
      </footer>
    </AppShell>
    </MotionConfig>
  );
}
