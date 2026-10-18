/**
 * Ranking features for a (pantry, recipe) pair. The training script and the in-app recommender
 * both call `recipeFeatures`, so a model trained offline scores exactly the same way on device.
 */
import { BY_NAME } from './normalize';

export const FEATURE_NAMES = [
  'coreCoverage', // share of the recipe's main ingredients already in the pantry
  'flavourCoverage', // share of spices, sauces and seasonings in the pantry
  'softCoverage', // credit for missing items with a close substitute in the pantry (learned embeddings)
  'missingCore', // how many main ingredients are missing (scaled, capped)
  'pantryUse', // share of the pantry's main ingredients this recipe uses up
  'heroPresent', // the recipe's lead ingredient is in the pantry
  'heroSubstitute', // best embedding similarity between the lead ingredient and the pantry
] as const;

// Groups treated as flavouring rather than the body of the dish
const FLAVOUR_GROUPS = new Set([
  'warm spice', 'spice blend', 'hot spice', 'sweet spice', 'seasoning', 'asian sauce', 'western sauce',
  'vinegar', 'chili paste', 'oil', 'sweetener', 'baking', 'aromatic', 'soft herb', 'woody herb', 'sour',
]);

export type Role = 'core' | 'flavour' | 'staple';

export const roleOf = (name: string): Role => {
  const def = BY_NAME.get(name);
  if (!def || def.staple) return def ? 'staple' : 'core';
  return FLAVOUR_GROUPS.has(def.group) ? 'flavour' : 'core';
};

/** Cosine similarity lookup between canonical ingredients, backed by the trained embeddings. */
export type Similarity = (a: string, b: string) => number;

export const recipeFeatures = (pantry: Set<string>, ingredients: string[], sim: Similarity): number[] => {
  const core = ingredients.filter((i) => roleOf(i) === 'core');
  const flavour = ingredients.filter((i) => roleOf(i) === 'flavour');
  const pantryCore = [...pantry].filter((i) => roleOf(i) === 'core');

  const coreHits = core.filter((i) => pantry.has(i));
  const missing = core.filter((i) => !pantry.has(i));
  const bestSub = (item: string) => pantryCore.reduce((best, p) => Math.max(best, sim(item, p)), 0);

  const hero = ingredients[0];
  return [
    core.length ? coreHits.length / core.length : 1,
    flavour.length ? flavour.filter((i) => pantry.has(i)).length / flavour.length : 1,
    missing.length ? missing.reduce((s, m) => s + Math.max(0, bestSub(m)), 0) / missing.length : 1,
    Math.min(1, missing.length / 5),
    pantryCore.length ? coreHits.length / pantryCore.length : 0,
    pantry.has(hero) ? 1 : 0,
    pantry.has(hero) ? 1 : Math.max(0, bestSub(hero)),
  ];
};
