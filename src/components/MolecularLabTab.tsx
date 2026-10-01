import React, { useState } from 'react';
import { Flame, Thermometer, Zap, Dna, RefreshCw, Info, CheckCircle2, Atom, Eye, Sliders } from 'lucide-react';
import { Ingredient } from '../types';

interface MolecularLabTabProps {
  currentIngredients: Ingredient[];
}

interface AromaPairing {
  pair: [string, string];
  compound: string;
  chemicalType: string;
  affinityScore: number;
  description: string;
  suggestedDish: string;
}

const SAMPLE_AROMA_PAIRINGS: AromaPairing[] = [
  {
    pair: ['Dark Chocolate', 'Avocado'],
    compound: '2-Methylbutanal & Esters',
    chemicalType: 'Lipid-Soluble Volatiles',
    affinityScore: 94,
    description: 'Rich buttery fats in avocado bind with cacao polyphenols to create a velvety mousse texture without altering sweetness.',
    suggestedDish: 'Molecular Cacao-Avocado Mousse with Sea Salt Flakes',
  },
  {
    pair: ['Blue Cheese', 'Honey / Pineapple'],
    compound: 'Methyl Ketones & Ethyl Butanoate',
    chemicalType: 'Ester-Ketone Synergy',
    affinityScore: 98,
    description: 'Pungent butyric aroma notes in blue cheese are naturally neutralized by tropical esters in honey and pineapple.',
    suggestedDish: 'Caramelized Pineapple Crostini with Blue Cheese Crisp',
  },
  {
    pair: ['Baby Spinach', 'Nutmeg & Butter'],
    compound: 'Sabinene & Eugenol',
    chemicalType: 'Phenolic Terpenes',
    affinityScore: 91,
    description: 'Earthy iron notes in chlorophyll are brightened by aromatic sabinene terpenes in ground nutmeg.',
    suggestedDish: 'Velouté of Wilted Spinach & Nutmeg Infused Cream',
  },
  {
    pair: ['Chicken Breast', 'Soy Sauce & Honey'],
    compound: 'Pyrazines & Furans',
    chemicalType: 'Maillard Reaction Bridge',
    affinityScore: 96,
    description: 'Amino acids (cysteine) in chicken cross-react with reducing sugars to trigger intense Maillard umami pyrazines.',
    suggestedDish: 'Umami-Glazed Pan-Seared Chicken Strips',
  },
];

