import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  DoorClosed,
  DoorOpen,
  Scale,
  Wind,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  X,
  RefreshCw,
  Zap,
  Activity,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { SmartFridgeSensors } from '../types';

interface SmartFridgeSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensors: SmartFridgeSensors;
  onToggleAnomaly: () => void;
}

export const SmartFridgeSensorModal: React.FC<SmartFridgeSensorModalProps> = ({
  isOpen,
  onClose,
  sensors,
  onToggleAnomaly,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Smart Fridge IoT Sensor Hub</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                  REAL-TIME TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connected IoT hardware sensors: Microclimates, door open triggers, shelf load cells & VOC odor detection.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Temperature Anomaly Banner */}
        {sensors.isAnomalyActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-rose-950/70 border-b border-rose-500/40 flex items-start justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <strong className="text-rose-200 text-sm font-extrabold block">
                  ⚠️ Temperature Anomaly Detected
                </strong>
                <p className="text-rose-300/90 leading-snug mt-0.5">
                  Fridge temperature increased from <strong>3.8°C → 8.1°C</strong> for 27 minutes. Refrigerator door was left slightly unlatched.
                </p>
                <div className="mt-2 text-[11px] text-rose-200 bg-rose-900/40 px-2.5 py-1 rounded-lg border border-rose-500/30 inline-block">
                  🚨 Action: Inspect raw poultry on shelf 2. Safe cook immediately.
                </div>
              </div>
            </div>

            <button
              onClick={onToggleAnomaly}
              className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-lg transition-all shrink-0"
            >
              Resolve Alert
            </button>
          </motion.div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 6 Sensor Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* 1. Temperature */}
            <div className={`p-4 rounded-2xl border ${sensors.isAnomalyActive ? 'bg-rose-950/30 border-rose-500/50' : 'bg-slate-950 border-slate-800'}`}>
              <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TEMPERATURE</span>
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${sensors.isAnomalyActive ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-cyan-500/10 text-cyan-300'}`}>
                  {sensors.isAnomalyActive ? 'ANOMALY' : 'NORMAL'}
                </span>
              </div>
              <strong className={`text-2xl font-black font-mono block ${sensors.isAnomalyActive ? 'text-rose-400' : 'text-white'}`}>
                {sensors.temperatureCelsius}°C
              </strong>
              <span className="text-[10px] text-slate-500">Target: 3.5°C – 4.0°C</span>
            </div>

            {/* 2. Humidity */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-teal-400" />
                  <span>HUMIDITY</span>
                </span>
                <span className="text-[10px] font-mono bg-teal-500/10 text-teal-300 px-1.5 py-0.5 rounded">
                  CRISPER
                </span>
              </div>
              <strong className="text-2xl font-black text-teal-300 font-mono block">
                {sensors.humidityPercent}% RH
              </strong>
              <span className="text-[10px] text-slate-500">Optimal for leafy greens</span>
            </div>

            {/* 3. Door State */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  {sensors.doorState === 'Closed' ? (
                    <DoorClosed className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>DOOR SENSOR</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">{sensors.doorOpenCountToday} opens today</span>
              </div>
              <strong className="text-xl font-black text-white font-mono block">
                {sensors.doorState}
              </strong>
              <span className="text-[10px] text-slate-500">Open duration: {sensors.doorOpenDurationSeconds}s</span>
            </div>

            {/* 4. Shelf Load Cells (Weight Sensors) */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                  <span>LOAD SENSOR</span>
                </span>
                <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded">
                  SHELF 1
                </span>
              </div>
              <strong className="text-2xl font-black text-purple-300 font-mono block">
                {sensors.shelfWeightSensorKg} kg
              </strong>
              <span className="text-[10px] text-amber-400 font-bold">Milk remaining: 320g / 1L</span>
            </div>

            {/* 5. Gas / Odor VOC Sensor */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <span>VOC ODOR SENSOR</span>
                </span>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded">
                  AIR QUALITY
                </span>
              </div>
              <strong className="text-2xl font-black text-cyan-300 font-mono block">
                {sensors.gasOdorIndexPpm} ppm
              </strong>
              <span className="text-[10px] text-slate-500">Pure clean air (&lt; 25 ppm)</span>
            </div>

            {/* 6. Ethylene Gas Sensor (Ripening Produce) */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>ETHYLENE (C₂H₄)</span>
                </span>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded">
                  RIPENING
                </span>
              </div>
              <strong className="text-2xl font-black text-amber-300 font-mono block">
                {sensors.ethyleneGasLevelPpm} ppm
              </strong>
              <span className="text-[10px] text-slate-500">Bananas & apples actively releasing</span>
            </div>
          </div>

          {/* Interactive IoT Hardware Test Strip */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>IoT Simulation Controller: Trigger anomalies to test Dynamic Island & Voice warning systems.</span>
            </div>

            <button
              onClick={onToggleAnomaly}
              className={`px-4 py-2 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 ${
                sensors.isAnomalyActive
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-rose-500 text-white hover:bg-rose-600'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{sensors.isAnomalyActive ? 'Reset to 3.8°C Normal' : 'Simulate 8.1°C Temp Anomaly'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
