/**
 * First-run account setup and sign-in, styled as a native Material 3 onboarding flow:
 * full-screen steps, linear progress, filled text fields, filter chips, a colour picker that
 * re-themes the app live, and a bottom-anchored primary button clear of the gesture bar.
 */
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ExternalLink, KeyRound, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { LogoMark } from '../Logo';
import { SEEDS, setSeed, useSeed } from '../../theme/dynamicColor';
import { createAccount, deleteAccount, initials, signIn, useAccount } from '../../auth/account';
import { PROVIDERS } from '../../ai/providers';
import { activeProvider, getAiSettings, updateAiSettings, useAiSettings } from '../../ai/settings';
import { userKey } from '../../state/userData';
import { Chip, PasswordField, PrimaryButton, Screen, TextField, haptic, slide, strength } from './parts';
import { TasteQuiz, quizPending } from './TasteQuiz';


// ---------- Create account ----------

const STEPS = 3; // name, password, colour (the taste questions follow)

const CreateAccount: React.FC = () => {
  const seed = useSeed();
  const [step, setStep] = useState(-1); // -1 = welcome
  const [dir, setDir] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const go = (to: number) => {
    haptic();
    setDir(to > step ? 1 : -1);
    setTouched(false);
    setStep(to);
  };

  const emailOk = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const errors = {
    name: !name.trim() ? 'Enter your name' : '',
    email: emailOk ? '' : 'That email looks incomplete',
    password: password.length < 6 ? 'Use at least 6 characters' : '',
    confirm: confirm !== password ? "Passwords don't match" : '',
  };

  const next = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched(true);
    if (step === 0 && (errors.name || errors.email)) return;
    if (step === 1 && (errors.password || errors.confirm)) return;
    if (step === 2) {
      setBusy(true);
      await createAccount({ name: name.trim(), email: email.trim(), seedId: seed.id, dietary: [], regions: [] }, password).catch(() => {});
      setBusy(false);
      return;
    }
    go(step + 1);
  };

  const level = strength(password);

  if (step === -1) {
    return (
      <Screen>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6 relative">
          <div aria-hidden="true" className="absolute -top-24 -right-24 w-80 h-80 bg-primary-container/60 animate-morph" />
          <div aria-hidden="true" className="absolute -bottom-28 -left-20 w-72 h-72 bg-secondary-container/70 animate-morph [animation-delay:-5s]" />
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="relative">
            <LogoMark className="w-28 h-28 drop-shadow-2xl" />
            {['🥕', '🍳', '🧄', '🍋'].map((e, i) => (
              <motion.span
                key={e}
                aria-hidden="true"
                className="absolute text-3xl"
                style={{ left: ['-46px', '110px', '-30px', '104px'][i], top: ['-10px', '-20px', '86px', '84px'][i] }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {e}
              </motion.span>
            ))}
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="relative space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight leading-tight">Cook with what you already have</h1>
            <p className="text-on-surface-variant text-base">A quick setup and a few questions about your taste. Your account lives only on this device.</p>
          </motion.div>
        </div>
        <div className="px-6 pb-6 space-y-3 relative">
          <PrimaryButton type="button" onClick={() => go(0)}>
            Get started
          </PrimaryButton>
          <p className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
            <ShieldCheck className="w-4 h-4" /> No sign-up servers. Nothing leaves your device.
          </p>
        </div>
      </Screen>
    );
  }

  const titles = [
    ['What should we call you?', 'This is how FridgeChef greets you.'],
    ['Create a password', 'You will use it to sign back in on this device.'],
    ['Pick your colour', 'The whole app tints to match. You can change it later.'],
  ];

  return (
    <Screen>
      {/* Top bar: back + progress */}
      <div className="h-16 flex items-center gap-2 px-2">
        <button
          onClick={() => go(step - 1)}
          className="w-12 h-12 grid place-items-center rounded-full state-layer text-on-surface"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 h-1 rounded-full bg-surface-highest overflow-hidden mr-4" role="progressbar" aria-valuemin={0} aria-valuemax={STEPS} aria-valuenow={step + 1}>
          <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${((step + 1) / STEPS) * 100}%` }} transition={{ type: 'spring', stiffness: 200, damping: 30 }} />
        </div>
      </div>

      <form onSubmit={next} className="flex-1 flex flex-col min-h-0" noValidate>
        <div className="flex-1 overflow-y-auto px-6">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
              className="pt-4 pb-8 space-y-6"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary">Step {step + 1} of {STEPS}</p>
                <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">{titles[step][0]}</h1>
                <p className="text-on-surface-variant">{titles[step][1]}</p>
              </div>

              {step === 0 && (
                <div className="space-y-2">
                  <TextField label="Your name" value={name} onChange={setName} autoComplete="name" autoFocus error={touched ? errors.name : ''} />
                  <TextField
                    label="Email (optional)"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    error={touched ? errors.email : ''}
                    supporting="Only shown in your profile"
                  />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-2">
                  <PasswordField label="Password" value={password} onChange={setPassword} autoComplete="new-password" autoFocus error={touched ? errors.password : ''} />
                  <div className="px-4 -mt-1 pb-2 flex gap-1.5" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i < level ? (level <= 1 ? 'bg-rose-300' : level === 2 ? 'bg-amber-300' : 'bg-primary') : 'bg-surface-highest'
                        }`}
                      />
                    ))}
                  </div>
                  <PasswordField label="Confirm password" value={confirm} onChange={setConfirm} autoComplete="new-password" error={touched ? errors.confirm : ''} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4 justify-items-center">
                    {SEEDS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          haptic(5);
                          setSeed(s);
                        }}
                        aria-pressed={seed.id === s.id}
                        aria-label={s.label}
                        className="flex flex-col items-center gap-2"
                      >
                        <span
                          className={`relative w-16 h-16 rounded-full overflow-hidden grid place-items-center transition-transform ${seed.id === s.id ? 'scale-110 ring-4 ring-on-surface/80' : ''}`}
                          style={{ background: `oklch(80% 0.13 ${s.hue})` }}
                        >
                          <span className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `oklch(45% 0.09 ${s.hue})` }} />
                          {seed.id === s.id && <Check className="relative w-6 h-6 text-white drop-shadow" />}
                        </span>
                        <span className="text-xs text-on-surface-variant">{s.label}</span>
                      </button>
                    ))}
                  </div>
                  {/* Live preview card */}
                  <div className="rounded-[1.75rem] bg-primary-container text-on-primary-container p-5 flex items-center gap-4">
                    <span className="w-12 h-12 rounded-full bg-primary text-on-primary grid place-items-center text-lg font-semibold">{initials(name)}</span>
                    <div className="flex-1">
                      <p className="font-semibold">Hi {name.trim().split(' ')[0] || 'there'}!</p>
                      <p className="text-sm opacity-80">This is how FridgeChef will look.</p>
                    </div>
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
        <div className="px-6 pb-6 pt-2">
          <PrimaryButton busy={busy}>{step === 2 ? 'Create account' : 'Continue'}</PrimaryButton>
        </div>
      </form>
    </Screen>
  );
};

