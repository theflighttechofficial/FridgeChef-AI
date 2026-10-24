import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingDown, PieChart, AlertTriangle, ShieldCheck, CheckCircle2, X, Receipt, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { receiptLog } from '../state/userData';
import { EmptyResult } from './ui/EmptyResult';

interface PantryFinancialIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PantryFinancialIntelligenceModal: React.FC<PantryFinancialIntelligenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const receipts = receiptLog.use();
  const audit = useMemo(() => {
    const since = Date.now() - 30 * 86400000;
    const recent = receipts.filter((r) => Date.parse(r.at) >= since);
    const items = recent.flatMap((r) => r.items);
    const total = Math.round(recent.reduce((t, r) => t + (r.total || r.items.reduce((s, i) => s + i.price, 0)), 0));
    const byCategory = new Map<string, number>();
    items.forEach((i) => byCategory.set(i.category, (byCategory.get(i.category) || 0) + i.price));
    const categorySum = [...byCategory.values()].reduce((a, b) => a + b, 0) || 1;
    const categories = [...byCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label, amount]) => ({ label, amount: Math.round(amount), pct: Math.round((amount / categorySum) * 100) }));
    const counts = new Map<string, { name: string; times: number; spent: number }>();
    items.forEach((i) => {
      const k = i.name.toLowerCase();
      const c = counts.get(k) || { name: i.name, times: 0, spent: 0 };
      counts.set(k, { ...c, times: c.times + 1, spent: c.spent + i.price });
    });
    const frequent = [...counts.values()].sort((a, b) => b.times - a.times || b.spent - a.spent).slice(0, 6);
    return { recent, total, categories, frequent, stores: new Set(recent.map((r) => r.store)).size };
  }, [receipts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Pantry Financial Intelligence</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  LAST 30 DAYS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Where your grocery money goes, from the receipts you scanned.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!audit.recent.length ? (
          <EmptyResult
            title="No receipts yet"
            hint="Scan a grocery receipt and add it to your fridge. Your spending over the last 30 days will show up here, kept only on this device."
            icon={<Receipt className="w-6 h-6" />}
          />
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Spent (30 days)', value: `₹${audit.total.toLocaleString('en-IN')}`, tone: 'text-emerald-400' },
                { label: 'Receipts', value: audit.recent.length, tone: 'text-cyan-400' },
                { label: 'Stores', value: audit.stores, tone: 'text-purple-400' },
              ].map((c) => (
                <div key={c.label} className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{c.label}</span>
                  <strong className={`text-lg font-black font-mono mt-0.5 block ${c.tone}`}>{c.value}</strong>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Spending by category</span>
              {audit.categories.map((cat) => (
                <div key={cat.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.label}</span>
                    <span className="font-mono text-white font-bold">
                      ₹{cat.amount} ({cat.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">What you buy most</span>
              {audit.frequent.map((item) => (
                <div key={item.name} className="flex justify-between text-xs py-1.5 border-b border-slate-800/60 last:border-0">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="font-mono text-slate-400">
                    {item.times}× · ₹{Math.round(item.spent)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
