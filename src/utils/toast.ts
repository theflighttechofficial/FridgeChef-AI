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

// Server marks offline sample responses with this header. Tell the user once per session.
let fallbackNoticeShown = false;
export const noteIfFallback = (res: Response) => {
  if (fallbackNoticeShown || !res.headers.get('X-AI-Fallback')) return;
  fallbackNoticeShown = true;
  showToast('AI service is offline, so you are seeing sample results.', 'info');
};
