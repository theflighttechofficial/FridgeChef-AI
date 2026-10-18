/**
 * Routes every `fetch('/api/...')` in the app through one place:
 *   - prefixes the server URL in the Android app (the website keeps relative URLs)
 *   - attaches the person's own AI provider, key and model as headers so the server uses them
 *     for that request only (it never stores or logs them)
 *   - fails fast when the Android app has no server configured, so callers fall back at once
 * Components keep calling plain fetch('/api/...'); nothing else needs to know about this.
 */
import { activeProvider, apiBase, getAiSettings, hasServer } from './settings';
import { HEADER_KEY, HEADER_MODEL, HEADER_PROVIDER } from './providers';

let installed = false;

export const installApiClient = () => {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  const nativeFetch = window.fetch.bind(window);

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    // Only plain string/URL calls are rewritten; Request objects pass through untouched
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : '';
    if (!url.startsWith('/api/')) return nativeFetch(input, init);
    if (!hasServer()) return Promise.reject(new TypeError('No FridgeChef server configured'));

    const headers = new Headers(init?.headers);
    const provider = activeProvider(getAiSettings());
    if (provider && !provider.def.deviceOnly) {
      headers.set(HEADER_PROVIDER, provider.def.id);
      headers.set(HEADER_KEY, provider.apiKey);
      headers.set(HEADER_MODEL, provider.model);
    }
    return nativeFetch(apiBase() + url, { ...init, headers });
  };
};
