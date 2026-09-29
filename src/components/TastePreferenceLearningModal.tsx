import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Star,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  X,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Award
} from 'lucide-react';
import { TastePreferenceVector } from '../types';

interface TastePreferenceLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentMealTitle?: string;
  onSaveFeedback?: (rating: number, tags: string[]) => void;
}

export const TastePreferenceLearningModal: React.FC<TastePreferenceLearningModalProps> = ({
  isOpen,
  onClose,
  recentMealTitle = 'Garlic Chicken & Wilted Spinach Skillet',
  onSaveFeedback,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Loved the garlic', 'Great spice heat', 'Perfect crisp']);
  const [isSaved, setIsSaved] = useState(false);

  const [tasteModel, setTasteModel] = useState<TastePreferenceVector>({
    likedFlavors: [
      { tag: 'Roasted Garlic & Allium', score: 98 },
      { tag: 'Bloomed Chili & Peppercorn Heat', score: 94 },
      { tag: 'Citrus Brightness (Lemon/Lime)', score: 91 },
      { tag: 'Smoked Paprika & Cumin', score: 86 },
    ],
    likedTextures: [
      { tag: 'Crispy Seared Fond', score: 96 },
      { tag: 'Al Dente Grains & Crunch', score: 89 },
      { tag: 'Velvety Yogurt Emulsion', score: 85 },
    ],
    dislikedElements: [
      { tag: 'Raw Cilantro Stems', score: 88 },
      { tag: 'Cloying Sweet Glazes', score: 84 },
      { tag: 'Overcooked Limp Vegetables', score: 92 },
    ],
    favoriteCuisines: ['South Indian Tadka', 'Mediterranean', 'Sichuan Flash-Wok'],
    totalMealsRated: 22,
    recentFeedbacks: [
      { mealTitle: 'Garlic Chicken & Wilted Spinach Skillet', rating: 5, tags: ['Loved the garlic', 'Great spice heat'], date: 'Today' },
      { mealTitle: 'Crispy Herb Chicken & Roasted Veggies', rating: 5, tags: ['Perfect crisp'], date: '2 days ago' },
      { mealTitle: 'Sweet Glazed Honey Carrots', rating: 2, tags: ['Too sweet', 'Too soft'], date: '5 days ago' },
    ],
  });

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCommitFeedback = () => {
    setIsSaved(true);
    if (onSaveFeedback) {
      onSaveFeedback(rating, selectedTags);
    }
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Taste Preference Learning Model</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                  REINFORCEMENT LEARNING
                </span>
              </div>
              <p className="text-xs text-slate-400">
                After each meal, rate your experience. FridgeChef learns your precise flavor and texture weights over time.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Post-Meal Rating Box */}
          <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">RATE RECENT MEAL</span>
                <h4 className="text-base font-extrabold text-white mt-0.5">{recentMealTitle}</h4>
              </div>

              {/* Star Rating Selector */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Feedback Chips */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">What stood out? (AI updates taste weights):</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Loved the garlic',
                  'Great spice heat',
                  'Perfect crisp',
                  'Good citrus acidity',
                  'Too salty',
                  'Too sweet',
                  'Too heavy',
                  'Vegetables overcooked',
                ].map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleCommitFeedback}
                className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSaved ? 'Preferences Updated!' : 'Commit Feedback to AI Model'}</span>
              </button>
            </div>
          </div>

          {/* Rolling Personal Taste Model Scorecard */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white uppercase tracking-wider">
                Learned Flavor & Texture Weights ({tasteModel.totalMealsRated} Meals Analyzed)
              </span>
              <span className="text-purple-400 font-mono text-[11px]">Continuously Adapting</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Liked Flavors */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Favored Flavors (Weight ↑)</span>
                </span>
                <div className="space-y-2">
                  {tasteModel.likedFlavors.map((f) => (
                    <div key={f.tag} className="text-xs">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>{f.tag}</span>
                        <span className="font-mono text-emerald-400">{f.score}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${f.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liked Textures */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Texture Profile (Weight ↑)</span>
                </span>
                <div className="space-y-2">
                  {tasteModel.likedTextures.map((t) => (
                    <div key={t.tag} className="text-xs">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>{t.tag}</span>
                        <span className="font-mono text-cyan-400">{t.score}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${t.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disliked Elements */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Penalized Elements (Weight ↓)</span>
                </span>
                <div className="space-y-2">
                  {tasteModel.dislikedElements.map((d) => (
                    <div key={d.tag} className="text-xs">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>{d.tag}</span>
                        <span className="font-mono text-rose-400">-{d.score}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${d.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
