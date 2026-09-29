import React, { useState } from 'react';
import { Zap, Sun, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const EnergyApplianceRouter: React.FC = () => {
  const [isPeakHour, setIsPeakHour] = useState(true);
  const [solarActive, setSolarActive] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">Energy-Efficient Appliance Routing</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                UTILITY SAVER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cross-references electricity peak rates & solar production with appliance wattage to recommend the cheapest cooking method.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsPeakHour(!isPeakHour)}
            className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
              isPeakHour ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {isPeakHour ? '⚡ Peak Rates ($0.38/kWh)' : 'Off-Peak Rates ($0.12/kWh)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950 border border-emerald-500/40 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span>Air Fryer (1400W)</span>
            <span>RECOMMENDED</span>
          </div>
          <p className="text-slate-300">Fast 12-min cook cycle. Saves $1.20 vs. traditional oven.</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span>Instant Pot / Pressure</span>
            <span>EFFICIENT</span>
          </div>
          <p className="text-slate-400">Low thermal loss. Ideal for slow stewing.</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1 opacity-60">
          <div className="flex items-center justify-between text-rose-400 font-bold">
            <span>Traditional Oven (3500W)</span>
            <span>HIGH PEAK COST</span>
          </div>
          <p className="text-slate-400">Preheat cycle draws high peak wattage.</p>
        </div>
      </div>
    </div>
  );
};
