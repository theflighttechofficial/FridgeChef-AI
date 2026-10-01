import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Award, Upload, CheckCircle2, X, Play, RotateCcw, Utensils, Maximize2, Zap } from 'lucide-react';
import { PlateAnalysisResult } from '../types';
import { compressImageFile, getDataUrlMimeType } from '../utils/imageUtils';
import { showToast, AI_OFFLINE_MESSAGE, noteIfFallback } from '../utils/toast';

interface PlatePhotoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_PLATE_PRESETS = [
  {
    name: 'Pan-Seared Skillet Bowl',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Gourmet Roasted Salmon & Greens',
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Aromatic Spiced Rice & Veggies',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  },
];

export const PlatePhotoAnalysisModal: React.FC<PlatePhotoAnalysisModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_PLATE_PRESETS[0].img);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PlateAnalysisResult | null>({
    dishName: 'Pan-Seared Golden Protein Bowl with Herb Wilted Greens',
    estimatedPortionSize: 'Single entree portion (~420g)',
    detectedIngredients: ['Seared Chicken', 'Sautéed Baby Spinach', 'Steamed Rice', 'Garlic Glaze', 'Toasted Sesame'],
    approximateMacros: { calories: 510, protein: '38g', carbs: '46g', fat: '13g' },
    plateScores: {
      presentation: 82,
      nutritionalBalance: 91,
      colorDiversity: 88,
      platingGeometry: 79,
      overallScore: 85,
    },
    chefCritique:
      'Beautiful Maillard crust on the protein and vibrant chlorophyll retention in the greens. The starch foundation anchors the dish cleanly.',
    elevationTip:
      'Add a small acidic garnish (pickled shallots or micro-cilantro) and move the protein slightly off-center using the rule-of-thirds.',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const base64 = await compressImageFile(file);
    setSelectedImage(base64);
    triggerPlateAnalysis(base64);
  };

  const triggerPlateAnalysis = async (imgUrl: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-plate-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imgUrl, mimeType: getDataUrlMimeType(imgUrl) }),
      });
      if (!res.ok) throw new Error(`Plate analysis failed (${res.status})`);
      noteIfFallback(res);
      const data = await res.json();
      setAnalysisResult(data);
    } catch (e) {
      showToast(AI_OFFLINE_MESSAGE);
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/70 via-slate-900 to-rose-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
              <Camera className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Plate Photo → Food & Plating Analysis</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  POST-COOKING VISION EVALUATION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Snap your finished plate. AI estimates portions, macronutrients, color diversity & professional plating score.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Sample Images Strip */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Try Sample Plates:</span>
            {SAMPLE_PLATE_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedImage(p.img);
                  triggerPlateAnalysis(p.img);
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 text-slate-300 text-[11px] font-bold transition-all"
              >
                {p.name}
              </button>
            ))}
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Plate Photo</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Image Display & Scored Badge */}
            <div className="space-y-3">
              <div className="relative aspect-video sm:aspect-square w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Plated dish"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                    <Camera className="w-10 h-10 mb-2 opacity-50" />
                    <span>No image selected</span>
                  </div>
                )}

                {/* Score Pill in Corner */}
                {analysisResult && (
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 font-mono font-bold text-xs shadow-xl flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>PLATE SCORE: {analysisResult.plateScores.overallScore}/100</span>
                  </div>
                )}
              </div>

              {analysisResult && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <strong className="text-white block font-bold">{analysisResult.dishName}</strong>
                  <span className="text-[11px] text-slate-400">{analysisResult.estimatedPortionSize}</span>
                </div>
              )}
            </div>

            {/* Right: Plate Scoring Bars & Chef Critique */}
            {isAnalyzing ? (
              <div className="p-12 text-center space-y-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-white">Analyzing Plate Composition...</h4>
                <p className="text-xs text-slate-400">Evaluating color contrasts, negative space & macronutrients.</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                {/* 4 Deep Scoring Dimensions */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Sensory & Plating Criteria
                  </span>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-bold">
                        <span className="text-slate-300">Presentation & Appetite Appeal</span>
                        <span className="font-mono text-amber-400">{analysisResult.plateScores.presentation}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${analysisResult.plateScores.presentation}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-bold">
                        <span className="text-slate-300">Nutritional Balance</span>
                        <span className="font-mono text-emerald-400">{analysisResult.plateScores.nutritionalBalance}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${analysisResult.plateScores.nutritionalBalance}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-bold">
                        <span className="text-slate-300">Color Diversity</span>
                        <span className="font-mono text-purple-400">{analysisResult.plateScores.colorDiversity}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-purple-400 h-full rounded-full" style={{ width: `${analysisResult.plateScores.colorDiversity}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-bold">
                        <span className="text-slate-300">Plating Geometry & Negative Space</span>
                        <span className="font-mono text-cyan-400">{analysisResult.plateScores.platingGeometry}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${analysisResult.plateScores.platingGeometry}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Master Chef Critique */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">MASTER CHEF CRITIQUE</span>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{analysisResult.chefCritique}"
                  </p>
                </div>

                {/* Actionable Elevation Tip */}
                <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>ACTIONABLE PLATING ELEVATION TIP</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {analysisResult.elevationTip}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
