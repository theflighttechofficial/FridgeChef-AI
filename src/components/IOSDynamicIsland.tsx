import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Camera, Mic, Activity, Battery, Wifi, Check, Zap } from 'lucide-react';

interface IOSDynamicIslandProps {
  activeTab: string;
  currentIngredientsCount: number;
  sensorAnomaly?: boolean;
  onOpenSensorModal?: () => void;
}

export const IOSDynamicIsland: React.FC<IOSDynamicIslandProps> = ({
  activeTab,
  currentIngredientsCount,
  sensorAnomaly,
  onOpenSensorModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Fridge AI Online');

  useEffect(() => {
    if (sensorAnomaly) setStatusMessage('⚠️ 8.1°C Temp Anomaly (27m)');
    else if (activeTab === 'scan') setStatusMessage(`${currentIngredientsCount} Items Monitored`);
    else if (activeTab === 'recipes') setStatusMessage('AI Culinary Matrix Sync');
    else if (activeTab === 'molecular') setStatusMessage('VOC Sensor Active (37°F)');
    else if (activeTab === 'shopping') setStatusMessage('Smart List Synced');
    else setStatusMessage('FridgeChef OS v3.2');
  }, [activeTab, currentIngredientsCount, sensorAnomaly]);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate([10, 30, 10]);
      } catch (e) {
        // Safe fallback for devices unsupported
      }
    }
  };

  return (
    // Mobile only: on desktop the pill overlapped the navbar tabs. A solid status strip sits
    // behind it so page content never scrolls underneath; the navbar sticks just below it.
    <div className="md:hidden fixed top-0 inset-x-0 z-50 h-12 flex justify-center items-start pt-2 pointer-events-none">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/60" />
      <div className="relative pointer-events-auto">
      <motion.div
        layout
        onClick={() => {
          triggerHaptic();
          setIsExpanded(!isExpanded);
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`bg-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl text-white cursor-pointer select-none flex items-center justify-between gap-3 px-3.5 py-1.5 ${
          isExpanded ? 'rounded-[24px] w-[320px] sm:w-[360px] p-4' : 'rounded-full w-auto min-w-[180px]'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
          <span className="text-[11px] font-extrabold tracking-tight text-slate-100 font-sans">
            {statusMessage}
          </span>
        </div>

        {!isExpanded && (
          <div className="flex items-center gap-1.5 opacity-80 text-[10px] text-slate-400 font-mono">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>98%</span>
          </div>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute left-0 right-0 top-12 bg-slate-950/95 border border-slate-800 backdrop-blur-3xl rounded-[24px] p-4 shadow-2xl space-y-3 text-xs"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">iOS Dynamic Island Status</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  HAPTICS ENABLED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  <div>
                    <span className="text-slate-400 block text-[9px]">Sensor Temp</span>
                    <strong className="text-white font-mono">37.2°F / 88% Humidity</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <span className="text-slate-400 block text-[9px]">AI Vision Latency</span>
                    <strong className="text-white font-mono">140ms (On-Device)</strong>
                  </div>
                </div>
              </div>

              {onOpenSensorModal && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSensorModal();
                    setIsExpanded(false);
                  }}
                  className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[11px] rounded-xl border border-cyan-500/40 transition-all flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Inspect Connected Smart IoT Sensors</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
    </div>
  );
};
