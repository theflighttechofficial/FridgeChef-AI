import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { FlavorDna } from '../types';

interface FlavorDnaRadarChartProps {
  flavorDna: FlavorDna;
  height?: number;
}

export const FlavorDnaRadarChart: React.FC<FlavorDnaRadarChartProps> = ({
  flavorDna,
  height = 190,
}) => {
  const data = [
    { subject: 'Salt ', value: flavorDna.salt, fullMark: 100 },
    { subject: 'Sweet ', value: flavorDna.sweet, fullMark: 100 },
    { subject: 'Acid ', value: flavorDna.acid, fullMark: 100 },
    { subject: 'Heat ', value: flavorDna.heat, fullMark: 100 },
    { subject: 'Umami ', value: flavorDna.umami, fullMark: 100 },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-1">
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 700 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} axisLine={false} />
            <Radar
              name="Flavor DNA"
              dataKey="value"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.38}
              strokeWidth={2}
              dot={{ r: 3, fill: '#fbbf24', stroke: '#0f172a', strokeWidth: 1.5 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Palate Readout */}
      <div className="flex flex-wrap justify-center gap-1.5 text-[10px] font-mono font-bold pt-1">
        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          Salt: <span className="text-amber-400">{flavorDna.salt}%</span>
        </span>
        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          Sweet: <span className="text-amber-400">{flavorDna.sweet}%</span>
        </span>
        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          Acid: <span className="text-amber-400">{flavorDna.acid}%</span>
        </span>
        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          Heat: <span className="text-rose-400">{flavorDna.heat}%</span>
        </span>
        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          Umami: <span className="text-emerald-400">{flavorDna.umami}%</span>
        </span>
      </div>
    </div>
  );
};
