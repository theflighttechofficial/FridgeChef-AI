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
      className="fixed z-[120] inset-x-3 bottom-3 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-sm p-5 rounded-[4px] bg-[#141816] border border-[#F5F1E8]/15 text-[#F5F1E8]"
    >
      <p className="text-sm font-semibold">Analytics</p>
      <p className="mt-2 text-[13px] leading-5 text-[#B9B4A8]">
        We would like to count which pages and tabs people open, using our own server. No ads, no third-party trackers,
        no IP addresses stored. Your saved recipes and shopping list use browser storage either way.{' '}
        <a href="#/privacy" className="underline underline-offset-2 hover:text-[#F5F1E8]">
          Privacy policy
        </a>
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => choose('granted')}
          className="flex-1 px-4 py-2.5 rounded-[3px] bg-[#F5F1E8] text-[#0A0C0B] text-sm font-semibold hover:bg-white"
        >
          Accept
        </button>
        <button
          onClick={() => choose('denied')}
          className="flex-1 px-4 py-2.5 rounded-[3px] border border-[#F5F1E8]/25 text-sm font-semibold hover:border-[#F5F1E8]/60"
        >
          Decline
        </button>
      </div>
    </div>
  );
};
