import React, { useState } from 'react';

export interface NutritionPoint {
  attribute: string;
  score: number; // 0 - 100
  detail: string;
}

interface D3RadarChartProps {
  data: NutritionPoint[];
  size?: number;
}

export const D3RadarChart: React.FC<D3RadarChartProps> = ({ data, size = 220 }) => {
  const [activePoint, setActivePoint] = useState<NutritionPoint | null>(null);

  if (!data || data.length === 0) return null;

  const N = data.length;
  const center = size / 2;
  const radius = center - 35; // margin for labels

  // Polar coordinate helper: angle in radians, index i
  const getCoordinates = (index: number, val: number) => {
    // Offset angle by -PI/2 so top axis starts at 12 o'clock
    const angle = (Math.PI * 2 * index) / N - Math.PI / 2;
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Concentric grid rings (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const getPolygonPoints = (level: number) => {
    return Array.from({ length: N }).map((_, i) => {
      const { x, y } = getCoordinates(i, level * 100);
      return `${x},${y}`;
    }).join(' ');
  };

  // Data polygon points string
  const dataPolygonPoints = data.map((d, i) => {
    const { x, y } = getCoordinates(i, Math.max(10, Math.min(100, d.score)));
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        className="overflow-visible select-none drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]"
      >
        <defs>
          <linearGradient id="d3RadarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx={center} cy={center} r={radius} fill="url(#centerGlow)" />

        {/* Grid Concentric Polygons */}
        {gridLevels.map((lvl) => (
          <polygon
            key={lvl}
            points={getPolygonPoints(lvl)}
            fill="none"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray={lvl === 1 ? '0' : '2,2'}
            opacity={lvl === 1 ? 0.8 : 0.5}
          />
        ))}

        {/* Radial Axis Spokes */}
        {Array.from({ length: N }).map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#334155"
              strokeWidth="1"
            />
          );
        })}

        {/* High-Fidelity Data Polygon */}
        <polygon
          points={dataPolygonPoints}
          fill="url(#d3RadarGradient)"
          stroke="#10b981"
          strokeWidth="2.5"
          className="transition-all duration-300"
        />

        {/* Axis Labels & Vertex Data Markers */}
        {data.map((item, i) => {
          const outerCoord = getCoordinates(i, 118); // offset for text
          const pointCoord = getCoordinates(i, Math.max(10, Math.min(100, item.score)));

          return (
            <g key={item.attribute} className="group cursor-pointer">
              {/* Vertex Point Marker */}
              <circle
                cx={pointCoord.x}
                cy={pointCoord.y}
                r={activePoint?.attribute === item.attribute ? 6 : 4}
                fill="#10b981"
                stroke="#020617"
                strokeWidth="2"
                className="transition-all duration-200"
                onMouseEnter={() => setActivePoint(item)}
                onMouseLeave={() => setActivePoint(null)}
              />

              {/* Label Text */}
              <text
                x={outerCoord.x}
                y={outerCoord.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#cbd5e1"
                fontSize="10"
                fontWeight="700"
                className="hover:fill-emerald-400 transition-colors"
                onMouseEnter={() => setActivePoint(item)}
                onMouseLeave={() => setActivePoint(null)}
              >
                {item.attribute}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Interactive Tooltip */}
      {activePoint ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-slate-900/95 border border-emerald-500/60 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md text-center z-10 animate-in fade-in zoom-in-95">
          <p className="text-xs font-extrabold text-white">{activePoint.attribute}</p>
          <p className="text-[11px] font-bold font-mono text-emerald-400">
            {activePoint.score}% Target ({activePoint.detail})
          </p>
        </div>
      ) : (
        <p className="text-[10px] text-slate-500 font-semibold mt-1">
          Hover vertices for exact macro scores
        </p>
      )}
    </div>
  );
};
