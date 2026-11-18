/**
 * "Indian food first" switch on the Fridge tab. Material 3 switch with a spring thumb; the card
 * warms up in saffron tones while it is on.
 */
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const IndianFocusToggle: React.FC<{ on: boolean; onChange: (on: boolean) => void }> = ({ on, onChange }) => (
  <motion.button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => onChange(!on)}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 380, damping: 30, delay: 0.12 }}
    className={`w-full sm:max-w-xl text-left rounded-3xl px-4 py-3.5 flex items-center gap-4 border transition-colors duration-300 ${
      on ? 'bg-[oklch(32%_0.07_60)] border-[oklch(62%_0.14_60/0.5)]' : 'bg-surface-container border-transparent'
    }`}
  >
    <motion.span
      aria-hidden="true"
      className="text-3xl leading-none"
      animate={on ? { rotate: [0, -14, 12, 0], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      🍛
    </motion.span>
    <span className="flex-1 min-w-0">
      <span className="block font-semibold text-on-surface">Indian food first</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={on ? 'on' : 'off'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
          className="block text-xs text-on-surface-variant"
        >
          {on ? 'Mostly Indian dishes, north to south and east to west, then a few others' : 'Off: dishes from every cuisine'}
        </motion.span>
      </AnimatePresence>
    </span>
    {/* M3 switch */}
    <span
      aria-hidden="true"
      className={`relative shrink-0 w-[3.25rem] h-8 rounded-full border-2 transition-colors duration-300 ${
        on ? 'bg-[oklch(78%_0.15_65)] border-transparent' : 'bg-surface-highest border-outline-variant'
      }`}
    >
      <motion.span
        className={`absolute top-1/2 -translate-y-1/2 rounded-full grid place-items-center ${on ? 'bg-[oklch(30%_0.08_55)]' : 'bg-on-surface-variant'}`}
        initial={false}
        animate={{ left: on ? 22 : 6, width: on ? 24 : 16, height: on ? 24 : 16 }}
        transition={{ type: 'spring', stiffness: 600, damping: 32 }}
      >
        {on && <Check className="w-3.5 h-3.5 text-[oklch(85%_0.12_70)]" strokeWidth={3} />}
      </motion.span>
    </span>
  </motion.button>
);