// ---------- Sign in ----------

const SignIn: React.FC = () => {
  const { account } = useAccount();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [shake, setShake] = useState(0);
  if (!account) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return setError('Enter your password');
    setBusy(true);
    const ok = await signIn(password);
    setBusy(false);
    if (!ok) {
      haptic(40);
      setShake((n) => n + 1);
      setError('Wrong password. Try again.');
    }
  };

  return (
    <Screen>
      <form onSubmit={submit} className="flex-1 flex flex-col" noValidate>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-primary-container text-on-primary-container grid place-items-center text-3xl font-semibold shadow-xl"
          >
            {initials(account.name)}
          </motion.span>
          <div className="text-center space-y-1">
            <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">Welcome back, {account.name.split(' ')[0]}</h1>
            <p className="text-on-surface-variant flex items-center justify-center gap-1.5">
              <Lock className="w-4 h-4" /> Enter your password to continue
            </p>
          </div>
          <motion.div key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.35 }} className="w-full max-w-sm">
            <PasswordField
              label="Password"
              value={password}
              onChange={(v) => {
                setPassword(v);
                setError('');
              }}
              autoComplete="current-password"
              autoFocus
              error={error}
            />
          </motion.div>
        </div>
        <div className="px-6 pb-6 space-y-2 w-full max-w-sm mx-auto">
          <PrimaryButton busy={busy}>Sign in</PrimaryButton>
          <button type="button" onClick={() => setConfirmReset(true)} className="w-full h-12 rounded-full text-primary font-semibold state-layer">
            Forgot password?
          </button>
        </div>
      </form>

      <AnimatePresence>
        {confirmReset && (
          <div className="fixed inset-0 z-[160] grid place-items-center p-6" role="alertdialog" aria-modal="true" aria-labelledby="reset-title">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => setConfirmReset(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-[1.75rem] bg-surface-high p-6 space-y-4"
            >
              <h2 id="reset-title" className="text-2xl font-semibold">Reset account?</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Passwords are stored only on this device, so they can't be recovered. Resetting removes this account and everything
                saved with it, so you can start fresh with a new one.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setConfirmReset(false)} className="h-10 px-4 rounded-full text-primary font-semibold state-layer">
                  Cancel
                </button>
                <button onClick={deleteAccount} className="h-10 px-4 rounded-full text-rose-300 font-semibold state-layer">
                  Reset account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Screen>
  );
};

// ---------- Connect AI (shown once after signing in) ----------

