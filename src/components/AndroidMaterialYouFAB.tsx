import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Speed-dial items cascade upward from the button when opening and collapse back in reverse
const fabMenuVariants: Variants = {
  open: { transition: { staggerChildren: 0.035, staggerDirection: -1 } },
  closed: { transition: { staggerChildren: 0.02 } },
};

const fabItemVariants: Variants = {
  open: { opacity: 1, x: 0, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 26 } },
  closed: { opacity: 0, x: 24, y: 12, scale: 0.85, transition: { duration: 0.15 } },
};
import { Camera, Sparkles, Trophy, Mic, Plus, X, ShieldAlert, Receipt, Brain, ChefHat, DollarSign, Activity, Bot, GitFork } from 'lucide-react';

interface AndroidMaterialYouFABProps {
  onQuickSnapClick: () => void;
  onOpenIronChefModal: () => void;
  onOpenEmergencyPantry: () => void;
  onOpenReceiptModal?: () => void;
  onOpenMemoryModal?: () => void;
  onOpenChefPersonaModal?: () => void;
  onOpenPantryChallengeModal?: () => void;
  onOpenBudgetModeModal?: () => void;
  onOpenKitchenVoiceModal?: () => void;
  onOpenNutritionModal?: () => void;
  onOpenFoodSafetyModal?: () => void;
  onOpenAutonomousAgentModal?: () => void;
  onOpenKnowledgeGraphModal?: () => void;
  onOpenPlateAnalysisModal?: () => void;
}

