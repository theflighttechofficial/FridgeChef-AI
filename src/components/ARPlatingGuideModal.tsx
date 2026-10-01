import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Layers, Award, CheckCircle2, RotateCcw, Zap } from 'lucide-react';
import { showToast } from '../utils/toast';

interface ARPlatingGuideModalProps {
  recipeTitle: string;
  onClose: () => void;
}

const PLATING_STYLES = [
  {
    id: 'ring-concentric',
    name: '3-Star Concentric Ring',
    description: 'Central protein focal point, ringed with vibrant sauce dots and micro-herbs.',
    saucePattern: 'Concentric Micro-Dots',
    garnish: 'Edible Flowers & Dill Microgreens',
  },
  {
    id: 'deconstructed-brushstroke',
    name: 'Deconstructed Brushstroke',
    description: 'Sleek diagonal sauce sweep with staggered protein layering and textured crunch.',
    saucePattern: 'Spoon Arc Sweep',
    garnish: 'Toasted Sesame & Sea Salt Flakes',
  },
  {
    id: 'geometric-tower',
    name: 'Architectural Layered Tower',
    description: 'Vertical stack anchored by warm grains, crowned with protein and foam drizzle.',
    saucePattern: 'Emulsified Foam Drizzle',
    garnish: 'Crispy Leek Nest',
  },
];

export const ARPlatingGuideModal: React.FC<ARPlatingGuideModalProps> = ({
  recipeTitle,
  onClose,
}) => {
  const [selectedStyle, setSelectedStyle] = useState(PLATING_STYLES[0]);
  const [activeStep, setActiveStep] = useState(1);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast('Camera is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (e) {
      console.warn('Camera access error:', e);
      showToast('Camera permissions required for live AR projection overlay.');
      setIsCameraActive(false);
    }
  };

  // Attach stream once the <video> element is mounted
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  // Release camera when the modal closes
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-slate-100">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              3-Michelin-Star Plating Assistant
            </span>
            <h2 className="text-base font-extrabold text-white line-clamp-1">
              AR Holographic Plating: {recipeTitle}
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 bg-slate-800 text-slate-300 hover:bg-rose-500 hover:text-white rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main AR Display & Template Controls */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: AR Holographic Camera Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 relative flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-slate-800">
          {isCameraActive ? (
            <div className="relative w-full h-full max-h-[520px] rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-2xl bg-black">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

              {/* Holographic AR Plate Ring Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full border-2 border-dashed border-emerald-400/80 animate-spin-slow flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <div className="w-52 h-52 rounded-full border border-teal-400/60 flex items-center justify-center">
                    <span className="text-[11px] font-extrabold font-mono text-emerald-400 bg-slate-950/80 px-2 py-1 rounded-md border border-emerald-500/40">
                      Center Protein Target
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Marker Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-emerald-500/40 text-xs flex items-center justify-between">
                <span className="text-slate-300 font-semibold">
                  Step {activeStep}: {activeStep === 1 ? 'Spoon base sauce arc' : activeStep === 2 ? 'Position protein in core circle' : 'Garnish micro-greens'}
                </span>
                <span className="text-emerald-400 font-bold font-mono">AR ALIGNED</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 max-w-md p-8 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/40">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Project Holographic Plating Guide</h3>
                <p className="text-xs text-slate-400">
                  Point your camera down at your dinner plate to view 3-Michelin-star alignment grids, sauce arcs, and garnish dots directly on your plate.
                </p>
              </div>
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:from-amber-400 hover:to-emerald-400 transition-all shadow-xl shadow-amber-500/20"
              >
                Launch AR Camera Guide
              </button>
            </div>
          )}
        </div>

        {/* Right: Plating Style Selector & Step Guide (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 p-6 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Select Plating Template</span>
            </h3>

            <div className="space-y-2">
              {PLATING_STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setSelectedStyle(st);
                    setActiveStep(1);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all space-y-1 ${
                    selectedStyle.id === st.id
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-extrabold text-white flex items-center justify-between">
                    <span>{st.name}</span>
                    {selectedStyle.id === st.id && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug">{st.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Plating Execution Steps */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white uppercase text-[10px]">Plating Technique</span>
              <span className="text-amber-400 font-mono font-bold">Step {activeStep} / 3</span>
            </div>

            {activeStep === 1 && (
              <div className="space-y-1">
                <p className="font-bold text-slate-200">1. Base Sauce Technique:</p>
                <p className="text-slate-400">{selectedStyle.saucePattern}. Pour sauce in center and drag with back of warm spoon.</p>
              </div>
            )}
            {activeStep === 2 && (
              <div className="space-y-1">
                <p className="font-bold text-slate-200">2. Protein Placement:</p>
                <p className="text-slate-400">Position main protein slightly off-center along the sauce line at a 45° angle.</p>
              </div>
            )}
            {activeStep === 3 && (
              <div className="space-y-1">
                <p className="font-bold text-slate-200">3. Final Garnish Crown:</p>
                <p className="text-slate-400">{selectedStyle.garnish}. Place with culinary tweezers for maximum visual height.</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                disabled={activeStep === 1}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 disabled:opacity-40 font-bold"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveStep((prev) => Math.min(3, prev + 1))}
                disabled={activeStep === 3}
                className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-lg font-bold disabled:opacity-40"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
