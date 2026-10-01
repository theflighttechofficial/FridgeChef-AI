import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Camera, ShoppingBag, Bookmark, ChefHat, Atom, Trophy, Award, Menu, X, Brain, Receipt, FlaskConical, Activity, Globe, Thermometer, ShieldAlert, Users, Mic, GitFork, Bot, PartyPopper, DollarSign, Zap } from 'lucide-react';
import { VoiceNavigationController } from './VoiceNavigationController';
import { ToolsMenu, ToolsGrid, ToolItem } from './ToolsMenu';
import { Logo } from './Logo';

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

  // Every secondary feature lives in the "AI Tools" dropdown so the bar keeps only the 5 core tabs
  const tools: ToolItem[] = [
    { group: 'AI Agents', label: 'Culinary OS', description: 'Autonomous 12-stage meal planning agent', icon: Bot, onSelect: onOpenAutonomousAgentModal, highlight: true },
    { group: 'AI Agents', label: 'Voice Kitchen', description: 'Talk to your kitchen assistant hands-free', icon: Mic, onSelect: onOpenKitchenVoiceModal },
    { group: 'AI Agents', label: 'Knowledge Graph', description: 'Flavor compounds and recipe connections', icon: GitFork, onSelect: onOpenKnowledgeGraphModal },
    { group: 'AI Agents', label: 'Taste Model', description: 'Learns your taste preferences over time', icon: Brain, onSelect: onOpenTasteModal },
    { group: 'AI Agents', label: 'Household Memory', description: 'What your household likes and avoids', icon: Brain, onSelect: onOpenMemoryModal },
    { group: 'AI Agents', label: 'Neuro-Gastronomy', description: 'Mood-based dishes and historic time machine', icon: Atom, onSelect: onOpenNeuroModal },
    { group: 'Cook & Create', label: 'Chef Personas', description: 'Recipes in 10 master chef styles', icon: ChefHat, onSelect: onOpenChefPersonaModal },
    { group: 'Cook & Create', label: 'Pantry Challenge', description: 'Cook with only what you have', icon: Trophy, onSelect: onOpenPantryChallengeModal },
    { group: 'Cook & Create', label: 'Iron Chef', description: 'Mystery box cooking game', icon: Trophy, onSelect: onOpenIronChefModal },
    { group: 'Cook & Create', label: 'Substitutes', description: 'Swap any ingredient intelligently', icon: FlaskConical, onSelect: onOpenSubstitutionsModal },
    { group: 'Cook & Create', label: 'AR Plating', description: 'Michelin-style plating guide', icon: Award, onSelect: onOpenARPlatingModal },
    { group: 'Cook & Create', label: 'Plate Vision', description: 'Score a photo of your plated dish', icon: Camera, onSelect: onOpenPlateAnalysisModal },
    { group: 'Cook & Create', label: 'Event Catering', description: 'Plan menus for guests and parties', icon: PartyPopper, onSelect: onOpenCateringModal },
    { group: 'Cook & Create', label: 'Dinner for Everyone', description: 'One meal for every household diet', icon: Users, onSelect: onOpenDinnerForEveryoneModal },
    { group: 'Health & Safety', label: 'Nutrition Dashboard', description: 'Personal macro and nutrient tracking', icon: Activity, onSelect: onOpenNutritionModal },
    { group: 'Health & Safety', label: 'Food Safety', description: 'HACCP windows and spoilage risk', icon: ShieldAlert, onSelect: onOpenFoodSafetyModal },
    { group: 'Health & Safety', label: 'Fridge Sensors', description: 'Temperature, humidity, door and VOC', icon: Thermometer, onSelect: onOpenSensorModal },
    { group: 'Health & Safety', label: 'Carbon Calculator', description: 'Food waste carbon and water impact', icon: Globe, onSelect: onOpenCarbonModal },
    { group: 'Money & Pantry', label: 'Budget Mode', description: 'Grocery price intelligence', icon: Receipt, onSelect: onOpenBudgetModeModal },
    { group: 'Money & Pantry', label: 'Pantry Financials', description: 'Where your food money goes', icon: Receipt, onSelect: onOpenFinancialModal },
    { group: 'Money & Pantry', label: 'Receipt to Pantry', description: 'Scan a receipt into your fridge', icon: Receipt, onSelect: onOpenReceiptModal },
  ];

  // Let the vertical mouse wheel scroll the horizontal tab rows while the pointer is over them
  const desktopNavScrollRef = useHorizontalWheelScroll<HTMLDivElement>();

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
              <Logo />
            </button>

            {/* Middle Horizontally Scrollable Navigation Container (with custom scrollbar) */}
            <div ref={desktopNavScrollRef} className="hidden md:flex items-center justify-center overflow-x-auto no-scrollbar py-2 px-1 flex-1 min-w-0 mx-2">
              {/* Zone 2: Navigation Tabs */}
              <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 shrink-0">
                <button
                  onClick={() => setActiveTab('scan')}
                  title="Fridge Scanner"
                  aria-label="Fridge Scanner"
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
                  <span className="hidden lg:inline">Scanner</span>
                </button>

                <button
                  onClick={() => setActiveTab('recipes')}
                  title="Recipe Discovery"
                  aria-label="Recipe Discovery"
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
                  <span className="hidden lg:inline">Recipes</span>
                </button>

                <button
                  onClick={() => setActiveTab('molecular')}
                  title="Molecular VOC Lab"
                  aria-label="Molecular VOC Lab"
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
                  <span className="hidden lg:inline">Lab</span>
                </button>

                <button
                  onClick={() => setActiveTab('shopping')}
                  title="Shopping List"
                  aria-label="Shopping List"
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
                  <span className="hidden lg:inline">Shopping</span>
                  {shoppingListCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-400 text-slate-950 font-bold">
                      {shoppingListCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  title="Saved Recipes"
                  aria-label="Saved Recipes"
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
                  <span className="hidden lg:inline">Saved</span>
                  {savedCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-emerald-400 font-bold">
                      {savedCount}
                    </span>
                  )}
                </button>
              </nav>

            </div>

            {/* Right Action Trigger Bar */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:block">
                <ToolsMenu tools={tools} />
              </div>
              <div className="hidden xl:block">
                <VoiceNavigationController activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
              <button
                onClick={onQuickScanClick}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95 whitespace-nowrap min-h-[38px]"
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
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

        {/* Mobile Expanded Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/98 border-t border-slate-800 p-4 space-y-2 max-h-[calc(100dvh-8rem)] overflow-y-auto">
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

            <div className="pt-4 mt-2 border-t border-slate-800">
              <ToolsGrid tools={tools} onPicked={() => setMobileMenuOpen(false)} />
            </div>
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
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 text-[10px] rounded-xl relative isolate transition-all ${
            activeTab === 'saved' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          {activeTab === 'saved' && (
            <motion.span
              layoutId="mobile-nav-pill"
              className="absolute inset-0 -z-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30"
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
          )}
          <Bookmark className="w-4 h-4" />
          <span>Saved</span>
          {savedCount > 0 && (
            <span className="absolute top-1 right-2 px-1 text-[8px] bg-emerald-500 text-slate-950 font-extrabold rounded-full">
              {savedCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
};
