import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert, Filter, Zap } from 'lucide-react';

interface CategoryData {
  category: string;
  consumed: number;
  wasted: number;
  wasteRate: number;
  hotspotNote: string;
}

const PAST_30_DAYS_DATA: CategoryData[] = [
  { category: 'Produce', consumed: 42, wasted: 9, wasteRate: 17.6, hotspotNote: 'Leafy greens & berries' },
  { category: 'Dairy & Eggs', consumed: 38, wasted: 3, wasteRate: 7.3, hotspotNote: 'Open cream cartons' },
  { category: 'Meat & Seafood', consumed: 28, wasted: 2, wasteRate: 6.6, hotspotNote: 'Thawed raw salmon' },
  { category: 'Bakery', consumed: 22, wasted: 5, wasteRate: 18.5, hotspotNote: 'Sliced sourdough mold' },
  { category: 'Fermented', consumed: 18, wasted: 0, wasteRate: 0.0, hotspotNote: 'Long shelf life' },
  { category: 'Pantry Stash', consumed: 56, wasted: 1, wasteRate: 1.7, hotspotNote: 'Optimal retention' },
];

const PAST_14_DAYS_DATA: CategoryData[] = [
  { category: 'Produce', consumed: 21, wasted: 4, wasteRate: 16.0, hotspotNote: 'Leafy greens' },
  { category: 'Dairy & Eggs', consumed: 19, wasted: 1, wasteRate: 5.0, hotspotNote: 'Fresh milk' },
  { category: 'Meat & Seafood', consumed: 14, wasted: 1, wasteRate: 6.6, hotspotNote: 'Chicken breast' },
  { category: 'Bakery', consumed: 11, wasted: 2, wasteRate: 15.3, hotspotNote: 'Artisan loaf' },
  { category: 'Fermented', consumed: 9, wasted: 0, wasteRate: 0.0, hotspotNote: 'Zero waste' },
  { category: 'Pantry Stash', consumed: 28, wasted: 0, wasteRate: 0.0, hotspotNote: 'Zero waste' },
];

export const ConsumptionWasteTrendChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'30' | '14'>('30');

  const chartData = timeframe === '30' ? PAST_30_DAYS_DATA : PAST_14_DAYS_DATA;

  const totalConsumed = chartData.reduce((acc, curr) => acc + curr.consumed, 0);
  const totalWasted = chartData.reduce((acc, curr) => acc + curr.wasted, 0);
  const overallEfficiency = Math.round((totalConsumed / (totalConsumed + totalWasted)) * 100);

  const highestWasteCategory = [...chartData].sort((a, b) => b.wasted - a.wasted)[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">30-Day Consumption & Food Waste Hotspots</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                RECHARTS ANALYTICS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tracks ingredient consumption frequency vs expired food waste to optimize grocery spending.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeframe('30')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === '30'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeframe('14')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === '14'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Last 14 Days
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Total Consumed Items</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">{totalConsumed} units</span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400/80" />
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Food Waste Hotspot</span>
            <span className="text-xl font-extrabold text-rose-400 font-mono">{highestWasteCategory.category}</span>
          </div>
          <AlertTriangle className="w-6 h-6 text-rose-400/80" />
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Fridge Efficiency Score</span>
            <span className="text-xl font-extrabold text-teal-300 font-mono">{overallEfficiency}% Utilized</span>
          </div>
          <Zap className="w-6 h-6 text-teal-400/80" />
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="consumed" name="Consumed Items (Used)" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="wasted" name="Waste Hotspot (Expired)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hotspot Breakdown Tips */}
      <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300">
            <strong>Hotspot Advisory:</strong> {highestWasteCategory.category} accounts for {highestWasteCategory.wasted} discarded items ({highestWasteCategory.hotspotNote}). Use high-humidity crisper drawer or freeze early!
          </span>
        </div>
      </div>
    </div>
  );
};
