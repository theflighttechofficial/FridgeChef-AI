import React, { useState } from 'react';
import { Wine, GlassWater, Sparkles, Flame, RefreshCw, Check } from 'lucide-react';

interface PairingNote {
  dish: string;
  beverageType: 'Wine' | 'Craft Beer' | 'Zero-Proof Mocktail';
  beverageName: string;
  notes: string;
  temp: string;
  glassware: string;
}

const SOMMELIER_PAIRINGS: PairingNote[] = [
  {
    dish: 'Gourmet Mediterranean Power Bowl',
    beverageType: 'Wine',
    beverageName: 'Crisp Sauvignon Blanc (Sancerre / Marlborough)',
    notes: 'High acidity cuts through rich avocado fat while bright citrus zest notes harmonize with lemon chicken & feta.',
    temp: '45°F - 48°F (7°C)',
    glassware: 'Standard Stemmed White Wine Glass',
  },
  {
    dish: 'Wok-Tossed Crispy Garlic Shrimp & Bok Choy',
    beverageType: 'Craft Beer',
    beverageName: 'Yuzu Dry Japanese Lager or Crisp Saison',
    notes: 'Effervescent carbonation wipes the palate clean between spicy garlic bites and enhances wok-hei umami.',
    temp: '38°F - 42°F (4°C)',
    glassware: 'Pilsner Flute',
  },
  {
    dish: 'Air-Fryer Caramelized Miso Eggplant & Tofu',
    beverageType: 'Zero-Proof Mocktail',
    beverageName: 'Sparkling Yuzu Ginger & Fermented Green Tea Elixir',
    notes: 'Zesty yuzu sharpness and subtle ginger heat balance the sweet rich miso glaze without overpowering delicate tofu.',
    temp: 'Chilled over cubed ice',
    glassware: 'Highball Glass with Fresh Rosemary Sprig',
  },
  {
    dish: 'Instant Pot Barbacoa Shredded Beef',
    beverageType: 'Wine',
    beverageName: 'Full-Bodied Malbec or Syrah',
    notes: 'Bold tannins stand up to chipotle smoke, while dark berry fruit aromas soften lime acidity.',
    temp: '60°F - 65°F (16°C)',
    glassware: 'Bordeaux Large Bowl Glass',
  },
];

export const GourmetSommelierWidget: React.FC = () => {
  const [selectedPairingIndex, setSelectedPairingIndex] = useState(0);

  const activePairing = SOMMELIER_PAIRINGS[selectedPairingIndex];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Wine className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Gourmet Beverage & Sommelier Pairing</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                SOMMELIER AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Curated fine wines, craft brews, and zero-proof artisanal mocktail pairings for your stashed recipes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          {SOMMELIER_PAIRINGS.map((p, idx) => (
            <button
              key={p.dish}
              onClick={() => setSelectedPairingIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedPairingIndex === idx
                  ? 'bg-purple-500 text-slate-950 font-extrabold shadow-md shadow-purple-500/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {p.dish.split(' ')[0]} {p.dish.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pairing Dish</span>
            <h4 className="text-sm font-extrabold text-white">{activePairing.dish}</h4>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold font-mono self-start sm:self-auto">
            {activePairing.beverageType}
          </span>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-purple-400 uppercase">Sommelier Recommended Bottle</span>
          <p className="text-sm font-extrabold text-slate-100">{activePairing.beverageName}</p>
          <p className="text-slate-300 text-xs leading-relaxed mt-1">{activePairing.notes}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-slate-400 font-bold">Serving Temp:</span>
            <span className="font-mono text-emerald-400 font-bold">{activePairing.temp}</span>
          </div>

          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-slate-400 font-bold">Glassware:</span>
            <span className="font-mono text-teal-300 font-bold">{activePairing.glassware}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