export const MolecularLabTab: React.FC<MolecularLabTabProps> = ({ currentIngredients }) => {
  const [selectedPairing, setSelectedPairing] = useState<AromaPairing>(SAMPLE_AROMA_PAIRINGS[0]);
  const [submittingIngredient, setSubmittingIngredient] = useState('Egg (1 large - 50g)');
  const [thermalTemp, setThermalTemp] = useState(135); // °F
  const [searSide, setSearSide] = useState<'Side A' | 'Side B'>('Side A');
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Molecular Substitution Matrix calculator
  const getSubstitutions = (item: string) => {
    if (item.toLowerCase().includes('egg')) {
      return [
        { name: 'Flaxseed Slurry', ratio: '1 tbsp (7g) ground flaxseed + 3 tbsp (45ml) warm water', role: 'Moisture & Viscous Binding' },
        { name: 'Aquafaba', ratio: '3 tbsp (45ml) chickpea liquid', role: 'Emulsification & Foaming Action' },
        { name: 'Mashed Banana', ratio: '1/4 cup (65g) ripe banana', role: 'Moisture & Starch Matrix (Sweet Baking)' },
      ];
    } else if (item.toLowerCase().includes('butter')) {
      return [
        { name: 'Avocado + Olive Oil', ratio: '35g mashed avocado + 15g extra virgin olive oil', role: 'Monounsaturated Fat Emulsion' },
        { name: 'Greek Yogurt', ratio: '50g full-fat Greek yogurt', role: 'Lactic Moisture & Binding' },
      ];
    } else {
      return [
        { name: 'Xanthan Gum Slurry', ratio: '0.5g xanthan + 50ml warm water', role: 'Viscosity & Hydrocolloid Thickening' },
        { name: 'Cornstarch Slurry', ratio: '10g cornstarch + 20ml cold liquid', role: 'Gelatinization Matrix' },
      ];
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Atom className="w-48 h-48 text-teal-400" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
          <Dna className="w-3.5 h-3.5" />
          <span>Molecular & Physics-Based Culinary Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          Culinary Physics & Volatile Organic Compound Lab
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Leverage chemical scent-profile pairing, real-time infrared thermal imaging simulation, and molecular structural binding calculations for your ingredients.
        </p>
      </div>

      {/* Grid: 3 Core Molecular Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Module 1: Scent-Profile Aroma Pairing Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Atom className="w-5 h-5 text-teal-400" />
                <span>Scent-Profile Volatile Aroma Pairings</span>
              </h2>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                VOC Gas Affinity AI
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Discovers unconventional flavor bridges based on shared volatile organic compounds (terpenes, pyrazines, and esters) present in your scanned fridge items.
            </p>

            {/* Pairings Cards Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_AROMA_PAIRINGS.map((ap, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPairing(ap)}
                  className={`p-3.5 rounded-xl border text-left transition-all space-y-2 ${
                    selectedPairing.pair[0] === ap.pair[0]
                      ? 'bg-teal-950/40 border-teal-500 text-white shadow-lg shadow-teal-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-teal-400 truncate">{ap.pair[0]} + {ap.pair[1]}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                      {ap.affinityScore}% Match
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{ap.suggestedDish}</p>
                </button>
              ))}
            </div>

            {/* Detailed Selected Aroma Card */}
            <div className="bg-slate-950 border border-teal-500/30 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                    Chemical Compound Synergy
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    {selectedPairing.pair[0]} & {selectedPairing.pair[1]}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-teal-400 font-mono">{selectedPairing.affinityScore}%</p>
                  <p className="text-[9px] text-slate-500 font-semibold uppercase">Molecular Affinity</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">Key Volatile:</span>
                  <span className="font-bold text-slate-200">{selectedPairing.compound}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">Compound Class:</span>
                  <span className="font-bold text-slate-200">{selectedPairing.chemicalType}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{selectedPairing.description}"
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">
                  Dish Idea: {selectedPairing.suggestedDish}
                </span>
              </div>
            </div>
          </div>

          {/* Module 3: Texture & Molecular Binding Substitutions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Dna className="w-5 h-5 text-emerald-400" />
                <span>Molecular Binding & Texture Substitutes</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Precision Gram Metrics</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                Select Missing Structural Ingredient:
              </label>
              <select
                value={submittingIngredient}
                onChange={(e) => setSubmittingIngredient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="Egg (1 large - 50g)">Egg (1 large - 50g Binding Agent)</option>
                <option value="Butter (100g Fat Matrix)">Butter (100g Fat & Moisture Matrix)</option>
                <option value="Heavy Cream (200ml Liquid Emulsion)">Heavy Cream (200ml Liquid Emulsion)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              {getSubstitutions(submittingIngredient).map((sub, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{sub.name}</span>
                    </p>
                    <p className="text-xs font-mono text-teal-400 font-bold">{sub.ratio}</p>
                    <p className="text-[11px] text-slate-400">{sub.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module 2: Simulated Thermal Imaging Camera Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-amber-400" />
                <span>Thermal Imaging Matrix</span>
              </h2>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showHeatmap ? 'Hide Overlay' : 'Show Overlay'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Simulates infrared thermal sensor readings over your pan to monitor internal heat distribution and sear zones in real-time.
            </p>

            {/* Interactive Heatmap Camera Container */}
            <div className="relative aspect-square bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 flex flex-col items-center justify-center shadow-2xl">
              {/* Simulated Cooking Item Graphic with Thermal Colors */}
              <div className="relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300">
                {/* Simulated Pan Heat Gradient Ring */}
                <div
                  className="absolute inset-0 rounded-full blur-xl transition-all duration-500 opacity-80"
                  style={{
                    background: showHeatmap
                      ? `radial-gradient(circle, rgba(239, 68, 68, 0.8) ${thermalTemp / 2}%, rgba(245, 158, 11, 0.6) 60%, rgba(16, 185, 129, 0.3) 100%)`
                      : 'none',
                  }}
                />

                {/* Simulated Steak / Protein Silhouette */}
                <div className="relative z-10 w-36 h-28 bg-amber-950/80 border-2 border-amber-500/50 rounded-3xl flex flex-col items-center justify-center p-3 text-center shadow-2xl backdrop-blur-sm">
                  <Flame className="w-8 h-8 text-amber-400 animate-pulse" />
                  <span className="text-xs font-extrabold text-white mt-1">
                    {thermalTemp < 125 ? 'Rare (120°F)' : thermalTemp < 140 ? 'Medium-Rare (135°F)' : 'Well Sear (160°F)'}
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    Core Temp: {thermalTemp}°F
                  </span>
                </div>
              </div>

              {/* Thermal HUD Controls */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono font-bold bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400">SEAR ZONE ACTIVE</span>
                <span className="text-amber-400">{searSide}</span>
              </div>

              {/* Thermal Alert Banner */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 border border-amber-500/40 p-2.5 rounded-xl text-center space-y-1">
                {thermalTemp >= 135 && thermalTemp <= 145 ? (
                  <p className="text-xs font-extrabold text-emerald-400 flex items-center justify-center gap-1 animate-bounce">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Perfect Sear Reached! Flip Protein Now
                  </p>
                ) : thermalTemp > 145 ? (
                  <p className="text-xs font-extrabold text-rose-400">
                    High Heat Sear, Pull from skillet soon to rest
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-slate-300">
                    Heating skillet... Searing surface temperature rising
                  </p>
                )}
              </div>
            </div>

            {/* Temperature Slider Control */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">Simulate Core Pan Temperature</span>
                <span className="text-amber-400 font-extrabold font-mono">{thermalTemp}°F</span>
              </div>
              <input
                type="range"
                min={100}
                max={180}
                step={1}
                value={thermalTemp}
                onChange={(e) => setThermalTemp(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
