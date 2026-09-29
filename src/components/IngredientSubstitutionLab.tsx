import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FlaskConical,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Percent,
  X,
  Layers,
  ChefHat
} from 'lucide-react';
import { Ingredient, IngredientSubstituteAnalysis, SubstituteOption } from '../types';

interface IngredientSubstitutionLabProps {
  currentIngredients: Ingredient[];
  initialTargetIngredient?: string;
  onClose?: () => void;
}

export const IngredientSubstitutionLab: React.FC<IngredientSubstitutionLabProps> = ({
  currentIngredients,
  initialTargetIngredient = 'Parmesan Cheese',
  onClose,
}) => {
  const [searchTarget, setSearchTarget] = useState(initialTargetIngredient);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [substitutesData, setSubstitutesData] = useState<IngredientSubstituteAnalysis>({
    targetIngredient: 'Parmesan Cheese',
    culinaryRole: 'Aged umami depth, crystalline texture, salinity & fat binding',
    substitutes: [
      {
        name: 'Nutritional Yeast',
        flavorSimilarityPercent: 87,
        textureSimilarityPercent: 74,
        culinaryRole: 'Savory cheesy umami & golden hue',
        ratio: '1:1 ratio (add pinch of salt)',
        dietaryTags: ['Vegan', 'Dairy-Free', 'Gluten-Free'],
        isAvailableInFridge: false,
        chefTechniqueNote: 'Whisk into warm sauces or sprinkle dry over pasta for an instant umami blast without dairy lactose.'
      },
      {
        name: 'Grana Padano or Pecorino',
        flavorSimilarityPercent: 95,
        textureSimilarityPercent: 96,
        culinaryRole: 'Hard aged cheese grating, crystalline crunch & rich fat',
        ratio: '1:1 exact replacement',
        dietaryTags: ['Keto', 'Nut-Free'],
        isAvailableInFridge: false,
        chefTechniqueNote: 'Pecorino is slightly saltier (sheep milk); reduce added salt by 15%.'
      },
      {
        name: 'Sharp Aged Cheddar',
        flavorSimilarityPercent: 82,
        textureSimilarityPercent: 79,
        culinaryRole: 'Sharp tang, melts smoothly into pan sauces',
        ratio: '1:1 finely grated on microplane',
        dietaryTags: ['Keto', 'Gluten-Free'],
        isAvailableInFridge: currentIngredients.some(i => i.name.toLowerCase().includes('cheddar') || i.name.toLowerCase().includes('cheese')),
        chefTechniqueNote: 'Grate finely on a microplane to mimic the dry powdery consistency of aged parmesan.'
      },
      {
        name: 'Toasted Cashew + Nutritional Yeast + Garlic',
        flavorSimilarityPercent: 84,
        textureSimilarityPercent: 78,
        culinaryRole: 'Rich nut fat, savory punch & crumbly topping',
        ratio: 'Pulse 1/2 cup raw cashews with 1/4 tsp salt & garlic powder',
        dietaryTags: ['Vegan', 'Paleo', 'Dairy-Free'],
        isAvailableInFridge: false,
        chefTechniqueNote: 'Pulse in a food processor until it reaches coarse sand texture. Outstanding on roasted vegetables.'
      }
    ]
  });

  const popularStaples = [
    'Parmesan Cheese',
    'Heavy Cream',
    'Farm Eggs',
    'Butter',
    'Buttermilk',
    'Soy Sauce',
    'Dry White Wine',
    'Fresh Cilantro',
    'Fish Sauce',
    'Cornstarch'
  ];

  const handleFetchSubstitutes = async (ingredientName: string) => {
    setIsAnalyzing(true);
    setSearchTarget(ingredientName);
    try {
      const res = await fetch('/api/ingredient-substitutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetIngredient: ingredientName,
          availableIngredients: currentIngredients.map(i => i.name),
        }),
      });
      const data = await res.json();
      if (data.substitutes) {
        setSubstitutesData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Ingredient Substitution Intelligence
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold border border-teal-500/30">
                CULINARY CHEMISTRY GRAPH
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Never halt cooking for a missing item. Molecular flavor & texture matching with live fridge inventory check.
            </p>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Select Preset Buttons & Search Bar */}
      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono mr-1">Quick Select:</span>
          {popularStaples.map((staple) => (
            <button
              key={staple}
              onClick={() => handleFetchSubstitutes(staple)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                searchTarget.toLowerCase() === staple.toLowerCase()
                  ? 'bg-teal-500 text-slate-950 border-teal-300 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {staple}
            </button>
          ))}
        </div>

        {/* Custom Ingredient Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchSubstitutes(searchTarget)}
              placeholder="Type any missing ingredient (e.g. Buttermilk, Mirin, Shallots, Gruyère)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
            />
          </div>
          <button
            onClick={() => handleFetchSubstitutes(searchTarget)}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Find Substitutes'}</span>
          </button>
        </div>
      </div>

      {/* Target Ingredient Culinary Role Header */}
      <div className="mt-5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-mono">TARGET INGREDIENT IN DISH</span>
          <strong className="text-white text-sm font-bold">{substitutesData.targetIngredient}</strong>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase font-mono">CULINARY FUNCTION</span>
          <span className="text-teal-300 font-semibold">{substitutesData.culinaryRole}</span>
        </div>
      </div>

      {/* 4 Interactive Substitute Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {substitutesData.substitutes.map((sub, idx) => {
          const isAvailable = sub.isAvailableInFridge || currentIngredients.some(i => i.name.toLowerCase().includes(sub.name.toLowerCase().split(' ')[0]));

          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl border transition-all ${
                isAvailable
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800/80">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{sub.name}</span>
                    {isAvailable && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                        IN YOUR FRIDGE ✅
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{sub.culinaryRole}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-teal-400 block">
                    {sub.flavorSimilarityPercent}% Match
                  </span>
                </div>
              </div>

              {/* Flavor vs Texture Similarity Bars */}
              <div className="grid grid-cols-2 gap-3 my-3 text-[11px]">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Flavor Match</span>
                    <strong className="text-teal-300 font-mono">{sub.flavorSimilarityPercent}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-teal-400 h-full rounded-full"
                      style={{ width: `${sub.flavorSimilarityPercent}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Texture Match</span>
                    <strong className="text-amber-300 font-mono">{sub.textureSimilarityPercent}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${sub.textureSimilarityPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Conversion Ratio & Chef Note */}
              <div className="space-y-1.5 text-xs">
                <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800/80 text-[11px]">
                  <strong className="text-teal-300 font-mono">Ratio: </strong>
                  <span className="text-slate-200">{sub.ratio}</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  <strong className="text-slate-300">Chef's Technique: </strong>
                  {sub.chefTechniqueNote}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {sub.dietaryTags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[9px] border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
