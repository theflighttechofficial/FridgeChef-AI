/**
 * Material You style dynamic colour. Every tonal palette in index.css is derived from one
 * `--seed-hue` variable, so re-theming the whole app is a single CSS variable change.
 */
import { useSyncExternalStore } from 'react';

export interface Seed {
  id: string;
  label: string;
  hue: number;
}

export const SEEDS: Seed[] = [
  { id: 'basil', label: 'Basil', hue: 155 },
  { id: 'matcha', label: 'Matcha', hue: 125 },
  { id: 'lagoon', label: 'Lagoon', hue: 195 },
  { id: 'blueberry', label: 'Blueberry', hue: 260 },
  { id: 'plum', label: 'Plum', hue: 310 },
  { id: 'radish', label: 'Radish', hue: 10 },
  { id: 'saffron', label: 'Saffron', hue: 65 },
];

const STORAGE_KEY = 'fridgechef.seed';
const listeners = new Set<() => void>();

const read = (): Seed => {
  try {
    return SEEDS.find((s) => s.id === localStorage.getItem(STORAGE_KEY)) || SEEDS[0];
  } catch {
    return SEEDS[0];
  }
};

let current = read();

const apply = (seed: Seed) => {
  document.documentElement.style.setProperty('--seed-hue', String(seed.hue));
  // Match the Android status bar / browser chrome to the surface colour
  const surface = getComputedStyle(document.documentElement).getPropertyValue('--n-950').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', surface || '#0f1412');
};

export const initDynamicColor = () => apply(current);

export const setSeed = (seed: Seed) => {
  current = seed;
  try {
    localStorage.setItem(STORAGE_KEY, seed.id);
  } catch {}
  apply(seed);
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const useSeed = () => useSyncExternalStore(subscribe, () => current, () => current);
