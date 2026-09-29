import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  Camera,
  ShoppingBag,
  Bookmark,
  Sparkles,
  ChefHat,
  Atom,
  Trophy,
  Award,
  Menu,
  X,
  Brain,
  Receipt,
  FlaskConical,
  Activity,
  Globe,
  Thermometer,
  ShieldAlert,
  Users,
  Mic,
  GitFork,
  Bot,
  PartyPopper,
  DollarSign
} from 'lucide-react';
import { VoiceNavigationController } from './VoiceNavigationController';

const useHorizontalWheelScroll = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // native horizontal scroll (trackpad)
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= maxScroll - 1 && e.deltaY > 0;
      if (atStart || atEnd) return; // hand control back to the page at the edges
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);
  return ref;
};

interface NavbarProps {
  activeTab: 'scan' | 'recipes' | 'shopping' | 'saved' | 'molecular';
  setActiveTab: (tab: 'scan' | 'recipes' | 'shopping' | 'saved' | 'molecular') => void;
  shoppingListCount: number;
  savedCount: number;
  onQuickScanClick: () => void;
  onOpenIronChefModal: () => void;
  onOpenARPlatingModal: () => void;
  onOpenNeuroModal: () => void;
  onOpenMemoryModal: () => void;
  onOpenReceiptModal: () => void;
  onOpenSubstitutionsModal: () => void;
  onOpenChefPersonaModal?: () => void;
  onOpenPantryChallengeModal?: () => void;
  onOpenBudgetModeModal?: () => void;
  onOpenNutritionModal?: () => void;
  onOpenCarbonModal?: () => void;
  onOpenSensorModal?: () => void;
  onOpenFoodSafetyModal?: () => void;
  onOpenDinnerForEveryoneModal?: () => void;
  onOpenKitchenVoiceModal?: () => void;
  onOpenKnowledgeGraphModal?: () => void;
  onOpenPlateAnalysisModal?: () => void;
  onOpenTasteModal?: () => void;
  onOpenCateringModal?: () => void;
  onOpenFinancialModal?: () => void;
  onOpenAutonomousAgentModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  shoppingListCount,
  savedCount,
  onQuickScanClick,
  onOpenIronChefModal,
  onOpenARPlatingModal,
  onOpenNeuroModal,
  onOpenMemoryModal,
  onOpenReceiptModal,
  onOpenSubstitutionsModal,
  onOpenChefPersonaModal,
  onOpenPantryChallengeModal,
  onOpenBudgetModeModal,
  onOpenNutritionModal,
  onOpenCarbonModal,
  onOpenSensorModal,
  onOpenFoodSafetyModal,
  onOpenDinnerForEveryoneModal,
  onOpenKitchenVoiceModal,
  onOpenKnowledgeGraphModal,
  onOpenPlateAnalysisModal,
  onOpenTasteModal,
  onOpenCateringModal,
  onOpenFinancialModal,
  onOpenAutonomousAgentModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Let the vertical mouse wheel scroll the horizontal tab rows while the pointer is over them
  const desktopNavScrollRef = useHorizontalWheelScroll<HTMLDivElement>();
  const mobileNavScrollRef = useHorizontalWheelScroll<HTMLDivElement>();

