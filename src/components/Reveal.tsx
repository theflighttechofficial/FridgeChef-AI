import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

// Fades and lifts a section into place the first time it scrolls into view
export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 32, scale: 0.985 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);