export const AndroidMaterialYouFAB: React.FC<AndroidMaterialYouFABProps> = ({
  onQuickSnapClick,
  onOpenIronChefModal,
  onOpenEmergencyPantry,
  onOpenReceiptModal,
  onOpenMemoryModal,
  onOpenChefPersonaModal,
  onOpenPantryChallengeModal,
  onOpenBudgetModeModal,
  onOpenKitchenVoiceModal,
  onOpenNutritionModal,
  onOpenFoodSafetyModal,
  onOpenAutonomousAgentModal,
  onOpenKnowledgeGraphModal,
  onOpenPlateAnalysisModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const triggerAndroidHaptic = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15, 20]);
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleFabAction = (action?: () => void) => {
    if (!action) return;
    triggerAndroidHaptic();
    action();
    setIsOpen(false);
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="fab-backdrop"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </AnimatePresence>
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 pointer-events-auto flex flex-col items-end">
      {/* Expanded Speed Dial Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={fabMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col items-end gap-2.5 mb-3 max-h-[70vh] overflow-y-auto no-scrollbar pr-1 pb-1"
          >
            {onOpenAutonomousAgentModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenAutonomousAgentModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 text-slate-950 font-black text-xs rounded-full shadow-2xl border border-emerald-300/30 whitespace-nowrap"
              >
                <Bot className="w-4 h-4 fill-slate-950 animate-pulse" />
                <span>Culinary Agent OS</span>
              </motion.button>
            )}

            {onOpenKnowledgeGraphModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenKnowledgeGraphModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold text-xs rounded-full shadow-2xl border border-purple-300/30 whitespace-nowrap"
              >
                <GitFork className="w-4 h-4 text-white" />
                <span>Recipe Knowledge Graph</span>
              </motion.button>
            )}

            {onOpenPlateAnalysisModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenPlateAnalysisModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-extrabold text-xs rounded-full shadow-2xl border border-amber-300/30 whitespace-nowrap"
              >
                <Camera className="w-4 h-4 text-slate-950" />
                <span>Plate Vision Scoring</span>
              </motion.button>
            )}
            {onOpenKitchenVoiceModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenKitchenVoiceModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-xs rounded-full shadow-2xl border border-emerald-300/30 whitespace-nowrap"
              >
                <Mic className="w-4 h-4 fill-slate-950 animate-pulse" />
                <span>Voice Kitchen Agent</span>
              </motion.button>
            )}

            {onOpenNutritionModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenNutritionModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-extrabold text-xs rounded-full shadow-2xl border border-teal-300/30 whitespace-nowrap"
              >
                <Activity className="w-4 h-4 text-white" />
                <span>Nutrition Dashboard</span>
              </motion.button>
            )}

            {onOpenFoodSafetyModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenFoodSafetyModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-xs rounded-full shadow-2xl border border-rose-300/30 whitespace-nowrap"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Food Safety Window</span>
              </motion.button>
            )}

            {onOpenChefPersonaModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenChefPersonaModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-extrabold text-xs rounded-full shadow-2xl border border-amber-300/30 whitespace-nowrap"
              >
                <ChefHat className="w-4 h-4 text-slate-950" />
                <span>Chef Personas</span>
              </motion.button>
            )}

            {onOpenPantryChallengeModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenPantryChallengeModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-xs rounded-full shadow-2xl border border-rose-300/30 whitespace-nowrap"
              >
                <Trophy className="w-4 h-4 text-amber-200" />
                <span>Pantry Challenge</span>
              </motion.button>
            )}

            {onOpenBudgetModeModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenBudgetModeModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold text-xs rounded-full shadow-2xl border border-teal-300/30 whitespace-nowrap"
              >
                <DollarSign className="w-4 h-4 text-slate-950" />
                <span>Budget Mode</span>
              </motion.button>
            )}

            {onOpenReceiptModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenReceiptModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-xs rounded-full shadow-2xl border border-emerald-300/30 whitespace-nowrap"
              >
                <Receipt className="w-4 h-4 text-slate-950" />
                <span>Receipt → Pantry AI</span>
              </motion.button>
            )}

            {onOpenMemoryModal && (
              <motion.button
                variants={fabItemVariants}
                whileHover={{ x: -4, scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleFabAction(onOpenMemoryModal)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold text-xs rounded-full shadow-2xl border border-purple-300/30 whitespace-nowrap"
              >
                <Brain className="w-4 h-4 text-purple-200" />
                <span>Household Memory</span>
              </motion.button>
            )}

            <motion.button
              variants={fabItemVariants}
              whileHover={{ x: -4, scale: 1.03 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleFabAction(onQuickSnapClick)}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-full shadow-2xl border border-emerald-300/30 whitespace-nowrap"
            >
              <Camera className="w-4 h-4 fill-slate-950" />
              <span>Camera Scan</span>
            </motion.button>

            <motion.button
              variants={fabItemVariants}
              whileHover={{ x: -4, scale: 1.03 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleFabAction(onOpenIronChefModal)}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-extrabold text-xs rounded-full shadow-2xl border border-amber-300/30 whitespace-nowrap"
            >
              <Trophy className="w-4 h-4 fill-slate-950" />
              <span>Iron Chef Challenge</span>
            </motion.button>

            <motion.button
              variants={fabItemVariants}
              whileHover={{ x: -4, scale: 1.03 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleFabAction(onOpenEmergencyPantry)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-rose-300 font-extrabold text-xs rounded-full shadow-2xl border border-rose-500/40 whitespace-nowrap"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Pantry Emergency</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Material You FAB Button */}
      <div className="relative flex justify-end">
        {/* Soft breathing halo while closed */}
        {!isOpen && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-[22px] bg-emerald-400/40 blur-md pointer-events-none"
            animate={{ scale: [1, 1.25, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <motion.button
          aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={isOpen}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          animate={{
            rotate: isOpen ? 135 : 0,
            borderRadius: isOpen ? 28 : 20,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          onClick={() => {
            triggerAndroidHaptic();
            setIsOpen((prev) => !prev);
          }}
          className={`relative w-13 h-13 sm:w-14 sm:h-14 flex items-center justify-center shadow-2xl border transition-[background-color,border-color,box-shadow,color] duration-300 ${
            isOpen
              ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/40'
              : 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 border-emerald-300/40 shadow-emerald-500/40'
          }`}
          title="Quick Actions"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
    </>
  );
};
