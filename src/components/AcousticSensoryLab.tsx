import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, Clock, AlertTriangle, Activity, CheckCircle2, Flame, ShieldAlert, Zap } from 'lucide-react';

export const AcousticSensoryLab: React.FC = () => {
  const [isListeningSonic, setIsListeningSonic] = useState(false);
  const [sizzleFreq, setSizzleFreq] = useState(2400); // Hz
  const [sizzleStatus, setSizzleStatus] = useState('Moisture Evaporating (Pre-Crisp)');

  // Smart Knife Cadence Trainer
  const [isKnifeTrainerActive, setIsKnifeTrainerActive] = useState(false);
  const [chopCount, setChopCount] = useState(0);
  const [cadenceCPM, setCadenceCPM] = useState(95); // Chops per minute
  const [rhythmSafetyScore, setRhythmSafetyScore] = useState(98); // %

  // Spoilage Hour Prediction
  const [selectedProduce, setSelectedProduce] = useState('Avocado');
  const [browningPct, setBrowningPct] = useState(25);


  // Sonic Frequency Listener Simulation
  const toggleSonicListening = () => setIsListeningSonic((prev) => !prev);

  useEffect(() => {
    if (!isListeningSonic) return;
    // Simulate frequency shift during frying
    const interval = setInterval(() => {
      setSizzleFreq((prev) => Math.min(5000, Math.max(1200, prev + Math.floor(Math.random() * 80) - 30)));
    }, 800);
    return () => clearInterval(interval);
  }, [isListeningSonic]);

  useEffect(() => {
    if (sizzleFreq > 4500) {
      setSizzleStatus('CRITICAL SEAR: Max Crispness Reached!');
    } else if (sizzleFreq > 3500) {
      setSizzleStatus('GOLDEN CRISP SEAR: Perfect Crust Detected');
    } else if (isListeningSonic) {
      setSizzleStatus('Moisture Reduction Phase');
    }
  }, [sizzleFreq, isListeningSonic]);

  // Smart Knife Cadence Trainer Simulation
  const toggleKnifeTrainer = () => {
    if (isKnifeTrainerActive) {
      setIsKnifeTrainerActive(false);
    } else {
      setIsKnifeTrainerActive(true);
      setChopCount(0);
    }
  };

  useEffect(() => {
    let chopInterval: any;
    if (isKnifeTrainerActive) {
      chopInterval = setInterval(() => {
        setChopCount((prev) => prev + 1);
        setCadenceCPM(Math.floor(80 + Math.random() * 30));
      }, 600);
    }
    return () => clearInterval(chopInterval);
  }, [isKnifeTrainerActive]);

  // Hours until spoilage calculation
  const hoursLeft = Math.max(2, Math.round((100 - browningPct) * 0.9));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">Sensory & Acoustic Food Intelligence</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                ACOUSTIC FFT & VISION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Performs pitch-frequency pan sizzle analysis, knife chopping rhythm training, and micro-texture produce spoilage hour predictions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: Sonic Doneness Pitch & Frequency Analyzer */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Sonic Sizzle Frequency</span>
            </h3>
            <span className="text-[10px] font-mono text-purple-400 font-bold">FFT SPECTRUM</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 text-center">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Sizzle Frequency:</span>
              <span className="text-purple-400 font-bold">{sizzleFreq} Hz</span>
            </div>

            {/* Simulated Frequency Spectrum Bar */}
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800 flex items-center">
              <div
                className="bg-gradient-to-r from-purple-500 via-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(sizzleFreq / 5000) * 100}%` }}
              />
            </div>

            <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">
              {sizzleStatus}
            </p>
          </div>

          <button
            onClick={toggleSonicListening}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              isListeningSonic
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20 animate-pulse'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isListeningSonic ? 'Listening to Pan Sizzle...' : 'Start Pan Acoustic Analysis'}</span>
          </button>
        </div>

        {/* Module 2: Smart Knife Cadence Trainer */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Smart Knife Rhythm Guide</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">HAPTIC CPM</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Chopping Cadence:</span>
              <span className="text-emerald-400 font-bold font-mono">{cadenceCPM} CPM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Rhythm Uniformity:</span>
              <span className="text-teal-400 font-bold font-mono">{rhythmSafetyScore}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Total Chops Detected:</span>
              <span className="text-white font-bold font-mono">{chopCount}</span>
            </div>
          </div>

          <button
            onClick={toggleKnifeTrainer}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              isKnifeTrainerActive
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 animate-bounce'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span>{isKnifeTrainerActive ? 'Active Chopping Cadence Metronome' : 'Start Knife Rhythm Trainer'}</span>
          </button>
        </div>

        {/* Module 3: Micro-Visual Spoilage Hour Predictor */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Produce Spoilage Hour Clock</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 font-bold">MICRO-TEXTURE</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Select Produce Item:</span>
              <select
                value={selectedProduce}
                onChange={(e) => setSelectedProduce(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200"
              >
                <option value="Avocado">Haas Avocado</option>
                <option value="Banana">Organic Banana</option>
                <option value="Spinach">Baby Spinach</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Micro-Browning / Softness:</span>
                <span className="text-amber-400 font-bold font-mono">{browningPct}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={95}
                value={browningPct}
                onChange={(e) => setBrowningPct(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center space-y-1">
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Estimated Freshness Window:</p>
              <p className="text-xl font-extrabold text-amber-400 font-mono">
                {hoursLeft} Hours Remaining
              </p>
              <p className="text-[10px] text-slate-400 italic">
                {hoursLeft < 12 ? 'High Priority: Cook within today!' : 'Fresh & ready to use.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
