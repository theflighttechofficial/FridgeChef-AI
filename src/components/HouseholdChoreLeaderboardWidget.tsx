import React, { useState } from 'react';
import { Users, Award, Trophy, CheckCircle2, Plus, Sparkles } from 'lucide-react';

interface Member {
  name: string;
  role: string;
  points: number;
  completedTasks: number;
  avatar: string;
}

const INITIAL_MEMBERS: Member[] = [
  { name: 'Chef Alex', role: 'Head Prep & Waste Arbitrage', points: 420, completedTasks: 14, avatar: '👨‍🍳' },
  { name: 'Sam', role: 'Sous Chef & Pantry Auditor', points: 310, completedTasks: 9, avatar: '👩‍🍳' },
  { name: 'Jordan', role: 'Dish & Tupperware Manager', points: 260, completedTasks: 8, avatar: '🧑‍🍳' },
];

export const HouseholdChoreLeaderboardWidget: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

  const handleTaskComplete = (index: number) => {
    setMembers((prev) =>
      prev.map((m, i) =>
        i === index
          ? { ...m, points: m.points + 25, completedTasks: m.completedTasks + 1 }
          : m
      )
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Kitchen Crew & Household Chore Leaderboard</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                HOUSEHOLD GAMIFICATION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Delegates fridge audits, batch preps, and meal logs across housemates with reward points.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {members.map((m, idx) => (
          <div
            key={m.name}
            className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{m.avatar}</span>
                <div>
                  <h4 className="font-extrabold text-white">{m.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{m.role}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">#{idx + 1}</span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-slate-300 font-mono">
              <span>{m.completedTasks} tasks</span>
              <span className="font-extrabold text-amber-400">{m.points} pts</span>
            </div>

            <button
              onClick={() => handleTaskComplete(idx)}
              className="w-full py-1.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-bold rounded-lg text-[11px] transition-all flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Log Task (+25 pts)</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
