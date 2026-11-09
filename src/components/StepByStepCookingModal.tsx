import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Clock, Flame, Lightbulb, List, Pause, Play, Plus, RotateCcw, Timer, Trash2, Volume2, VolumeX, X } from 'lucide-react';
import { CookingStep, Recipe } from '../types';
import { speechEngine } from '../utils/speechUtils';
import { elaborateRecipe } from '../ml/elaborate';
import { reportMissingBasic } from '../state/basics';
import { showToast } from '../utils/toast';

interface CustomTimer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

interface StepByStepCookingModalProps {
  recipe: Recipe;
  onClose: () => void;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

const HEAT_LEVEL: Record<NonNullable<CookingStep['heat']>, number> = { Off: 0, Low: 1, 'Medium-low': 2, Medium: 3, 'Medium-high': 4, High: 5 };

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Short chime when a timer finishes (Web Audio, no asset needed)
const playChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
    osc.onended = () => ctx.close().catch(() => {});
  } catch {}
};

const HeatMeter: React.FC<{ heat: NonNullable<CookingStep['heat']> }> = ({ heat }) => (
  <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-high text-sm text-on-surface-variant">
    <Flame className="w-4 h-4 text-amber-400" />
    {heat === 'Off' ? 'No heat' : `${heat} heat`}
    {heat !== 'Off' && (
      <span className="flex gap-0.5 ml-1" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`w-1 h-3 rounded-full ${n <= HEAT_LEVEL[heat] ? 'bg-amber-400' : 'bg-on-surface-variant/25'}`} />
        ))}
      </span>
    )}
  </span>
);