  return (
    <>
      <header className="sticky top-12 md:top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 w-full shadow-md">
        <div className="w-full px-3 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            {/* Zone 1: Brand Wordmark */}
            <button
              onClick={() => setActiveTab('scan')}
              className="flex items-center gap-2 text-left focus:outline-none group shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  FridgeChef<span className="text-emerald-400">.AI</span>
                </span>
              </div>
            </button>

            {/* Middle Horizontally Scrollable Navigation Container (with custom scrollbar) */}
            <div ref={desktopNavScrollRef} className="hidden md:flex items-center gap-3 overflow-x-auto nav-scrollbar py-2 px-1 flex-1 max-w-full mx-2">
              {/* Zone 2: Navigation Tabs */}
              <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 shrink-0">
                <button
                  onClick={() => setActiveTab('scan')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg relative isolate text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] ${
                    activeTab === 'scan'
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {activeTab === 'scan' && (
                    <motion.span
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-emerald-500 shadow-md shadow-emerald-500/20"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <Camera className="w-3.5 h-3.5" />
                  <span>Fridge Scanner</span>
                </button>

                <button
                  onClick={() => setActiveTab('recipes')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg relative isolate text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] ${
                    activeTab === 'recipes'
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {activeTab === 'recipes' && (
                    <motion.span
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-emerald-500 shadow-md shadow-emerald-500/20"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Recipe Discovery</span>
                </button>

                <button
                  onClick={() => setActiveTab('molecular')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap relative isolate min-h-[38px] ${
                    activeTab === 'molecular'
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {activeTab === 'molecular' && (
                    <motion.span
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-teal-500 shadow-md shadow-teal-500/20"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <Atom className="w-3.5 h-3.5 text-teal-400" />
                  <span>Molecular VOC Lab</span>
                </button>

                <button
                  onClick={() => setActiveTab('shopping')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap relative isolate min-h-[38px] ${
                    activeTab === 'shopping'
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {activeTab === 'shopping' && (
                    <motion.span
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-emerald-500 shadow-md shadow-emerald-500/20"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Shopping List</span>
                  {shoppingListCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-400 text-slate-950 font-bold">
                      {shoppingListCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap relative isolate min-h-[38px] ${
                    activeTab === 'saved'
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {activeTab === 'saved' && (
                    <motion.span
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-emerald-500 shadow-md shadow-emerald-500/20"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved</span>
                  {savedCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-emerald-400 font-bold">
                      {savedCount}
                    </span>
                  )}
                </button>
              </nav>

              <div className="h-6 w-px bg-slate-800 shrink-0" />

              {/* Zone 3: AI Culinary Tools & Intelligence Bar */}
              <div className="flex items-center gap-2 shrink-0">
                {onOpenAutonomousAgentModal && (
                  <button
                    onClick={onOpenAutonomousAgentModal}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Autonomous Culinary Operating System (12-Stage Agent)"
                  >
                    <Bot className="w-4 h-4 fill-slate-950 animate-pulse" />
                    <span>Culinary OS</span>
                  </button>
                )}

                {onOpenKitchenVoiceModal && (
                  <button
                    onClick={onOpenKitchenVoiceModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Natural Conversational Kitchen Agent (Spoken Dialogue)"
                  >
                    <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Voice</span>
                  </button>
                )}

                {onOpenKnowledgeGraphModal && (
                  <button
                    onClick={onOpenKnowledgeGraphModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 border border-purple-500/40 text-purple-300 font-bold text-xs rounded-xl hover:bg-purple-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Recipe Knowledge Graph (Flavor Compounds & Chemistry)"
                  >
                    <GitFork className="w-3.5 h-3.5 text-purple-400" />
                    <span>Graph</span>
                  </button>
                )}

                {onOpenPlateAnalysisModal && (
                  <button
                    onClick={onOpenPlateAnalysisModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl hover:bg-amber-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Plate Photo -> Food & Plating Analysis"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Plate Vision</span>
                  </button>
                )}

                {onOpenTasteModal && (
                  <button
                    onClick={onOpenTasteModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 border border-purple-500/40 text-purple-300 font-bold text-xs rounded-xl hover:bg-purple-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Taste Preference Learning Engine"
                  >
                    <Brain className="w-3.5 h-3.5 text-purple-400" />
                    <span>Taste Model</span>
                  </button>
                )}

                {onOpenCateringModal && (
                  <button
                    onClick={onOpenCateringModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-orange-500/10 border border-orange-500/40 text-orange-300 font-bold text-xs rounded-xl hover:bg-orange-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Event / Guest Mode (Mini AI Catering Planner)"
                  >
                    <PartyPopper className="w-3.5 h-3.5 text-orange-400" />
                    <span>Catering</span>
                  </button>
                )}

                {onOpenFinancialModal && (
                  <button
                    onClick={onOpenFinancialModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Pantry Financial Intelligence (Where is my money going?)"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Financials</span>
                  </button>
                )}

                {onOpenNutritionModal && (
                  <button
                    onClick={onOpenNutritionModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Personal Nutrition Dashboard"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nutrition</span>
                  </button>
                )}

                {onOpenCarbonModal && (
                  <button
                    onClick={onOpenCarbonModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-teal-500/10 border border-teal-500/40 text-teal-300 font-bold text-xs rounded-xl hover:bg-teal-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Food Waste Carbon Calculator"
                  >
                    <Globe className="w-3.5 h-3.5 text-teal-400" />
                    <span>Carbon</span>
                  </button>
                )}

                {onOpenDinnerForEveryoneModal && (
                  <button
                    onClick={onOpenDinnerForEveryoneModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 border border-purple-500/40 text-purple-300 font-bold text-xs rounded-xl hover:bg-purple-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Multi-Person Household: Dinner for Everyone"
                  >
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Household</span>
                  </button>
                )}

                {onOpenFoodSafetyModal && (
                  <button
                    onClick={onOpenFoodSafetyModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-xl hover:bg-rose-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Food Safety Intelligence & HACCP Window"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Food Safety</span>
                  </button>
                )}

                {onOpenSensorModal && (
                  <button
                    onClick={onOpenSensorModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-bold text-xs rounded-xl hover:bg-cyan-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Smart Fridge IoT Sensors (Temp, Humidity, Door, VOC)"
                  >
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sensors</span>
                  </button>
                )}

                {onOpenChefPersonaModal && (
                  <button
                    onClick={onOpenChefPersonaModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl hover:bg-amber-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Chef Persona Engine (10 Master Styles)"
                  >
                    <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                    <span>Personas</span>
                  </button>
                )}

                {onOpenPantryChallengeModal && (
                  <button
                    onClick={onOpenPantryChallengeModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-xl hover:bg-rose-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="“Cook With What You Have” Challenge"
                  >
                    <Trophy className="w-3.5 h-3.5 text-rose-400" />
                    <span>Challenge</span>
                  </button>
                )}

                {onOpenBudgetModeModal && (
                  <button
                    onClick={onOpenBudgetModeModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                    title="Grocery Price Intelligence & Budget Mode"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Budget Mode</span>
                  </button>
                )}

                <button
                  onClick={onOpenMemoryModal}
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 border border-purple-500/40 text-purple-300 font-bold text-xs rounded-xl hover:bg-purple-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                  title="FridgeChef Memory Engine"
                >
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>Memory</span>
                </button>

                <button
                  onClick={onOpenReceiptModal}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                  title="Receipt -> Pantry AI"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Receipt AI</span>
                </button>

                <button
                  onClick={onOpenSubstitutionsModal}
                  className="flex items-center gap-1.5 px-3 py-2 bg-teal-500/10 border border-teal-500/40 text-teal-300 font-bold text-xs rounded-xl hover:bg-teal-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                  title="Ingredient Substitution Intelligence"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
                  <span>Substitutes</span>
                </button>

                <button
                  onClick={onOpenNeuroModal}
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 border border-purple-500/40 text-purple-300 font-bold text-xs rounded-xl hover:bg-purple-500/20 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                  title="Neuro-Gastronomy & Historic Time Machine"
                >
                  <Atom className="w-3.5 h-3.5 text-purple-400" />
                  <span>Neuro</span>
                </button>

                <button
                  onClick={onOpenIronChefModal}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl hover:bg-amber-500/30 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                  title="Iron Chef Mystery Box Mode"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Iron Chef</span>
                </button>

                <button
                  onClick={onOpenARPlatingModal}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:border-amber-400 hover:text-amber-400 transition-all min-h-[38px] shrink-0 whitespace-nowrap"
                  title="3-Michelin-Star AR Plating Guide"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>AR Plating</span>
                </button>

                <VoiceNavigationController
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </div>

            {/* Right Action Trigger Bar */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onQuickScanClick}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95 whitespace-nowrap min-h-[38px]"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
                <span className="hidden xs:inline">Snap Fridge</span>
                <span className="xs:hidden">Snap</span>
              </button>

              {/* Mobile Quick Drawer Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl hover:text-emerald-400 min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Quick Action Strip */}
        <div ref={mobileNavScrollRef} className="md:hidden overflow-x-auto no-scrollbar border-t border-slate-800/60 bg-slate-950/80 px-3 py-2 flex items-center gap-2">
          {onOpenAutonomousAgentModal && (
            <button
              onClick={onOpenAutonomousAgentModal}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs rounded-lg whitespace-nowrap min-h-[36px]"
            >
              <Bot className="w-3.5 h-3.5 fill-slate-950 animate-pulse" />
              <span>Culinary OS</span>
            </button>
          )}

          {onOpenKitchenVoiceModal && (
            <button
              onClick={onOpenKitchenVoiceModal}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
            >
              <Mic className="w-3.5 h-3.5 fill-slate-950 animate-pulse" />
              <span>Voice Kitchen</span>
            </button>
          )}

          {onOpenNutritionModal && (
            <button
              onClick={onOpenNutritionModal}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nutrition</span>
            </button>
          )}

          {onOpenCarbonModal && (
            <button
              onClick={onOpenCarbonModal}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>Carbon</span>
            </button>
          )}

          {onOpenDinnerForEveryoneModal && (
            <button
              onClick={onOpenDinnerForEveryoneModal}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Household</span>
            </button>
          )}

          {onOpenFoodSafetyModal && (
            <button
              onClick={onOpenFoodSafetyModal}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Food Safety</span>
            </button>
          )}

          {onOpenSensorModal && (
            <button
              onClick={onOpenSensorModal}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
            >
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sensors</span>
            </button>
          )}

          {onOpenChefPersonaModal && (
            <button
              onClick={onOpenChefPersonaModal}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Personas</span>
            </button>
          )}

          {onOpenPantryChallengeModal && (
            <button
              onClick={onOpenPantryChallengeModal}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
            >
              <Trophy className="w-3.5 h-3.5 text-rose-400" />
              <span>Challenge</span>
            </button>
          )}

          {onOpenBudgetModeModal && (
            <button
              onClick={onOpenBudgetModeModal}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              <span>Budget Mode</span>
            </button>
          )}

          <button
            onClick={onOpenMemoryModal}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Memory</span>
          </button>

          <button
            onClick={onOpenReceiptModal}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Receipt AI</span>
          </button>

          <button
            onClick={onOpenSubstitutionsModal}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
          >
            <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
            <span>Substitutes</span>
          </button>

          <button
            onClick={onOpenIronChefModal}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Iron Chef</span>
          </button>

          <button
            onClick={onOpenARPlatingModal}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>AR Plating</span>
          </button>

          <button
            onClick={onOpenNeuroModal}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-xs rounded-lg whitespace-nowrap min-h-[36px]"
          >
            <Atom className="w-3.5 h-3.5 text-purple-400" />
            <span>Neuro & History</span>
          </button>
        </div>

        {/* Mobile Expanded Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/98 border-t border-slate-800 p-4 space-y-2 animate-in slide-in-from-top duration-200">
            <button
              onClick={() => { setActiveTab('recipes'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold ${
                activeTab === 'recipes' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                <span>Discovered Culinary Recipes</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('scan'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold ${
                activeTab === 'scan' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span>Fridge Scanner</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('molecular'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold ${
                activeTab === 'molecular' ? 'bg-teal-500 text-slate-950' : 'bg-slate-950 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-teal-400" />
                <span>Molecular VOC Lab</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('shopping'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold ${
                activeTab === 'shopping' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Shopping List</span>
              </div>
              {shoppingListCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-400 text-slate-950 font-bold">
                  {shoppingListCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('saved'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold ${
                activeTab === 'saved' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span>Saved Recipes</span>
              </div>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-800 text-emerald-400 font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 text-[10px] rounded-xl relative isolate transition-all ${
            activeTab === 'scan' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          {activeTab === 'scan' && (
            <motion.span
              layoutId="mobile-nav-pill"
              className="absolute inset-0 -z-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30"
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
          )}
          <Camera className="w-4 h-4" />
          <span>Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 text-[10px] rounded-xl relative isolate transition-all ${
            activeTab === 'recipes' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          {activeTab === 'recipes' && (
            <motion.span
              layoutId="mobile-nav-pill"
              className="absolute inset-0 -z-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30"
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
          )}
          <Utensils className="w-4 h-4" />
          <span>Recipes</span>
        </button>

        <button
          onClick={() => setActiveTab('molecular')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 text-[10px] rounded-xl transition-all ${
            activeTab === 'molecular' ? 'text-teal-400 font-bold bg-teal-500/10' : 'text-slate-400'
          }`}
        >
          <Atom className="w-4 h-4 text-teal-400" />
          <span>VOC Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('shopping')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 text-[10px] rounded-xl transition-all relative ${
            activeTab === 'shopping' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shopping</span>
          {shoppingListCount > 0 && (
            <span className="absolute top-1 right-2 px-1 text-[8px] bg-emerald-500 text-slate-950 font-extrabold rounded-full">
              {shoppingListCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenIronChefModal}
          className="flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 text-[10px] rounded-xl text-amber-400 font-bold"
        >
          <Trophy className="w-4 h-4" />
          <span>Iron Chef</span>
        </button>

        <button
          onClick={onOpenARPlatingModal}
          className="flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 text-[10px] rounded-xl text-amber-300 font-bold"
        >
          <Award className="w-4 h-4" />
          <span>AR Guide</span>
        </button>
      </div>
    </>
  );
};
