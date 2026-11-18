/**
 * A burst of food confetti for good moments (finishing a dish). Pure transforms, removed from the
 * page when done; nothing is drawn when the person prefers reduced motion.
 */
import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const PIECES = ['🎉', '🍅', '🥕', '🧄', '🌶️', '🍋', '🥬', '✨', '🧀', '🍳', '⭐', '🫑'];

export const Celebrate: React.FC<{ count?: number }> = ({ count = 26 }) => {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        emoji: PIECES[i % PIECES.length],
        x: (Math.random() - 0.5) * 340,
        y: -(140 + Math.random() * 300),
        rotate: (Math.random() - 0.5) * 540,
        delay: Math.random() * 0.15,
        size: 18 + Math.random() * 18,
      })),
    [count]
  );
  if (reduce) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] grid place-items-center overflow-hidden">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ fontSize: p.size }}
          initial={{ x: 0, y: 80, opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{ x: p.x, y: [80, p.y, p.y + 520], opacity: [0, 1, 1, 0], scale: 1, rotate: p.rotate }}
          transition={{ duration: 1.9, delay: p.delay, ease: [0.2, 0.8, 0.3, 1], times: [0, 0.35, 1] }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
};
