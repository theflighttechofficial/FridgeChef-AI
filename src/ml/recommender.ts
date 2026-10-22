/**
 * On-device recipe recommender. Scores every recipe in the bundled corpus against the pantry with
 * the weights and ingredient embeddings trained by scripts/train-recipe-model.ts, then adds the
 * person's learned taste (tasteModel.ts) and a bonus for using up items marked "Use Soon".
 * Runs in a few milliseconds, fully offline.
 */
import { FilterOptions, Ingredient, Recipe } from '../types';
import model from './model.json';
import { corpus, CorpusRecipe } from './data/recipes';
import { canonicalPantry } from './normalize';
import { recipeFeatures, roleOf, Similarity } from './features';
import { tasteScore } from './tasteModel';
import { composeRecipes, predictRegions } from './composer';

const SUBSTITUTE_THRESHOLD = 0.85;
const TASTE_WEIGHT = 1.2;
const EXPIRING_WEIGHT = 1.5;
const OVER_TIME_PENALTY = 1.5;
const SAME_CUISINE_PENALTY = 0.35;
const SAME_HERO_PENALTY = 0.5;
const PREFERRED_REGION_BONUS = 0.6;
const EXPLORE_TEMPERATURE = 0.8;
// Below this share of a recipe's main ingredients, composed recipes lead the list
const WEAK_MATCH = 0.5;

const RECIPES = corpus();
const index = new Map<string, number>(model.vocab.map((n: string, i: number) => [n, i]));
const vectors: number[][] = model.embeddings;

export const similarity: Similarity = (a, b) => {
  if (a === b) return 1;
  const ia = index.get(a);
  const ib = index.get(b);
  if (ia === undefined || ib === undefined) return 0;
  const va = vectors[ia];
  const vb = vectors[ib];
  let s = 0;
  for (let k = 0; k < va.length; k++) s += va[k] * vb[k];
  return s;
};

const title = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export const modelInfo = {
  version: model.version as number,
  trainedAt: model.trainedAt as string,
  recipes: RECIPES.length,
  ingredients: model.vocab.length as number,
  dim: model.dim as number,
  cuisines: model.cuisineModel.cuisines.length as number,
  cuisineMetrics: model.cuisineModel.metrics,
  metrics: model.metrics as {
    model: { top1: number; top3: number; mrr: number };
    coverageBaseline: { top1: number; top3: number; mrr: number };
    testSessions: number;
    candidatesPerSession: number;
  },
};

const satisfiesDiet = (tags: string[], dietary: string[]) =>
  dietary.every((d) => tags.includes(d) || (d === 'Vegetarian' && tags.includes('Vegan')) || (d === 'Dairy-Free' && tags.includes('Vegan')));

export interface RecommendOptions {
  filters?: Partial<FilterOptions>;
  limit?: number;
  // Recipe ids already shown for this pantry; "New ideas" skips them while others remain
  exclude?: Set<string>;
  // 0 = always the best-scoring picks; 1 = sample widely among good matches for variety
  explore?: number;
  // Which round of "New ideas" this is; rotates the composed recipes' cuisine and technique
  round?: number;
  // Regions the person said they love during setup; a gentle boost, not a filter
  preferredRegions?: string[];
}

export interface Recommendation {
  recipe: Recipe;
  score: number;
}

const toRecipe = (r: CorpusRecipe, pantry: Map<string, string>): Recipe => {
  const pantryCore = [...pantry.keys()].filter((p) => roleOf(p) === 'core');
  const matched: string[] = [];
  const missing: string[] = [];
  const substitutions: { missing: string; use: string }[] = [];
  for (const ing of r.ingredients) {
    const role = roleOf(ing);
    if (pantry.has(ing)) {
      matched.push(pantry.get(ing)!);
      continue;
    }
    if (role === 'staple') continue;
    const best = role === 'core' ? pantryCore.map((p) => [p, similarity(ing, p)] as const).sort((a, b) => b[1] - a[1])[0] : undefined;
    if (best && best[1] >= SUBSTITUTE_THRESHOLD) substitutions.push({ missing: title(ing), use: pantry.get(best[0])! });
    else missing.push(title(ing));
  }
  const [protein, carbs, fat] = r.macros;
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    prepTimeMinutes: r.prepTimeMinutes,
    cookTimeMinutes: r.cookTimeMinutes,
    calories: r.calories,
    difficulty: r.difficulty,
    dietaryTags: r.tags,
    cuisine: r.cuisine,
    region: r.region,
    matchedIngredients: [...new Set(matched)],
    missingIngredients: missing,
    substitutions,
    macros: { protein: `${protein}g`, carbs: `${carbs}g`, fat: `${fat}g` },
    servings: r.servings,
    chefTip: r.chefTip,
    emoji: r.emoji,
    source: 'local-model',
    steps: r.steps.map((s, i) => ({ stepNumber: i + 1, instruction: s.instruction, timerSeconds: s.timerSeconds })),
  };
};

