import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Bell, Check, ArrowRight, AlertTriangle, Snowflake, Sparkles, X } from 'lucide-react';
import { Ingredient } from '../types';

interface PantryHealthNotificationBannerProps {
  ingredients: Ingredient[];
  onStartCookingFromAlert?: () => void;
}

export const PantryHealthNotificationBanner: React.FC<PantryHealthNotificationBannerProps> = ({
  ingredients,
  onStartCookingFromAlert,
}) => {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  // Filter ingredients expiring soon (freshness === 'Use Soon')
  const expiringItems = ingredients.filter(
    (item) => item.freshness === 'Use Soon'
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setPermissionGranted(true);
      }
    }
  }, []);

  const handleEnableBrowserNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setPermissionGranted(true);
        new Notification('FridgeChef AI • Pantry Health Online', {
          body: `Monitoring ${expiringItems.length} ingredients nearing expiration date.`,
          icon: '/favicon.ico',
        });
      }
    }
  };

  if (expiringItems.length === 0 || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="w-full bg-gradient-to-r from-rose-950/90 via-slate-900/95 to-amber-950/90 border border-rose-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Glow ambient background ring */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-white">
                  Pantry Health Alert: {expiringItems.length} Ingredient{expiringItems.length > 1 ? 's' : ''} Expiring Soon
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-extrabold border border-rose-500/30">
                  ACTION REQUIRED
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1">
                <strong className="text-rose-300">
                  {expiringItems.map((i) => i.name).slice(0, 3).join(', ')}
                  {expiringItems.length > 3 ? ` +${expiringItems.length - 3} more` : ''}
                </strong>{' '}
                will spoil within 48-72 hours. Cook or freeze immediately.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {!permissionGranted && (
              <button
                onClick={handleEnableBrowserNotifications}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                title="Enable browser system push alerts"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Allow Push</span>
              </button>
            )}

            {onStartCookingFromAlert && (
              <button
                onClick={onStartCookingFromAlert}
                className="px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-xs rounded-xl hover:opacity-90 transition-all shadow-lg shadow-rose-500/25 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Cook Recipes Now</span>
              </button>
            )}

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
