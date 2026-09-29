import React, { useState } from 'react';
import { Camera, MapPin, Tag, RefreshCw, Sparkles, ShoppingCart, Trees, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const EcologyArbitrageWidget: React.FC = () => {
  const [cameraActive, setCameraActive] = useState(true);
  const [selectedCam, setSelectedCam] = useState<'Pantry Cam' | 'Wine Fridge Cam'>('Pantry Cam');

  // Backyard Foraging Flora
  const backyardFlora = [
    { name: 'Wild Dandelion Greens', location: 'Backyard Lawn', culinaryUse: 'Piquant bitter salad garnish rich in Vitamin A' },
    { name: 'Wild Rosemary Bush', location: 'Side Garden Path', culinaryUse: 'Aromatic woody pine flavor for pan-seared chicken' },
    { name: 'Wood Sorrel / Wild Clover', location: 'Shaded Garden Corner', culinaryUse: 'Tart citrus-like tang ideal for dressings' },
  ];

  // Grocery Arbitrage Local Surplus Deals
  const surplusArbitrageStore = [
    { item: 'Feta Cheese (150g)', store: 'Trader Joe\'s (0.8 mi)', price: '$2.49', discount: '40% OFF Surplus' },
    { item: 'English Cucumber', store: 'Local Farmers Market (1.2 mi)', price: '$0.89', discount: '50% OFF Clearance' },
    { item: 'Organic Sesame Seeds', store: 'Whole Foods (1.5 mi)', price: '$1.99', discount: '30% OFF' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">Hyper-Local Ecology & Decentralized Kitchens</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-bold">
                IOT & FORAGING
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Retrofit micro-camera links for non-smart pantries, backyard foraging mapping, and local grocery surplus arbitrage.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: Appliance Retrofit Micro-Cam Link */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-teal-400" />
              <span>Pantry Retrofit Micro-Cam</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">ONLINE</span>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCam('Pantry Cam')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  selectedCam === 'Pantry Cam'
                    ? 'bg-teal-500 text-slate-950 border-teal-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Pantry Cam #1
              </button>
              <button
                onClick={() => setSelectedCam('Wine Fridge Cam')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  selectedCam === 'Wine Fridge Cam'
                    ? 'bg-teal-500 text-slate-950 border-teal-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Wine Fridge Cam #2
              </button>
            </div>

            {/* Simulated Live Camera Feed Display */}
            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
              <div className="text-center space-y-1">
                <Camera className="w-8 h-8 text-teal-400/50 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-white">{selectedCam} Snapshot</p>
                <p className="text-[10px] text-emerald-400 font-mono">10 items detected (Updated 2m ago)</p>
              </div>

              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[9px] text-teal-400 font-mono">
                LIVE RETROFIT
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Hyper-Local Foraging & Backyard Sync */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>Backyard Foraging Flora Map</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">GPS SYNCED</span>
          </div>

          <div className="space-y-2">
            {backyardFlora.map((flora, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl space-y-1 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-white">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {flora.name}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">{flora.location}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{flora.culinaryUse}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Module 3: Dynamic Pricing Grocery Arbitrage Engine */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Grocery Surplus Arbitrage</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 font-bold">WHOLESALE AI</span>
          </div>

          <div className="space-y-2">
            {surplusArbitrageStore.map((arb, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-white">{arb.item}</p>
                  <p className="text-[10px] text-slate-400">{arb.store}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-amber-400 font-mono">{arb.price}</p>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                    {arb.discount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
