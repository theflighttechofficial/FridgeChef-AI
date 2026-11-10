/**
 * Which kitchen basics (src/ml/basics.ts) the person has told us they are out of. Stored with
 * their other data, so it resets with the account. Recipes then treat those as missing.
 */
import { useSyncExternalStore } from 'react';
import { KITCHEN_BASICS, assumedBasics } from '../ml/basics';
import { userKey } from './userData';

const KEY = userKey('missingBasics');
const listeners = new Set<() => void>();

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

let missing = read();

const save = (next: string[]) => {
  missing = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
};

export const getMissingBasics = () => missing;
export const getAssumedBasics = () => assumedBasics(missing);

/** Accepts a canonical name or a display label ("Coriander leaves"). */
export const reportMissingBasic = (nameOrLabel: string) => {
  const b = KITCHEN_BASICS.find((k) => k.name === nameOrLabel || k.label === nameOrLabel);
  if (b && !missing.includes(b.name)) save([...missing, b.name]);
  return b;
};

export const restockBasic = (name: string) => save(missing.filter((m) => m !== name));

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const useMissingBasics = () => useSyncExternalStore(subscribe, getMissingBasics, getMissingBasics);