export const StepByStepCookingModal: React.FC<StepByStepCookingModalProps> = ({ recipe, onClose }) => {
  // Older or AI recipes without detail get the same beginner-friendly method as on-device ones
  const steps = useMemo<CookingStep[]>(() => {
    if (recipe.steps.some((s) => s.kind || s.details?.length)) return recipe.steps;
    if (!recipe.steps.length) return [{ stepNumber: 1, instruction: recipe.description || 'Gather your ingredients and cook to taste.' }];
    return elaborateRecipe({
      title: recipe.title,
      ingredients: [...recipe.matchedIngredients, ...recipe.missingIngredients],
      assumed: recipe.assumedIngredients,
      steps: recipe.steps,
      chefTip: recipe.chefTip,
    });
  }, [recipe]);

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [handsFree, setHandsFree] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showTimers, setShowTimers] = useState(false);
  const [reported, setReported] = useState<string[]>([]);
  const step = steps[index];
  const last = index === steps.length - 1;

  // ----- Step timer -----
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    setTimerRunning(false);
    setTimerSeconds(step.timerSeconds || null);
    if (handsFree) speak(step);
    return () => speechEngine.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setTimerSeconds((s) => (s === null ? s : Math.max(0, s - 1))), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  useEffect(() => {
    if (timerRunning && timerSeconds === 0) {
      setTimerRunning(false);
      playChime();
      speechEngine.speak(`Timer done for step ${index + 1}.`);
    }
  }, [timerSeconds, timerRunning, index]);

  // ----- Extra kitchen timers -----
  const [timers, setTimers] = useState<CustomTimer[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newMins, setNewMins] = useState('5');
  const anyRunning = timers.some((t) => t.isRunning);
  useEffect(() => {
    if (!anyRunning) return;
    const id = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.isRunning) return t;
          const left = t.remainingSeconds - 1;
          if (left <= 0) {
            playChime();
            speechEngine.speak(`${t.label} is done.`);
          }
          return { ...t, remainingSeconds: Math.max(0, left), isRunning: left > 0 };
        })
      );
    }, 1000);
    return () => clearInterval(id);
  }, [anyRunning]);

  const addTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseFloat(newMins);
    if (!Number.isFinite(mins) || mins <= 0 || mins > 600) return;
    const secs = Math.round(mins * 60);
    setTimers((prev) => [...prev, { id: `t-${Date.now()}`, label: newLabel.trim() || `${mins} min timer`, totalSeconds: secs, remainingSeconds: secs, isRunning: true }]);
    setNewLabel('');
  };

  // ----- Read aloud -----
  const speak = (s: CookingStep) => {
    const text = [`Step ${steps.indexOf(s) + 1}.`, s.title, s.instruction, ...(s.details || []), s.cue ? `It's ready when: ${s.cue}` : ''].filter(Boolean).join(' ');
    speechEngine.speak(text);
  };
  const toggleHandsFree = () => {
    if (handsFree) speechEngine.stop();
    else speak(step);
    setHandsFree(!handsFree);
  };

  const go = (to: number) => {
    speechEngine.stop();
    setDir(to > index ? 1 : -1);
    setIndex(Math.max(0, Math.min(steps.length - 1, to)));
  };

  const reportBasic = (label: string) => {
    const b = reportMissingBasic(label);
    if (!b) return;
    setReported((r) => [...r, label]);
    showToast(`Noted: you're out of ${b.label.toLowerCase()}. Future recipes won't assume it.`, 'info');
  };

  const fridge = recipe.matchedIngredients;
  const basics = recipe.assumedIngredients || [];
  const toBuy = recipe.missingIngredients;

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col text-on-surface pt-safe pb-safe" role="dialog" aria-modal="true" aria-label={`Cooking ${recipe.title}`}>
      {/* Top app bar */}
      <header className="h-16 shrink-0 px-2 flex items-center gap-1">
        <button onClick={onClose} className="w-12 h-12 grid place-items-center rounded-full state-layer" aria-label="Close cooking mode">
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0 px-1">
          <h2 className="text-base font-semibold truncate">{recipe.title}</h2>
          <p className="text-xs text-on-surface-variant">
            Step {index + 1} of {steps.length}
          </p>
        </div>
        <button
          onClick={toggleHandsFree}
          className={`w-12 h-12 grid place-items-center rounded-full state-layer ${handsFree ? 'bg-primary-container text-on-primary-container' : ''}`}
          aria-label={handsFree ? 'Stop reading steps aloud' : 'Read steps aloud'}
          aria-pressed={handsFree}
        >
          {handsFree ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button onClick={() => setShowTimers(true)} className="relative w-12 h-12 grid place-items-center rounded-full state-layer" aria-label="Kitchen timers">
          <Timer className="w-5 h-5" />
          {anyRunning && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-primary" />}
        </button>
        <button onClick={() => setShowSteps(true)} className="w-12 h-12 grid place-items-center rounded-full state-layer" aria-label="All steps">
          <List className="w-5 h-5" />
        </button>
      </header>

      {/* Segmented progress */}
      <div className="px-4 flex gap-1" aria-hidden>
        {steps.map((_, i) => (
          <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= index ? 'bg-primary' : 'bg-surface-highest'}`} />
        ))}
      </div>

      {/* Step content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className="max-w-2xl mx-auto px-5 py-6 space-y-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="h-8 px-3 rounded-full bg-primary text-on-primary text-sm font-semibold inline-flex items-center">
                {step.kind === 'prep' ? 'Prep' : step.kind === 'serve' ? 'Finish' : `Step ${index + 1}`}
              </span>
              {step.heat && <HeatMeter heat={step.heat} />}
              {step.timerSeconds ? (
                <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-high text-sm text-on-surface-variant">
                  <Clock className="w-4 h-4" /> {Math.max(1, Math.round(step.timerSeconds / 60))} min
                </span>
              ) : null}
            </div>

            <div className="space-y-2">
              {step.title && <p className="text-sm font-semibold text-primary">{step.title}</p>}
              <h1 className="text-[1.6rem] sm:text-3xl leading-snug font-semibold tracking-tight">{step.instruction}</h1>
            </div>

            {/* Prep step: everything the recipe needs, with a way to report missing basics */}
            {step.kind === 'prep' && (
              <section className="rounded-3xl bg-surface-container p-4 space-y-4">
                {fridge.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">From your fridge</h3>
                    <div className="flex flex-wrap gap-2">
                      {fridge.map((i) => (
                        <span key={i} className="h-8 px-3 rounded-lg bg-surface-high text-sm inline-flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-primary" /> {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {basics.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Kitchen basics we assumed</h3>
                    <p className="text-xs text-on-surface-variant">Tap anything you don't have and we'll stop assuming it.</p>
                    <div className="flex flex-wrap gap-2">
                      {basics.map((i) =>
                        reported.includes(i) ? (
                          <span key={i} className="h-8 px-3 rounded-lg border border-outline-variant text-sm inline-flex items-center text-on-surface-variant line-through">
                            {i}
                          </span>
                        ) : (
                          <button
                            key={i}
                            onClick={() => reportBasic(i)}
                            className="h-8 px-3 rounded-lg border border-outline-variant text-sm inline-flex items-center gap-1.5 state-layer"
                            aria-label={`I don't have ${i}`}
                          >
                            {i} <X className="w-3.5 h-3.5 text-on-surface-variant" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
                {toBuy.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">You may need to buy</h3>
                    <p className="text-sm">{toBuy.join(', ')}</p>
                  </div>
                )}
              </section>
            )}

            {/* How to do it */}
            {step.details && step.details.length > 0 && (
              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{step.kind === 'prep' ? 'Prep list' : 'How to do it'}</h3>
                <ol className="space-y-2">
                  {step.details.map((d, i) => (
                    <li key={i} className="flex gap-3 text-base leading-relaxed">
                      <span className="w-6 h-6 shrink-0 mt-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold grid place-items-center">{i + 1}</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Done when */}
            {step.cue && (
              <section className="rounded-2xl bg-primary-container text-on-primary-container p-4 flex gap-3">
                <Check className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-80">It's ready when</p>
                  <p className="text-base">{step.cue}</p>
                </div>
              </section>
            )}

            {step.kind !== 'prep' && step.keyIngredients && step.keyIngredients.length > 0 && (
              <p className="text-sm text-on-surface-variant">
                <span className="font-semibold text-on-surface">You'll use: </span>
                {step.keyIngredients.join(', ')}
              </p>
            )}

            {step.chefTip && (
              <section className="rounded-2xl bg-surface-container p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                <p className="text-sm leading-relaxed">{step.chefTip}</p>
              </section>
            )}

            {/* Step timer */}
            {timerSeconds !== null && (
              <section className="rounded-3xl bg-surface-container p-4 flex items-center gap-4">
                <p className={`flex-1 text-4xl font-semibold tabular-nums ${timerSeconds === 0 ? 'text-rose-300' : ''}`}>{formatTime(timerSeconds)}</p>
                <button onClick={() => setTimerSeconds(step.timerSeconds || null)} className="w-12 h-12 grid place-items-center rounded-full state-layer" aria-label="Reset timer">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => (timerSeconds === 0 ? (setTimerSeconds(step.timerSeconds || 0), setTimerRunning(true)) : setTimerRunning(!timerRunning))}
                  className="h-12 px-5 rounded-full bg-primary text-on-primary font-semibold inline-flex items-center gap-2"
                >
                  {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {timerRunning ? 'Pause' : timerSeconds === 0 ? 'Restart' : 'Start'}
                </button>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <footer className="shrink-0 px-4 py-3 flex gap-3 border-t border-outline-variant/40">
        <button
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="h-14 px-5 rounded-full border border-outline-variant font-semibold inline-flex items-center gap-1 disabled:opacity-40 state-layer"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={() => (last ? onClose() : go(index + 1))}
          className="flex-1 h-14 rounded-full bg-primary text-on-primary font-semibold inline-flex items-center justify-center gap-1"
        >
          {last ? (
            <>
              <Check className="w-5 h-5" /> Done cooking
            </>
          ) : (
            <>
              Next step <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </footer>

      {/* All steps sheet */}
      <AnimatePresence>
        {showSteps && (
          <Sheet title="All steps" onClose={() => setShowSteps(false)}>
            <ol className="space-y-1">
              {steps.map((s, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      go(i);
                      setShowSteps(false);
                    }}
                    className={`w-full p-3 rounded-2xl text-left flex gap-3 state-layer ${i === index ? 'bg-secondary-container text-on-secondary-container' : ''}`}
                  >
                    <span className={`w-7 h-7 shrink-0 rounded-full grid place-items-center text-xs font-semibold ${i < index ? 'bg-primary text-on-primary' : 'bg-surface-highest'}`}>
                      {i < index ? <Check className="w-4 h-4" /> : i + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{s.title || s.instruction}</span>
                  </button>
                </li>
              ))}
            </ol>
          </Sheet>
        )}

        {showTimers && (
          <Sheet title="Kitchen timers" onClose={() => setShowTimers(false)}>
            <form onSubmit={addTimer} className="flex gap-2">
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="What is it for?"
                className="flex-1 min-w-0 h-12 px-4 rounded-2xl bg-surface-high outline-none focus:ring-2 ring-primary"
              />
              <input
                type="number"
                min="0.5"
                max="600"
                step="0.5"
                value={newMins}
                onChange={(e) => setNewMins(e.target.value)}
                className="w-20 h-12 px-3 rounded-2xl bg-surface-high text-center outline-none focus:ring-2 ring-primary"
                aria-label="Minutes"
              />
              <button type="submit" className="h-12 w-12 shrink-0 rounded-2xl bg-primary text-on-primary grid place-items-center" aria-label="Add timer">
                <Plus className="w-5 h-5" />
              </button>
            </form>
            {!timers.length ? (
              <p className="text-sm text-on-surface-variant text-center py-6">No extra timers. Add one for anything cooking on the side.</p>
            ) : (
              <ul className="space-y-2 mt-3">
                {timers.map((t) => (
                  <li key={t.id} className="p-3 rounded-2xl bg-surface-high flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{t.label}</p>
                      <p className={`text-2xl font-semibold tabular-nums ${t.remainingSeconds === 0 ? 'text-rose-300' : ''}`}>{formatTime(t.remainingSeconds)}</p>
                    </div>
                    <button onClick={() => setTimers((p) => p.map((x) => (x.id === t.id ? { ...x, isRunning: !x.isRunning } : x)))} className="w-11 h-11 grid place-items-center rounded-full bg-primary text-on-primary" aria-label={t.isRunning ? 'Pause' : 'Start'}>
                      {t.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setTimers((p) => p.map((x) => (x.id === t.id ? { ...x, remainingSeconds: x.totalSeconds, isRunning: false } : x)))} className="w-11 h-11 grid place-items-center rounded-full state-layer" aria-label="Reset">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button onClick={() => setTimers((p) => p.filter((x) => x.id !== t.id))} className="w-11 h-11 grid place-items-center rounded-full state-layer" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sheet: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        ref={ref}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        className="relative w-full sm:max-w-md max-h-[80dvh] overflow-y-auto rounded-t-[1.75rem] sm:rounded-[1.75rem] bg-surface-low p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="w-8 h-1 rounded-full bg-on-surface-variant/40 mx-auto mb-3" />
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="w-10 h-10 grid place-items-center rounded-full state-layer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};
