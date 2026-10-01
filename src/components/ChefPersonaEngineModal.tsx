import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Flame, Clock, Play, ArrowRight, ShieldCheck, CheckCircle2, X, Zap, Layers, Utensils } from 'lucide-react';
import { ChefPersonaType, ChefPersonaMeta, ChefPersonaRecipe, Ingredient, Recipe } from '../types';
import { showToast, AI_OFFLINE_MESSAGE, noteIfFallback } from '../utils/toast';

interface ChefPersonaEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: Ingredient[];
  onStartCookingRecipe: (recipe: Recipe) => void;
}

export const CHEF_PERSONAS: ChefPersonaMeta[] = [
  {
    type: 'Indian',
    flagEmoji: '',
    name: 'Indian Master Chef',
    subtitle: 'Aromatic Tadka & Claypot Braises',
    signatureStyle: 'Layered blooming spices, roasted aromatics, mustard & curry leaves',
    quote: 'Spices are not heat; they are music in warm oil.'
  },
  {
    type: 'Japanese',
    flagEmoji: '',
    name: 'Japanese Washoku Shokunin',
    subtitle: 'Dashi Broths & Umami Precision',
    signatureStyle: 'Subtle dashi infusions, precision knife cuts, balanced mirin-soy glaze',
    quote: 'Respect the true natural flavor of the ingredient.'
  },
  {
    type: 'Italian',
    flagEmoji: '',
    name: 'Italian Nonna & Trattoria',
    subtitle: 'San Marzano Acidity & Silky Olive Emulsions',
    signatureStyle: 'High-heat blistering, emulsified starchy cooking water, al dente discipline',
    quote: 'Simple food cooked with intense love and good olive oil.'
  },
  {
    type: 'French',
    flagEmoji: '',
    name: 'French Haute Cuisine',
    subtitle: 'Foaming Butter Basting & Velouté Reductions',
    signatureStyle: 'Arroser pan-basting, shallot pan fond deglazing, refined brigade garnishes',
    quote: 'Butter, time, and technique are the trinity of gastronomy.'
  },
  {
    type: 'Korean',
    flagEmoji: '',
    name: 'Korean Hansik Master',
    subtitle: 'Fermented Gochujang & Scorched Stone Pot',
    signatureStyle: 'Aged kimchi acid balance, toasted sesame oil finish, bold umami crunch',
    quote: 'Fermentation is time speaking through flavor.'
  },
  {
    type: 'Mexican',
    flagEmoji: '',
    name: 'Mexican Abuela & Taqueria',
    subtitle: 'Charred Fire Chiles & Vibrant Citrus Zest',
    signatureStyle: 'Comal blistering, toasted dried chiles, fresh cilantro and lime acid punch',
    quote: 'Fire and fresh acid bring any pantry alive.'
  },
  {
    type: 'Molecular',
    flagEmoji: '',
    name: 'Modernist Gastronomist',
    subtitle: 'Agar Pearls & Precision Thermal Science',
    signatureStyle: 'Deconstructed textures, savory light espumas, sous-vide tenderization',
    quote: 'Cooking is edible chemistry and applied physics.'
  },
  {
    type: 'Fitness',
    flagEmoji: '',
    name: 'Macro & Performance Coach',
    subtitle: 'Max Lean Protein per Calorie',
    signatureStyle: 'Clean macro ratios, healthy fats, minimal seed oils, high satiety density',
    quote: 'Fuel the body with clean, high-performance fuel.'
  },
  {
    type: 'Budget',
    flagEmoji: '',
    name: 'Frugal Pantry Wizard',
    subtitle: 'Maximum Caloric Volume per Rupee/Cent',
    signatureStyle: 'Root-to-stem zero-waste usage, grain stretching, rich fond pan gravies',
    quote: 'Great cooking is making gold out of humble copper.'
  },
  {
    type: 'Homestyle',
    flagEmoji: '',
    name: 'Homestyle Comfort Kitchen',
    subtitle: 'One-Pot Nostalgia & Zero-Fuss Cleanup',
    signatureStyle: 'Hearty warming stews, easy sheet pans, satisfying family portions',
    quote: 'No fussy tweezers, just delicious, comforting nourishment.'
  }
];

