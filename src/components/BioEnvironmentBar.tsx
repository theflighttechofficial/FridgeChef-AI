import React, { useState } from 'react';
import { CloudRain, Moon, Dna, Mountain, SlidersHorizontal, Check, Zap } from 'lucide-react';

export const BioEnvironmentBar: React.FC = () => {
  const [altitudeFt, setAltitudeFt] = useState(5280); // Denver / High Altitude default
  const [sleepScore, setSleepScore] = useState(68); // Fair Sleep -> Prioritize Serotonin
  const [weatherCondition, setWeatherCondition] = useState('Rainy & Overcast (58°F)');
  const [showDetails, setShowDetails] = useState(false);

  // Dynamic Altitude adjustments
  const boilingPointF = Math.round(212 - (altitudeFt / 500));
  const bakingLiquidIncreasePct = Math.round((altitudeFt / 1000) * 2);
  const cookTimeIncreasePct = Math.round((altitudeFt / 1000) * 3);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-white">Bio-Dynamic & Environmental Sync</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                AUTO-TUNED
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Adapts recipe liquid ratios, boiling points, and serotonin priorities to your local atmosphere & circadian state.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-bold text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showDetails ? 'Hide Bio Controls' : 'Configure Sensors'}</span>
        </button>
      </div>

      {/* 3 Environmental Indicator Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Badge 1: Circadian & Mood Adaptor */}
        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
            <span className="flex items-center gap-1 text-purple-400">
              <Moon className="w-3.5 h-3.5" /> Sleep & Mood Sync
            </span>
            <span className="font-mono text-purple-300">{sleepScore}% Rested</span>
          </div>
          <p className="font-bold text-slate-200">
            {sleepScore < 70 ? 'Serotonin & Tryptophan Priority' : 'High Energy Balanced'}
          </p>
          <p className="text-[10px] text-slate-500 italic">
            {weatherCondition}, Prioritizing cozy warm comfort meals.
          </p>
        </div>

        {/* Badge 2: Microbiome Alignment */}
        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
            <span className="flex items-center gap-1 text-teal-400">
              <Dna className="w-3.5 h-3.5" /> Microbiome Flora
            </span>
            <span className="font-mono text-teal-300">Active Needs</span>
          </div>
          <p className="font-bold text-slate-200">Prebiotic Oligosaccharides</p>
          <p className="text-[10px] text-slate-500 italic">
            Recommending garlic, onions, spinach & fermented sides.
          </p>
        </div>

        {/* Badge 3: Barometric & Altitude Compensator */}
        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
            <span className="flex items-center gap-1 text-amber-400">
              <Mountain className="w-3.5 h-3.5" /> Barometer & Elevation
            </span>
            <span className="font-mono text-amber-300">{altitudeFt} ft</span>
          </div>
          <p className="font-bold text-slate-200">
            Water Boils at {boilingPointF}°F (-{212 - boilingPointF}°F)
          </p>
          <p className="text-[10px] text-slate-500 italic">
            Timer adjusted +{cookTimeIncreasePct}%, Liquid ratios +{bakingLiquidIncreasePct}%.
          </p>
        </div>
      </div>

      {/* Expandable Interactive Environmental Sensor Adjuster */}
      {showDetails && (
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Simulate Local Elevation (Barometric Altitude)</span>
              <span className="text-amber-400 font-bold font-mono">{altitudeFt} ft</span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={250}
              value={altitudeFt}
              onChange={(e) => setAltitudeFt(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Simulate Sleep Tracker Score</span>
              <span className="text-purple-400 font-bold font-mono">{sleepScore}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              step={5}
              value={sleepScore}
              onChange={(e) => setSleepScore(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
