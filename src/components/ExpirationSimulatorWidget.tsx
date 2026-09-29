import React, { useState } from 'react';
import { ShieldAlert, Clock, Snowflake, ShieldCheck, Flame, Info } from 'lucide-react';

interface ZoneOption {
  zone: 'Crisper Drawer' | 'Main Shelf' | 'Door Rack' | 'Deep Freeze (-18°C)';
  decayMultiplier: number;
  tip: string;
}

const ZONES: ZoneOption[] = [
  { zone: 'Crisper Drawer', decayMultiplier: 0.6, tip: 'High humidity setting keeps leafy greens crisper 3x longer.' },
  { zone: 'Main Shelf', decayMultiplier: 1.0, tip: 'Optimal constant 37°F temperature for dairy, meats, and leftovers.' },
  { zone: 'Door Rack', decayMultiplier: 1.5, tip: 'Fluctuating door temps accelerate milk & raw protein spoilage.' },
  { zone: 'Deep Freeze (-18°C)', decayMultiplier: 0.1, tip: 'Halts bacterial breakdown completely for 3-6 months.' },
];

export const ExpirationSimulatorWidget: React.FC = () => {
  const [daysElapsed, setDaysElapsed] = useState(7);
  const [selectedZone, setSelectedZone] = useState<ZoneOption>(ZONES[0]);

  // Degradation calculation
  const effectiveDays = Math.round(daysElapsed * selectedZone.decayMultiplier);
  const freshnessPercent = Math.max(0, 100 - effectiveDays * 7);

  const getFreshnessStatus = (pct: number) => {
    if (pct > 75) return { text: 'Optimal Freshness', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (pct > 40) return { text: 'Use Soon (Moderate Decay)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { text: 'High Spoilage Risk / Freeze Immediately', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const status = getFreshnessStatus(freshnessPercent);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Interactive Shelf-Life & Spoilage Simulator</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-bold">
                DECAY SIMULATOR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Simulate bacterial decay and organoleptic quality drops across fridge micro-climates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {ZONES.map((z) => (
            <button
              key={z.zone}
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedZone.zone === z.zone
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md shadow-teal-500/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {z.zone.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold">Simulated Storage Time:</span>
            <span className="font-mono font-extrabold text-emerald-400 text-sm">{daysElapsed} Days</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={daysElapsed}
            onChange={(e) => setDaysElapsed(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Status Bar */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${status.bg}`}>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Predicted State in {selectedZone.zone}</span>
            <h4 className={`text-sm font-extrabold ${status.color}`}>{status.text}</h4>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-white">{freshnessPercent}%</span>
            <span className="text-[10px] text-slate-400 block">Freshness Retained</span>
          </div>
        </div>

        {/* Tip */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span><strong>Zone Strategy:</strong> {selectedZone.tip}</span>
        </div>
      </div>
    </div>
  );
};
