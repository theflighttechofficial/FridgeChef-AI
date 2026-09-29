import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Refrigerator,
  Snowflake,
  Sparkles,
  Thermometer,
  Layers,
  ChevronRight,
  Info,
  Clock,
  Flame,
  X,
  Utensils,
  Droplets,
  Calendar
} from 'lucide-react';
import { Ingredient, FridgeLocation } from '../types';

interface FridgeDigitalTwinProps {
  ingredients: Ingredient[];
  onSelectIngredientToCook?: (ingredientName: string) => void;
  onMoveLocation?: (ingredientId: string, newLocation: FridgeLocation) => void;
}

export const FridgeDigitalTwin: React.FC<FridgeDigitalTwinProps> = ({
  ingredients,
  onSelectIngredientToCook,
  onMoveLocation,
}) => {
  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);

  // Map category to default fridge shelf location if not stored
  const getLocationForItem = (item: Ingredient): FridgeLocation => {
    if (item.category === 'Meat & Seafood' && item.freshness === 'Frozen') return 'Deep Freeze';
    if (item.freshness === 'Frozen' || item.name.toLowerCase().includes('frozen') || item.name.toLowerCase().includes('edamame')) return 'Deep Freeze';
    if (item.category === 'Produce') return 'Crisper Drawer';
    if (item.category === 'Dairy & Eggs' || item.category === 'Bakery') return 'Top Shelf';
    if (item.category === 'Meat & Seafood' || item.category === 'Grains & Pulses') return 'Middle Shelf';
    if (item.category === 'Condiments' || item.category === 'Beverages' || item.category === 'Fermented') return 'Door Rack';
    return 'Middle Shelf';
  };

  const getItemEmoji = (name: string, category: string): string => {
    const n = name.toLowerCase();
    if (n.includes('milk')) return '🥛';
    if (n.includes('cheese') || n.includes('cheddar') || n.includes('feta')) return '🧀';
    if (n.includes('egg')) return '🥚';
    if (n.includes('chicken') || n.includes('poultry')) return '🍗';
    if (n.includes('salmon') || n.includes('fish')) return '🐟';
    if (n.includes('spinach') || n.includes('greens') || n.includes('bok choy')) return '🥬';
    if (n.includes('tomato')) return '🍅';
    if (n.includes('carrot')) return '🥕';
    if (n.includes('pepper') || n.includes('bell pepper')) return '🫑';
    if (n.includes('tofu')) return '🧊';
    if (n.includes('yogurt')) return '🥣';
    if (n.includes('kimchi') || n.includes('miso')) return '🏺';
    if (n.includes('bread') || n.includes('sourdough')) return '🍞';
    if (n.includes('edamame') || n.includes('peas')) return '🫛';
    if (n.includes('avocado')) return '🥑';
    if (n.includes('butter')) return '🧈';
    if (category === 'Produce') return '🥦';
    if (category === 'Meat & Seafood') return '🥩';
    if (category === 'Dairy & Eggs') return '🧀';
    return '🥫';
  };

  const topShelfItems = ingredients.filter((i) => getLocationForItem(i) === 'Top Shelf');
  const middleShelfItems = ingredients.filter((i) => getLocationForItem(i) === 'Middle Shelf');
  const crisperItems = ingredients.filter((i) => getLocationForItem(i) === 'Crisper Drawer');
  const doorItems = ingredients.filter((i) => getLocationForItem(i) === 'Door Rack');
  const freezerItems = ingredients.filter((i) => getLocationForItem(i) === 'Deep Freeze');

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Ambient Cool Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Refrigerator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white">Fridge Digital Twin</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                LIVE SHELF TOPOLOGY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive 2.5D visual representation of your refrigerator shelves, microclimates & freshness zones.
            </p>
          </div>
        </div>

        {/* Telemetry Status Indicators */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5 text-cyan-400">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Fridge: 37.2°F</span>
          </div>
          <div className="px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5 text-blue-400">
            <Snowflake className="w-3.5 h-3.5" />
            <span>Freezer: -0.4°F</span>
          </div>
        </div>
      </div>

      {/* Main Digital Refrigerator Chassis */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* The Visual Refrigerator Cabinet */}
        <div className="lg:col-span-3 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-2xl relative space-y-4">
          {/* Refrigerator Ceiling LED Bar */}
          <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 rounded-full shadow-lg shadow-cyan-400/50 mb-3" />

          {/* ZONE 1: TOP SHELF */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 relative group">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 border-b border-slate-800/60 pb-1">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <span>🥛 TOP SHELF</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400">38°F / Dairy & Eggs</span>
              </span>
              <span>{topShelfItems.length} items</span>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[46px] items-center">
              {topShelfItems.length === 0 ? (
                <span className="text-xs text-slate-600 italic">Shelf is empty</span>
              ) : (
                topShelfItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedItem(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      selectedItem?.id === item.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30'
                        : item.freshness === 'Use Soon'
                        ? 'bg-rose-950/60 text-rose-200 border-rose-500/50 hover:bg-rose-900/60'
                        : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    <span>{getItemEmoji(item.name, item.category)}</span>
                    <span>{item.name}</span>
                    {item.quantity && <span className="text-[10px] opacity-70 font-mono">({item.quantity})</span>}
                  </motion.button>
                ))
              )}
            </div>
            {/* Shelf Glass Divider Line */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent rounded-full mt-3 opacity-60" />
          </div>

          {/* ZONE 2: MIDDLE SHELF */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 relative group">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 border-b border-slate-800/60 pb-1">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <span>🍗 MIDDLE SHELF</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400">36°F / Proteins & Prepared</span>
              </span>
              <span>{middleShelfItems.length} items</span>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[46px] items-center">
              {middleShelfItems.length === 0 ? (
                <span className="text-xs text-slate-600 italic">Shelf is empty</span>
              ) : (
                middleShelfItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedItem(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      selectedItem?.id === item.id
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30'
                        : item.freshness === 'Use Soon'
                        ? 'bg-rose-950/60 text-rose-200 border-rose-500/50 hover:bg-rose-900/60'
                        : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <span>{getItemEmoji(item.name, item.category)}</span>
                    <span>{item.name}</span>
                    {item.quantity && <span className="text-[10px] opacity-70 font-mono">({item.quantity})</span>}
                  </motion.button>
                ))
              )}
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent rounded-full mt-3 opacity-60" />
          </div>

          {/* ZONE 3: CRISPER DRAWER */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-3 relative group">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 border-b border-emerald-900/50 pb-1">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span>🥬 HUMIDITY CRISPER DRAWER</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">85% Humidity / Fresh Greens</span>
              </span>
              <span>{crisperItems.length} items</span>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[46px] items-center">
              {crisperItems.length === 0 ? (
                <span className="text-xs text-slate-600 italic">Crisper is empty</span>
              ) : (
                crisperItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedItem(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      selectedItem?.id === item.id
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md shadow-emerald-400/30'
                        : item.freshness === 'Use Soon'
                        ? 'bg-rose-950/60 text-rose-200 border-rose-500/50 hover:bg-rose-900/60'
                        : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    <span>{getItemEmoji(item.name, item.category)}</span>
                    <span>{item.name}</span>
                    {item.quantity && <span className="text-[10px] opacity-70 font-mono">({item.quantity})</span>}
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* ZONE 4: DEEP FREEZE (-18°C) */}
          <div className="bg-blue-950/30 border border-blue-500/40 rounded-2xl p-3 relative group">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 border-b border-blue-900/50 pb-1">
              <span className="font-bold text-blue-300 flex items-center gap-1.5">
                <span>❄️ DEEP FREEZER</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">-18°C / 0°F / Sub-Zero Preservation</span>
              </span>
              <span>{freezerItems.length} items</span>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[46px] items-center">
              {freezerItems.length === 0 ? (
                <span className="text-xs text-slate-600 italic">Freezer is empty</span>
              ) : (
                freezerItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedItem(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      selectedItem?.id === item.id
                        ? 'bg-blue-400 text-slate-950 border-blue-300 shadow-md shadow-blue-400/30'
                        : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <span>❄️ {getItemEmoji(item.name, item.category)}</span>
                    <span>{item.name}</span>
                    {item.quantity && <span className="text-[10px] opacity-70 font-mono">({item.quantity})</span>}
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Inspection Sidebar: Click an item to view full telemetry */}
        <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          {selectedItem ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{getItemEmoji(selectedItem.name, selectedItem.category)}</span>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{selectedItem.name}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{selectedItem.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Data Properties */}
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Current Location</span>
                  <strong className="text-cyan-300 font-mono">{getLocationForItem(selectedItem)}</strong>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Quantity</span>
                  <strong className="text-white font-mono">{selectedItem.quantity || '1 portion'}</strong>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Freshness Status</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    selectedItem.freshness === 'Use Soon'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {selectedItem.freshness || 'Fresh'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Estimated Expiry</span>
                  <strong className="text-amber-300 font-mono">
                    {selectedItem.freshness === 'Use Soon' ? '2-3 Days Remaining' : '6-8 Days Remaining'}
                  </strong>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] mb-1">Microclimate Advice</span>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Stored in {getLocationForItem(selectedItem)}. Keep sealed to maintain optimal humidity levels.
                  </p>
                </div>
              </div>

              {onSelectIngredientToCook && (
                <button
                  onClick={() => onSelectIngredientToCook(selectedItem.name)}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Find Recipes with {selectedItem.name}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-2">
              <Info className="w-8 h-8 text-slate-600 animate-pulse" />
              <strong className="text-xs text-slate-300 font-bold">Select any item on a shelf</strong>
              <p className="text-[11px] text-slate-500">
                Click on any dairy, produce, or protein to inspect real-time freshness, storage temperature & recipe matches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
