import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { subscribeToasts, ToastMessage } from '../utils/toast';

const TOAST_MS = 5000;

// Bottom-centre stack of short notices; each one dismisses itself after a few seconds
export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(
    () =>
      subscribeToasts((toast) => {
        // Collapse repeats of the same message so a burst of failures shows once
        setToasts((prev) => (prev.some((t) => t.text === toast.text) ? prev : [...prev.slice(-2), toast]));
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), TOAST_MS);
      }),
    []
  );

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div
      className="fixed inset-x-0 bottom-24 md:bottom-6 z-[90] flex flex-col items-center gap-2 px-4 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto w-full max-w-md flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${
              t.kind === 'error'
                ? 'bg-slate-900 border-rose-500/40 text-rose-100'
                : 'bg-slate-900 border-slate-700 text-slate-100'
            }`}
          >
            <span className="flex-1 leading-snug">{t.text}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
