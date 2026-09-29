export interface Ingredient {
  id: string;
  name: string;
  category: 'Produce' | 'Dairy & Eggs' | 'Meat & Seafood' | 'Pantry' | 'Condiments' | 'Spices' | 'Beverages' | 'Bakery' | 'Grains & Pulses' | 'Fermented' | 'Nuts & Seeds' | 'Other';
  freshness?: 'Fresh' | 'Use Soon' | 'Moderate' | 'Frozen' | 'Pantry Staple';
  quantity?: string;
  confidence?: number;
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  timerSeconds?: number;
  keyIngredients?: string[];
  chefTip?: string;
}

export interface NutritionRadarPoint {
  attribute: string;
  score: number; // 0 to 100 percentage score
}

export interface FlavorDna {
  salt: number; // 0 to 100
  sweet: number; // 0 to 100
  acid: number; // 0 to 100
  heat: number; // 0 to 100
  umami: number; // 0 to 100
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookingMethod?: 'Pan-Seared' | 'Air Fryer' | 'Pressure Cooker / Instant Pot' | 'Sous Vide' | 'Claypot Braising' | 'Wok Stir-Fry' | 'Oven Roasted' | 'Smoked' | 'Raw Fermented';
  dietaryTags: string[]; // e.g. ['Vegetarian', 'Gluten-Free', 'Keto']
  cuisine: string; // e.g. 'Mediterranean', 'Asian', 'Mexican', 'French'
  matchedIngredients: string[];
  missingIngredients: string[];
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  nutritionRadarData?: NutritionRadarPoint[];
  flavorDna?: FlavorDna;
  steps: CookingStep[];
  chefTip?: string;
  imageUrl?: string;
  servings?: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  addedFromRecipe?: string;
  checked: boolean;
  addedAt: string;
}

export interface FilterOptions {
  dietary: string[];
  maxPrepTime: number; // in minutes, e.g. 60
  difficulty: string; // 'All' | 'Easy' | 'Medium' | 'Hard'
  cuisine: string; // 'All' | 'Mediterranean' | 'Asian' | ...
  searchQuery: string;
  sortBy: 'match' | 'time' | 'calories';
}

export interface PresetFridge {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ingredients: Ingredient[];
}

export type FridgeLocation = 'Top Shelf' | 'Middle Shelf' | 'Crisper Drawer' | 'Door Rack' | 'Deep Freeze';

export interface HouseholdMember {
  id: string;
  name: string;
  role: 'Self' | 'Partner' | 'Kid' | 'Roommate';
  dislikedIngredients: string[];
  allergens: string[];
  spiceTolerance: number; // 1 to 5
  favoriteCuisines: string[];
  notes?: string;
}

export interface HouseholdMemoryProfile {
  householdName: string;
  members: HouseholdMember[];
  overallSpiceTolerance: number; // 1 to 5
  favoriteCuisines: string[];
  dislikedIngredients: string[];
  typicalMealTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  preferredAppliances: string[];
  frequentlyPurchased: string[];
  budgetTier: 'Value' | 'Balanced' | 'Gourmet';
  cookingSkillLevel: 'Beginner' | 'Intermediate' | 'Pro Chef';
  lovedRecipes: string[];
  dislikedRecipes: string[];
  learnedInsights: string[];
}

export interface ReceiptItem {
  name: string;
  category: Ingredient['category'];
  quantity: string;
  estimatedWeightGrams: number;
  price: string;
  estimatedShelfLifeDays: number;
  storageLocation: FridgeLocation | 'Pantry Cupboard';
}

export interface ReceiptAnalysisResult {
  storeName: string;
  totalCost: string;
  totalWeightKg: number;
  estimatedPantryUtilizationPercent: number;
  items: ReceiptItem[];
  immediateUseItems: string[];
  mealSuggestions: string[];
}

export interface AutonomousDecision {
  title: string;
  cookTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  spiceLevel: string;
  estimatedCost: string;
  preventedWasteGrams: number;
  proteinGrams: number;
  calories: number;
  expiringIngredientsUsed: string[];
  decisionFactors: Array<{
    factor: string;
    detail: string;
    impact: string;
  }>;
  briefWhy: string;
  steps: CookingStep[];
}

export interface SubstituteOption {
  name: string;
  flavorSimilarityPercent: number;
  textureSimilarityPercent: number;
  culinaryRole: string;
  ratio: string;
  dietaryTags: string[];
  isAvailableInFridge: boolean;
  chefTechniqueNote: string;
}

export interface IngredientSubstituteAnalysis {
  targetIngredient: string;
  culinaryRole: string;
  substitutes: SubstituteOption[];
}

export type EvolutionType = 'higher-protein' | 'lower-calorie' | 'more-spicy' | 'restaurant-style' | 'budget-version' | '15-minute';

export interface RecipeEvolutionItem {
  id: EvolutionType;
  name: string;
  title: string;
  tagline: string;
  cookTimeMinutes: number;
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  costEstimate: string;
  modifications: string[];
  secretIngredient: string;
  chefNote: string;
  steps: CookingStep[];
}

