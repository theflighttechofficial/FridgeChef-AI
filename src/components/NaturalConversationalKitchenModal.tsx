import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Play,
  X,
  Send,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { KitchenConversationMessage, Ingredient, Recipe } from '../types';

interface NaturalConversationalKitchenModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: Ingredient[];
  onStartCookingRecipe: (recipe: Recipe) => void;
}

export const NaturalConversationalKitchenModal: React.FC<NaturalConversationalKitchenModalProps> = ({
  isOpen,
  onClose,
  availableIngredients,
  onStartCookingRecipe,
}) => {
  const [messages, setMessages] = useState<KitchenConversationMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      text: 'Hey! I’m your FridgeChef Voice Kitchen Agent. You’ve got chicken, baby spinach, and rice in your fridge. What kind of meal are you craving right now?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [activeDraftRecipe, setActiveDraftRecipe] = useState<any>({
    title: 'Garlic Chicken & Wilted Spinach Rice Skillet',
    description: 'Quick-seared protein bowl with garlic wilted greens',
    cookTimeMinutes: 22,
    calories: 480,
    macros: { protein: '36g', carbs: '44g', fat: '12g' },
    spiceLevel: 'Medium (Level 2/5)',
    keyModification: 'Balanced everyday healthy dinner',
    steps: [
      { stepNumber: 1, instruction: 'Dice chicken and season with black pepper, garlic powder, and a pinch of salt.', timerSeconds: 120 },
      { stepNumber: 2, instruction: 'Sear chicken in skillet over medium-high heat for 6 minutes.', timerSeconds: 360 },
      { stepNumber: 3, instruction: 'Fold in fresh baby spinach and pre-cooked rice; toss for 3 minutes.', timerSeconds: 180 },
    ],
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  // Always points at the latest handler so the recognition callback never sees stale chat state
  const sendMessageRef = useRef<(text: string) => void>(() => {});

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          sendMessageRef.current(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
    return () => {
      recognitionRef.current?.abort?.();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: KitchenConversationMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/conversational-kitchen-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages,
          currentRecipe: activeDraftRecipe,
          availableIngredients: availableIngredients.map((i) => i.name),
        }),
      });
      const data = await res.json();

      const assistantMsg: KitchenConversationMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.replyText,
        timestamp: 'Just now',
        actionTaken: data.action,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(data.replyText);

      if (data.updatedRecipe) {
        setActiveDraftRecipe(data.updatedRecipe);
      }

      if (data.action === 'START_COOKING') {
        setTimeout(() => {
          handleLaunchCooking();
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLaunchCooking = () => {
    const recipeToCook: Recipe = {
      id: `voice-agent-${Date.now()}`,
      title: activeDraftRecipe.title,
      description: activeDraftRecipe.description,
      prepTimeMinutes: 5,
      cookTimeMinutes: activeDraftRecipe.cookTimeMinutes || 20,
      calories: activeDraftRecipe.calories || 480,
      difficulty: 'Easy',
      cuisine: 'Conversational Custom',
      dietaryTags: ['Voice Guided', activeDraftRecipe.spiceLevel || 'Medium'],
      matchedIngredients: availableIngredients.map((i) => i.name),
      missingIngredients: [],
      macros: activeDraftRecipe.macros || { protein: '34g', carbs: '40g', fat: '12g' },
      steps: activeDraftRecipe.steps || [],
    };
    onStartCookingRecipe(recipeToCook);
    onClose();
  };

  sendMessageRef.current = handleSendMessage;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Mic className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Natural Conversational Kitchen Agent</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  TWO-WAY SPOKEN DIALOGUE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                “Hey FridgeChef, what can I make?” → “Make it spicier.” → “Start cooking.” Live conversational agent.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Live Recipe Draft Card (Sticky Preview at Top of Agent) */}
        {activeDraftRecipe && (
          <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">ACTIVE CONVERSATIONAL DISH:</span>
              <strong className="text-white">{activeDraftRecipe.title}</strong>
              <span className="text-slate-400">({activeDraftRecipe.cookTimeMinutes} min • {activeDraftRecipe.macros?.protein} protein • {activeDraftRecipe.spiceLevel})</span>
            </div>

            <button
              onClick={handleLaunchCooking}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Start Hands-Free Session</span>
            </button>
          </div>
        )}

        {/* Chat Message Scrollable Container */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                  msg.role === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 font-mono">
                  <span>{msg.role === 'user' ? 'You' : 'FridgeChef Agent'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="p-4 rounded-2xl bg-slate-950 text-slate-400 border border-slate-800 rounded-tl-none text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="font-mono text-[11px] ml-1">FridgeChef is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0">Try Saying:</span>
          {['“What can I make?”', '“Make it spicier”', '“Lower the calories”', '“Double the protein”', '“Start cooking”'].map(
            (phrase, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(phrase.replace(/[“”]/g, ''))}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl border border-slate-800 text-[11px] whitespace-nowrap transition-colors"
              >
                {phrase}
              </button>
            )
          )}
        </div>

        {/* Input Bar with Voice Toggle */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-2xl transition-all shadow-md flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-slate-900 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak'}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? 'Listening to your voice...' : 'Type or say “Make it spicier” or “Start cooking”...'}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-3 bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
