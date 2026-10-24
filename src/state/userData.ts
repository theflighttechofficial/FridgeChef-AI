/**
 * Everything personal the app stores lives under one key prefix, so a new account always
 * starts from scratch and "Delete account" removes it all in one go.
 */
import { useSyncExternalStore } from 'react';
import { Recipe } from '../types';

export const USER_PREFIX = 'fridgechef.u.';
export const userKey = (name: string) => USER_PREFIX + name;

// Keys used before user data was namespaced; removed together with the account
const LEGACY_KEYS = ['fridgechef.savedRecipes', 'fridgechef.shoppingList', 'fridgechef.tasteModel.v1'];
// Device-wide keys that still belong to the person: their AI key goes with their account
const PERSONAL_KEYS = ['fridgechef.aiSettings.v1'];

export const wipeUserData = () => {
  try {
    const doomed: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith(USER_PREFIX) || LEGACY_KEYS.includes(k) || PERSONAL_KEYS.includes(k))) doomed.push(k);
    }
    doomed.forEach((k) => localStorage.removeItem(k));
  } catch {}
};

/** Move data saved by older versions under the user prefix (once). */
export const migrateLegacyUserData = () => {
  try {
    const saved = localStorage.getItem('fridgechef.savedRecipes');
    if (saved && !localStorage.getItem(userKey('savedRecipes'))) localStorage.setItem(userKey('savedRecipes'), saved);
    // The old shopping list started with sample items, so only real additions carry over
    const shopping = localStorage.getItem('fridgechef.shoppingList');
    if (shopping && !localStorage.getItem(userKey('shoppingList'))) {
      const items = (JSON.parse(shopping) as { id: string }[]).filter((i) => !/^shop-\d$/.test(String(i.id)));
      localStorage.setItem(userKey('shoppingList'), JSON.stringify(items));
    }
    localStorage.removeItem('fridgechef.savedRecipes');
    localStorage.removeItem('fridgechef.shoppingList');
  } catch {}
};

// ---------- Small persisted logs other screens derive their numbers from ----------

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const createLog = <T>(name: string, max: number) => {
  const key = userKey(name);
  let entries = readJson<T[]>(key, []);
  const listeners = new Set<() => void>();
  const add = (entry: T) => {
    entries = [...entries, entry].slice(-max);
    try {
      localStorage.setItem(key, JSON.stringify(entries));
    } catch {}
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  };
  const use = () => useSyncExternalStore(subscribe, () => entries, () => entries);
  return { add, use, get: () => entries };
};

export interface CookEntry {
  title: string;
  cuisine: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  at: string;
}

const grams = (s?: string) => Number.parseInt(String(s || '').replace(/[^\d]/g, ''), 10) || 0;

/** Meals the person started cooking: feeds nutrition, sustainability and taste screens. */
export const cookLog = createLog<CookEntry>('cookLog', 400);
export const recordCook = (r: Recipe) =>
  cookLog.add({
    title: r.title,
    cuisine: r.cuisine,
    calories: r.calories,
    protein: grams(r.macros?.protein),
    carbs: grams(r.macros?.carbs),
    fat: grams(r.macros?.fat),
    ingredients: r.matchedIngredients,
    at: new Date().toISOString(),
  });

/** Consecutive days (ending today or yesterday) with at least one meal cooked. */
export const cookStreak = (log: CookEntry[]) => {
  const days = new Set(log.map((m) => new Date(m.at).toDateString()));
  const d = new Date();
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(d.toDateString())) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
};

export interface ReceiptEntry {
  store: string;
  total: number;
  items: { name: string; category: string; price: number }[];
  at: string;
}

/** Receipts imported into the pantry: feeds the spending screen. */
export const receiptLog = createLog<ReceiptEntry>('receiptLog', 200);
