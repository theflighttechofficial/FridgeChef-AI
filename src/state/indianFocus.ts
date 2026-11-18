/**
 * "Indian food first": a per-person switch on the Fridge tab. When on, recipe suggestions are
 * mostly Indian dishes from any region that fit the ingredients, followed by a few from other
 * cuisines. Stored with the person's other data on the device.
 */
import { useSyncExternalStore } from 'react';
import { userKey } from './userData';

const KEY = userKey('indianFocus');
// Share of each suggestion list that goes to Indian dishes when the switch is on
export const INDIAN_SHARE = 0.75;

const load = () => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

let on = typeof localStorage === 'undefined' ? false : load();
const listeners = new Set<() => void>();

export const getIndianFocus = () => on;

export const setIndianFocus = (value: boolean) => {
  on = value;
  try {
    localStorage.setItem(KEY, value ? '1' : '0');
  } catch {}
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
export const useIndianFocus = () => useSyncExternalStore(subscribe, getIndianFocus, getIndianFocus);
