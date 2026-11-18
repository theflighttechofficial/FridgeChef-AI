/**
 * Answers to the taste questions asked once at the start (and editable in Settings). Stored with
 * the person's other data on the device. The recommender turns them into a score for each recipe,
 * and cloud AI gets them as one plain sentence.
 */
import { useSyncExternalStore } from 'react';
import { userKey } from './userData';

export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'fiery';
export type Skill = 'beginner' | 'comfortable' | 'confident';
export type Adventure = 'familiar' | 'balanced' | 'explorer';

export interface TasteProfile {
  spice: SpiceLevel;
  loves: string[]; // ids from LOVES
  avoids: string[]; // ids from AVOIDS
  skill: Skill;
  weeknightMinutes: number; // 0 = no limit
  goals: string[]; // ids from GOALS
  adventure: Adventure;
  sweetTooth: boolean;
  completedAt: string;
}

export const DEFAULT_PROFILE: TasteProfile = {
  spice: 'medium',
  loves: [],
  avoids: [],
  skill: 'comfortable',
  weeknightMinutes: 0,
  goals: [],
  adventure: 'balanced',
  sweetTooth: false,
  completedAt: '',
};

export interface Choice {
  id: string;
  label: string;
  emoji: string;
  // Ingredient groups (ingredients.ts) or canonical names this choice stands for
  groups?: string[];
  names?: string[];
}

export const SPICE: { id: SpiceLevel; label: string; emoji: string; hint: string }[] = [
  { id: 'mild', label: 'Mild', emoji: '🌱', hint: 'Little or no chili' },
  { id: 'medium', label: 'Medium', emoji: '🌶️', hint: 'A gentle kick' },
  { id: 'hot', label: 'Hot', emoji: '🔥', hint: 'Bring the heat' },
  { id: 'fiery', label: 'Fiery', emoji: '🌋', hint: 'The hotter the better' },
];

export const LOVES: Choice[] = [
  { id: 'chicken', label: 'Chicken', emoji: '🍗', groups: ['poultry'] },
  { id: 'red-meat', label: 'Beef & lamb', emoji: '🥩', groups: ['red meat', 'pork'] },
  { id: 'seafood', label: 'Fish & seafood', emoji: '🐟', groups: ['fish', 'shellfish'] },
  { id: 'eggs', label: 'Eggs', emoji: '🥚', groups: ['egg'] },
  { id: 'paneer-cheese', label: 'Paneer & cheese', emoji: '🧀', groups: ['soft cheese', 'hard cheese'] },
  { id: 'tofu', label: 'Tofu & soy', emoji: '🍢', groups: ['soy protein'] },
  { id: 'pulses', label: 'Dal & beans', emoji: '🫘', groups: ['pulse'] },
  { id: 'greens', label: 'Leafy greens', emoji: '🥬', groups: ['leafy green', 'brassica', 'salad leaf'] },
  { id: 'veg', label: 'Fresh vegetables', emoji: '🥕', groups: ['fresh veg', 'sweet veg', 'squash', 'root', 'nightshade', 'sweet pepper'] },
  { id: 'rice', label: 'Rice & grains', emoji: '🍚', groups: ['grain'] },
  { id: 'noodles', label: 'Noodles & pasta', emoji: '🍝', groups: ['noodle', 'pasta'] },
  { id: 'bread', label: 'Breads & rotis', emoji: '🫓', groups: ['bread'] },
  { id: 'potato', label: 'Potatoes', emoji: '🥔', groups: ['starchy root'] },
  { id: 'mushroom', label: 'Mushrooms', emoji: '🍄', groups: ['mushroom'] },
  { id: 'coconut', label: 'Coconut', emoji: '🥥', groups: ['coconut'] },
  { id: 'creamy', label: 'Creamy & rich', emoji: '🥛', groups: ['cream', 'cultured dairy'] },
  { id: 'tangy', label: 'Tangy & sour', emoji: '🍋', groups: ['citrus', 'sour', 'vinegar', 'ferment'] },
  { id: 'nutty', label: 'Nuts & seeds', emoji: '🥜', groups: ['nut', 'seed'] },
];

