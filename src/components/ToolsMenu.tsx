import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LayoutGrid, Search } from 'lucide-react';

export interface ToolItem {
  label: string;
  description: string;
  icon: React.ElementType;
  group: string;
  onSelect?: () => void;
  highlight?: boolean;
}

interface ToolsGridProps {
  tools: ToolItem[];
  onPicked?: () => void;
  autoFocusSearch?: boolean;
}

// Grouped, searchable list of AI tools. Shared by the desktop dropdown and the mobile drawer.
export const ToolsGrid: React.FC<ToolsGridProps> = ({ tools, onPicked, autoFocusSearch }) => {
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = tools.filter(
      (t) => t.onSelect && (!q || t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );
    const byGroup = new Map<string, ToolItem[]>();
    visible.forEach((t) => byGroup.set(t.group, [...(byGroup.get(t.group) || []), t]));
    return [...byGroup.entries()];
  }, [tools, query]);

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus-within:border-emerald-500/60 transition-colors">
        <Search className="w-4 h-4 text-slate-500 shrink-0" />
        <input
          autoFocus={autoFocusSearch}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AI tools…"
          className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
        />
      </label>

      {groups.length === 0 && <p className="text-xs text-slate-500 text-center py-6">No tools match “{query}”.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {groups.map(([group, items], gi) => (
          <motion.section
            key={group}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.04, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">{group}</h3>
            <ul className="space-y-0.5">
              {items.map((tool) => {
                const Icon = tool.icon;
                return (
                  <li key={tool.label}>
                    <button
                      onClick={() => {
                        tool.onSelect?.();
                        onPicked?.();
                      }}
                      className="w-full flex items-start gap-3 px-2 py-2 rounded-xl text-left hover:bg-slate-800/70 focus-visible:bg-slate-800/70 outline-none group"
                    >
                      <span
                        className={`mt-0.5 w-8 h-8 shrink-0 rounded-lg flex items-center justify-center border transition-colors ${
                          tool.highlight
                            ? 'bg-gradient-to-br from-emerald-400 to-indigo-400 text-slate-950 border-emerald-300/40'
                            : 'bg-slate-950 text-emerald-400 border-slate-800 group-hover:border-emerald-500/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {tool.label}
                        </span>
                        <span className="block text-[11px] text-slate-400 leading-snug line-clamp-2">{tool.description}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        ))}
      </div>
    </div>
  );
};

// Desktop "AI Tools" dropdown trigger + animated panel
export const ToolsMenu: React.FC<{ tools: ToolItem[] }> = ({ tools }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const count = tools.filter((t) => t.onSelect).length;

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border min-h-[38px] whitespace-nowrap ${
          open
            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
            : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span>AI Tools</span>
        <span className="px-1.5 rounded-full bg-slate-800 text-[10px] text-emerald-400">{count}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 top-full mt-2 w-[min(92vw,680px)] max-h-[75vh] overflow-y-auto p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/60 z-50"
          >
            <ToolsGrid tools={tools} onPicked={() => setOpen(false)} autoFocusSearch />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
