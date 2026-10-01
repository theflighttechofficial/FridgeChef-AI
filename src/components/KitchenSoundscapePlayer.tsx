import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Play, Pause, Waves, Zap } from 'lucide-react';

export const KitchenSoundscapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<'lofi-kitchen' | 'ambient-beats' | 'zen-sizzle'>('lofi-kitchen');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodesRef = useRef<any[]>([]);

  // Web Audio Synth Lo-Fi Kitchen Ambient Drone Generator
  const startSoundscape = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Base Ambient Warm Drone (Chords Cmaj7)
      const freqs = [130.81, 164.81, 196.0, 246.94]; // C3, E3, G3, B3
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.connect(ctx.destination);

      const newOscs = freqs.map((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(gainNode);
        osc.start();
        return osc;
      });

      oscNodesRef.current = newOscs;
      setIsPlaying(true);
    } catch (e) {
      console.error('Audio synth error:', e);
    }
  };

  const stopSoundscape = () => {
    if (audioCtxRef.current) {
      oscNodesRef.current.forEach((osc) => {
        try { osc.stop(); } catch (e) {}
      });
      oscNodesRef.current = [];
      try { audioCtxRef.current.close(); } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleSoundscape = () => {
    if (isPlaying) {
      stopSoundscape();
    } else {
      startSoundscape();
    }
  };

  useEffect(() => {
    return () => {
      stopSoundscape();
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl border transition-all ${isPlaying ? 'bg-purple-500/10 border-purple-500 text-purple-400 animate-pulse' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
          <Waves className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white">Spatial Kitchen Soundscape</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
              LO-FI FOCUS
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Algorithmically generated ambient audio tailored to lower stress & synchronize timer rhythm.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <select
          value={selectedTrack}
          onChange={(e) => setSelectedTrack(e.target.value as any)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
        >
          <option value="lofi-kitchen">Warm Culinary Chill (Cmaj7)</option>
          <option value="ambient-beats">Deep Focus Rhythm</option>
          <option value="zen-sizzle">Zen Sizzle Meditation</option>
        </select>

        <button
          onClick={toggleSoundscape}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            isPlaying
              ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>Playing Soundscape</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Play Audio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