export const AVOIDS: Choice[] = [
  { id: 'mushroom', label: 'Mushrooms', emoji: '🍄', groups: ['mushroom'] },
  { id: 'eggplant', label: 'Eggplant', emoji: '🍆', names: ['eggplant'] },
  { id: 'okra', label: 'Okra', emoji: '🥒', names: ['okra'] },
  { id: 'bitter-gourd', label: 'Bitter gourd', emoji: '🥬', names: ['bitter gourd'] },
  { id: 'seafood', label: 'Fish & seafood', emoji: '🐟', groups: ['fish', 'shellfish'], names: ['fish sauce', 'oyster sauce', 'shrimp paste'] },
  { id: 'pork', label: 'Pork', emoji: '🥓', groups: ['pork'] },
  { id: 'beef', label: 'Beef', emoji: '🐄', names: ['ground beef', 'beef steak'] },
  { id: 'lamb', label: 'Lamb & mutton', emoji: '🐑', names: ['lamb'] },
  { id: 'eggs', label: 'Eggs', emoji: '🥚', groups: ['egg'] },
  { id: 'onion-garlic', label: 'Onion & garlic', emoji: '🧅', groups: ['allium'], names: ['ginger garlic paste'] },
  { id: 'cilantro', label: 'Coriander leaves', emoji: '🌿', names: ['cilantro'] },
  { id: 'coconut', label: 'Coconut', emoji: '🥥', groups: ['coconut'] },
  { id: 'tofu', label: 'Tofu', emoji: '🍢', groups: ['soy protein'] },
  { id: 'olives', label: 'Olives', emoji: '🫒', names: ['olives'] },
  { id: 'alcohol', label: 'Cooking with alcohol', emoji: '🍷', groups: ['alcohol'] },
  { id: 'cheese', label: 'Cheese', emoji: '🧀', groups: ['soft cheese', 'hard cheese'] },
];

export const GOALS: { id: string; label: string; emoji: string }[] = [
  { id: 'quick', label: 'Quick meals', emoji: '⚡' },
  { id: 'protein', label: 'More protein', emoji: '💪' },
  { id: 'light', label: 'Lighter eating', emoji: '🥗' },
  { id: 'comfort', label: 'Comfort food', emoji: '🍲' },
  { id: 'family', label: 'Family friendly', emoji: '👨‍👩‍👧' },
  { id: 'learn', label: 'Learn new dishes', emoji: '🎓' },
];

export const SKILLS: { id: Skill; label: string; emoji: string; hint: string }[] = [
  { id: 'beginner', label: 'Just starting', emoji: '🥄', hint: 'Simple dishes with clear steps' },
  { id: 'comfortable', label: 'Comfortable', emoji: '🍳', hint: 'I cook most days' },
  { id: 'confident', label: 'Confident', emoji: '👩‍🍳', hint: 'Give me a challenge' },
];

export const TIMES: { minutes: number; label: string }[] = [
  { minutes: 15, label: '15 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 45, label: '45 min' },
  { minutes: 0, label: 'No rush' },
];

export const ADVENTURES: { id: Adventure; label: string; emoji: string; hint: string }[] = [
  { id: 'familiar', label: 'Stick to favourites', emoji: '🏠', hint: 'Mostly cuisines I already love' },
  { id: 'balanced', label: 'A bit of both', emoji: '⚖️', hint: 'Favourites with a surprise now and then' },
  { id: 'explorer', label: 'Surprise me', emoji: '🧭', hint: 'Dishes from all over the world' },
];

// ---------- Store ----------

const KEY = userKey('tasteProfile');

const load = (): TasteProfile | null => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? { ...DEFAULT_PROFILE, ...parsed } : null;
  } catch {
    return null;
  }
};

let profile: TasteProfile | null = typeof localStorage === 'undefined' ? null : load();
const listeners = new Set<() => void>();

export const getTasteProfile = () => profile;

