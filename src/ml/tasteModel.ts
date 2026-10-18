/**
 * On-device taste model: a small online logistic regression that learns from what this person
 * saves, cooks and unsaves. Features are sparse (cuisine, dietary tags, ingredient groups), the
 * weights live in localStorage, and nothing leaves the device.
 */
import { Recipe } from '../types';
import { BY_NAME, canonicalize } from './normalize';

const STORAGE_KEY = 'fridgechef.tasteModel.v1';
const LEARNING_RATE = 0.25;
const DECAY = 0.995; // slow forgetting so tastes can change
const MAX_WEIGHT = 3;

export interface TasteState {
  weights: Record<string, number>;
  events: number;
}

const empty = (): TasteState => ({ weights: {}, events: 0 });

const load = (): TasteState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed.weights === 'object' ? parsed : empty();
  } catch {
    return empty();
  }
};

let state = load();
const listeners = new Set<() => void>();

const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
};

export const subscribeTaste = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getTasteState = () => state;

export const tasteFeatures = (recipe: Pick<Recipe, 'cuisine' | 'dietaryTags' | 'matchedIngredients' | 'missingIngredients'>) => {
  const feats = new Set<string>();
  if (recipe.cuisine) feats.add(`cuisine:${recipe.cuisine}`);
  for (const t of recipe.dietaryTags || []) feats.add(`tag:${t}`);
  for (const raw of [...(recipe.matchedIngredients || []), ...(recipe.missingIngredients || [])]) {
    for (const c of canonicalize(raw)) {
      const def = BY_NAME.get(c);
      if (def && !def.staple) feats.add(`group:${def.group}`);
    }
  }
  return [...feats];
};

const raw = (feats: string[]) => feats.reduce((s, f) => s + (state.weights[f] || 0), 0) / Math.sqrt(feats.length || 1);

/** Preference score in roughly [-1, 1]; 0 when the model knows nothing yet. */
export const tasteScore = (recipe: Parameters<typeof tasteFeatures>[0]) => Math.tanh(raw(tasteFeatures(recipe)));

/** One SGD step on logistic loss. signal: 1 = liked (saved / cooked), 0 = disliked (unsaved). */
export const recordTaste = (recipe: Parameters<typeof tasteFeatures>[0], signal: 0 | 1) => {
  const feats = tasteFeatures(recipe);
  if (!feats.length) return;
  const p = 1 / (1 + Math.exp(-raw(feats)));
  const step = (LEARNING_RATE * (signal - p)) / Math.sqrt(feats.length);
  const weights: Record<string, number> = {};
  for (const [k, v] of Object.entries(state.weights)) {
    const decayed = v * DECAY;
    if (Math.abs(decayed) > 0.01) weights[k] = decayed;
  }
  for (const f of feats) weights[f] = Math.max(-MAX_WEIGHT, Math.min(MAX_WEIGHT, (weights[f] || 0) + step));
  state = { weights, events: state.events + 1 };
  save();
};

export const resetTaste = () => {
  state = empty();
  save();
};

/** Strongest learned likes and dislikes, for display. */
export const topTastes = (limit = 6) => {
  const entries = Object.entries(state.weights).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  const label = (k: string) => {
    const [kind, value] = [k.slice(0, k.indexOf(':')), k.slice(k.indexOf(':') + 1)];
    return kind === 'group' ? value.replace(/\b\w/g, (c) => c.toUpperCase()) : value;
  };
  return entries.slice(0, limit).map(([k, w]) => ({ key: k, label: label(k), weight: w }));
};
