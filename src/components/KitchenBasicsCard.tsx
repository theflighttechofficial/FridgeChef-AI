import React, { useState } from 'react';
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react';
import { KITCHEN_BASICS } from '../ml/basics';
import { reportMissingBasic, restockBasic, useMissingBasics } from '../state/basics';

/**
 * The kitchen basics FridgeChef assumes you have (salt, spices, onion...). Tap one to say you're
 * out of it; recipes then treat it as missing. Tap again once it's back in the kitchen.
 */
export const KitchenBasicsCard: React.FC<{ defaultOpen?: boolean }> = ({ defaultOpen = false }) => {
  const missing = useMissingBasics();
  const [open, setOpen] = useState(defaultOpen);
  const have = KITCHEN_BASICS.length - missing.length;
  const groups = ['Essentials', 'Spices', 'Fresh basics'] as const;

  return (
    <section className="rounded-3xl bg-slate-900 p-4 sm:p-5 space-y-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 text-left" aria-expanded={open}>
        <span className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container grid place-items-center shrink-0">
          <ChefHat className="w-5 h-5" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-base font-semibold text-white">Kitchen basics</span>
          <span className="block text-sm text-slate-400">
            We assume you have {have} of {KITCHEN_BASICS.length}
            {missing.length ? ` · out of ${missing.length}` : ''}
          </span>
        </span>
        {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {open && (
        <div className="space-y-4 pt-1">
          <p className="text-sm text-slate-400">Recipes can use these without them being in your fridge. Tap anything you've run out of.</p>
          {groups.map((g) => (
            <div key={g} className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{g}</h3>
              <div className="flex flex-wrap gap-2">
                {KITCHEN_BASICS.filter((b) => b.kind === g).map((b) => {
                  const out = missing.includes(b.name);
                  return (
                    <button
                      key={b.name}
                      onClick={() => (out ? restockBasic(b.name) : reportMissingBasic(b.name))}
                      aria-pressed={!out}
                      className={`h-9 px-3 rounded-lg text-sm border transition-colors ${
                        out ? 'border-rose-400/40 text-rose-300 line-through' : 'border-transparent bg-secondary-container text-on-secondary-container'
                      }`}
                      title={out ? `Mark ${b.label} as back in stock` : `I'm out of ${b.label}`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
