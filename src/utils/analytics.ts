// First-party, consent-gated analytics. Events go to our own server (/api/analytics);
// nothing is sent until the visitor accepts in the consent banner.
export type ConsentState = 'granted' | 'denied' | null;

const CONSENT_KEY = 'fridgechef.consent';

export const getConsent = (): ConsentState => {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
};

export const setConsent = (value: 'granted' | 'denied') => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {}
  window.dispatchEvent(new CustomEvent('fridgechef:consent', { detail: value }));
};

export const track = (event: string, props: Record<string, string | number | boolean> = {}) => {
  if (getConsent() !== 'granted') return;
  const body = JSON.stringify({ event, props, path: location.pathname + location.hash, ref: document.referrer || undefined });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true });
    }
  } catch {}
};
