/**
 * AI settings chosen on the Settings screen. Stored in localStorage on this device only.
 *
 *   engine   'auto'  cloud AI first (the person's key, else the server's), on-device model as fallback
 *            'local' on-device model only: instant, private, works offline
 *   provider / apiKey / model / baseUrl   the person's own AI provider (optional)
 *   serverUrl   FridgeChef server for the Android app (the website uses its own origin)
 */
import { useSyncExternalStore } from 'react';
import { providerById } from './providers';

export interface AiSettings {
  engine: 'auto' | 'local';
  provider: string;
  apiKey: string;
  model: string;
  baseUrl: string;
  serverUrl: string;
}

const STORAGE_KEY = 'fridgechef.aiSettings.v1';

const DEFAULTS: AiSettings = {
  engine: 'auto',
  provider: 'gemini',
  apiKey: '',
  model: '',
  baseUrl: '',
  serverUrl: '',
};

const load = (): AiSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

let current = load();
const listeners = new Set<() => void>();

export const getAiSettings = () => current;

export const updateAiSettings = (patch: Partial<AiSettings>) => {
  current = { ...current, ...patch };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {}
  listeners.forEach((l) => l());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useAiSettings = () => useSyncExternalStore(subscribe, getAiSettings, getAiSettings);

/** The person's provider, resolved with defaults, or null when no key is set. */
export const activeProvider = (s: AiSettings = current) => {
  const def = providerById(s.provider);
  if (!def) return null;
  if (!s.apiKey.trim() && def.id !== 'custom') return null;
  return {
    def,
    apiKey: s.apiKey.trim(),
    model: s.model.trim() || def.defaultModel,
    baseUrl: (def.id === 'custom' && s.baseUrl.trim()) || def.baseUrl,
  };
};

export const isNativeApp = () => !!(window as any).Capacitor?.isNativePlatform?.();

/** Base URL for /api calls: same origin on the web; the configured server in the Android app. */
export const apiBase = () => {
  const configured = current.serverUrl.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined) || '';
  return configured.replace(/\/+$/, '');
};

/** Whether /api calls can reach a server at all (always on the web). */
export const hasServer = () => !isNativeApp() || !!apiBase();
