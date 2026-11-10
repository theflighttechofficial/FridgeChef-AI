import React from 'react';
import { CookingTimeBudget, CookingMoodMode } from '../types';

interface ContextAwareCookingBarProps {
  selectedTime: CookingTimeBudget;
  onSelectTime: (time: CookingTimeBudget) => void;
  selectedMood: CookingMoodMode;
  onSelectMood: (mood: CookingMoodMode) => void;
}

const TIMES: { id: CookingTimeBudget; label: string }[] = [
  { id: '15 min', label: '15 min' },
  { id: '30 min', label: '30 min' },
  { id: '60+ min', label: 'Any time' },
];

const MOODS: { id: CookingMoodMode; label: string }[] = [
  { id: 'Standard', label: 'Everyday' },
  { id: 'Starving', label: 'Starving' },
  { id: 'Gourmet', label: 'Impress' },
  { id: 'Hosting', label: 'Guests' },
];

const Chip: React.FC<{ on: boolean; onClick: () => void; children: React.ReactNode }> = ({ on, onClick, children }) => (
  <button
    onClick={onClick}
    aria-pressed={on}
    className={`h-9 px-4 shrink-0 rounded-lg text-sm font-medium border transition-colors ${
      on ? 'bg-secondary-container text-on-secondary-container border-transparent' : 'border-outline-variant text-on-surface-variant state-layer'
    }`}
  >
    {children}
  </button>
);

/** One scrollable row of quick filters: how long you have and what kind of meal you want. */
export const ContextAwareCookingBar: React.FC<ContextAwareCookingBarProps> = ({ selectedTime, onSelectTime, selectedMood, onSelectMood }) => (
  <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto no-scrollbar" role="toolbar" aria-label="Quick filters">
    {TIMES.map((t) => (
      <Chip key={t.id} on={selectedTime === t.id} onClick={() => onSelectTime(t.id)}>
        {t.label}
      </Chip>
    ))}
    <span className="w-px h-6 bg-outline-variant shrink-0 mx-1" aria-hidden />
    {MOODS.map((m) => (
      <Chip key={m.id} on={selectedMood === m.id} onClick={() => onSelectMood(m.id)}>
        {m.label}
      </Chip>
    ))}
  </div>
);
