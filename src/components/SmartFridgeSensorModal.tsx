import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, DoorClosed, DoorOpen, Scale, Wind, AlertTriangle, CheckCircle2, X, RefreshCw, Zap, Activity, ShieldAlert, Sliders } from 'lucide-react';
import { EmptyResult } from './ui/EmptyResult';
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
  const [showDemo, setShowDemo] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 tool-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="tool-panel max-w-4xl"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-high border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-on-surface leading-tight">Fridge sensors</h3>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                Temperature, humidity and door sensors from a connected smart fridge.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showDemo ? (
          <div className="flex flex-col items-center">
            <EmptyResult
              title="No smart fridge connected"
              hint="FridgeChef can show live temperature, humidity and door sensors from a connected fridge. None is linked to this account yet."
              icon={<Thermometer className="w-6 h-6" />}
            />
            <button onClick={() => setShowDemo(true)} className="mb-8 -mt-6 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700">
              Preview with sample data
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/30 text-xs text-amber-300 font-bold">Sample data: not from your fridge</div>
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
                <strong className="text-rose-200 text-sm font-semibold block">
                  Temperature Anomaly Detected
                </strong>
                <p className="text-rose-300/90 leading-snug mt-0.5">
                  Fridge temperature increased from <strong>3.8°C → 8.1°C</strong> for 27 minutes. Refrigerator door was left slightly unlatched.
                </p>
                <div className="mt-2 text-xs text-rose-200 bg-rose-900/40 px-2.5 py-1 rounded-lg border border-rose-500/30 inline-block">
                  Action: Inspect raw poultry on shelf 2. Safe cook immediately.
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
                  <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>TEMPERATURE</span>
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${sensors.isAnomalyActive ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-emerald-500/10 text-emerald-300'}`}>
                  {sensors.isAnomalyActive ? 'ANOMALY' : 'NORMAL'}
                </span>
              </div>
              <strong className={`text-2xl font-semibold block ${sensors.isAnomalyActive ? 'text-rose-400' : 'text-white'}`}>
                {sensors.temperatureCelsius}°C
              </strong>
              <span className="text-xs text-slate-500">Target: 3.5°C – 4.0°C</span>
            </div>

            {/* 2. Humidity */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-teal-400" />
                  <span>HUMIDITY</span>
                </span>
                <span className="text-xs bg-teal-500/10 text-teal-300 px-1.5 py-0.5 rounded">
                  CRISPER
                </span>
              </div>
              <strong className="text-2xl font-semibold text-teal-300 block">
                {sensors.humidityPercent}% RH
              </strong>
              <span className="text-xs text-slate-500">Optimal for leafy greens</span>
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
                <span className="text-xs text-slate-400">{sensors.doorOpenCountToday} opens today</span>
              </div>
              <strong className="text-xl font-semibold text-white block">
                {sensors.doorState}
              </strong>
              <span className="text-xs text-slate-500">Open duration: {sensors.doorOpenDurationSeconds}s</span>
            </div>

            {/* 4. Shelf Load Cells (Weight Sensors) */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-teal-400" />
                  <span>LOAD SENSOR</span>
                </span>
                <span className="text-xs bg-teal-500/10 text-teal-300 px-1.5 py-0.5 rounded">
                  SHELF 1
                </span>
              </div>
              <strong className="text-2xl font-semibold text-teal-300 block">
                {sensors.shelfWeightSensorKg} kg
              </strong>
              <span className="text-xs text-amber-400 font-bold">Milk remaining: 320g / 1L</span>
            </div>

            {/* 5. Gas / Odor VOC Sensor */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VOC ODOR SENSOR</span>
                </span>
                <span className="text-xs bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded">
                  AIR QUALITY
                </span>
              </div>
              <strong className="text-2xl font-semibold text-emerald-300 block">
                {sensors.gasOdorIndexPpm} ppm
              </strong>
              <span className="text-xs text-slate-500">Pure clean air (&lt; 25 ppm)</span>
            </div>

            {/* 6. Ethylene Gas Sensor (Ripening Produce) */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>ETHYLENE (C₂H₄)</span>
                </span>
                <span className="text-xs bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded">
                  RIPENING
                </span>
              </div>
              <strong className="text-2xl font-semibold text-amber-300 block">
                {sensors.ethyleneGasLevelPpm} ppm
              </strong>
              <span className="text-xs text-slate-500">Bananas & apples actively releasing</span>
            </div>
          </div>

          {/* Interactive IoT Hardware Test Strip */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>IoT Simulation Controller: Trigger anomalies to test Dynamic Island & Voice warning systems.</span>
            </div>

            <button
              onClick={onToggleAnomaly}
              className={`px-4 py-2 font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 ${
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
          </>
        )}
      </motion.div>
    </div>
  );
};
