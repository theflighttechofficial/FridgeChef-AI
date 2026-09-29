import React, { useState } from 'react';
import { Users, RefreshCw, CheckCircle2, ShieldCheck, Bell } from 'lucide-react';

export const FamilyPantrySyncWidget: React.FC = () => {
  const [householdName, setHouseholdName] = useState('Greenwood Apartment Household');
  const [syncStatus, setSyncStatus] = useState('SYNCED LIVE');

  const members = [
    { name: 'Alex (You)', role: 'Primary Chef', status: 'Online' },
    { name: 'Priya', role: 'Roommate', status: 'Online (Scanned Milk 10m ago)' },
    { name: 'Sam', role: 'Roommate', status: 'Updated Pantry' },
  ];

  const recentLogs = [
    { user: 'Priya', action: 'Added 1L Organic Whole Milk', time: '10 mins ago' },
    { user: 'Sam', action: 'Used last 2 Eggs', time: '1 hour ago' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">Multi-User Family Pantry Sync</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                {syncStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Shared household digital pantry. Real-time updates prevent double-buying and sync shopping lists across all phones.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Connected Household Members (3):</span>
          <div className="space-y-1.5">
            {members.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="font-bold text-white">{m.name}</span>
                <span className="text-[10px] text-teal-400 font-mono">{m.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Recent Household Pantry Logs:</span>
          <div className="space-y-1.5">
            {recentLogs.map((log, idx) => (
              <div key={idx} className="text-[11px] text-slate-300 flex items-center justify-between">
                <span><strong className="text-teal-400">{log.user}:</strong> {log.action}</span>
                <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
