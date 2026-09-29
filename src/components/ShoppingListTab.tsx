import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, CheckCircle2, Copy, Check, Printer, Sparkles, Filter } from 'lucide-react';
import { ShoppingItem } from '../types';

interface ShoppingListTabProps {
  items: ShoppingItem[];
  onToggleCheck: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (name: string, category: string, quantity: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
}

const CATEGORIES = [
  'Produce',
  'Dairy & Eggs',
  'Meat & Seafood',
  'Pantry',
  'Spices & Condiments',
  'Other',
];

export const ShoppingListTab: React.FC<ShoppingListTabProps> = ({
  items,
  onToggleCheck,
  onRemoveItem,
  onAddItem,
  onClearChecked,
  onClearAll,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Produce');
  const [newItemQuantity, setNewItemQuantity] = useState('1 item');
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemCategory, newItemQuantity.trim() || '1 item');
    setNewItemName('');
    setNewItemQuantity('1 item');
  };

  const handleCopyClipboard = () => {
    const textList = items
      .map((item) => `[${item.checked ? 'X' : ' '}] ${item.name} (${item.quantity}) - ${item.category}`)
      .join('\n');
    navigator.clipboard.writeText(textList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const checkedCount = items.filter((i) => i.checked).length;

  // Group items by category
  const filteredItems = items.filter(
    (item) => filterCategory === 'All' || item.category === filterCategory
  );

  const grouped: { [key: string]: ShoppingItem[] } = {};
  filteredItems.forEach((item) => {
    const cat = item.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  return (
    <div className="space-y-8 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Smart Grocery Planning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Shopping List
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {items.length} total items ({checkedCount} purchased). Missing recipe ingredients are automatically added here.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyClipboard}
            disabled={items.length === 0}
            className="px-3.5 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs rounded-xl transition-all disabled:opacity-40 flex items-center gap-2"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={items.length === 0}
            className="px-3.5 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs rounded-xl transition-all disabled:opacity-40 flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {checkedCount > 0 && (
            <button
              onClick={onClearChecked}
              className="px-3.5 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Checked ({checkedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Custom Item Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Custom Item to Shopping List</span>
        </h3>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            placeholder="Item name (e.g., Almond Milk, Rosemary...)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="sm:col-span-5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            placeholder="Quantity (e.g. 1 carton, 200g)"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
            className="sm:col-span-3 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="sm:col-span-2 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </form>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter Aisle:
        </span>
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Shopping List Grouped View */}
      {items.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-white">Your Shopping List is empty!</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you select recipe options with missing ingredients, click "Add to Shopping List" to automatically collect them here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(grouped).map((catKey) => {
            const catItems = grouped[catKey];
            return (
              <div
                key={catKey}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{catKey}</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {catItems.filter((i) => i.checked).length} / {catItems.length} bought
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() => onToggleCheck(item.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                            item.checked
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-950 border-slate-700 hover:border-emerald-500 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-0.5 min-w-0">
                          <p
                            className={`text-xs sm:text-sm font-semibold transition-all ${
                              item.checked
                                ? 'text-slate-500 line-through'
                                : 'text-slate-100'
                            }`}
                          >
                            {item.name}
                            <span className="ml-2 text-xs font-normal text-emerald-400/90">
                              ({item.quantity})
                            </span>
                          </p>
                          {item.addedFromRecipe && (
                            <p className="text-[10px] text-slate-500 italic truncate">
                              Needed for: {item.addedFromRecipe}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors opacity-80 group-hover:opacity-100"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
