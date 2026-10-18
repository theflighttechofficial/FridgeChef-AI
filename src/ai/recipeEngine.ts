/**
 * Picks who answers "what can I cook?" and "what's in this photo?":
 *   1. the FridgeChef server (which uses the person's own key when set, else the server's)
 *   2. the person's provider called directly from the device (Android app without a server,
 *      or a custom OpenAI-compatible endpoint)
 *   3. the on-device model (src/ml), which always works, offline included
 * With engine = 'local' in Settings, recipes come straight from the on-device model.
 */
import { FilterOptions, Ingredient, Recipe } from '../types';
import { activeProvider, getAiSettings, hasServer } from './settings';
import { directAnalyzeFridge, directGenerateRecipes } from './directLlm';

export type RecipeSource = 'ai' | 'local-model';

export interface RecipeResult {
  recipes: Recipe[];
  source: RecipeSource;
  // Shown to the person when we fell back from cloud AI to the on-device model
  notice?: string;
}

// Normalize AI step payloads; drop empty steps so the cooking modal never renders blanks
const normalizeSteps = (steps: any[] | undefined) =>
  (Array.isArray(steps) ? steps : [])
    .filter((st) => st && typeof st.instruction === 'string' && st.instruction.trim())
    .map((st, sIdx) => ({
      stepNumber: Number(st.stepNumber) || sIdx + 1,
      instruction: st.instruction,
      timerSeconds: Number(st.timerSeconds) || undefined,
      keyIngredients: Array.isArray(st.keyIngredients) ? st.keyIngredients : [],
      chefTip: st.chefTip,
    }));

const asStrings = (x: unknown) => (Array.isArray(x) ? x.filter((v): v is string => typeof v === 'string') : []);

/** Turn one AI recipe payload into a Recipe the UI can render safely. */
export const formatAiRecipe = (rec: any, idx: number, prefix: string, fallbackIngredients: string[] = []): Recipe => ({
  id: `${prefix}-${Date.now()}-${idx}`,
  title: String(rec?.title || '').trim(),
  description: String(rec?.description || ''),
  prepTimeMinutes: Number(rec?.prepTimeMinutes) || 15,
  cookTimeMinutes: Number(rec?.cookTimeMinutes) || 15,
  calories: Number(rec?.calories) || 420,
  difficulty: ['Easy', 'Medium', 'Hard'].includes(rec?.difficulty) ? rec.difficulty : 'Easy',
  dietaryTags: asStrings(rec?.dietaryTags),
  cuisine: String(rec?.cuisine || 'Chef Special'),
  matchedIngredients: asStrings(rec?.matchedIngredients).length ? asStrings(rec?.matchedIngredients) : fallbackIngredients.slice(0, 4),
  missingIngredients: asStrings(rec?.missingIngredients),
  macros: {
    protein: String(rec?.macros?.protein || '25g'),
    carbs: String(rec?.macros?.carbs || '30g'),
    fat: String(rec?.macros?.fat || '15g'),
  },
  nutritionRadarData: Array.isArray(rec?.nutritionRadarData) ? rec.nutritionRadarData : undefined,
  servings: Number(rec?.servings) || 2,
  chefTip: rec?.chefTip || undefined,
  steps: normalizeSteps(rec?.steps),
  source: 'ai',
});

const usable = (recipes: Recipe[]) => recipes.filter((r) => r.title && r.steps.length);

const fallbackMessage = (res: Response) => {
  try {
    const header = res.headers.get('X-AI-Fallback-Message');
    return header ? decodeURIComponent(header) : undefined;
  } catch {
    return undefined;
  }
};

export const localRecipes = async (ingredients: Ingredient[], filters?: Partial<FilterOptions>, limit = 6) => {
  const { recommend } = await import('../ml/recommender');
  return recommend(ingredients, { filters, limit }).map((r) => r.recipe);
};