export const saveTasteProfile = (next: Omit<TasteProfile, 'completedAt'>) => {
  profile = { ...next, completedAt: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {}
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
export const useTasteProfile = () => useSyncExternalStore(subscribe, getTasteProfile, getTasteProfile);

// ---------- Scoring ----------

// How much heat each ingredient brings; a recipe's heat is the sum, capped at 3
const HEAT: Record<string, number> = {
  'green chili': 1,
  'chili powder': 1,
  'hot sauce': 1,
  gochujang: 1,
  gochugaru: 1,
  harissa: 1,
  'thai curry paste': 1,
  'cajun seasoning': 0.5,
  'sambar powder': 0.5,
  'black pepper': 0.25,
  paprika: 0.25,
  mustard: 0.25,
  kimchi: 0.5,
};
const WANTED_HEAT: Record<SpiceLevel, number> = { mild: 0, medium: 1, hot: 2, fiery: 3 };

export const recipeHeat = (ingredients: string[]) => Math.min(3, ingredients.reduce((s, i) => s + (HEAT[i] || 0), 0));

export interface ScorableRecipe {
  ingredients: string[]; // canonical names
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  minutes: number;
  calories: number;
  protein: number;
  cuisine: string;
}

const covers = (choice: Choice, name: string, groupOf: (n: string) => string | undefined) =>
  !!choice.names?.includes(name) || (!!choice.groups && choice.groups.includes(groupOf(name) || ''));

const SWEET_CUISINES = new Set(['Indian Sweets']);
const isDessert = (r: ScorableRecipe) =>
  SWEET_CUISINES.has(r.cuisine) || (r.ingredients.includes('sugar') && r.ingredients.some((i) => ['chocolate', 'condensed milk', 'khoya', 'vanilla', 'jaggery'].includes(i)));

/**
 * Score a recipe against the answers. Positive = fits this person. An avoided ingredient costs
 * more than any bonus can give back, so such dishes sink to the bottom without being hidden.
 */
export const profileScore = (r: ScorableRecipe, p: TasteProfile | null, groupOf: (name: string) => string | undefined): number => {
  if (!p) return 0;
  let score = 0;

  const avoided = AVOIDS.filter((a) => p.avoids.includes(a.id));
  if (avoided.some((a) => r.ingredients.some((i) => covers(a, i, groupOf)))) score -= 4;

  const loved = LOVES.filter((l) => p.loves.includes(l.id));
  const hits = loved.filter((l) => r.ingredients.some((i) => covers(l, i, groupOf))).length;
  score += Math.min(hits, 3) * 0.35;

  // Heat: full marks for the level asked for, a growing penalty for each step away from it.
  // Too hot for someone who wants mild counts more than too mild for someone who likes heat.
  const gap = recipeHeat(r.ingredients) - WANTED_HEAT[p.spice];
  score += gap > 0 ? -0.45 * gap : 0.15 * gap;

  if (p.skill === 'beginner') score += r.difficulty === 'Easy' ? 0.3 : r.difficulty === 'Medium' ? -0.4 : -1.5;
  if (p.skill === 'confident' && r.difficulty !== 'Easy') score += 0.2;

  if (p.weeknightMinutes && r.minutes > p.weeknightMinutes) score -= Math.min(1.2, (r.minutes - p.weeknightMinutes) / 30);

  if (p.goals.includes('quick') && r.minutes <= 30) score += 0.3;
  if (p.goals.includes('protein') && (r.tags.includes('High-Protein') || r.protein >= 28)) score += 0.4;
  if (p.goals.includes('light') && r.calories <= 400) score += 0.35;
  if (p.goals.includes('light') && r.calories >= 600) score -= 0.3;
  if (p.goals.includes('comfort') && r.calories >= 450) score += 0.25;
  if (p.goals.includes('family') && recipeHeat(r.ingredients) <= 1 && r.difficulty !== 'Hard') score += 0.25;
  if (p.goals.includes('learn') && r.difficulty !== 'Easy') score += 0.2;

  if (isDessert(r)) score += p.sweetTooth ? 0.3 : -0.3;
  return score;
};

/** One sentence for cloud AI prompts. Empty when the questions were skipped. */
export const describeTasteProfile = (p: TasteProfile | null, regions: string[] = []): string => {
  if (!p) return '';
  const label = (list: { id: string; label: string }[], ids: string[]) => list.filter((x) => ids.includes(x.id)).map((x) => x.label.toLowerCase());
  const parts = [`likes ${p.spice} heat`, `cooking skill: ${p.skill}`];
  if (p.loves.length) parts.push(`loves ${label(LOVES, p.loves).join(', ')}`);
  if (p.avoids.length) parts.push(`never use ${label(AVOIDS, p.avoids).join(', ')}`);
  if (p.weeknightMinutes) parts.push(`usually has ${p.weeknightMinutes} minutes to cook`);
  if (p.goals.length) parts.push(`wants ${label(GOALS, p.goals).join(', ')}`);
  if (regions.length) parts.push(`favourite cuisines: ${regions.join(', ')}`);
  parts.push(p.adventure === 'explorer' ? 'enjoys trying unfamiliar cuisines' : p.adventure === 'familiar' ? 'prefers familiar cuisines' : 'open to a mix of familiar and new');
  if (p.sweetTooth) parts.push('has a sweet tooth');
  return parts.join('; ');
};
