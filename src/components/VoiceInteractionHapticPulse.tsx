import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Zap } from 'lucide-react';

interface VoiceInteractionHapticPulseProps {
  isActive: boolean;
  mode: 'speaking' | 'listening';
  label?: string;
  onStop?: () => void;
}

export const VoiceInteractionHapticPulse: React.FC<VoiceInteractionHapticPulseProps> = ({
  isActive,
  mode,
  label = mode === 'speaking' ? 'AI Voice Assistant Speaking...' : 'Listening for Voice Command...',
  onStop,
}) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-3 relative overflow-hidden"
    >
      {/* Siri-style glowing animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/20 to-purple-500/10 animate-pulse pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        {/* Animated Visual Haptic Pulsing Orb */}
        <div className="relative flex items-center justify-center w-9 h-9">
          <motion.div
            animate={{
              scale: [1, 1.4, 1, 1.3, 1],
              opacity: [0.3, 0.8, 0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-emerald-400/30 blur-md"
          />
          <div className="relative z-10 p-2 rounded-full bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/50">
            {mode === 'speaking' ? (
              <Volume2 className="w-4 h-4 animate-bounce" />
            ) : (
              <Mic className="w-4 h-4 animate-pulse" />
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white">{label}</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
              iOS Siri-Style Haptics
            </span>
          </div>

          {/* Audio Waveform Bars */}
          <div className="flex items-center gap-1 mt-1.5 h-3">
            {[0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.3, 0.9, 0.6].map((h, idx) => (
              <motion.div
                key={idx}
                animate={{
                  height: ['20%', '100%', '30%', '80%', '20%'],
                }}
                transition={{
                  duration: 0.6 + (idx % 3) * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.08,
                }}
                className="w-1 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {onStop && (
        <button
          onClick={onStop}
          className="relative z-10 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 text-xs font-bold rounded-xl transition-all"
        >
          Stop Voice
        </button>
      )}
    </motion.div>
  );
};
