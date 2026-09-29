import React, { useState } from 'react';
import { Filter, Search, RotateCcw, Clock, Award, Globe, Flame, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterOptions } from '../types';

interface SidebarFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onResetFilters: () => void;
  totalRecipesCount: number;
}

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Keto',
  'Gluten-Free',
  'Dairy-Free',
  'Low-Carb',
  'Nut-Free',
  'Paleo',
];

const CUISINE_OPTIONS = [
  'All',
  'Indian (North & South)',
  'American / BBQ',
  'Thai Street Food',
  'Japanese / Izakaya',
  'Mediterranean',
  'Asian Fusion',
  'Korean Clean Eats',
  'Cantonese / Asian',
  'Mexican',
];

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalRecipesCount,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleDietary = (diet: string) => {
    const exists = filters.dietary.includes(diet);
    const updated = exists
      ? filters.dietary.filter((d) => d !== diet)
      : [...filters.dietary, diet];
    onFilterChange({ ...filters, dietary: updated });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 sm:space-y-6 shadow-xl lg:sticky lg:top-20">
      {/* Header Bar with Mobile Toggle */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Recipe Filters
          </h3>
          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full">
            {totalRecipesCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <span>{isMobileOpen ? 'Hide' : 'Filters'}</span>
            {isMobileOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Filter Body (Always visible on lg+, collapsible on mobile) */}
      <div className={`${isMobileOpen ? 'block' : 'hidden lg:block'} space-y-5 transition-all`}>
        {/* Search Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search Recipes</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. salmon, pasta, bowl..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

      {/* Dietary Restrictions (Interactive Filter Buttons - Compliant with Zero-Pill Rule) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dietary Preferences</span>
          </span>
          {filters.dietary.length > 0 && (
            <span className="text-[10px] text-emerald-400 font-bold">
              {filters.dietary.length} selected
            </span>
          )}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DIETARY_OPTIONS.map((diet) => {
            const isSelected = filters.dietary.includes(diet);
            return (
              <button
                key={diet}
                type="button"
                onClick={() => toggleDietary(diet)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {diet}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prep Time Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Max Prep Time</span>
          </span>
          <span className="text-emerald-400 font-bold">
            {filters.maxPrepTime >= 60 ? '60+ mins' : `${filters.maxPrepTime} mins`}
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={60}
          step={5}
          value={filters.maxPrepTime}
          onChange={(e) => onFilterChange({ ...filters, maxPrepTime: Number(e.target.value) })}
          className="w-full accent-emerald-500 bg-slate-950 rounded-lg cursor-pointer h-1.5"
        />
      </div>

      {/* Difficulty Rating Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-slate-500" />
          <span>Difficulty</span>
        </label>
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => onFilterChange({ ...filters, difficulty: diff })}
              className={`py-1 text-xs font-medium rounded-lg transition-colors ${
                filters.difficulty === diff
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>Cuisine Style</span>
        </label>
        <select
          value={filters.cuisine}
          onChange={(e) => onFilterChange({ ...filters, cuisine: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          {CUISINE_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-slate-500" />
          <span>Sort Recipes By</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="match">Most Ingredients Matched</option>
          <option value="time">Quickest Total Time</option>
          <option value="calories">Lowest Calorie Count</option>
        </select>
      </div>

      </div>

      <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800 text-center">
        Showing <span className="text-slate-300 font-bold">{totalRecipesCount}</span> recipe options
      </div>
    </div>
  );
};
