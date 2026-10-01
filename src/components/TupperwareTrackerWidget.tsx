import React, { useState } from 'react';
import { QrCode, Plus, Trash2, Clock, Snowflake, CheckCircle2 } from 'lucide-react';

interface LeftoverContainer {
  id: string;
  qrTagId: string;
  dishName: string;
  cookedDate: string;
  daysLeft: number;
  fridgeShelf: string;
}

export const TupperwareTrackerWidget: React.FC = () => {
  const [containers, setContainers] = useState<LeftoverContainer[]>([
    { id: 'c1', qrTagId: 'QR-TUPPER-01', dishName: 'Creamy Garlic Pasta', cookedDate: '2026-09-25', daysLeft: 2, fridgeShelf: 'Top Shelf Left' },
    { id: 'c2', qrTagId: 'QR-TUPPER-02', dishName: 'Grilled Chicken Breasts', cookedDate: '2026-09-26', daysLeft: 3, fridgeShelf: 'Crisper Drawer' },
  ]);

  const [newDish, setNewDish] = useState('');
  const [newShelf, setNewShelf] = useState('Middle Shelf');

  const [formError, setFormError] = useState<string | null>(null);
  const handleAddContainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.trim()) {
      setFormError('Enter what is in the container.');
      return;
    }
    setFormError(null);
    const newC: LeftoverContainer = {
      id: `c-${Date.now()}`,
      qrTagId: `QR-TUPPER-${Math.floor(10 + Math.random() * 90)}`,
      dishName: newDish.trim(),
      cookedDate: new Date().toISOString().split('T')[0],
      daysLeft: 4,
      fridgeShelf: newShelf,
    };
    setContainers([...containers, newC]);
    setNewDish('');
  };

  const removeContainer = (id: string) => {
    setContainers(containers.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">"Scan to Log" Tupperware QR/NFC Tracker</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                SMART CONTAINER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Attach reusable QR/NFC smart tags to your tupperware containers to track cooked date, shelf location, & expiration warnings.
            </p>
          </div>
        </div>
      </div>

      {/* Log Form */}
      <form onSubmit={handleAddContainer} noValidate onInput={() => setFormError(null)} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Dish name in container (e.g., Vegetable Curry)..."
          value={newDish}
          onChange={(e) => setNewDish(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
        />
        <select
          value={newShelf}
          onChange={(e) => setNewShelf(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
        >
          <option value="Top Shelf">Top Shelf</option>
          <option value="Middle Shelf">Middle Shelf</option>
          <option value="Bottom Shelf">Bottom Shelf</option>
          <option value="Crisper Drawer">Crisper Drawer</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Tupperware Tag</span>
        </button>
        {formError && (
          <p role="alert" className="text-xs text-rose-300 basis-full w-full">
            {formError}
          </p>
        )}
      </form>

      {/* Containers List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {containers.map((c) => (
          <div key={c.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2 relative group">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-cyan-400 font-mono flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" /> {c.qrTagId}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${c.daysLeft <= 2 ? 'bg-rose-500/20 text-rose-300 animate-pulse font-bold' : 'bg-slate-800 text-slate-300'}`}>
                {c.daysLeft} Days Left
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-white">{c.dishName}</h4>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <span>{c.fridgeShelf}</span>
              <button
                onClick={() => removeContainer(c.id)}
                className="text-slate-500 hover:text-rose-400"
                title="Remove container"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
