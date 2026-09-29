import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Camera,
  Upload,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Plus,
  Scale,
  DollarSign,
  TrendingUp,
  ChefHat
} from 'lucide-react';
import { ReceiptAnalysisResult, Ingredient } from '../types';
import { compressImageFile, getDataUrlMimeType } from '../utils/imageUtils';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportToFridge: (newIngredients: Ingredient[], suggestedMeals?: string[]) => void;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  onClose,
  onImportToFridge,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ReceiptAnalysisResult | null>({
    storeName: 'DMart Supercenter',
    totalCost: '₹1,842',
    totalWeightKg: 6.2,
    estimatedPantryUtilizationPercent: 91,
    items: [
      { name: 'Chicken Breast', category: 'Meat & Seafood', quantity: '500 g', estimatedWeightGrams: 500, price: '₹220', estimatedShelfLifeDays: 3, storageLocation: 'Middle Shelf' },
      { name: 'Whole Milk', category: 'Dairy & Eggs', quantity: '1 L', estimatedWeightGrams: 1000, price: '₹66', estimatedShelfLifeDays: 6, storageLocation: 'Top Shelf' },
      { name: 'Cherry Tomatoes', category: 'Produce', quantity: '6 pcs (250g)', estimatedWeightGrams: 250, price: '₹40', estimatedShelfLifeDays: 5, storageLocation: 'Crisper Drawer' },
      { name: 'Farm Fresh Eggs', category: 'Dairy & Eggs', quantity: '12 pcs', estimatedWeightGrams: 600, price: '₹84', estimatedShelfLifeDays: 21, storageLocation: 'Top Shelf' },
      { name: 'Tender Baby Spinach', category: 'Produce', quantity: '250 g', estimatedWeightGrams: 250, price: '₹35', estimatedShelfLifeDays: 4, storageLocation: 'Crisper Drawer' },
      { name: 'Basmati Rice', category: 'Grains & Pulses', quantity: '5 kg', estimatedWeightGrams: 5000, price: '₹550', estimatedShelfLifeDays: 365, storageLocation: 'Pantry Cupboard' }
    ],
    immediateUseItems: ['Chicken Breast', 'Tender Baby Spinach', 'Cherry Tomatoes'],
    mealSuggestions: [
      'Garlic Chicken & Wilted Spinach Rice Bowl',
      'Creamy Spinach & Tomato Scrambled Eggs',
      'Herbed Pan-Seared Chicken with Sautéed Greens'
    ]
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const base64 = await compressImageFile(file);
      const res = await fetch('/api/analyze-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: getDataUrlMimeType(base64) }),
      });
      if (!res.ok) throw new Error(`Receipt analysis failed (${res.status})`);
      const data = await res.json();
      if (Array.isArray(data?.items)) setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImport = () => {
    if (!analysisResult) return;
    const newIngredients: Ingredient[] = analysisResult.items.map((item, idx) => ({
      id: `rcpt-${Date.now()}-${idx}`,
      name: item.name,
      category: item.category,
      freshness: item.estimatedShelfLifeDays <= 4 ? 'Use Soon' : 'Fresh',
      quantity: item.quantity,
      confidence: 0.96,
    }));

    onImportToFridge(newIngredients, analysisResult.mealSuggestions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Receipt → Pantry AI</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  SMART GROCERY OCR
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Snap or upload any supermarket bill to auto-populate fridge inventory and shelf-life estimates.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Upload / Preset Trigger */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="border-2 border-dashed border-slate-700 hover:border-emerald-400 bg-slate-950/50 hover:bg-slate-950 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2">
              <Upload className="w-6 h-6 text-emerald-400" />
              <strong className="text-xs text-white">Upload Supermarket Receipt</strong>
              <span className="text-[10px] text-slate-400">PNG, JPG, or PDF Receipt</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-1">Simulated Receipt Example</span>
                <p className="text-[11px] text-slate-400">
                  Demonstrates parsing a supermarket grocery purchase with weight, cost, and shelf-life prediction.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">DMart Supercenter</span>
                <span className="text-white font-bold">₹1,842.00</span>
              </div>
            </div>
          </div>

          {isAnalyzing && (
            <div className="p-8 text-center space-y-3 bg-slate-950/80 rounded-2xl border border-emerald-500/30">
              <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-sm font-bold text-white">AI Vision Scanning Receipt...</h4>
              <p className="text-xs text-slate-400">Extracting ingredient quantities, weights, shelf-life & pricing.</p>
            </div>
          )}

          {/* Analysis Results Display */}
          {analysisResult && !isAnalyzing && (
            <div className="space-y-4">
              {/* Macro Summary Strip: ₹1,842 grocery purchase | Estimated 6.2 kg food | 91% pantry utilization */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Grocery Spend</span>
                  <strong className="text-base font-extrabold text-emerald-400 font-mono">
                    {analysisResult.totalCost}
                  </strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Food Mass</span>
                  <strong className="text-base font-extrabold text-teal-400 font-mono">
                    {analysisResult.totalWeightKg} kg
                  </strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Pantry Utilization</span>
                  <strong className="text-base font-extrabold text-purple-400 font-mono">
                    {analysisResult.estimatedPantryUtilizationPercent}%
                  </strong>
                </div>
              </div>

              {/* Extracted Item List */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Extracted Groceries ({analysisResult.items.length})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">LOCATION & EXPIRY PREDICTED</span>
                </div>

                <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto">
                  {analysisResult.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white font-semibold">{item.name}</strong>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{item.quantity}</span>
                          <span>•</span>
                          <span className="text-teal-400">{item.storageLocation}</span>
                          <span>•</span>
                          <span className={item.estimatedShelfLifeDays <= 4 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            Expires in ~{item.estimatedShelfLifeDays} days
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-300">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Meal Suggestions from Receipt */}
              <div className="bg-purple-950/30 p-4 rounded-2xl border border-purple-500/30 space-y-2">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Immediate Meal Ideas from this Receipt</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {analysisResult.mealSuggestions.map((meal, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-white font-medium flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="line-clamp-2">{meal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Auto-assigns shelf micro-climates & expiry triggers.</span>
          <button
            onClick={handleImport}
            disabled={!analysisResult || isAnalyzing}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center gap-2"
          >
            <span>Receipt → Pantry → Cook</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
