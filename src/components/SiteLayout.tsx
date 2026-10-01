import React, { useEffect } from 'react';
import { LogoMark } from './Logo';
import { setPageMeta } from '../utils/seo';
import { track } from '../utils/analytics';

interface SiteLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

// Shared shell for the standalone pages (legal, contact, thanks, 404): ink background, serif headings
export const SiteLayout: React.FC<SiteLayoutProps> = ({ title, description, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(title, description);
    track('page_view', { page: title });
  }, [title, description]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0C0B] text-[#F5F1E8]">
      <header className="max-w-3xl w-full mx-auto px-5 sm:px-8 py-5 flex items-center justify-between border-b border-[#F5F1E8]/10">
        <a href="#/" className="flex items-center gap-2.5">
          <LogoMark className="w-7 h-7" />
          <span className="font-serif text-lg">FridgeChef</span>
        </a>
        <a href="#/" className="text-sm text-[#B9B4A8] hover:text-[#F5F1E8]">
          Open the app
        </a>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-16">{children}</main>
      <SiteFooter />
    </div>
  );
};

export const SiteFooter: React.FC<{ className?: string }> = ({ className = '' }) => (
  <footer
    className={`max-w-3xl w-full mx-auto px-5 sm:px-8 py-6 border-t border-[#F5F1E8]/10 flex flex-col sm:flex-row gap-3 justify-between text-xs text-[#8F8A80] ${className}`}
  >
    <span>&copy; 2026 FridgeChef</span>
    <nav className="flex flex-wrap gap-5">
      <a href="#/contact" className="hover:text-[#F5F1E8]">Contact</a>
      <a href="#/terms" className="hover:text-[#F5F1E8]">Terms</a>
      <a href="#/privacy" className="hover:text-[#F5F1E8]">Privacy</a>
      <button onClick={() => window.dispatchEvent(new Event('fridgechef:open-consent'))} className="hover:text-[#F5F1E8]">
        Cookie settings
      </button>
    </nav>
  </footer>
);
