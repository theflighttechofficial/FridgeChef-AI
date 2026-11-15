/**
 * Building blocks shared by the onboarding screens: Material 3 filled text fields, filter chips,
 * the bottom-anchored primary button and the full-screen phone-width frame.
 */
import React, { useRef, useState } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';
import { haptic as tap } from '../../utils/haptics';

export const haptic = (ms = 8) => tap(ms >= 30 ? 'success' : ms >= 12 ? 'medium' : 'light');

// ---------- Building blocks ----------

export const TextField: React.FC<{
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

export const PasswordField: React.FC<Omit<React.ComponentProps<typeof TextField>, 'type' | 'trailing'>> = (props) => {
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

export const Chip: React.FC<{ selected: boolean; onClick: () => void; children: React.ReactNode }> = ({ selected, onClick, children }) => (
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

export const PrimaryButton: React.FC<{ children: React.ReactNode; disabled?: boolean; busy?: boolean; type?: 'button' | 'submit'; onClick?: () => void }> = ({
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

export const strength = (pw: string) => {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

export const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-[150] bg-surface text-on-surface pt-safe pb-safe overflow-hidden">
    {/* Phone-width column, centred on tablets and desktops */}
    <div className="relative h-full w-full max-w-md mx-auto flex flex-col">{children}</div>
  </div>
);