export interface RecipeEvolutionSet {
  original: {
    title: string;
    calories: number;
    protein: string;
    cookTime: number;
    keyHighlight: string;
  };
  evolutions: RecipeEvolutionItem[];
}

export type ChefPersonaType =
  | 'Indian'
  | 'Japanese'
  | 'Italian'
  | 'French'
  | 'Korean'
  | 'Mexican'
  | 'Molecular'
  | 'Fitness'
  | 'Budget'
  | 'Homestyle';

export interface ChefPersonaMeta {
  type: ChefPersonaType;
  flagEmoji: string;
  name: string;
  subtitle: string;
  signatureStyle: string;
  quote: string;
}

export interface ChefPersonaRecipe {
  persona: ChefPersonaType;
  dishTitle: string;
  personaGreeting: string;
  tagline: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  signatureTechnique: string;
  flavorProfile: string;
  chefTip: string;
  steps: CookingStep[];
}

export interface PantryChallengeScore {
  challengeDishTitle: string;
  ingredientUtilization: number;
  creativity: number;
  nutrition: number;
  wasteReduction: number;
  difficulty: number;
  xpEarned: number;
  badgeUnlocked: string;
  feedbackQuote: string;
  cookTimeMinutes: number;
}

export interface WhyThisRecipeFactor {
  factor: string;
  score: number; // e.g. +31, +24, -5
  detail: string;
  isPositive: boolean;
}

export interface WhyThisRecipeExplainability {
  totalScore: number; // e.g. 91/100
  factors: WhyThisRecipeFactor[];
  summaryNote: string;
}

export interface BudgetGroceryItem {
  item: string;
  qty: string;
  cost: string;
  source: 'Pantry (Free)' | 'To Buy';
}

export interface BudgetMealPlanResult {
  recipeTitle: string;
  totalEstimatedCost: string;
  costPerServing: string;
  proteinPerServingGrams: number;
  caloriesPerServing: number;
  costPer10gProtein: string;
  groceryBreakdown: BudgetGroceryItem[];
  strategyHighlight: string;
  steps: CookingStep[];
}

// 📊 11. Personal Nutrition Dashboard Types
export interface NutritionDaySummary {
  day: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sodiumMg: number;
  sugarGrams: number;
}

export interface MicronutrientMetric {
  name: string;
  amount: string;
  recommendedDailyPercent: number;
  status: 'Optimal' | 'Low' | 'High';
}

export interface NutritionDiagnosis {
  headline: string;
  observation: string;
  recommendedAction: string;
  balancingMealSuggestions: string[];
}

export interface WeeklyNutritionProfile {
  weeklyAverages: {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    fiberGrams: number;
    sodiumMg: number;
    sugarGrams: number;
  };
  mealDiversityCount: number; // e.g. 18 unique plants & proteins
  micronutrients: MicronutrientMetric[];
  dailyHistory: NutritionDaySummary[];
  diagnosis: NutritionDiagnosis;
}

// 🌍 12. Food Waste Carbon Calculator Types
export interface SustainabilityMetrics {
  foodRescuedKg: number;
  estimatedMoneySavedRupees: number;
  foodWasteAvoidedKg: number;
  co2AvoidedKg: number;
  waterSavedLiters: number;
  householdSustainabilityScore: number;
  scoreBreakdown: {
    wasteDiversionScore: number;
    localSeasonalityScore: number;
    resourceEfficiencyScore: number;
    compostingPackagingScore: number;
  };
}

// 🌡️ 13. Smart Fridge Sensor Integration Types
export interface SmartFridgeSensors {
  temperatureCelsius: number;
  humidityPercent: number;
  doorState: 'Closed' | 'Ajar' | 'Open';
  doorOpenDurationSeconds: number;
  doorOpenCountToday: number;
  isAnomalyActive: boolean;
  anomalyMessage?: string;
  shelfWeightSensorKg: number;
  gasOdorIndexPpm: number; // e.g. 12 ppm (normal) to 80 ppm (spoilage odor)
  ethyleneGasLevelPpm: number;
  lastSyncTimestamp: string;
}

// ⚖️ 14. Food Safety Intelligence Types
export type SafetyWindowStatus = 'Safe' | 'Cook Today' | 'Caution' | 'Discard';

export interface FoodSafetyProfile {
  ingredientName: string;
  category: string;
  safetyStatus: SafetyWindowStatus;
  openedDaysAgo: number;
  maxRefrigeratedDays: number;
  safeStorageLocation: string;
  safeCookInternalTempCelsius: number;
  safeCookInternalTempFahrenheit: number;
  crossContaminationWarning?: string;
  rawCookedSeparationRule: string;
  allergenAlerts: string[];
  handlingAction: string;
}

// 🧑🤝🧑 15. Multi-Person Household Profiles
export interface DinnerMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  dietaryPreference: string;
  spiceTolerance: string;
  dislikedIngredients: string[];
  medicalAllergens: string[];
  healthGoals: string;
}

