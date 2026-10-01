import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Check, AlertCircle, Zap } from 'lucide-react';
import { speechEngine } from '../utils/speechUtils';
import { showToast } from '../utils/toast';

interface VoiceNavigationProps {
  activeTab: 'scan' | 'recipes' | 'shopping' | 'saved' | 'molecular';
  setActiveTab: (tab: 'scan' | 'recipes' | 'shopping' | 'saved' | 'molecular') => void;
}

export const VoiceNavigationController: React.FC<VoiceNavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Refs keep the single recognition instance's callbacks in sync with the latest props/state,
  // so the recognizer is created once instead of being torn down on every tab change.
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;
  const setActiveTabRef = useRef(setActiveTab);
  setActiveTabRef.current = setActiveTab;
  const isListeningRef = useRef(isListening);
  isListeningRef.current = isListening;

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        const clean = currentTranscript.trim().toLowerCase();
        setTranscript(clean);

        // Keyword recognition logic
        if (clean.includes('scan') || clean.includes('camera') || clean.includes('fridge')) {
          if (activeTabRef.current !== 'scan') {
            setActiveTabRef.current('scan');
            setLastCommand('Switched to Fridge Scanner');
            speechEngine.speak('Opening Fridge Scanner');
          }
        } else if (clean.includes('recipe') || clean.includes('recipes') || clean.includes('cook') || clean.includes('food')) {
          if (activeTabRef.current !== 'recipes') {
            setActiveTabRef.current('recipes');
            setLastCommand('Switched to Recipe Discovery');
            speechEngine.speak('Opening Recipe Discovery');
          }
        } else if (clean.includes('shop') || clean.includes('shopping') || clean.includes('grocery') || clean.includes('list')) {
          if (activeTabRef.current !== 'shopping') {
            setActiveTabRef.current('shopping');
            setLastCommand('Switched to Shopping List');
            speechEngine.speak('Opening Shopping List');
          }
        } else if (clean.includes('lab') || clean.includes('molecular') || clean.includes('science')) {
          if (activeTabRef.current !== 'molecular') {
            setActiveTabRef.current('molecular');
            setLastCommand('Switched to Molecular Lab');
            speechEngine.speak('Opening Molecular Lab');
          }
        } else if (clean.includes('save') || clean.includes('saved') || clean.includes('bookmark')) {
          if (activeTabRef.current !== 'saved') {
            setActiveTabRef.current('saved');
            setLastCommand('Switched to Saved Recipes');
            speechEngine.speak('Opening Saved Recipes');
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Voice navigation speech error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showToast('Speech recognition is not supported on this browser version.');
      return;
    }

    if (isListening) {
      isListeningRef.current = false; // prevent onend from auto-restarting
      setIsListening(false);
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setTranscript('');
    } else {
      isListeningRef.current = true;
      setIsListening(true);
      try {
        recognitionRef.current.start();
        speechEngine.speak('Voice navigation active. Say scan, recipes, or shopping.');
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={toggleListening}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
          isListening
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 animate-pulse border border-rose-400'
            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400'
        }`}
        title="Toggle Voice Activated Navigation Commands"
      >
        {isListening ? (
          <>
            <Mic className="w-3.5 h-3.5 animate-bounce text-white" />
            <span>Voice Nav ON</span>
          </>
        ) : (
          <>
            <MicOff className="w-3.5 h-3.5 text-slate-400" />
            <span>Voice Nav</span>
          </>
        )}
      </button>

      {/* Voice Transcript Floating Banner */}
      {isListening && (
        <div className="absolute top-10 right-0 z-50 bg-slate-900 border border-emerald-500/40 p-3 rounded-xl shadow-2xl w-64 space-y-1.5 text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> Listening...
            </span>
            <span className="text-slate-500 font-mono">Commands: Scan, Recipes, Shopping</span>
          </div>
          <p className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800 italic truncate">
            {transcript ? `"${transcript}"` : 'Say a tab name...'}
          </p>
          {lastCommand && (
            <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
              <Check className="w-3 h-3" /> {lastCommand}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
