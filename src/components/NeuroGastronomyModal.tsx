import React, { useState } from 'react';
import { Sparkles, History, Music, Lightbulb, HeartPulse, ShieldAlert, Award, X, Play, CheckCircle2 } from 'lucide-react';
import { Ingredient, Recipe } from '../types';

interface NeuroGastronomyModalProps {
  currentIngredients: Ingredient[];
  onStartCooking: (recipe: Recipe) => void;
  onClose: () => void;
}

const HISTORIC_ERAS = [
  {
    id: 'medieval-14th',
    name: '14th-Century Medieval Feast',
    description: 'Slow-simmered pottage with warm fragrant spicing (cinnamon, cloves, ginger) and whole grains.',
    era: '1380 AD — Royal Court of Richard II',
    recipeTitle: 'Reconstructed 14th-Century Medieval Spice Pottage',
  },
  {
    id: 'ancient-roman',
    name: 'Ancient Roman Empire',
    description: 'Savory garum-infused reduction with honeyed herbs and braised roots.',
    era: '1st Century AD — Apicius Culinary Archives',
    recipeTitle: 'Ancient Roman Honey & Herb Reduction Skillet',
  },
  {
    id: 'speakeasy-1920',
    name: '1920s Speakeasy Supper',
    description: 'Pan-browned skillet chops with rich butter onion jus and toasted crusts.',
    era: '1924 — Jazz Age Supper Club',
    recipeTitle: '1920s Jazz Age Cast-Iron Skillet Chop',
  },
];

export const NeuroGastronomyModal: React.FC<NeuroGastronomyModalProps> = ({
  currentIngredients,
  onStartCooking,
  onClose,
}) => {
  const [isSicknessModeActive, setIsSicknessModeActive] = useState(false);
  const [selectedEra, setSelectedEra] = useState(HISTORIC_ERAS[0]);
  const [soundFrequencyHz, setSoundFrequencyHz] = useState(528); // 528 Hz Love/Sweetness frequency
  const [smartLightHex, setSmartLightHex] = useState('#f59e0b'); // Warm Amber Glow

  // Generate historic recipe
  const generateHistoricRecipe = (): Recipe => {
    return {
      id: `historic-${selectedEra.id}`,
      title: selectedEra.recipeTitle,
      description: `${selectedEra.description} (Crafted historically using scanned items: ${currentIngredients.slice(0, 3).map((i) => i.name).join(', ')})`,
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      calories: 460,
      difficulty: 'Medium',
      dietaryTags: ['Historic', 'Authentic', 'Heritage'],
      cuisine: selectedEra.era,
      matchedIngredients: currentIngredients.slice(0, 3).map((i) => i.name),
      missingIngredients: ['Ground Cloves', 'Honey'],
      macros: { protein: '34g', carbs: '28g', fat: '22g' },
      steps: [
        { stepNumber: 1, instruction: `Prepare ingredients according to authentic ${selectedEra.era} cooking techniques.` },
        { stepNumber: 2, instruction: `Simmer over medium flame, building flavor layers with heritage spices.` },
        { stepNumber: 3, instruction: `Garnish with fresh herbs and serve with warm flatbread.` },
      ],
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-slate-100">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <History className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
              Neuro-Gastronomy & Historic Time Machine
            </span>
            <h2 className="text-base font-extrabold text-white">
              Cognitive Culinary Personalization Suite
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 bg-slate-800 text-slate-300 hover:bg-rose-500 hover:text-white rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl mx-auto p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
        {/* Module 1: Generative Historic Recipe Time Machine */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <span>Generative Historic Recipe Time Machine</span>
            </h3>
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              HERITAGE ARCHIVES
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Reconstructs authentic historic recipes from past centuries using the current items in your fridge.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {HISTORIC_ERAS.map((era) => (
              <button
                key={era.id}
                onClick={() => setSelectedEra(era)}
                className={`p-4 rounded-xl border text-left transition-all space-y-1.5 ${
                  selectedEra.id === era.id
                    ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold">{era.era}</span>
                <p className="text-xs font-extrabold text-white">{era.name}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{era.description}</p>
              </button>
            ))}
          </div>

          <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400">Selected Historic Recipe:</span>
              <h4 className="text-sm font-extrabold text-white">{selectedEra.recipeTitle}</h4>
              <p className="text-xs text-slate-400">{selectedEra.description}</p>
            </div>
            <button
              onClick={() => {
                onStartCooking(generateHistoricRecipe());
                onClose();
              }}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-amber-400 transition-all shrink-0 flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Cook Historic Recipe</span>
            </button>
          </div>
        </div>

        {/* Module 2: Sickness & Muted Receptor Taste Modulation */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-400" />
              <span>Sickness & Congestion Taste Receptor Compensator</span>
            </h3>
            <button
              onClick={() => setIsSicknessModeActive(!isSicknessModeActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSicknessModeActive
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              <span>{isSicknessModeActive ? 'Wellness Mode ACTIVE' : 'Enable Cold/Flu Mode'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Dynamically boosts Umami glutamates, lemon citrus acidity, and ginger thermals to offset muted taste buds when you have a cold, flu, or sinus congestion.
          </p>

          {isSicknessModeActive && (
            <div className="bg-slate-950 border border-rose-500/30 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recipe Taste Modulation Adjustments Applied:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Acidity (+35% Citrus / Vinegar): Enhances muted saliva reaction.</li>
                <li>Umami (+40% Glutamate Boost): Enhances savory receptor sensitivity.</li>
                <li>Thermal Warmth (Ginger / Cayenne): Stimulates nasal airflow and circulation.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Module 3: AI Sommelier & Neuro-Frequency Light Sync */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-indigo-400" />
              <span>AI Sommelier, Neuro-Frequency & Smart Light Sync</span>
            </h3>
            <span className="text-xs font-mono text-indigo-400 font-bold">SMART HOME</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold block">Acoustic Pitch for Sweetness Perception:</span>
              <p className="font-mono text-indigo-400 font-bold text-base">{soundFrequencyHz} Hz Harmonic</p>
              <p className="text-[11px] text-slate-500">
                High acoustic frequencies amplify perceived sweetness without adding extra sugar.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold block">Smart Home Light Sync:</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: smartLightHex }} />
                <span className="font-mono text-slate-200 font-bold">Warm Amber Ambient (#F59E0B)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Warm amber hues stimulate appetite and relax digestive muscles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
