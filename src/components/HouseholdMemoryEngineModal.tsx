import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Users,
  Flame,
  Clock,
  Heart,
  ThumbsDown,
  Sparkles,
  ShieldAlert,
  Save,
  Plus,
  Trash2,
  X,
  ChefHat,
  Zap,
  Info
} from 'lucide-react';
import { HouseholdMemoryProfile, HouseholdMember, Ingredient } from '../types';

interface HouseholdMemoryEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoryProfile: HouseholdMemoryProfile;
  onUpdateProfile: (updated: HouseholdMemoryProfile) => void;
  currentIngredients: Ingredient[];
}

export const HouseholdMemoryEngineModal: React.FC<HouseholdMemoryEngineModalProps> = ({
  isOpen,
  onClose,
  memoryProfile,
  onUpdateProfile,
  currentIngredients,
}) => {
  const [profile, setProfile] = useState<HouseholdMemoryProfile>(memoryProfile);
  const [activeTab, setActiveTab] = useState<'members' | 'preferences' | 'insights'>('members');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(profile.members[0]?.id || '');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [liveInsight, setLiveInsight] = useState<string>(
    "You usually prefer spicy South Indian breakfasts and you haven't used the spinach you bought 4 days ago."
  );

  const activeMember = profile.members.find((m) => m.id === selectedMemberId) || profile.members[0];

  const handleUpdateMember = (id: string, updates: Partial<HouseholdMember>) => {
    const updatedMembers = profile.members.map((m) => (m.id === id ? { ...m, ...updates } : m));
    const nextProfile = { ...profile, members: updatedMembers };
    setProfile(nextProfile);
    onUpdateProfile(nextProfile);
  };

  const handleGenerateFreshInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const res = await fetch('/api/household-memory-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memoryProfile: profile,
          currentIngredients: currentIngredients,
        }),
      });
      const data = await res.json();
      if (data.conversationalGreeting) {
        setLiveInsight(data.conversationalGreeting);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">FridgeChef Memory Engine</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                  PERSISTENT HOUSEHOLD MODEL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transforms AI from a generic chatbot into your family's personal culinary model.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient AI Proactive Insight Callout */}
        <div className="px-6 py-3.5 bg-purple-950/40 border-b border-purple-900/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-purple-200 italic">
              "{liveInsight}"
            </p>
          </div>
          <button
            onClick={handleGenerateFreshInsight}
            disabled={isGeneratingInsight}
            className="shrink-0 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
          >
            <Zap className={`w-3.5 h-3.5 ${isGeneratingInsight ? 'animate-spin' : ''}`} />
            <span>{isGeneratingInsight ? 'Synthesizing...' : 'Re-Sync Memory'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-800 flex gap-4 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'members'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Household Members ({profile.members.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'preferences'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Appliances & Cuisines</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'insights'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Learned Memory Graph</span>
          </button>
        </div>

        {/* Tab 1: Household Members */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Member Selector List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Members</span>
                  <span className="text-[10px] text-purple-400 font-mono">3 PROFILES</span>
                </div>
                {profile.members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMemberId(member.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedMemberId === member.id
                        ? 'bg-purple-950/40 border-purple-500/50 text-white shadow-md'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <strong className="block text-xs font-bold">{member.name}</strong>
                      <span className="text-[10px] text-slate-400">{member.role} • Spice lvl {member.spiceTolerance}/5</span>
                    </div>
                    {member.allergens.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-mono border border-rose-500/30">
                        {member.allergens.length} Alert
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Selected Member Edit Form */}
              {activeMember && (
                <div className="md:col-span-2 bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">{activeMember.name}</h4>
                      <p className="text-xs text-slate-400">{activeMember.notes || 'No custom notes'}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 font-bold text-slate-300">
                      {activeMember.role}
                    </span>
                  </div>

                  {/* Spice Tolerance Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>Spice Tolerance</span>
                      </label>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        Level {activeMember.spiceTolerance} of 5 ({['Mild', 'Gentle', 'Medium', 'Hot', 'Explosive'][activeMember.spiceTolerance - 1]})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={activeMember.spiceTolerance}
                      onChange={(e) => handleUpdateMember(activeMember.id, { spiceTolerance: parseInt(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* Disliked Ingredients */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                      <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                      <span>Disliked Ingredients (AI will avoid/substitute)</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {activeMember.dislikedIngredients.map((d, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-1"
                        >
                          <span>{d}</span>
                          <button
                            onClick={() => {
                              const updated = activeMember.dislikedIngredients.filter((_, i) => i !== idx);
                              handleUpdateMember(activeMember.id, { dislikedIngredients: updated });
                            }}
                            className="text-rose-400 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Allergens & Medical Dietary Tags */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <span>Allergens & Intolerances</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {activeMember.allergens.length === 0 ? (
                        <span className="text-xs text-slate-500 italic">No allergens recorded</span>
                      ) : (
                        activeMember.allergens.map((a, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
                          >
                            ⚠️ {a}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Appliances & Cuisines */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                    Favorite Cuisines
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {profile.favoriteCuisines.map((c, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-xl text-xs font-bold border border-purple-500/30">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                    Preferred Cooking Appliances
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredAppliances.map((app, i) => (
                      <span key={i} className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-xl text-xs font-bold border border-teal-500/30">
                        ⚡ {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Typical Meal Times */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Typical Household Meal Times</span>
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Breakfast</span>
                    <strong className="text-sm font-mono text-white">{profile.typicalMealTimes.breakfast}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Lunch</span>
                    <strong className="text-sm font-mono text-white">{profile.typicalMealTimes.lunch}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Dinner</span>
                    <strong className="text-sm font-mono text-white">{profile.typicalMealTimes.dinner}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Learned Memory Graph */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/30 rounded-2xl border border-purple-500/30 space-y-3">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Learned Behavioral Memory Graph</span>
                </span>
                <div className="space-y-2">
                  {profile.learnedInsights.map((insight, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-purple-400 font-bold">#{idx + 1}</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequently Purchased Ingredients */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Frequently Purchased Household Staples
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.frequentlyPurchased.map((item, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-lg text-xs border border-slate-800">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/25 hover:opacity-90 transition-all"
          >
            Save & Sync Personal Model
          </button>
        </div>
      </motion.div>
    </div>
  );
};
