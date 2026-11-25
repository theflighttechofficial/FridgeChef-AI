import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ChevronRight, Zap } from 'lucide-react';
import { HouseholdMemoryProfile } from '../types';

interface HouseholdMemoryBannerProps {
  memoryProfile: HouseholdMemoryProfile;
  onOpenMemoryModal: () => void;
  insightText?: string;
}

export const HouseholdMemoryBanner: React.FC<HouseholdMemoryBannerProps> = ({
  memoryProfile,
  onOpenMemoryModal,
  insightText,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-surface-high border border-teal-500/30 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-xl relative overflow-hidden group cursor-pointer"
      onClick={onOpenMemoryModal}
    >
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-teal-500/5 blur-xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 shrink-0">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-teal-300">
                Personal Culinary Model
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
                {memoryProfile.members.length} {memoryProfile.members.length === 1 ? 'PROFILE' : 'PROFILES'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
              {insightText}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenMemoryModal();
          }}
          className="self-end sm:self-center shrink-0 px-3.5 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>Household Memory</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
