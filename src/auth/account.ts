/**
 * On-device account. One person per install: the profile and a salted PBKDF2 hash of the
 * password live in localStorage and never leave the device. Signing in once keeps the person
 * signed in until they sign out in Settings.
 */
import { useSyncExternalStore } from 'react';
import { wipeUserData } from '../state/userData';

export interface Account {
  name: string;
  email: string;
  seedId: string; // Material You colour picked during setup
  dietary: string[];
  regions: string[];
  createdAt: string;
  salt: string;
  hash: string;
}

const ACCOUNT_KEY = 'fridgechef.account.v1';
const SESSION_KEY = 'fridgechef.session.v1';

const read = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};
const write = (key: string, value: unknown) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

let account = read<Account>(ACCOUNT_KEY);
let signedIn = !!account && read<{ signedIn: boolean }>(SESSION_KEY)?.signedIn === true;
const listeners = new Set<() => void>();
let snapshot = { account, signedIn };
const emit = () => {
  snapshot = { account, signedIn };
  listeners.forEach((l) => l());
};

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

const hashPassword = async (password: string, salt: string) => {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    // Insecure context (plain http on a LAN): no WebCrypto, so fall back to a simple digest
    let h = 2166136261;
    for (const ch of salt + password) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return `fnv:${(h >>> 0).toString(16)}`;
  }
  const key = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 120_000 }, key, 256);
  return toHex(bits);
};

const newSalt = () => {
  const bytes = new Uint8Array(16);
  globalThis.crypto?.getRandomValues?.(bytes);
  return toHex(bytes.buffer) || String(Date.now());
};

export const createAccount = async (profile: Omit<Account, 'createdAt' | 'salt' | 'hash'>, password: string) => {
  const salt = newSalt();
  account = { ...profile, createdAt: new Date().toISOString(), salt, hash: await hashPassword(password, salt) };
  signedIn = true;
  write(ACCOUNT_KEY, account);
  write(SESSION_KEY, { signedIn: true });
  emit();
};

export const signIn = async (password: string) => {
  if (!account) return false;
  const ok = (await hashPassword(password, account.salt)) === account.hash;
  if (ok) {
    signedIn = true;
    write(SESSION_KEY, { signedIn: true });
    emit();
  }
  return ok;
};

export const signOut = () => {
  signedIn = false;
  write(SESSION_KEY, { signedIn: false });
  emit();
};

export const updateProfile = (patch: Partial<Pick<Account, 'name' | 'email' | 'seedId' | 'dietary' | 'regions'>>) => {
  if (!account) return;
  account = { ...account, ...patch };
  write(ACCOUNT_KEY, account);
  emit();
};

/** Remove the account (used by "Delete account" and "Forgot password"). Recipes and lists stay. */
/** Remove the account and everything saved with it; the next person starts from scratch. */
export const deleteAccount = () => {
  account = null;
  signedIn = false;
  write(ACCOUNT_KEY, null);
  write(SESSION_KEY, null);
  wipeUserData();
  emit();
  // In-memory state (pantry, taste model, logs) was loaded from storage at start-up
  if (typeof location !== 'undefined') location.reload();
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
export const getAccount = () => account;

export const useAccount = () => useSyncExternalStore(subscribe, () => snapshot, () => snapshot);

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || '🙂';
