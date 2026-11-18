/**
 * The taste questions: asked once after the account is created (and for people who had an
 * account before the questions existed), and again from Settings whenever tastes change.
 * Seven short screens; the last one shows real dishes to like or pass, which seeds the
 * on-device taste model.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, Heart, X } from 'lucide-react';
import { REGIONS } from '../../ml/data/schema';
import { getAccount, updateProfile } from '../../auth/account';
import { userKey } from '../../state/userData';
import { recordTaste } from '../../ml/tasteModel';
import {
  ADVENTURES,
  AVOIDS,
  DEFAULT_PROFILE,
  GOALS,
  LOVES,
  SKILLS,
  SPICE,
  TIMES,
  TasteProfile,
  getTasteProfile,
  saveTasteProfile,
} from '../../state/tasteProfile';
import { Chip, PrimaryButton, Screen, haptic, slide } from './parts';

const DIETS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'Nut-Free', 'Paleo'];
const REGION_CHOICES = Object.keys(REGIONS).filter((r) => r !== 'Fusion');
const SEEN_KEY = userKey('tasteQuizSeen');

/** True until the questions have been answered or skipped once. */
export const quizPending = () => {
  try {
    return !getTasteProfile() && localStorage.getItem(SEEN_KEY) !== '1';
  } catch {
    return false;
  }
};

// Well-known dishes from every region; the ones that fit the person's diet are shown
const SAMPLE_TITLES = [
  'Butter Chicken', 'Masala Dosa', 'Palak Paneer', 'Chicken Biryani', 'Dal Tadka', 'Chole Bhature', 'Pad Thai', 'Margherita Pizza',
  'Beef Tacos', 'Shakshuka', 'Kung Pao Chicken', 'Ratatouille', 'Chicken Katsu Curry', 'Falafel Wraps', 'Spaghetti Carbonara', 'Bibimbap',
  'Greek Salad', 'Fish and Chips', 'Jollof Rice', 'Hummus Bowl', 'Thai Green Curry', 'Minestrone', 'Paneer Tikka', 'Ramen', 'Chana Masala',
  'Pho Bo', 'Mango Sticky Rice', 'Aloo Gobi', 'Miso Soup with Tofu', 'Guacamole and Chips Bowl', 'Veg Hakka Noodles', 'Gulab Jamun',
];

interface SampleDish {
  title: string;
  cuisine: string;
  emoji: string;
  description: string;
  tags: string[];
  ingredients: string[];
}

const fits = (tags: string[], dietary: string[]) =>
  dietary.every((d) => tags.includes(d) || ((d === 'Vegetarian' || d === 'Dairy-Free') && tags.includes('Vegan')));

const loadDishes = async (dietary: string[]): Promise<SampleDish[]> => {
  const { corpus } = await import('../../ml/data/recipes');
  const all = corpus().filter((r) => fits(r.tags, dietary));
  const wanted = SAMPLE_TITLES.map((t) => all.find((r) => r.title === t)).filter((r): r is NonNullable<typeof r> => !!r);
  // Top up from the rest of the corpus, one dish per cuisine, when a strict diet leaves few
  const seen = new Set(wanted.map((r) => r.cuisine));
  for (const r of all) {
    if (wanted.length >= 8) break;
    if (!seen.has(r.cuisine)) {
      seen.add(r.cuisine);
      wanted.push(r);
    }
  }
  return wanted.slice(0, 8).map((r) => ({ title: r.title, cuisine: r.cuisine, emoji: r.emoji, description: r.description, tags: r.tags, ingredients: r.ingredients }));
};

// ---------- Pieces ----------

