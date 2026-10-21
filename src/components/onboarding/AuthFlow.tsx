/**
 * First-run account setup and sign-in, styled as a native Material 3 onboarding flow:
 * full-screen steps, linear progress, filled text fields, filter chips, a colour picker that
 * re-themes the app live, and a bottom-anchored primary button clear of the gesture bar.
 */
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Eye, EyeOff, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { LogoMark } from '../Logo';
import { SEEDS, setSeed, useSeed } from '../../theme/dynamicColor';
import { REGIONS } from '../../ml/data/schema';
import { createAccount, deleteAccount, initials, signIn, useAccount } from '../../auth/account';

const DIETS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'Nut-Free', 'Paleo'];
const REGION_CHOICES = Object.keys(REGIONS).filter((r) => r !== 'Fusion');

const haptic = (ms = 8) => {
  try {
    navigator.vibrate?.(ms);
  } catch {}
};

// ---------- Building blocks ----------

const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  error?: string;
  supporting?: string;
  autoFocus?: boolean;
  trailing?: React.ReactNode;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}> = ({ label, value, onChange, type = 'text', autoComplete, error, supporting, autoFocus, trailing, inputMode }) => {
  const id = useRef(`f-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <div>
      <div
        className={`relative rounded-t-2xl bg-surface-highest/70 border-b-2 transition-colors ${
          error ? 'border-rose-300' : 'border-on-surface-variant/50 focus-within:border-primary'
        }`}
      >
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          inputMode={inputMode}
          placeholder=" "
          spellCheck={false}
          className="peer w-full h-16 px-4 pt-5 pr-14 bg-transparent outline-none text-base text-on-surface"
        />
        <label
          htmlFor={id}
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none transition-all duration-200
            peer-focus:top-4 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
            ${error ? 'peer-focus:text-rose-300' : 'peer-focus:text-primary'}`}
        >
          {label}
        </label>
        {trailing && <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
      <p className={`px-4 pt-1 text-xs min-h-5 ${error ? 'text-rose-300' : 'text-on-surface-variant'}`}>{error || supporting}</p>
    </div>
  );
};

const PasswordField: React.FC<Omit<React.ComponentProps<typeof TextField>, 'type' | 'trailing'>> = (props) => {
  const [show, setShow] = useState(false);
  return (
    <TextField
      {...props}
      type={show ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="w-12 h-12 grid place-items-center rounded-full state-layer text-on-surface-variant"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      }
    />
  );
};

const Chip: React.FC<{ selected: boolean; onClick: () => void; children: React.ReactNode }> = ({ selected, onClick, children }) => (
  <button
    type="button"
    onClick={() => {
      haptic(5);
      onClick();
    }}
    aria-pressed={selected}
    className={`h-10 px-4 rounded-xl text-sm font-medium inline-flex items-center gap-2 border transition-colors ${
      selected ? 'bg-secondary-container text-on-secondary-container border-transparent' : 'border-outline-variant text-on-surface-variant state-layer'
    }`}
  >
    {selected && <Check className="w-4 h-4" />}
    {children}
  </button>
);

const PrimaryButton: React.FC<{ children: React.ReactNode; disabled?: boolean; busy?: boolean; type?: 'button' | 'submit'; onClick?: () => void }> = ({
  children,
  disabled,
  busy,
  type = 'submit',
  onClick,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || busy}
    className="w-full h-14 rounded-full bg-primary text-on-primary text-base font-semibold shadow-lg shadow-black/30 disabled:opacity-40 flex items-center justify-center gap-2"
  >
    {busy ? <span className="w-5 h-5 rounded-full border-2 border-on-primary/30 border-t-on-primary animate-spin" /> : children}
  </button>
);

const strength = (pw: string) => {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-[150] bg-surface text-on-surface pt-safe pb-safe overflow-hidden">
    {/* Phone-width column, centred on tablets and desktops */}
    <div className="relative h-full w-full max-w-md mx-auto flex flex-col">{children}</div>
  </div>
);

// ---------- Create account ----------

const STEPS = 4; // name, password, colour, food

const CreateAccount: React.FC = () => {
  const seed = useSeed();
  const [step, setStep] = useState(-1); // -1 = welcome
  const [dir, setDir] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [dietary, setDietary] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
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
    if (step === 3) {
      setBusy(true);
      await createAccount({ name: name.trim(), email: email.trim(), seedId: seed.id, dietary, regions }, password).catch(() => {});
      setBusy(false);
      return;
    }
    go(step + 1);
  };

  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
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
            <p className="text-on-surface-variant text-base">Set up FridgeChef-AI in under a minute. Your account lives only on this phone.</p>
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
    ['What do you like to eat?', 'We will tune recipe ideas to fit. Skip anything that does not apply.'],
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
                <p className="text-sm font-medium text-primary">Step {step + 1} of 4</p>
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

              {step === 3 && (
                <div className="space-y-6">
                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-on-surface-variant">Dietary needs</h2>
                    <div className="flex flex-wrap gap-2">
                      {DIETS.map((d) => (
                        <Chip key={d} selected={dietary.includes(d)} onClick={() => toggle(dietary, setDietary, d)}>
                          {d}
                        </Chip>
                      ))}
                    </div>
                  </section>
                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-on-surface-variant">Cuisines you love</h2>
                    <div className="flex flex-wrap gap-2">
                      {REGION_CHOICES.map((r) => (
                        <Chip key={r} selected={regions.includes(r)} onClick={() => toggle(regions, setRegions, r)}>
                          {r}
                        </Chip>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="px-6 pb-6 pt-2">
          <PrimaryButton busy={busy}>{step === 3 ? 'Create account' : 'Continue'}</PrimaryButton>
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
                Passwords are stored only on this device, so they can't be recovered. You can remove this account and create a new one.
                Your saved recipes, shopping list and settings stay.
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

// ---------- Gate ----------

/** Renders the setup or sign-in screen when needed, otherwise the app. */
export const AuthGate: React.FC<{ children: React.ReactNode; paused?: boolean }> = ({ children, paused }) => {
  const { account, signedIn } = useAccount();
  const [celebrate, setCelebrate] = useState(false);
  const wasNew = useRef(!account);

  // Brief welcome after creating an account
  useEffect(() => {
    if (account && signedIn && wasNew.current) {
      wasNew.current = false;
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 1600);
      return () => clearTimeout(t);
    }
    if (!account) wasNew.current = true;
  }, [account, signedIn]);

  // Wait while the first-launch intro is on screen
  if (paused) return <>{children}</>;
  if (!account) return <CreateAccount />;
  if (!signedIn) return <SignIn />;
  return (
    <>
      {children}
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
              <p className="opacity-80">Let's see what's in your fridge.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
