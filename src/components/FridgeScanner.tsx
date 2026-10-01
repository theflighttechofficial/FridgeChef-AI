import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Camera, Upload, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, Layers, Zap } from 'lucide-react';
import { Ingredient, PresetFridge } from '../types';
import { compressImageFile, drawToJpeg } from '../utils/imageUtils';
import { showToast } from '../utils/toast';

// recharts is heavy; keep it out of the initial bundle
const ConsumptionWasteTrendChart = lazy(() =>
  import('./ConsumptionWasteTrendChart').then((m) => ({ default: m.ConsumptionWasteTrendChart }))
);

interface FridgeScannerProps {
  presetFridges: PresetFridge[];
  currentIngredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
  onAnalyzeImage: (imageBase64: string, extraNote?: string) => Promise<void>;
  onSelectPreset: (preset: PresetFridge) => void;
  onGenerateRecipes: () => void;
  isAnalyzing: boolean;
}

export const FridgeScanner: React.FC<FridgeScannerProps> = ({
  presetFridges,
  currentIngredients,
  onIngredientsChange,
  onAnalyzeImage,
  onSelectPreset,
  onGenerateRecipes,
  isAnalyzing,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(presetFridges[0]?.imageUrl || null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientCategory, setNewIngredientCategory] = useState<Ingredient['category']>('Produce');
  const [extraNote, setExtraNote] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const analyzeFile = async (file: File) => {
    try {
      const base64 = await compressImageFile(file);
      setSelectedImage(base64);
      await onAnalyzeImage(base64, extraNote);
    } catch (err) {
      console.error('Image read error:', err);
      showToast('Could not read that image. Please try another file.');
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so selecting the same file again still fires onChange
    e.target.value = '';
    if (file) analyzeFile(file);
  };

  // Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) analyzeFile(file);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  // Live Camera Trigger
  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast('Camera is not supported in this browser. Please upload an image instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setIsWebcamActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      showToast('Could not access device camera. Please check camera permissions or upload an image.');
      setIsWebcamActive(false);
    }
  };

  // Attach stream once the <video> element is mounted
  useEffect(() => {
    if (isWebcamActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isWebcamActive]);

  // Release camera on unmount
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      const dataUrl = drawToJpeg(video, video.videoWidth || 1280, video.videoHeight || 720);
      setSelectedImage(dataUrl);
      stopCamera();
      onAnalyzeImage(dataUrl, extraNote);
    } catch (err) {
      console.error('Capture error:', err);
    }
  };

  // Add Manual Ingredient
  const [formError, setFormError] = useState<string | null>(null);
  const handleAddManualIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) {
      setFormError('Type an ingredient name first.');
      return;
    }
    if (currentIngredients.some((i) => i.name.trim().toLowerCase() === newIngredientName.trim().toLowerCase())) {
      setFormError(`${newIngredientName.trim()} is already in your fridge list.`);
      return;
    }
    setFormError(null);
    const newItem: Ingredient = {
      id: `manual-${Date.now()}`,
      name: newIngredientName.trim(),
      category: newIngredientCategory,
      freshness: 'Fresh',
      quantity: '1 item',
    };
    onIngredientsChange([...currentIngredients, newItem]);
    setNewIngredientName('');
  };

  // Remove Ingredient
  const handleRemoveIngredient = (id: string) => {
    onIngredientsChange(currentIngredients.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero Intro - Always at the top */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-12 -top-12 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Vision Powered Culinary Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Snap your open fridge. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Let AI cook the perfect meal.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Upload a picture of your refrigerator or choose a sample setup. Our AI instantly detects visible items, tracks freshness, and generates custom recipes matching your dietary lifestyle.
          </p>
        </div>
      </div>

      {/* Main Scanner Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Camera / Image Dropzone & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Fridge Photo Capture</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">JPG, PNG, WEBP</span>
            </div>

            {/* Webcam Stream View */}
            {isWebcamActive ? (
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video border-2 border-emerald-500 shadow-2xl flex flex-col items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                  <button
                    onClick={capturePhoto}
                    className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:bg-emerald-400 transition-all flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Snap</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 font-medium text-xs rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone / Preview Area */
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative rounded-xl overflow-hidden border-2 border-dashed transition-all aspect-video flex flex-col items-center justify-center ${
                  selectedImage
                    ? 'border-emerald-500/50 bg-slate-950'
                    : 'border-slate-800 hover:border-emerald-500/50 bg-slate-950/60'
                }`}
              >
                {selectedImage ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={selectedImage}
                      alt="Fridge interior"
                      className="w-full h-full object-cover"
                    />

                    {/* Laser Scanner Effect when analyzing */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute shadow-[0_0_15px_#10B981] animate-scanline" />
                        <div className="bg-slate-900/90 border border-emerald-500/50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold animate-pulse">
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Gemini AI is analyzing fridge contents...</span>
                        </div>
                      </div>
                    )}

                    {!isAnalyzing && (
                      <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-medium text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">
                        Drag and drop your fridge photo here
                      </p>
                      <p className="text-xs text-slate-500">
                        or click below to upload / take a live picture
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium text-xs rounded-xl transition-all flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Use Camera</span>
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            )}

            {/* Optional Note for AI */}
            <div className="pt-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                Special Dietary Note or Prompt for AI (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Focus on high protein recipes, ignore sauces, or I have extra garlic in pantry..."
                value={extraNote}
                onChange={(e) => setExtraNote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Sample Presets Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Or Try Sample Fridge Presets</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presetFridges.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedImage(preset.imageUrl);
                    onSelectPreset(preset);
                  }}
                  className="group flex items-start gap-3 p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-all hover:scale-[1.01]"
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.title}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-800 group-hover:border-emerald-500/50 transition-colors"
                  />
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {preset.title}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                      {preset.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Detected Ingredients List & Manual Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Detected Ingredients</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentIngredients.length} item{currentIngredients.length !== 1 ? 's' : ''} ready for recipe generation
                  </p>
                </div>
                {selectedImage && (
                  <button
                    onClick={() => onAnalyzeImage(selectedImage, extraNote)}
                    disabled={isAnalyzing}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>Re-Scan</span>
                  </button>
                )}
              </div>

              {/* Ingredients List */}
              {currentIngredients.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No ingredients detected yet. Snap a photo or add items manually below!
                  </p>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto pr-1 space-y-2">
                  {currentIngredients.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-white truncate">
                              {item.name}
                            </p>
                            {/* Color-Coded Freshness Forecast Badge */}
                            {item.freshness === 'Use Soon' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                <span>Expiring (1 Day)</span>
                              </span>
                            ) : item.freshness === 'Moderate' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <span>Use in 2-3 Days</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>Fresh (5-7 Days)</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span>{item.category}</span>
                            {item.quantity && (
                              <>
                                <span>•</span>
                                <span className="text-slate-400">{item.quantity}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveIngredient(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                        title="Remove ingredient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Ingredient Form */}
              <form onSubmit={handleAddManualIngredient} noValidate onInput={() => setFormError(null)} className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-semibold text-slate-400">
                  Add Missing or Extra Ingredient:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Olive Oil, Garlic, Salt..."
                    value={newIngredientName}
                    onChange={(e) => setNewIngredientName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors min-h-[44px]"
                  />
                  <select
                    value={newIngredientCategory}
                    onChange={(e) => setNewIngredientCategory(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 min-h-[44px]"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Dairy & Eggs">Dairy</option>
                    <option value="Meat & Seafood">Meat</option>
                    <option value="Pantry">Pantry</option>
                    <option value="Condiments">Condiment</option>
                    <option value="Spices">Spice</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition-colors shrink-0 flex items-center justify-center min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formError && (
                  <p role="alert" className="text-xs text-rose-300 basis-full w-full">
                    {formError}
                  </p>
                )}
              </form>
            </div>

            {/* Bottom Generate CTA Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={onGenerateRecipes}
                disabled={currentIngredients.length === 0 || isAnalyzing}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-slate-950 font-bold text-sm rounded-xl shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Suggest Recipes from {currentIngredients.length} Ingredients</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Recharts Consumption & Food Waste Hotspot Trend Chart */}
      <div className="pt-6 border-t border-slate-800/80">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-slate-900/60" />}>
          <ConsumptionWasteTrendChart />
        </Suspense>
      </div>
    </div>
  );
};
