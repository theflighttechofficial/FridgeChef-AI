// Tiny app-wide toast bus. Any component can call showToast(); <Toaster /> renders them.
export type ToastKind = 'error' | 'info';
export interface ToastMessage {
  id: number;
  kind: ToastKind;
  text: string;
}

type Listener = (toast: ToastMessage) => void;
const listeners = new Set<Listener>();
let nextId = 1;

export const showToast = (text: string, kind: ToastKind = 'error') => {
  const toast = { id: nextId++, kind, text };
  listeners.forEach((l) => l(toast));
};

export const subscribeToasts = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const AI_OFFLINE_MESSAGE = "Couldn't reach the AI service. Showing sample results instead.";

// Server marks offline answers with X-AI-Fallback and a route-specific X-AI-Fallback-Message.
// Each distinct message is shown once per page load so repeated calls don't spam notices.
const shownFallbackMessages = new Set<string>();
export const noteIfFallback = (res: Response) => {
  if (!res.headers.get('X-AI-Fallback')) return;
  let message = 'AI service is offline, so you are seeing sample results.';
  try {
    const header = res.headers.get('X-AI-Fallback-Message');
    if (header) message = decodeURIComponent(header);
  } catch {}
  if (shownFallbackMessages.has(message)) return;
  shownFallbackMessages.add(message);
  showToast(message, 'info');
};