export const ChefPersonaEngineModal: React.FC<ChefPersonaEngineModalProps> = ({
  isOpen,
  onClose,
  availableIngredients,
  onStartCookingRecipe,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<ChefPersonaType>('Indian');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [createdDish, setCreatedDish] = useState<ChefPersonaRecipe | null>(null);

  if (!isOpen) return null;

  const currentMeta = CHEF_PERSONAS.find((p) => p.type === selectedPersona) || CHEF_PERSONAS[0];

  const handleSynthesize = async (persona: ChefPersonaType) => {
    setIsSynthesizing(true);
    setSelectedPersona(persona);
    try {
      const res = await fetch('/api/chef-persona-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          ingredients: availableIngredients.map((i) => i.name),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      noteIfFallback(res);
      const data = await res.json();
      setCreatedDish(data);
    } catch (e) {
      showToast(AI_OFFLINE_MESSAGE);
      console.error(e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCookThis = () => {
    if (!createdDish) return;
    const recipe: Recipe = {
      id: `persona-${selectedPersona}-${Date.now()}`,
      title: createdDish.dishTitle,
      description: createdDish.tagline,
      prepTimeMinutes: createdDish.prepTimeMinutes,
      cookTimeMinutes: createdDish.cookTimeMinutes,
      calories: createdDish.calories,
      difficulty: 'Medium',
      cuisine: selectedPersona,
      dietaryTags: [selectedPersona, 'Chef Crafted'],
      matchedIngredients: availableIngredients.map((i) => i.name),
      missingIngredients: [],
      macros: createdDish.macros,
      steps: createdDish.steps,
      chefTip: createdDish.chefTip,
    };
    onStartCookingRecipe(recipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
              <ChefHat className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Chef Persona Engine</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  10 MASTER STYLES
                </span>
              </div>
              <p className="text-xs text-slate-400">
                The same pantry ingredients produce radically different dishes when viewed through a master chef's eyes.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10 Chef Persona Grid Selection */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {CHEF_PERSONAS.map((persona) => {
              const isSelected = selectedPersona === persona.type;
              return (
                <button
                  key={persona.type}
                  onClick={() => handleSynthesize(persona.type)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <strong className="block text-xs font-bold leading-tight">{persona.name}</strong>
                    <span className="text-[10px] text-slate-400 block line-clamp-1">{persona.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Chef Banner */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">{currentMeta.name}</h4>
                <p className="text-xs text-amber-300 italic font-serif">"{currentMeta.quote}"</p>
              </div>
            </div>
            <button
              onClick={() => handleSynthesize(selectedPersona)}
              disabled={isSynthesizing}
              className="shrink-0 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>{isSynthesizing ? 'Synthesizing...' : 'Re-Cook This Style'}</span>
            </button>
          </div>

          {isSynthesizing ? (
            <div className="p-12 text-center space-y-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-sm font-bold text-white">Channeling {currentMeta.name}...</h4>
              <p className="text-xs text-slate-400">Re-imagining your ingredients through authentic culinary tradition.</p>
            </div>
          ) : createdDish ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Dish Overview & Flavor Profile (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                        CHEF CREATION
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                        {createdDish.dishTitle}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">{createdDish.tagline}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                      {createdDish.cookTimeMinutes} mins
                    </span>
                  </div>

                  <p className="text-xs text-amber-200/90 italic bg-amber-950/30 p-3 rounded-xl border border-amber-900/40">
                    "{createdDish.personaGreeting}"
                  </p>

                  {/* Macros & Nutritional Highlights */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">PROTEIN</span>
                      <strong className="text-xs text-emerald-400 font-mono mt-0.5 block">{createdDish.macros.protein}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">CALORIES</span>
                      <strong className="text-xs text-amber-400 font-mono mt-0.5 block">{createdDish.calories} kcal</strong>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">PREP TIME</span>
                      <strong className="text-xs text-cyan-400 font-mono mt-0.5 block">{createdDish.prepTimeMinutes} mins</strong>
                    </div>
                  </div>
                </div>

                {/* Technique & Flavor Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">SIGNATURE TECHNIQUE</span>
                    <strong className="text-xs text-amber-300 block">{createdDish.signatureTechnique}</strong>
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">FLAVOR PROFILE</span>
                    <p className="text-xs text-slate-300 leading-snug">{createdDish.flavorProfile}</p>
                  </div>
                </div>

                {/* Master Chef Tip */}
                <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>MASTER CHEF SECRET TIP</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{createdDish.chefTip}</p>
                </div>
              </div>

              {/* Right Column: Step Sequence & 1-Click Launch */}
              <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
                    Culinary Instructions
                  </span>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {createdDish.steps.map((st) => (
                      <div key={st.stepNumber} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-amber-400 font-mono font-bold">
                          <span>STEP {st.stepNumber}</span>
                          {st.timerSeconds && <span>⏱{Math.round(st.timerSeconds / 60)} min</span>}
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{st.instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCookThis}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Cook {createdDish.dishTitle}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white">Select any Chef Persona above</h4>
              <p className="text-xs text-slate-400">
                Click any chef persona (Indian, Japanese, Italian, French, etc.) to immediately synthesize a custom dish from your current fridge ingredients!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
