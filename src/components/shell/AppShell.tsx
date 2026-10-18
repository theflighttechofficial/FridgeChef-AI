/**
 * Material 3 app shell: top app bar, bottom navigation bar (phones), navigation rail (tablets
 * and desktop), the "Snap" FAB and the tools sheet. Same layout in the browser and the Android app.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Camera, ChefHat, FlaskConical, LayoutGrid, Search, Settings, ShoppingBag, X } from 'lucide-react';
import { LogoMark } from '../Logo';
import { VoiceNavigationController } from '../VoiceNavigationController';
import { AppTab } from '../../types';
import { ToolItem } from './tools';

interface Destination {
  tab: AppTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const TAB_TITLES: Record<AppTab, string> = {
  scan: 'My fridge',
  recipes: 'Recipes',
  saved: 'Saved',
  shopping: 'Shopping',
  molecular: 'Food lab',
  settings: 'Settings',
};

const haptic = () => {
  try {
    navigator.vibrate?.(8);
  } catch {}
};

// ---------- Top app bar ----------

const TopAppBar: React.FC<{
  activeTab: AppTab;
  setActiveTab: (t: AppTab) => void;
  onOpenTools: () => void;
}> = ({ activeTab, setActiveTab, onOpenTools }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 pt-safe transition-colors duration-300 ${scrolled ? 'bg-surface-high' : 'bg-surface'}`}
    >
      <div className="h-16 flex items-center gap-2 px-2 sm:px-4 md:px-6">
        <button
          onClick={() => setActiveTab('scan')}
          className="md:hidden w-12 h-12 grid place-items-center rounded-full state-layer"
          aria-label="FridgeChef home"
        >
          <LogoMark className="w-8 h-8" />
        </button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.h1
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex-1 min-w-0 truncate text-[1.375rem] font-medium text-on-surface md:pl-2"
          >
            {TAB_TITLES[activeTab]}
          </motion.h1>
        </AnimatePresence>
        <div className="flex items-center gap-1 text-on-surface-variant">
          <VoiceNavigationController activeTab={activeTab} setActiveTab={setActiveTab} />
          <button onClick={onOpenTools} className="w-12 h-12 grid place-items-center rounded-full state-layer" aria-label="All tools" title="All tools">
            <LayoutGrid className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-12 h-12 grid place-items-center rounded-full state-layer md:hidden ${activeTab === 'settings' ? 'text-primary' : ''}`}
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

// ---------- Bottom navigation bar (phones) ----------

const NavigationBar: React.FC<{ items: Destination[]; activeTab: AppTab; onSelect: (t: AppTab) => void }> = ({ items, activeTab, onSelect }) => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container pb-safe" aria-label="Main">
    <div className="h-20 grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map(({ tab, label, icon: Icon, badge }) => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => {
              haptic();
              onSelect(tab);
            }}
            aria-current={active ? 'page' : undefined}
            className="flex flex-col items-center justify-center gap-1 pt-3 pb-4 active:!scale-100"
          >
            <span className="relative h-8 w-16 grid place-items-center">
              {active && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-full bg-secondary-container"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <Icon className={`relative w-6 h-6 transition-colors ${active ? 'text-on-secondary-container' : 'text-on-surface-variant'}`} />
              {!!badge && (
                <span className="absolute top-0 right-3 min-w-4 h-4 px-1 rounded-full bg-rose-400 text-rose-950 text-[11px] font-bold grid place-items-center">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </span>
            <span className={`text-xs tracking-wide ${active ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>{label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

// ---------- Navigation rail (tablet / desktop) ----------

const NavigationRail: React.FC<{
  items: Destination[];
  activeTab: AppTab;
  onSelect: (t: AppTab) => void;
  onSnap: () => void;
  onOpenTools: () => void;
}> = ({ items, activeTab, onSelect, onSnap, onOpenTools }) => {
  const railItem = ({ tab, label, icon: Icon, badge }: Destination, onClick?: () => void) => {
    const active = activeTab === tab;
    return (
      <button
        key={label}
        onClick={onClick || (() => onSelect(tab))}
        aria-current={active && !onClick ? 'page' : undefined}
        className="w-full flex flex-col items-center gap-1 py-1 group active:!scale-100"
      >
        <span className="relative h-8 w-14 grid place-items-center">
          {active && !onClick ? (
            <motion.span layoutId="rail-indicator" className="absolute inset-0 rounded-full bg-secondary-container" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
          ) : (
            <span className="absolute inset-0 rounded-full bg-on-surface opacity-0 group-hover:opacity-[0.08] transition-opacity" />
          )}
          <Icon className={`relative w-6 h-6 ${active && !onClick ? 'text-on-secondary-container' : 'text-on-surface-variant'}`} />
          {!!badge && (
            <span className="absolute -top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-400 text-rose-950 text-[11px] font-bold grid place-items-center">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </span>
        <span className={`text-xs ${active && !onClick ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>{label}</span>
      </button>
    );
  };

  return (
    <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-24 flex-col items-center bg-surface pt-safe py-4 gap-4" aria-label="Main">
      <button onClick={() => onSelect('scan')} className="w-14 h-14 grid place-items-center rounded-2xl state-layer" aria-label="FridgeChef home">
        <LogoMark className="w-10 h-10" />
      </button>
      <button
        onClick={onSnap}
        className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container grid place-items-center shadow-lg shadow-black/30 hover:shadow-xl hover:rounded-[1.25rem]"
        aria-label="Snap fridge photo"
        title="Snap fridge photo"
      >
        <Camera className="w-6 h-6" />
      </button>
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-3">{items.map((item) => railItem(item))}</div>
      <div className="w-full flex flex-col items-center gap-3">
        {railItem({ tab: 'settings', label: 'Tools', icon: LayoutGrid }, onOpenTools)}
        {railItem({ tab: 'settings', label: 'Settings', icon: Settings })}
      </div>
    </nav>
  );
};

// ---------- Snap FAB (phones) ----------

const SnapFab: React.FC<{ onSnap: () => void; hidden: boolean }> = ({ onSnap, hidden }) => {
  const [extended, setExtended] = useState(true);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 8) setExtended(y < last || y < 80);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.button
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          onClick={() => {
            haptic();
            onSnap();
          }}
          className="md:hidden fixed right-4 z-40 h-14 min-w-14 px-4 rounded-2xl bg-primary-container text-on-primary-container shadow-xl shadow-black/40 flex items-center justify-center gap-3 font-semibold"
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom) + 1rem)' }}
          aria-label="Snap fridge photo"
        >
          <Camera className="w-6 h-6 shrink-0" />
          <motion.span
            initial={false}
            animate={{ width: extended ? 'auto' : 0, opacity: extended ? 1 : 0 }}
            className="overflow-hidden whitespace-nowrap text-sm"
          >
            Snap fridge
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// ---------- Tools sheet ----------

const ToolsSheet: React.FC<{ open: boolean; onClose: () => void; tools: ToolItem[] }> = ({ open, onClose, tools }) => {
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (!open) return;
    setQuery('');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = tools.filter((t) => !q || `${t.label} ${t.description} ${t.group}`.toLowerCase().includes(q));
    return [...new Set(visible.map((t) => t.group))].map((g) => ({ group: g, items: visible.filter((t) => t.group === g) }));
  }, [tools, query]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="All tools">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/55" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose()}
            className="absolute inset-x-0 bottom-0 md:inset-x-auto md:right-4 md:bottom-4 md:top-4 md:w-[440px] max-h-[88vh] md:max-h-none flex flex-col rounded-t-[1.75rem] md:rounded-[1.75rem] bg-surface-low pb-safe"
          >
            <div className="pt-3 pb-1 grid place-items-center md:hidden">
              <span className="w-8 h-1 rounded-full bg-on-surface-variant/40" />
            </div>
            <div className="px-5 pt-2 pb-3 flex items-center gap-3">
              <h2 className="flex-1 text-[1.375rem] font-medium text-on-surface">All tools</h2>
              <button onClick={onClose} className="w-10 h-10 grid place-items-center rounded-full state-layer text-on-surface-variant" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 pb-3">
              <label className="h-12 flex items-center gap-3 px-4 rounded-full bg-surface-highest text-on-surface-variant focus-within:ring-2 focus-within:ring-primary">
                <Search className="w-5 h-5 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tools"
                  className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant text-base"
                />
              </label>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-5">
              {groups.map(({ group, items }) => (
                <section key={group}>
                  <h3 className="px-2 pb-2 text-sm font-semibold text-primary">{group}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {items.map((tool) => (
                      <button
                        key={tool.label}
                        onClick={() => {
                          onClose();
                          tool.onSelect?.();
                        }}
                        className={`text-left p-3 rounded-2xl state-layer flex flex-col gap-2 min-h-[6.5rem] ${tool.highlight ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface'}`}
                      >
                        <span className={`w-10 h-10 rounded-full grid place-items-center ${tool.highlight ? 'bg-emerald-950/40' : 'bg-secondary-container text-on-secondary-container'}`}>
                          <tool.icon className="w-5 h-5" />
                        </span>
                        <span className="text-sm font-semibold leading-tight">{tool.label}</span>
                        <span className={`text-xs leading-snug line-clamp-2 ${tool.highlight ? 'opacity-80' : 'text-on-surface-variant'}`}>{tool.description}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
              {!groups.length && <p className="px-2 text-sm text-on-surface-variant">No tools match “{query}”.</p>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ---------- Shell ----------

interface AppShellProps {
  activeTab: AppTab;
  setActiveTab: (t: AppTab) => void;
  shoppingListCount: number;
  savedCount: number;
  tools: ToolItem[];
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ activeTab, setActiveTab, shoppingListCount, savedCount, tools, children }) => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const closeTools = useCallback(() => setToolsOpen(false), []);

  const select = (tab: AppTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const snap = () => {
    if (activeTab !== 'scan') setActiveTab('scan');
    // Let the scanner mount before asking it to open the picker
    setTimeout(() => window.dispatchEvent(new Event('fridgechef:snap')), activeTab === 'scan' ? 0 : 350);
  };

  const destinations: Destination[] = [
    { tab: 'scan', label: 'Fridge', icon: Camera },
    { tab: 'recipes', label: 'Recipes', icon: ChefHat },
    { tab: 'saved', label: 'Saved', icon: Bookmark, badge: savedCount },
    { tab: 'shopping', label: 'Shopping', icon: ShoppingBag, badge: shoppingListCount },
    { tab: 'molecular', label: 'Lab', icon: FlaskConical },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface md:pl-24">
      <NavigationRail items={destinations} activeTab={activeTab} onSelect={select} onSnap={snap} onOpenTools={() => setToolsOpen(true)} />
      <TopAppBar activeTab={activeTab} setActiveTab={select} onOpenTools={() => setToolsOpen(true)} />
      <div className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</div>
      <SnapFab onSnap={snap} hidden={activeTab === 'settings' || toolsOpen} />
      <NavigationBar items={destinations} activeTab={activeTab} onSelect={select} />
      <ToolsSheet open={toolsOpen} onClose={closeTools} tools={tools} />
    </div>
  );
};