/** Rank the bundled recipes for this pantry. */
export const recommend = (ingredients: Ingredient[], { filters = {}, limit = 6, exclude, explore = 0, round = 0, preferredRegions = [] }: RecommendOptions = {}): Recommendation[] => {
  const pantry = canonicalPantry(ingredients.map((i) => i.name));
  const pantrySet = new Set(pantry.keys());
  const expiring = canonicalPantry(ingredients.filter((i) => i.freshness === 'Use Soon').map((i) => i.name));
  const weights: number[] = model.weights;
  const dietary = filters.dietary || [];

  const regionFit = predictRegions([...pantrySet]);
  const coverage = new Map<string, number>();
  const scored = RECIPES.filter((r) => satisfiesDiet(r.tags, dietary))
    .filter((r) => !filters.difficulty || filters.difficulty === 'All' || r.difficulty === filters.difficulty)
    .filter((r) => !filters.cuisine || filters.cuisine === 'All' || r.cuisine === filters.cuisine || r.region === filters.cuisine)
    .map((r) => {
      const feats = recipeFeatures(pantrySet, r.ingredients, similarity, regionFit[r.region] || 0);
      let score = feats.reduce((s, f, k) => s + f * weights[k], 0);
      const recipe = toRecipe(r, pantry);
      coverage.set(recipe.id, feats[0]);
      score += TASTE_WEIGHT * tasteScore(recipe);
      if (preferredRegions.includes(r.region)) score += PREFERRED_REGION_BONUS;
      if (expiring.size) score += (EXPIRING_WEIGHT * r.ingredients.filter((i) => expiring.has(i)).length) / expiring.size;
      const maxTime = filters.maxPrepTime;
      if (maxTime && maxTime < 60 && r.prepTimeMinutes + r.cookTimeMinutes > maxTime) score -= OVER_TIME_PENALTY;
      return { recipe, score };
    })
    .sort((a, b) => b.score - a.score);

  // Skip recipes already shown, unless that would leave too few to fill the list
  const fresh = exclude?.size ? scored.filter((c) => !exclude.has(c.recipe.id)) : scored;
  const candidates = fresh.length >= limit ? fresh : scored;

  // Re-rank so the list isn't six variations of one cuisine or one main ingredient. With
  // explore > 0 each slot is sampled (softmax over adjusted scores) instead of taken greedily,
  // so repeated "New ideas" taps surface different good matches.
  const heroOf = (r: Recipe) => r.matchedIngredients[0] || r.title;
  const picked: Recommendation[] = [];
  const pool = candidates.slice(0, Math.max(limit * (explore > 0 ? 8 : 4), limit));
  while (picked.length < limit && pool.length) {
    const adjusted = pool.map(
      (c) =>
        c.score -
        SAME_CUISINE_PENALTY * picked.filter((p) => p.recipe.cuisine === c.recipe.cuisine).length -
        SAME_HERO_PENALTY * picked.filter((p) => heroOf(p.recipe) === heroOf(c.recipe)).length
    );
    let idx = adjusted.indexOf(Math.max(...adjusted));
    if (explore > 0) {
      const t = EXPLORE_TEMPERATURE * explore;
      const max = adjusted[idx];
      const weights = adjusted.map((a) => Math.exp((a - max) / t));
      let r = Math.random() * weights.reduce((x, y) => x + y, 0);
      idx = weights.findIndex((w) => (r -= w) <= 0);
      if (idx < 0) idx = weights.length - 1;
    }
    picked.push(pool.splice(idx, 1)[0]);
  }

  // Pantries the corpus covers poorly still get recipes built from exactly what is there
  const best = Math.max(0, ...picked.map((p) => coverage.get(p.recipe.id) || 0));
  const weak = best < WEAK_MATCH;
  const composed = composeRecipes(pantry, { dietary, cuisine: filters.cuisine, limit: weak ? 2 : 1, variant: round }).map((recipe) => ({
    recipe,
    score: weak ? Infinity : -Infinity,
  }));
  if (!composed.length) return picked;
  return weak ? [...composed, ...picked].slice(0, limit) : [...picked.slice(0, limit - 1), ...composed.slice(0, 1)];
};

/** Closest substitutes in the pantry (or overall) for one ingredient, by learned similarity. */
export const substitutesFor = (name: string, limit = 5) => {
  const [canon] = [...canonicalPantry([name]).keys()];
  if (!canon) return [];
  return (model.vocab as string[])
    .filter((v) => v !== canon && roleOf(v) !== 'staple')
    .map((v) => ({ name: title(v), score: similarity(canon, v) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
