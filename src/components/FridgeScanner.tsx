import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Upload, Plus, Trash2, RefreshCw, Sparkles, Images, X } from 'lucide-react';
import { KitchenBasicsCard } from './KitchenBasicsCard';
import { Ingredient, PresetFridge } from '../types';
import { compressImageFile, drawToJpeg } from '../utils/imageUtils';
import { showToast } from '../utils/toast';

// recharts is heavy; keep it out of the initial bundle


interface FridgeScannerProps {
  presetFridges: PresetFridge[];
  currentIngredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
  onAnalyzeImage: (imageBase64: string, extraNote?: string) => Promise<void>;
  onSelectPreset: (preset: PresetFridge) => void;
  onGenerateRecipes: () => void;
  isAnalyzing: boolean;
  // The person's fridge photo; kept until they upload or take a new one
  photo: string | null;
  onPhotoChange: (photo: string) => void;
}

export const FridgeScanner: React.FC<FridgeScannerProps> = ({
  presetFridges,
  currentIngredients,
  onIngredientsChange,
  onAnalyzeImage,
  onSelectPreset,
  onGenerateRecipes,
  isAnalyzing,
  photo: selectedImage,
  onPhotoChange: setSelectedImage,
}) => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const newIngredientCategory: Ingredient['category'] = 'Produce';
  const [extraNote, setExtraNote] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  // "Snap fridge" first asks where the photo comes from: camera or gallery
  const [sourcePickerOpen, setSourcePickerOpen] = useState(false);
  const openSourcePicker = () => setSourcePickerOpen(true);
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

  // The app-wide "Snap" FAB opens the photo picker (camera or gallery on Android)
  useEffect(() => {
    const open = () => setSourcePickerOpen(true);
    window.addEventListener('fridgechef:snap', open);
    return () => window.removeEventListener('fridgechef:snap', open);
  }, []);

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
    <div className="space-y-6">
      {/* Hero: the two main actions */}
      <section className="relative overflow-hidden rounded-[2rem] bg-primary-container text-on-primary-container p-6 sm:p-8">
        <div aria-hidden="true" className="absolute -right-16 -top-20 w-72 h-72 bg-emerald-400/20 animate-morph" />
        <div aria-hidden="true" className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 text-[5rem] sm:text-[7rem] leading-none select-none hidden min-[480px]:block rotate-[-8deg]">
          🥗
        </div>
        <div className="relative z-10 max-w-xl space-y-3">
          <h1 className="text-[2rem] leading-[1.1] sm:text-5xl font-semibold tracking-tight text-emerald-50 min-[480px]:max-w-[70%] sm:max-w-none">What's in your fridge?</h1>
          <p className="text-emerald-100/85 text-sm sm:text-base leading-relaxed">Snap a photo or add items. We'll suggest what to cook, using your kitchen basics too.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={openSourcePicker}
              disabled={isAnalyzing}
              className="h-12 px-6 rounded-full bg-emerald-200 text-emerald-950 font-semibold text-sm flex items-center gap-2 disabled:opacity-60"
            >
              <Camera className="w-5 h-5" />
              {selectedImage ? 'New photo' : 'Snap fridge'}
            </button>
            {currentIngredients.length > 0 && (
              <button
                onClick={onGenerateRecipes}
                disabled={isAnalyzing}
                className="h-12 px-6 rounded-full border border-emerald-200/40 text-emerald-50 font-semibold text-sm flex items-center gap-2 state-layer disabled:opacity-60"
              >
                <Sparkles className="w-5 h-5" />
                Cook with {currentIngredients.length} items
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: photo and sample fridges */}
        <div className="space-y-6 min-w-0">
          {isWebcamActive ? (
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-video">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                <button onClick={capturePhoto} className="h-12 px-6 bg-emerald-300 text-emerald-950 font-semibold text-sm rounded-full flex items-center gap-2">
                  <Camera className="w-5 h-5" /> Take photo
                </button>
                <button onClick={stopCamera} className="h-12 px-5 bg-slate-900/80 text-slate-200 font-semibold text-sm rounded-full">
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedImage ? (
            <section className="rounded-3xl overflow-hidden bg-slate-900">
              <div className="relative aspect-video">
                <img src={selectedImage} alt="Your fridge" className="w-full h-full object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute animate-scanline" />
                    <span className="px-4 py-2 rounded-full bg-slate-900/90 text-emerald-300 text-sm font-semibold flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Reading your fridge…
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Note for the AI (optional)"
                  value={extraNote}
                  onChange={(e) => setExtraNote(e.target.value)}
                  className="flex-1 min-w-0 h-11 bg-slate-950 rounded-full px-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:ring-2 ring-emerald-500/60"
                />
                <button
                  onClick={() => onAnalyzeImage(selectedImage, extraNote)}
                  disabled={isAnalyzing}
                  className="h-11 px-4 shrink-0 rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} /> Re-scan
                </button>
              </div>
            </section>
          ) : (
            /* Drag-and-drop only makes sense with a mouse; phones use the hero button */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="hidden md:flex rounded-3xl border-2 border-dashed border-slate-800 hover:border-emerald-500/50 p-8 flex-col items-center justify-center gap-3 text-center"
            >
              <Camera className="w-8 h-8 text-emerald-400" />
              <p className="text-sm font-semibold text-white">Drop a fridge photo here</p>
              <div className="flex gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="h-10 px-4 rounded-full border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 state-layer">
                  <Upload className="w-4 h-4" /> Upload
                </button>
                <button onClick={startCamera} className="h-10 px-4 rounded-full bg-emerald-300 text-emerald-950 text-sm font-semibold flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Camera
                </button>
              </div>
            </div>
          )}

          {/* Sample fridges: one swipeable row */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-300">Try a sample fridge</h2>
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 overflow-x-auto no-scrollbar snap-x">
              {presetFridges.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className="snap-start shrink-0 w-56 p-3 rounded-2xl bg-slate-900 text-left flex items-center gap-3 state-layer"
                >
                  <img src={preset.imageUrl} alt="" loading="lazy" decoding="async" className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-800" />
                  <span className="text-sm font-semibold text-white line-clamp-2 leading-snug">{preset.title}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right: ingredients and basics */}
        <div className="space-y-4 min-w-0">
          <section className="rounded-3xl bg-slate-900 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Your ingredients</h2>
              <span className="text-sm text-slate-400">{currentIngredients.length}</span>
            </div>

            {currentIngredients.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Nothing here yet. Snap your fridge, pick a sample, or add items below.</p>
            ) : (
              <ul className="max-h-80 overflow-y-auto -mx-1 px-1 divide-y divide-slate-800/70">
                {currentIngredients.map((item) => {
                  const fresh =
                    item.freshness === 'Use Soon'
                      ? { dot: 'bg-rose-400', text: 'Use soon' }
                      : item.freshness === 'Moderate'
                      ? { dot: 'bg-amber-400', text: '2–3 days' }
                      : { dot: 'bg-emerald-400', text: 'Fresh' };
                  return (
                    <li key={item.id} className="flex items-center gap-3 py-2.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${fresh.dot}`} aria-hidden />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{item.name}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {fresh.text}
                          {item.quantity ? ` · ${item.quantity}` : ''}
                        </p>
                      </div>
                      <button onClick={() => handleRemoveIngredient(item.id)} className="w-10 h-10 grid place-items-center rounded-full text-slate-500 state-layer" aria-label={`Remove ${item.name}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <form onSubmit={handleAddManualIngredient} noValidate onInput={() => setFormError(null)} className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add an ingredient"
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  className="flex-1 min-w-0 h-12 bg-slate-950 rounded-full px-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:ring-2 ring-emerald-500/60"
                  aria-label="Ingredient name"
                />
                <button type="submit" className="w-12 h-12 shrink-0 rounded-full bg-emerald-300 text-emerald-950 grid place-items-center" aria-label="Add ingredient">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formError && (
                <p role="alert" className="text-xs text-rose-300 px-4">
                  {formError}
                </p>
              )}
            </form>

            <button
              onClick={onGenerateRecipes}
              disabled={currentIngredients.length === 0 || isAnalyzing}
              className="w-full h-12 rounded-full bg-emerald-300 text-emerald-950 font-semibold text-sm disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" /> Suggest recipes
            </button>
          </section>

          <KitchenBasicsCard />
        </div>
      </div>

      {/* Photo inputs: gallery picker, and camera capture (opens the camera directly on phones) */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />

      {/* Source picker: camera or gallery. Portalled to <body> because the tab's animated
          (transformed) wrapper would otherwise trap position: fixed. */}
      {createPortal(
      <AnimatePresence>
        {sourcePickerOpen && (
          <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-label="Add a fridge photo">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/55" onClick={() => setSourcePickerOpen(false)} />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              className="relative w-full md:max-w-sm rounded-t-[1.75rem] md:rounded-[1.75rem] bg-surface-low p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-on-surface">Add a fridge photo</h2>
                <button onClick={() => setSourcePickerOpen(false)} className="w-10 h-10 grid place-items-center rounded-full state-layer text-on-surface-variant" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {[
                {
                  label: 'Take photo',
                  hint: 'Open the camera',
                  icon: Camera,
                  run: () => {
                    // Phones honour capture="environment"; desktops ignore it, so use the webcam there
                    const native = !!(window as any).Capacitor?.isNativePlatform?.();
                    if (native || window.matchMedia('(pointer: coarse)').matches) cameraInputRef.current?.click();
                    else startCamera();
                  },
                },
                { label: 'Choose from gallery', hint: 'Pick an existing photo', icon: Images, run: () => fileInputRef.current?.click() },
              ].map(({ label, hint, icon: Icon, run }) => (
                <button
                  key={label}
                  onClick={() => {
                    setSourcePickerOpen(false);
                    run();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface-container state-layer text-left"
                >
                  <span className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container grid place-items-center">
                    <Icon className="w-6 h-6" />
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-on-surface">{label}</span>
                    <span className="block text-sm text-on-surface-variant">{hint}</span>
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </div>
  );
};
