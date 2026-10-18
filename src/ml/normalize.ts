/**
 * Maps free-text pantry names ("Lean Ground Beef (90/10)", "Soy Sauce & Fish Sauce") onto the
 * canonical ingredient vocabulary. Shared by the training script and the in-app recommender.
 */
import { INGREDIENTS, IngredientDef } from './data/ingredients';

const stem = (word: string) => (word.length > 4 && word.endsWith('es') && !word.endsWith('ses') ? word.slice(0, -2) : word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word);

export const tokens = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(stem);

// Some canonical items are blends of others; having the blend means having its parts too.
const IMPLIES: Record<string, string[]> = {
  'ginger garlic paste': ['ginger', 'garlic'],
};

interface Phrase {
  toks: string[];
  name: string;
}

const PHRASES: Phrase[] = INGREDIENTS.flatMap((def) =>
  [def.name, ...(def.aliases || [])].map((p) => ({ toks: tokens(p), name: def.name }))
).sort((a, b) => b.toks.length - a.toks.length);

export const BY_NAME = new Map<string, IngredientDef>(INGREDIENTS.map((d) => [d.name, d]));

/** Longest-first, non-overlapping phrase matches inside one segment of text. */
const matchSegment = (segment: string): string[] => {
  const toks = tokens(segment);
  const used = new Array(toks.length).fill(false);
  const found: string[] = [];
  for (const phrase of PHRASES) {
    const n = phrase.toks.length;
    for (let i = 0; i + n <= toks.length; i++) {
      if (used.slice(i, i + n).some(Boolean)) continue;
      if (phrase.toks.every((t, k) => toks[i + k] === t)) {
        for (let k = i; k < i + n; k++) used[k] = true;
        found.push(phrase.name);
      }
    }
  }
  return found;
};

/** Canonical names found in one free-text pantry entry (may be several, may be none). */
export const canonicalize = (raw: string): string[] => {
  // "Paneer (Indian Cottage Cheese)" -> ["Paneer", "Indian Cottage Cheese"]; "Dill/Parsley" -> both
  const segments = raw
    .replace(/[()[\]]/g, '|')
    .split(/\||\/|&|,|\band\b|\bor\b|\+/i)
    .map((s) => s.trim())
    .filter(Boolean);
  const out = new Set<string>();
  for (const seg of segments) matchSegment(seg).forEach((n) => out.add(n));
  for (const n of [...out]) IMPLIES[n]?.forEach((p) => out.add(p));
  return [...out];
};

/** Map of canonical name -> original pantry entry it came from (first wins). */
export const canonicalPantry = (names: string[]) => {
  const map = new Map<string, string>();
  for (const raw of names) for (const c of canonicalize(raw)) if (!map.has(c)) map.set(c, raw);
  // A pantry with both parts also has the blend
  for (const [blend, parts] of Object.entries(IMPLIES)) {
    if (!map.has(blend) && parts.every((p) => map.has(p))) map.set(blend, map.get(parts[0])!);
  }
  return map;
};