const Tile: React.FC<{ selected: boolean; onClick: () => void; emoji: string; label: string; hint?: string; wide?: boolean }> = ({ selected, onClick, emoji, label, hint, wide }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.95 }}
    animate={{ scale: selected ? 1.02 : 1 }}
    transition={{ type: 'spring', stiffness: 500, damping: 26 }}
    onClick={() => {
      haptic(6);
      onClick();
    }}
    aria-pressed={selected}
    className={`relative rounded-3xl p-4 text-left border-2 transition-colors ${wide ? 'flex items-center gap-4' : 'flex flex-col gap-2'} ${
      selected ? 'bg-primary-container text-on-primary-container border-primary' : 'bg-surface-container border-transparent text-on-surface'
    }`}
  >
    <motion.span aria-hidden="true" className="text-3xl leading-none" animate={selected ? { rotate: [0, -12, 10, 0], scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.45 }}>
      {emoji}
    </motion.span>
    <span className="min-w-0">
      <span className="block font-semibold">{label}</span>
      {hint && <span className={`block text-sm ${selected ? 'opacity-80' : 'text-on-surface-variant'}`}>{hint}</span>}
    </span>
  </motion.button>
);

const EmojiChip: React.FC<{ selected: boolean; onClick: () => void; emoji: string; children: React.ReactNode; tone?: 'love' | 'avoid' }> = ({ selected, onClick, emoji, children, tone = 'love' }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.92 }}
    onClick={() => {
      haptic(5);
      onClick();
    }}
    aria-pressed={selected}
    className={`h-12 pl-3 pr-4 rounded-2xl text-sm font-medium inline-flex items-center gap-2 border transition-colors ${
      selected
        ? tone === 'avoid'
          ? 'bg-rose-400/20 text-rose-100 border-rose-300/60 line-through decoration-rose-300/70'
          : 'bg-secondary-container text-on-secondary-container border-transparent'
        : 'border-outline-variant text-on-surface-variant state-layer'
    }`}
  >
    <span aria-hidden="true" className="text-xl no-underline">{emoji}</span>
    {children}
  </motion.button>
);

/** One dish at a time: drag it right to like, left to pass, or use the buttons. */
const DishDeck: React.FC<{ dishes: SampleDish[]; onRate: (dish: SampleDish, liked: boolean) => void; done: number }> = ({ dishes, onRate, done }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-120, -20], [1, 0]);
  const dish = dishes[done];

  useEffect(() => x.set(0), [done, x]);

  if (!dishes.length) return <div className="h-72 rounded-[2rem] bg-surface-container skeleton-shimmer overflow-hidden" />;
  if (!dish)
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-72 rounded-[2rem] bg-primary-container text-on-primary-container grid place-items-center text-center p-6">
        <div className="space-y-2">
          <p className="text-5xl">🎉</p>
          <p className="text-xl font-semibold">Got it!</p>
          <p className="opacity-80 text-sm">FridgeChef now knows where to start. It keeps learning from what you save and cook.</p>
        </div>
      </motion.div>
    );

  return (
    <div className="space-y-5">
      <div className="relative h-72">
        {/* The next card peeks out underneath */}
        {dishes[done + 1] && <div aria-hidden="true" className="absolute inset-x-4 top-3 bottom-0 rounded-[2rem] bg-surface-high opacity-60" />}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={dish.title}
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 600) onRate(dish, info.offset.x > 0);
            }}
            initial={{ scale: 0.9, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="absolute inset-0 rounded-[2rem] bg-surface-high p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing touch-pan-y shadow-xl shadow-black/30"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">{dish.cuisine}</span>
              <span className="text-xs text-on-surface-variant">
                {done + 1} / {dishes.length}
              </span>
            </div>
            <div className="text-center">
              <span aria-hidden="true" className="text-7xl block drop-shadow-xl">{dish.emoji}</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold leading-tight">{dish.title}</h3>
              <p className="text-on-surface-variant text-sm line-clamp-2">{dish.description}</p>
            </div>
            <motion.span style={{ opacity: likeOpacity }} className="absolute top-5 left-5 px-3 h-8 rounded-full bg-primary text-on-primary text-sm font-bold grid place-items-center rotate-[-8deg]">
              Yum
            </motion.span>
            <motion.span style={{ opacity: passOpacity }} className="absolute top-5 right-5 px-3 h-8 rounded-full bg-rose-400 text-rose-950 text-sm font-bold grid place-items-center rotate-[8deg]">
              Not for me
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-8">
        <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => onRate(dish, false)} aria-label={`Not for me: ${dish.title}`} className="w-16 h-16 rounded-full bg-surface-high text-rose-300 grid place-items-center shadow-lg">
          <X className="w-7 h-7" />
        </motion.button>
        <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => onRate(dish, true)} aria-label={`I like ${dish.title}`} className="w-20 h-20 rounded-full bg-primary text-on-primary grid place-items-center shadow-xl">
          <Heart className="w-9 h-9 fill-current" />
        </motion.button>
      </div>
      <p className="text-center text-xs text-on-surface-variant">Swipe the card or tap a button</p>
    </div>
  );
};