export const generateRecipes = async (ingredients: Ingredient[], filters: FilterOptions): Promise<RecipeResult> => {
  const settings = getAiSettings();
  const local = async (notice?: string): Promise<RecipeResult> => ({ recipes: await localRecipes(ingredients, filters), source: 'local-model', notice });
  if (settings.engine === 'local' || !ingredients.length) return local();

  const names = ingredients.map((i) => i.name);
  const body = {
    ingredients: names,
    dietary: filters.dietary,
    maxPrepTime: filters.maxPrepTime,
    difficulty: filters.difficulty === 'All' ? undefined : filters.difficulty,
    cuisine: filters.cuisine === 'All' ? undefined : filters.cuisine,
  };
  const provider = activeProvider(settings);
  let notice: string | undefined;

  if (hasServer() && !provider?.def.deviceOnly) {
    try {
      const res = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok && !res.headers.get('X-AI-Fallback')) {
        const data = await res.json();
        const recipes = usable((data?.recipes || []).map((r: any, i: number) => formatAiRecipe(r, i, 'gen', names)));
        if (recipes.length) return { recipes, source: 'ai' };
      } else if (res.headers.get('X-AI-Fallback')) {
        // Keep only the part about the person's own key; the rest describes the server's fallback
        const message = fallbackMessage(res);
        notice = message?.startsWith('Your AI key') ? message.slice(0, message.indexOf(').') + 2) : undefined;
      }
    } catch {
      // Server unreachable: try the person's key directly, then the on-device model
    }
  }

  if (provider) {
    try {
      const data = await directGenerateRecipes(body);
      const recipes = usable((data?.recipes || []).map((r: any, i: number) => formatAiRecipe(r, i, 'direct', names)));
      if (recipes.length) return { recipes, source: 'ai' };
    } catch (err: any) {
      notice = `${provider.def.label} didn't answer (${String(err?.message || err).slice(0, 120)}).`;
    }
  }

  return local(`${notice || 'Cloud AI is unavailable.'} Showing picks from the on-device model.`);
};

export interface FridgeAnalysis {
  detectedIngredients: Ingredient[];
  suggestedRecipes: Recipe[];
  notice?: string;
}

const formatDetected = (items: any[]): Ingredient[] =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item && typeof item.name === 'string' && item.name.trim())
    .map((item, idx) => ({
      id: `ai-${Date.now()}-${idx}`,
      name: item.name.trim(),
      category: item.category || 'Produce',
      freshness: item.freshness || 'Fresh',
      quantity: item.quantity || '1 item',
      confidence: Number(item.confidence) || 0.9,
    }));

export const analyzeFridgePhoto = async (imageBase64: string, note?: string): Promise<FridgeAnalysis> => {
  const provider = activeProvider(getAiSettings());
  let notice: string | undefined;

  if (hasServer() && !provider?.def.deviceOnly) {
    try {
      const res = await fetch('/api/analyze-fridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, extraPrompt: note }),
      });
      if (res.ok && !res.headers.get('X-AI-Fallback')) {
        const data = await res.json();
        return {
          detectedIngredients: formatDetected(data?.detectedIngredients),
          suggestedRecipes: usable((data?.suggestedRecipes || []).map((r: any, i: number) => formatAiRecipe(r, i, 'ai-recipe'))),
        };
      }
      notice = fallbackMessage(res);
    } catch {}
  }

  if (provider?.def.vision) {
    const mimeType = /^data:(image\/\w+);/.exec(imageBase64)?.[1] || 'image/jpeg';
    const data = await directAnalyzeFridge(imageBase64, mimeType, note);
    return {
      detectedIngredients: formatDetected(data?.detectedIngredients),
      suggestedRecipes: usable((data?.suggestedRecipes || []).map((r: any, i: number) => formatAiRecipe(r, i, 'direct-recipe'))),
    };
  }

  throw new Error(
    notice ||
      (provider ? `${provider.def.label} can't read photos. Pick a vision provider in Settings, or add items by hand.` : 'Photo reading needs an AI provider. Add an API key in Settings, or add items by hand.')
  );
};
