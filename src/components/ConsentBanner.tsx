import React, { useEffect, useState } from 'react';
import { getConsent, setConsent, track } from '../utils/analytics';

// Asks once whether anonymous analytics may be collected. Reopened from "Cookie settings" in footers.
export const ConsentBanner: React.FC = () => {
  const [open, setOpen] = useState(() => getConsent() === null);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener('fridgechef:open-consent', reopen);
    return () => window.removeEventListener('fridgechef:open-consent', reopen);
  }, []);

  if (!open) return null;

  const choose = (value: 'granted' | 'denied') => {
    setConsent(value);
    setOpen(false);
    if (value === 'granted') track('page_view', { page: 'consent_granted' });
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie and analytics preferences"
      className="fixed z-[120] inset-x-3 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] md:inset-x-auto md:right-4 md:bottom-4 md:max-w-sm p-5 rounded-[1.75rem] bg-surface-high text-on-surface shadow-2xl shadow-black/50"
    >
      <p className="text-base font-semibold">Analytics</p>
      <p className="mt-2 text-[13px] leading-5 text-on-surface-variant">
        We would like to count which pages and tabs people open, using our own server. No ads, no third-party trackers,
        no IP addresses stored. Your saved recipes and shopping list use browser storage either way.{' '}
        <a href="#/privacy" className="underline underline-offset-2 text-primary">
          Privacy policy
        </a>
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => choose('granted')}
          className="flex-1 h-10 px-4 rounded-full bg-emerald-300 text-emerald-950 text-sm font-semibold"
        >
          Accept
        </button>
        <button
          onClick={() => choose('denied')}
          className="flex-1 h-10 px-4 rounded-full border border-outline-variant text-emerald-300 text-sm font-semibold state-layer"
        >
          Decline
        </button>
      </div>
    </div>
  );
};
