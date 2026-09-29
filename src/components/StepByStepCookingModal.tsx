import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  List,
  Award,
  BellRing,
  Plus,
  Trash2,
  Timer,
  WifiOff
} from 'lucide-react';
import { Recipe } from '../types';
import { speechEngine } from '../utils/speechUtils';
import { VoiceInteractionHapticPulse } from './VoiceInteractionHapticPulse';

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

export const StepByStepCookingModal: React.FC<StepByStepCookingModalProps> = ({
  recipe,
  onClose,
  skillLevel = 'Intermediate',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeSkillLevel, setActiveSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(skillLevel);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMultiTimerOpen, setIsMultiTimerOpen] = useState(false);

  // Current Step Timer
  // Guard against AI recipes that arrive without steps
  const currentStep = recipe.steps[currentStepIndex] ?? {
    stepNumber: 1,
    instruction: recipe.description || 'Gather your ingredients and cook to taste.',
  };
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceRef = useRef(autoAdvance);
  autoAdvanceRef.current = autoAdvance;

  // Persistent Custom Multi-Timers State
  const [customTimers, setCustomTimers] = useState<CustomTimer[]>([
    { id: 'ct-1', label: 'Boil Water / Pasta', totalSeconds: 480, remainingSeconds: 480, isRunning: false },
    { id: 'ct-2', label: 'Oven Roast', totalSeconds: 900, remainingSeconds: 900, isRunning: false },
  ]);
  const [newTimerLabel, setNewTimerLabel] = useState('');
  const [newTimerMins, setNewTimerMins] = useState('5');

  // Audio completion sound synthesis (Web Audio API synth chime)
  const playTimerChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
      osc.onended = () => ctx.close().catch(() => {});
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  // Reset step timer on step change
  useEffect(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);

    if (currentStep.timerSeconds) {
      setTimerSeconds(currentStep.timerSeconds);
    } else {
      setTimerSeconds(null);
    }

    // Auto read-aloud current step
    speakCurrentStep();

    return () => {
      speechEngine.stop();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    };
  }, [currentStepIndex]);

  // Step Timer Tick (interval lives for the whole running period, not per tick)
  useEffect(() => {
    if (!isTimerRunning) return;
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => (prev === null ? prev : Math.max(0, prev - 1)));
    }, 1000);
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  // Step timer completion side effects (kept out of state updaters so StrictMode doesn't double-fire)
  useEffect(() => {
    if (isTimerRunning && timerSeconds === 0) {
      setIsTimerRunning(false);
      playTimerChime();
      speechEngine.speak(`Step timer complete for step ${currentStep.stepNumber}!`);
    }
  }, [timerSeconds, isTimerRunning]);

  // Custom Multi-Timers Tick Loop
  const hasRunningCustomTimer = customTimers.some((t) => t.isRunning);
  useEffect(() => {
    if (!hasRunningCustomTimer) return;
    const customInterval = setInterval(() => {
      setCustomTimers((prev) =>
        prev.map((t) => {
          if (!t.isRunning || t.remainingSeconds <= 0) return t;
          const nextSecs = t.remainingSeconds - 1;
          return { ...t, remainingSeconds: nextSecs, isRunning: nextSecs > 0 };
        })
      );
    }, 1000);
    return () => clearInterval(customInterval);
  }, [hasRunningCustomTimer]);

  // Announce custom timers that just hit zero
  const prevCustomTimersRef = useRef(customTimers);
  useEffect(() => {
    const prevById = new Map(prevCustomTimersRef.current.map((t) => [t.id, t.remainingSeconds]));
    customTimers.forEach((t) => {
      const prevSecs = prevById.get(t.id);
      if (t.remainingSeconds === 0 && prevSecs !== undefined && prevSecs > 0) {
        playTimerChime();
        speechEngine.speak(`Kitchen timer complete: ${t.label}!`);
      }
    });
    prevCustomTimersRef.current = customTimers;
  }, [customTimers]);

  // Multi-Timer Actions
  const handleAddCustomTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseFloat(newTimerMins) || 1;
    const secs = Math.round(mins * 60);
    const newTimer: CustomTimer = {
      id: `custom-timer-${Date.now()}`,
      label: newTimerLabel.trim() || `Custom ${mins}m Timer`,
      totalSeconds: secs,
      remainingSeconds: secs,
      isRunning: true,
    };
    setCustomTimers((prev) => [...prev, newTimer]);
    setNewTimerLabel('');
    setNewTimerMins('5');
  };

  const toggleCustomTimer = (id: string) => {
    setCustomTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const resetCustomTimer = (id: string) => {
    setCustomTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false } : t))
    );
  };

  const deleteCustomTimer = (id: string) => {
    setCustomTimers((prev) => prev.filter((t) => t.id !== id));
  };

  // Read Aloud Function
  const speakCurrentStep = () => {
    const textToRead = `Step ${currentStep.stepNumber}. ${currentStep.instruction}`;
    speechEngine.speak(
      textToRead,
      () => {
        setIsSpeaking(false);
        if (autoAdvanceRef.current && currentStepIndex < recipe.steps.length - 1) {
          if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
          autoAdvanceTimeoutRef.current = setTimeout(() => {
            // Re-check: user may have toggled auto-advance off while waiting
            if (autoAdvanceRef.current) handleNextStep();
          }, 2500);
        }
      },
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const toggleSpeech = () => {
    if (speechEngine.isSpeaking()) {
      speechEngine.stop();
      setIsSpeaking(false);
    } else {
      speakCurrentStep();
    }
  };

  const handleNextStep = () => {
    speechEngine.stop();
    setCompletedSteps((prev) => (prev.includes(currentStepIndex) ? prev : [...prev, currentStepIndex]));
    setCurrentStepIndex((prev) => Math.min(prev + 1, Math.max(0, recipe.steps.length - 1)));
  };

  const handlePrevStep = () => {
    speechEngine.stop();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(currentStep.timerSeconds || null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const activeRunningCustomTimers = customTimers.filter((t) => t.isRunning).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-slate-100">
      {/* Voice Interaction Pulsing iOS Indicator Bar */}
      {isSpeaking && (
        <div className="px-6 pt-3 bg-slate-900/60">
          <VoiceInteractionHapticPulse
            isActive={isSpeaking}
            mode="speaking"
            label={`Reading Step ${currentStep.stepNumber} Aloud...`}
            onStop={() => {
              speechEngine.stop();
              setIsSpeaking(false);
            }}
          />
        </div>
      )}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
              Step-by-Step Hands-Free Mode
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
              {recipe.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Offline Mode Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
            <WifiOff className="w-3.5 h-3.5" />
            <span>OFFLINE CACHED</span>
          </div>

          {/* Read Aloud Toggle Button */}
          <button
            onClick={toggleSpeech}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isSpeaking
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 animate-pulse'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {isSpeaking ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Reading Aloud...</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Read Step</span>
              </>
            )}
          </button>

          {/* Auto Advance Toggle */}
          <button
            onClick={() => setAutoAdvance(!autoAdvance)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors hidden sm:flex items-center gap-1.5 ${
              autoAdvance
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
            title="Auto advance to next step when speech completes"
          >
            <span>Auto-Advance</span>
            <span className="text-[10px] font-bold uppercase">{autoAdvance ? 'ON' : 'OFF'}</span>
          </button>

          {/* Steps Drawer Toggle */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
            title="Overview of all steps"
          >
            <List className="w-5 h-5" />
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-800 text-slate-300 hover:bg-rose-500 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Step Content Container */}
        <div className="flex-1 max-w-4xl mx-auto px-6 py-8 flex flex-col justify-between overflow-y-auto">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-emerald-400">
                Step {currentStep.stepNumber} of {Math.max(1, recipe.steps.length)}
              </span>
              <span>
                {Math.round(((currentStepIndex + 1) / Math.max(1, recipe.steps.length)) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_10px_#10B981]"
                style={{
                  width: `${((currentStepIndex + 1) / Math.max(1, recipe.steps.length)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Large Instruction Display */}
          <div className="my-auto space-y-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <span>Instruction Step {currentStep.stepNumber}</span>
              </div>

              {/* Skill Adaptation Selector Pill */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                <span className="text-[10px] text-slate-500 font-mono uppercase px-1">SKILL MODE:</span>
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveSkillLevel(lvl)}
                    className={`px-2 py-0.5 rounded-lg transition-all ${
                      activeSkillLevel === lvl
                        ? 'bg-emerald-500 text-slate-950 font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl === 'Beginner' ? '🟢 Beginner' : lvl === 'Intermediate' ? '🟡 Mid' : '🔴 Advanced'}
                  </button>
                ))}
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight sm:leading-snug tracking-tight">
              {activeSkillLevel === 'Beginner'
                ? currentStep.instruction
                    .replace(/sear/gi, 'cook over medium-high heat for 5-6 minutes until browned')
                    .replace(/bloom/gi, 'gently heat in oil for 60 seconds until fragrant')
                    .replace(/deglaze/gi, 'pour liquid into the hot pan and scrape up any browned bits with a wooden spoon')
                : activeSkillLevel === 'Advanced'
                ? currentStep.instruction
                    .replace(/sear/gi, 'sear in hot clarified fat until a deeply caramelized Maillard crust develops')
                    .replace(/sauté/gi, 'toss vigorously over high flame to preserve cellular turgor')
                    .replace(/simmer/gi, 'reduce heat to a gentle 85°C simmer to prevent protein toughening')
                : currentStep.instruction}
            </h1>

            {/* Key Ingredients */}
            {currentStep.keyIngredients && currentStep.keyIngredients.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ingredients for this step:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentStep.keyIngredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-3 py-1 bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Chef Tip Card */}
            {currentStep.chefTip && (
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-2xl flex items-start gap-3">
                <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-emerald-400 uppercase">Chef's Pro Tip:</span>
                  <p className="text-slate-300 italic">{currentStep.chefTip}</p>
                </div>
              </div>
            )}

            {/* Step Specific Timer */}
            {timerSeconds !== null && (
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase">
                      Step Timer
                    </span>
                    <p className={`text-3xl font-extrabold font-mono tracking-wider ${timerSeconds === 0 ? 'text-rose-400 animate-bounce' : 'text-white'}`}>
                      {formatTime(timerSeconds)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTimer}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                      isTimerRunning
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-slate-950" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>{timerSeconds === 0 ? 'Restart' : 'Start Timer'}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Step Navigation Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="px-5 py-3 bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={speakCurrentStep}
              className="p-3 bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="Re-read current step"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {currentStepIndex < recipe.steps.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all shadow-xl shadow-emerald-500/25 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Cooking!</span>
              </button>
            )}
          </div>
        </div>

        {/* Steps Overview Side Drawer */}
        {isDrawerOpen && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 p-5 overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <List className="w-4 h-4 text-emerald-400" />
                <span>All Cooking Steps</span>
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              {recipe.steps.map((step, idx) => (
                <button
                  key={step.stepNumber}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    idx === currentStepIndex
                      ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                      : completedSteps.includes(idx)
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400 line-through'
                      : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </span>
                  <p className="text-xs line-clamp-2 leading-relaxed">
                    {step.instruction}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Persistent Floating Multi-Timer Widget */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* Expanded Multi-Timer Panel */}
          {isMultiTimerOpen && (
            <div className="w-80 sm:w-96 bg-slate-900/95 border border-slate-800 p-5 rounded-2xl shadow-2xl backdrop-blur-md space-y-4 text-xs animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Timer className="w-4 h-4 text-emerald-400" />
                  <span>Kitchen Multi-Timers</span>
                </h3>
                <button
                  onClick={() => setIsMultiTimerOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Add Custom Timer Form */}
              <form onSubmit={handleAddCustomTimer} className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Timer label (e.g. Boil Pasta, Sauce)..."
                    value={newTimerLabel}
                    onChange={(e) => setNewTimerLabel(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    min="0.5"
                    max="180"
                    step="0.5"
                    value={newTimerMins}
                    onChange={(e) => setNewTimerMins(e.target.value)}
                    className="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-200 text-center focus:outline-none focus:border-emerald-500"
                  />
                  <span className="self-center text-slate-400 font-semibold text-[11px]">min</span>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {/* Active Timers List */}
              <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
                {customTimers.length === 0 ? (
                  <p className="text-center text-slate-500 py-3 italic">
                    No custom timers set. Add one above!
                  </p>
                ) : (
                  customTimers.map((t) => (
                    <div
                      key={t.id}
                      className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="font-semibold text-slate-200 truncate">{t.label}</p>
                        <p className={`font-mono text-lg font-bold ${t.remainingSeconds === 0 ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`}>
                          {formatTime(t.remainingSeconds)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleCustomTimer(t.id)}
                          className={`p-2 rounded-lg font-bold text-xs transition-colors ${
                            t.isRunning
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-emerald-500 text-slate-950'
                          }`}
                          title={t.isRunning ? 'Pause' : 'Start'}
                        >
                          {t.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => resetCustomTimer(t.id)}
                          className="p-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Reset"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCustomTimer(t.id)}
                          className="p-2 bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Floating Toggle Button */}
          <button
            onClick={() => setIsMultiTimerOpen(!isMultiTimerOpen)}
            className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-emerald-400/30"
          >
            <Timer className="w-4 h-4 fill-slate-950" />
            <span>Multi-Timers ({customTimers.length})</span>
            {activeRunningCustomTimers > 0 && (
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