export interface DinnerForEveryoneResult {
  baseRecipeTitle: string;
  tagline: string;
  cookTimeMinutes: number;
  baseTechnique: string;
  sharedBaseIngredients: string[];
  harmonyScore: number;
  harmonyReason: string;
  memberModifications: Array<{
    memberName: string;
    memberDietary: string;
    personalizedDishName: string;
    modifications: string[];
    spiceAdjustment: string;
    macros: { protein: string; carbs: string; fat: string };
    chefNote: string;
  }>;
  steps: CookingStep[];
}

// 🗣️ 16. Natural Conversational Kitchen Voice Agent
export interface KitchenConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTaken?: string;
}

// 🧠 17. Recipe Knowledge Graph Types
export interface KnowledgeGraphNode {
  id: string;
  label: string;
  category: 'Ingredient' | 'FlavorCompound' | 'CookingTechnique' | 'Cuisine' | 'Recipe' | 'Substitution';
  description: string;
  flavorProfile?: string;
  relatedNodes: string[];
}

// 🔬 18. AI Recipe Scientific Validation Types
export interface RecipeScientificValidation {
  overallConfidencePercent: number; // e.g. 94%
  culinaryValidator: {
    ingredientCompatibility: number;
    cookingTempCelsius: number;
    timingFeasibility: number;
    textureScore: number;
    verdict: string;
  };
  nutritionValidator: {
    caloricAccuracy: number;
    macroBalance: number;
    portionScaleFeasibility: number;
    verdict: string;
  };
  safetyValidator: {
    haccpThermalSafe: boolean;
    rawCrossContaminationSafe: boolean;
    holdingTempSafe: boolean;
    verdict: string;
  };
  validationAuditVerdict: string;
}

// 🧑🍳 19. Cooking Skill Adaptation
export type CookingSkillAdaptationLevel = 'Beginner' | 'Intermediate' | 'Advanced';

// 📷 20. Plate Photo -> Food Analysis Types
export interface PlateAnalysisResult {
  dishName: string;
  estimatedPortionSize: string;
  detectedIngredients: string[];
  approximateMacros: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  plateScores: {
    presentation: number;
    nutritionalBalance: number;
    colorDiversity: number;
    platingGeometry: number;
    overallScore: number;
  };
  chefCritique: string;
  elevationTip: string;
}

// 🧠 21. Taste Preference Learning Types
export interface TastePreferenceVector {
  likedFlavors: Array<{ tag: string; score: number }>;
  likedTextures: Array<{ tag: string; score: number }>;
  dislikedElements: Array<{ tag: string; score: number }>;
  favoriteCuisines: string[];
  totalMealsRated: number;
  recentFeedbacks: Array<{
    mealTitle: string;
    rating: number;
    tags: string[];
    date: string;
  }>;
}

// 🕐 22. Context-Aware Cooking Moods & Times
export type CookingTimeBudget = '5 min' | '15 min' | '30 min' | '60+ min';
export type CookingMoodMode = 'Standard' | 'Starving' | 'Gourmet' | 'Hosting';

// 🎉 23. Event / Guest Mode Catering Types
export interface EventCateringCourse {
  courseName: string;
  title: string;
  description: string;
  scaledPortions: string;
  keyIngredients: string[];
}

export interface EventCateringPlanResult {
  menuCourses: EventCateringCourse[];
  totalEstimatedCost: string;
  procurementShoppingList: Array<{
    item: string;
    qty: string;
    estCost: string;
    category: string;
  }>;
  prepTimeline: Array<{
    timeMarker: string;
    action: string;
    chefTip: string;
  }>;
  servingSchedule: Array<{
    time: string;
    action: string;
  }>;
  cateringProTip: string;
}

// 🧾 24. Pantry Financial Intelligence Types
export interface PantryFinancialAudit {
  monthlyTotalSpendRupees: number;
  categorySpending: {
    protein: number;
    produce: number;
    dairy: number;
    snacks: number;
    grains: number;
  };
  spoilageLossMonthlyRupees: number;
  wasteReductionTargetRupees: number;
  repeatedlyUnusedItems: Array<{
    name: string;
    category: string;
    timesBought: number;
    timesWasted: number;
    lossEstimateRupees: number;
    preventionTip: string;
  }>;
}

// 🤖 25. Autonomous Culinary Agent Types
export interface AutonomousAgentStage {
  stageNumber: number;
  title: string;
  detail: string;
  status: 'Completed' | 'Ready' | 'InProgress';
}

export interface AutonomousAgentMeal {
  day: string;
  mealName: string;
  cookTime: string;
  rescuedIngredient: string;
  protein: string;
  calories: number;
}

export interface AutonomousAgentCrossReuse {
  ingredient: string;
  usedInDays: string[];
  savingsNote: string;
}

export interface AutonomousCulinaryAgentResult {
  goal: string;
  agentStatus: string;
  projectedWeeklySavings: string;
  projectedWasteReductionKg: number;
  weeklyCostEstimate: string;
  pantryUtilizationRate: number;
  stages: AutonomousAgentStage[];
  sevenDayMealPlan: AutonomousAgentMeal[];
  ingredientCrossReuseGraph: AutonomousAgentCrossReuse[];
  consolidatedShoppingList: Array<{
    item: string;
    qty: string;
    estCost: string;
  }>;
  agentExecutiveSummary: string;
}