const AI_PROMPT_SEEN = userKey('aiPromptSeen');
const KEY_PROVIDERS = PROVIDERS.filter((p) => p.keyUrl);

const promptSeen = () => {
  try {
    return localStorage.getItem(AI_PROMPT_SEEN) === '1';
  } catch {
    return true;
  }
};

const ConnectAi: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [providerId, setProviderId] = useState(getAiSettings().provider || KEY_PROVIDERS[0].id);
  const [key, setKey] = useState('');
  const provider = KEY_PROVIDERS.find((p) => p.id === providerId) || KEY_PROVIDERS[0];

  const finish = (save: boolean) => {
    if (save && key.trim()) updateAiSettings({ provider: provider.id, apiKey: key.trim(), model: '', engine: 'auto' });
    try {
      localStorage.setItem(AI_PROMPT_SEEN, '1');
    } catch {}
    haptic(save ? 12 : 5);
    onDone();
  };

  return (
    <Screen>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          finish(true);
        }}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4 space-y-6">
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-3xl bg-primary-container text-on-primary-container grid place-items-center"
          >
            <KeyRound className="w-8 h-8" />
          </motion.span>
          <div className="space-y-2">
            <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">Connect your AI</h1>
            <p className="text-on-surface-variant">
              Add a free API key so FridgeChef can read fridge photos and write recipes with cloud AI. Without one, the on-device model still works offline.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-on-surface-variant">1. Pick a provider</h2>
            <div className="flex flex-wrap gap-2">
              {KEY_PROVIDERS.map((p) => (
                <Chip key={p.id} selected={p.id === provider.id} onClick={() => setProviderId(p.id)}>
                  {p.label}
                </Chip>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-on-surface-variant">2. Create a key</h2>
            <a
              href={provider.keyUrl}
              target="_blank"
              rel="noreferrer"
              className="h-12 px-5 rounded-full border border-outline-variant text-primary font-semibold inline-flex items-center gap-2 state-layer"
            >
              Open {provider.label} <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-xs text-on-surface-variant">Sign in there, create an API key and copy it.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-on-surface-variant">3. Paste it here</h2>
            <PasswordField label={`${provider.label} API key`} value={key} onChange={setKey} autoComplete="off" supporting={`Looks like ${provider.keyHint}`} />
            <p className="flex items-start gap-2 text-xs text-on-surface-variant">
              <ShieldCheck className="w-4 h-4 shrink-0 text-primary" /> Your key is stored only on this device. You can change it any time in Settings.
            </p>
          </section>
        </div>
        <div className="px-6 pb-6 pt-2 space-y-2">
          <PrimaryButton disabled={!key.trim()}>Save and continue</PrimaryButton>
          <button type="button" onClick={() => finish(false)} className="w-full h-12 rounded-full text-primary font-semibold state-layer">
            Skip for now
          </button>
        </div>
      </form>
    </Screen>
  );
};

// ---------- Gate ----------

/** Renders the setup or sign-in screen when needed, otherwise the app. */
export const AuthGate: React.FC<{ children: React.ReactNode; paused?: boolean }> = ({ children, paused }) => {
  const { account, signedIn } = useAccount();
  const ai = useAiSettings();
  const [celebrate, setCelebrate] = useState(false);
  const [askAi, setAskAi] = useState(() => !promptSeen());
  const [askTaste, setAskTaste] = useState(() => quizPending());
  const wasNew = useRef(!account);

  // Brief welcome after creating an account
  useEffect(() => {
    if (account && signedIn && wasNew.current) {
      wasNew.current = false;
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 1600);
      return () => clearTimeout(t);
    }
    if (!account) {
      wasNew.current = true;
      setAskTaste(true);
      setAskAi(true);
    }
  }, [account, signedIn]);

  // Wait while the first-launch intro is on screen
  if (paused) return <>{children}</>;
  if (!account) return <CreateAccount />;
  if (!signedIn) return <SignIn />;
  return (
    <>
      {children}
      <AnimatePresence>
        {askTaste && !celebrate && (
          <motion.div key="taste-quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <TasteQuiz onDone={() => setAskTaste(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {askAi && !askTaste && !celebrate && !activeProvider(ai) && (
          <motion.div key="connect-ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ConnectAi onDone={() => setAskAi(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[150] bg-primary-container text-on-primary-container grid place-items-center pt-safe pb-safe"
            onClick={() => setCelebrate(false)}
          >
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="text-center space-y-4 px-8">
              <span className="mx-auto w-24 h-24 rounded-full bg-primary text-on-primary grid place-items-center text-4xl font-semibold shadow-2xl">
                {initials(account.name)}
              </span>
              <h1 className="text-3xl font-semibold">You're all set, {account.name.split(' ')[0]}!</h1>
              <p className="opacity-80">A few questions about your taste, then we cook.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
