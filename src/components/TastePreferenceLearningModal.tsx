import React, { useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Brain, Star, TrendingUp, TrendingDown, CheckCircle2, X } from 'lucide-react';
import { getTasteState, recordTaste, subscribeTaste, topTastes } from '../ml/tasteModel';
import { cookLog } from '../state/userData';
import { EmptyResult } from './ui/EmptyResult';

interface TastePreferenceLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TastePreferenceLearningModal: React.FC<TastePreferenceLearningModalProps> = ({ isOpen, onClose }) => {
  const log = cookLog.use();
  const taste = useSyncExternalStore(subscribeTaste, getTasteState, getTasteState);
  const recent = log[log.length - 1];
  const [rating, setRating] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const learned = topTastes(12);
  const likes = learned.filter((t) => t.weight > 0).slice(0, 6);
  const dislikes = learned.filter((t) => t.weight < 0).slice(0, 6);
  const pct = (w: number) => Math.round(Math.min(1, Math.abs(w) / 3) * 100);

  const handleCommitFeedback = () => {
    if (!recent || !rating) return;
    // 4–5 stars count as "liked", 1–2 as "disliked"; 3 is neutral and teaches nothing
    if (rating !== 3) {
      recordTaste({ cuisine: recent.cuisine, dietaryTags: [], matchedIngredients: recent.ingredients, missingIngredients: [] }, rating >= 4 ? 1 : 0);
    }
    setIsSaved(true);
    setTimeout(onClose, 900);
  };

  const Weights = ({ items, tone, sign }: { items: typeof learned; tone: string; sign: string }) => (
    <div className="space-y-2">
      {items.map((f) => (
        <div key={f.key} className="text-xs">
          <div className="flex justify-between text-slate-300 font-medium">
            <span>{f.label}</span>
            <span className={`font-mono ${tone}`}>
              {sign}
              {pct(f.weight)}%
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1 mt-1 overflow-hidden">
            <div className={`h-full rounded-full ${tone.replace('text-', 'bg-')}`} style={{ width: `${pct(f.weight)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        <div className="px-6 py-4 bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Taste Profile</h3>
              <p className="text-xs text-slate-400">Learned on this device from what you save, cook and rate.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!recent && !taste.events ? (
          <EmptyResult
            title="Your taste profile starts here"
            hint="Save or cook a few recipes. FridgeChef learns which cuisines and ingredients you enjoy and ranks future suggestions for you."
            icon={<Brain className="w-6 h-6" />}
          />
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {recent && (
              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">Rate your last meal</span>
                    <h4 className="text-base font-extrabold text-white mt-0.5">{recent.title}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} aria-label={`${star} stars`} className="p-1 transition-transform active:scale-90">
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleCommitFeedback}
                    disabled={!rating}
                    className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSaved ? 'Saved' : 'Save rating'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                What FridgeChef has learned ({taste.events} signal{taste.events === 1 ? '' : 's'})
              </span>
              {!learned.length ? (
                <p className="text-xs text-slate-400">Nothing learned yet. Rate, save or cook a recipe to start.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>You lean towards</span>
                    </span>
                    {likes.length ? <Weights items={likes} tone="text-emerald-400" sign="+" /> : <p className="text-xs text-slate-500">Nothing yet.</p>}
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>You tend to skip</span>
                    </span>
                    {dislikes.length ? <Weights items={dislikes} tone="text-rose-400" sign="-" /> : <p className="text-xs text-slate-500">Nothing yet.</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
