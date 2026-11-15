/**
 * Top of the Fridge tab: a greeting by time of day and the person's own numbers (cooking streak,
 * dishes cooked, recipes saved), which count up when they come into view.
 */
import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { Bookmark, ChefHat, Flame } from 'lucide-react';
import { useAccount } from '../auth/account';
import { cookLog, cookStreak } from '../state/userData';
import { SPICE, useTasteProfile } from '../state/tasteProfile';

const greeting = (hour: number) => (hour < 5 ? 'Still up' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 22 ? 'Good evening' : 'Late-night bite');
const prompt = (hour: number) => (hour < 11 ? "What's for breakfast?" : hour < 16 ? "What's for lunch?" : hour < 22 ? "What's for dinner?" : 'Something quick?');

const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) return setShown(value);
    const controls = animate(0, value, { duration: 0.9, ease: [0.2, 0, 0, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [value, inView, reduce]);
  return <span ref={ref} className="tabular-nums">{shown}</span>;
};

const Stat: React.FC<{ icon: React.ReactNode; value: number; label: string; delay: number; onClick?: () => void }> = ({ icon, value, label, delay, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 14, scale: 0.94 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: 'spring', stiffness: 380, damping: 28, delay }}
    whileTap={{ scale: 0.96 }}
    className="flex-1 min-w-0 rounded-3xl bg-surface-container px-4 py-3 text-left"
  >
    <span className="flex items-center gap-2 text-primary">
      {icon}
      <span className="text-2xl font-semibold text-on-surface">
        <CountUp value={value} />
      </span>
    </span>
    <span className="block text-xs text-on-surface-variant truncate">{label}</span>
  </motion.button>
);

export const HomeGreeting: React.FC<{ savedCount: number; onOpenSaved: () => void; onOpenRecipes: () => void }> = ({ savedCount, onOpenSaved, onOpenRecipes }) => {
  const { account } = useAccount();
  const log = cookLog.use();
  const profile = useTasteProfile();
  const hour = new Date().getHours();
  const first = account?.name.trim().split(/\s+/)[0];
  const spice = profile && SPICE.find((s) => s.id === profile.spice);

  return (
    <section className="space-y-4" aria-label="Your kitchen at a glance">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}>
        <p className="text-sm text-on-surface-variant">
          {greeting(hour)}
          {first ? `, ${first}` : ''} <span aria-hidden="true" className="inline-block animate-wave origin-[70%_70%]">👋</span>
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-on-surface">{prompt(hour)}</h2>
        {spice && (
          <p className="mt-1 text-xs text-on-surface-variant">
            Tuned to your taste: {spice.emoji} {spice.label.toLowerCase()} heat
            {profile.loves.length ? ` · ${profile.loves.length} favourites` : ''}
            {profile.avoids.length ? ` · ${profile.avoids.length} to skip` : ''}
          </p>
        )}
      </motion.div>
      <div className="flex gap-3 sm:max-w-xl">
        <Stat icon={<Flame className="w-5 h-5" />} value={cookStreak(log)} label="day streak" delay={0.05} onClick={onOpenRecipes} />
        <Stat icon={<ChefHat className="w-5 h-5" />} value={log.length} label="cooked" delay={0.11} onClick={onOpenRecipes} />
        <Stat icon={<Bookmark className="w-5 h-5" />} value={savedCount} label="saved" delay={0.17} onClick={onOpenSaved} />
      </div>
    </section>
  );
};