// ---------- Quiz ----------

const TITLES: [string, string][] = [
  ['How do you eat?', 'Pick any that apply. Recipes will always respect these.'],
  ['Which cuisines do you love?', 'Pick as many as you like, or none to see everything.'],
  ['How spicy do you like it?', 'This sets the heat of the dishes we suggest.'],
  ['What do you love to eat?', 'Dishes with these move up your list.'],
  ['Anything you would rather skip?', 'Dishes with these move to the bottom of your list.'],
  ['How do you cook?', 'So the recipes fit your evening.'],
  ['What are you looking for?', 'Pick what matters most right now.'],
  ['Yum or not for you?', 'A few real dishes, so FridgeChef learns your taste from the start.'],
];
const LAST = TITLES.length - 1;

export const TasteQuiz: React.FC<{ onDone: () => void; editing?: boolean }> = ({ onDone, editing }) => {
  const account = getAccount();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [dietary, setDietary] = useState<string[]>(account?.dietary || []);
  const [regions, setRegions] = useState<string[]>(account?.regions || []);
  const [answers, setAnswers] = useState<Omit<TasteProfile, 'completedAt'>>(() => ({ ...DEFAULT_PROFILE, ...(getTasteProfile() || {}) }));
  const [dishes, setDishes] = useState<SampleDish[]>([]);
  const [rated, setRated] = useState(0);

  const set = <K extends keyof TasteProfile>(key: K, value: TasteProfile[K]) => setAnswers((a) => ({ ...a, [key]: value }));
  const toggleIn = (key: 'loves' | 'avoids' | 'goals', id: string) =>
    setAnswers((a) => ({ ...a, [key]: a[key].includes(id) ? a[key].filter((x) => x !== id) : [...a[key], id] }));
  const toggle = (list: string[], setList: (v: string[]) => void, v: string) => setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const dietKey = dietary.join('|');
  useEffect(() => {
    if (step !== LAST) return;
    let live = true;
    setRated(0);
    setDishes([]);
    loadDishes(dietary).then((d) => live && setDishes(d)).catch(() => {});
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, dietKey]);

  const go = (to: number) => {
    haptic();
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const markSeen = () => {
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {}
  };

  const finish = () => {
    updateProfile({ dietary, regions });
    saveTasteProfile(answers);
    markSeen();
    haptic(14);
    onDone();
  };

  const skip = () => {
    markSeen();
    onDone();
  };

  const rate = (dish: SampleDish, liked: boolean) => {
    haptic(liked ? 12 : 6);
    recordTaste({ cuisine: dish.cuisine, dietaryTags: dish.tags, matchedIngredients: dish.ingredients, missingIngredients: [] }, liked ? 1 : 0);
    setRated((n) => n + 1);
  };

  const lovesShown = useMemo(() => {
    // Hide choices the chosen diet rules out
    const veg = dietary.includes('Vegetarian') || dietary.includes('Vegan');
    const vegan = dietary.includes('Vegan');
    return LOVES.filter((l) => !(veg && ['chicken', 'red-meat', 'seafood'].includes(l.id)) && !(vegan && ['eggs', 'paneer-cheese', 'creamy'].includes(l.id)));
  }, [dietary]);

  return (
    <Screen>
      <div className="h-16 flex items-center gap-2 px-2">
        <button
          type="button"
          onClick={() => (step === 0 ? skip() : go(step - 1))}
          className="w-12 h-12 grid place-items-center rounded-full state-layer text-on-surface"
          aria-label={step === 0 ? 'Close' : 'Back'}
        >
          {step === 0 ? <X className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
        </button>
        <div className="flex-1 flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={TITLES.length} aria-valuenow={step + 1}>
          {TITLES.map((_, i) => (
            <span key={i} className="h-1.5 flex-1 rounded-full bg-surface-highest overflow-hidden">
              <motion.span className="block h-full rounded-full bg-primary" initial={false} animate={{ width: i <= step ? '100%' : '0%' }} transition={{ type: 'spring', stiffness: 260, damping: 30 }} />
            </span>
          ))}
        </div>
        <button type="button" onClick={skip} className="h-10 px-4 rounded-full text-primary font-semibold state-layer text-sm">
          {editing ? 'Cancel' : 'Skip'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="pt-4 pb-8 space-y-6"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">
                Your taste · {step + 1} of {TITLES.length}
              </p>
              <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">{TITLES[step][0]}</h1>
              <p className="text-on-surface-variant">{TITLES[step][1]}</p>
            </div>

            {step === 0 && (
              <div className="flex flex-wrap gap-2">
                {DIETS.map((d) => (
                  <Chip key={d} selected={dietary.includes(d)} onClick={() => toggle(dietary, setDietary, d)}>
                    {d}
                  </Chip>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-wrap gap-2">
                {REGION_CHOICES.map((r) => (
                  <Chip key={r} selected={regions.includes(r)} onClick={() => toggle(regions, setRegions, r)}>
                    {r}
                  </Chip>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {SPICE.map((s) => (
                    <Tile key={s.id} selected={answers.spice === s.id} onClick={() => set('spice', s.id)} emoji={s.emoji} label={s.label} hint={s.hint} />
                  ))}
                </div>
                <Tile wide selected={answers.sweetTooth} onClick={() => set('sweetTooth', !answers.sweetTooth)} emoji="🍰" label="I have a sweet tooth" hint="Show desserts and sweets too" />
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-wrap gap-2">
                {lovesShown.map((l) => (
                  <EmojiChip key={l.id} emoji={l.emoji} selected={answers.loves.includes(l.id)} onClick={() => toggleIn('loves', l.id)}>
                    {l.label}
                  </EmojiChip>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-wrap gap-2">
                {AVOIDS.map((a) => (
                  <EmojiChip key={a.id} tone="avoid" emoji={a.emoji} selected={answers.avoids.includes(a.id)} onClick={() => toggleIn('avoids', a.id)}>
                    {a.label}
                  </EmojiChip>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <section className="space-y-3">
                  <h2 className="text-sm font-semibold text-on-surface-variant">In the kitchen I am</h2>
                  <div className="grid gap-3">
                    {SKILLS.map((s) => (
                      <Tile key={s.id} wide selected={answers.skill === s.id} onClick={() => set('skill', s.id)} emoji={s.emoji} label={s.label} hint={s.hint} />
                    ))}
                  </div>
                </section>
                <section className="space-y-3">
                  <h2 className="text-sm font-semibold text-on-surface-variant">On a normal day I have</h2>
                  <div className="flex flex-wrap gap-2">
                    {TIMES.map((t) => (
                      <Chip key={t.minutes} selected={answers.weeknightMinutes === t.minutes} onClick={() => set('weeknightMinutes', t.minutes)}>
                        {t.label}
                      </Chip>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <EmojiChip key={g.id} emoji={g.emoji} selected={answers.goals.includes(g.id)} onClick={() => toggleIn('goals', g.id)}>
                      {g.label}
                    </EmojiChip>
                  ))}
                </div>
                <section className="space-y-3">
                  <h2 className="text-sm font-semibold text-on-surface-variant">When it comes to new dishes</h2>
                  <div className="grid gap-3">
                    {ADVENTURES.map((a) => (
                      <Tile key={a.id} wide selected={answers.adventure === a.id} onClick={() => set('adventure', a.id)} emoji={a.emoji} label={a.label} hint={a.hint} />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {step === LAST && <DishDeck dishes={dishes} done={rated} onRate={rate} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-6 pt-2">
        <PrimaryButton type="button" onClick={() => (step === LAST ? finish() : go(step + 1))}>
          {step === LAST ? (editing ? 'Save my taste' : 'Start cooking') : 'Continue'}
        </PrimaryButton>
      </div>
    </Screen>
  );
};
