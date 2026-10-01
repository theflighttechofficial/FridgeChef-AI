import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LogoMark } from './Logo';

interface IntroShowreelProps {
  onContinue: () => void;
}

const STEPS = [
  ['Photograph the inside of your fridge.', 'It lists what is there and flags what needs using first.'],
  ['Get one dinner idea, not fifty.', 'Picked from what you already have, with the reasons shown.'],
  ['Cook with the phone propped up.', 'Steps are read aloud and timers start on their own.'],
];

// Intro landing page. Editorial layout: serif headline, the showreel as the product demo, a numbered list.
export const IntroShowreel: React.FC<IntroShowreelProps> = ({ onContinue }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [reelEnded, setReelEnded] = useState(false);
  const [reelLoaded, setReelLoaded] = useState(false);
  const heroCtaRef = useRef<HTMLButtonElement>(null);
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);

  // Phones get a sticky "Open the app" bar once the hero button scrolls away
  useEffect(() => {
    const el = heroCtaRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setHeroCtaVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // The showreel iframe reports when it ends or restarts
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow || e.data?.source !== 'fridgechef-showreel') return;
      if (e.data.type === 'ended') setReelEnded(true);
      if (e.data.type === 'started') setReelEnded(false);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const replay = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'replay' }, '*');
    setReelEnded(false);
  };

  return (
    <motion.div
      key="intro-page"
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#0A0C0B] text-[#F5F1E8]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-label="Welcome to FridgeChef"
    >
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between py-5 border-b border-[#F5F1E8]/10">
          <span className="flex items-center gap-2.5">
            <LogoMark className="w-7 h-7" />
            <span className="font-serif text-lg">FridgeChef</span>
          </span>
          <button onClick={onContinue} className="text-sm text-[#B9B4A8] hover:text-[#F5F1E8] underline-offset-4 hover:underline">
            Skip intro
          </button>
        </header>

        <main className="py-8 sm:py-10 lg:py-0">
          {/* Hero fills the first screen: copy on the left, demo reel on the right */}
          <div className="grid lg:grid-cols-12 gap-x-12 gap-y-8 items-center lg:min-h-[calc(100vh-4.25rem)] lg:py-10">
            <div className="lg:col-span-5 space-y-6">
              <h1 className="font-serif text-[2.4rem] leading-[1.05] sm:text-5xl xl:text-6xl tracking-tight">
                Dinner, from whatever is already in your fridge.
              </h1>
              <p className="text-[15px] leading-7 text-[#B9B4A8] max-w-md">
                FridgeChef looks at what you have, suggests one meal that uses up the food closest to going off, and talks
                you through cooking it.
              </p>
              <button
                ref={heroCtaRef}
                onClick={onContinue}
                autoFocus
                className="w-full sm:w-auto px-6 py-3.5 rounded-[3px] bg-[#FF5A3C] text-[#1A0A05] font-semibold hover:bg-[#ff7357] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A3C]"
              >
                Open the app &rarr;
              </button>
            </div>

            <figure className="lg:col-span-7">
              <div className="relative aspect-video rounded-[4px] overflow-hidden border border-[#F5F1E8]/10 bg-black">
                {!reelLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-[#141816]" aria-hidden>
                    <div className="absolute left-[6%] top-[12%] h-[8%] w-[40%] rounded-[2px] bg-[#F5F1E8]/5" />
                    <div className="absolute left-[6%] top-[24%] h-[5%] w-[28%] rounded-[2px] bg-[#F5F1E8]/5" />
                    <div className="absolute right-[18%] top-[10%] h-[80%] w-[20%] rounded-[18px] bg-[#F5F1E8]/5" />
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src="/showreel.html"
                  title="FridgeChef product walkthrough"
                  onLoad={() => setReelLoaded(true)}
                  className="absolute inset-0 w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-4 text-xs text-[#8F8A80]">
                <span>Product walkthrough, 20 seconds. Sample data.</span>
                <button
                  onClick={replay}
                  disabled={!reelEnded}
                  className="text-[#B9B4A8] hover:text-[#F5F1E8] disabled:opacity-0 underline underline-offset-4"
                >
                  Watch again
                </button>
              </figcaption>
            </figure>
          </div>

          <section className="mt-14 lg:mt-6 pb-4 grid lg:grid-cols-12 gap-x-10">
            <h2 className="lg:col-span-4 font-serif text-2xl mb-6 lg:mb-0">How it works</h2>
            <ol className="lg:col-span-8 divide-y divide-[#F5F1E8]/10 border-y border-[#F5F1E8]/10">
              {STEPS.map(([title, text], i) => (
                <li key={title} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                  <span className="font-serif text-[#FF5A3C] text-lg tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block text-[17px] text-[#F5F1E8]">{title}</span>
                    <span className="block mt-1 text-[15px] leading-6 text-[#B9B4A8]">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </main>

        <div
          className={`lg:hidden fixed inset-x-0 bottom-0 z-10 p-3 bg-[#0A0C0B]/95 border-t border-[#F5F1E8]/10 transition-transform duration-200 ${
            heroCtaVisible ? 'translate-y-full' : 'translate-y-0'
          }`}
          aria-hidden={heroCtaVisible}
        >
          <button
            onClick={onContinue}
            tabIndex={heroCtaVisible ? -1 : 0}
            className="w-full py-3.5 rounded-[3px] bg-[#FF5A3C] text-[#1A0A05] font-semibold"
          >
            Open the app &rarr;
          </button>
        </div>

        <footer className="pb-24 lg:pb-8 py-8 border-t border-[#F5F1E8]/10 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs text-[#8F8A80]">
          <p>Suggestions are AI-generated. Check allergens and food safety yourself.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#/contact" className="hover:text-[#F5F1E8]">Contact</a>
            <a href="#/terms" className="hover:text-[#F5F1E8]">Terms</a>
            <a href="#/privacy" className="hover:text-[#F5F1E8]">Privacy</a>
            <button onClick={() => window.dispatchEvent(new Event('fridgechef:open-consent'))} className="hover:text-[#F5F1E8]">
              Cookie settings
            </button>
            <span>&copy; 2026 FridgeChef</span>
          </nav>
        </footer>
      </div>
    </motion.div>
  );
};
