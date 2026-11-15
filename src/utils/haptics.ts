/**
 * Touch feedback. The Android app uses the system haptics engine (crisp, respects the phone's
 * touch-feedback setting); browsers fall back to a short vibration where supported.
 */
type Strength = 'light' | 'medium' | 'success';

let native: Promise<typeof import('@capacitor/haptics') | null> | undefined;
const loadNative = () =>
  (native ??= (window as any).Capacitor?.isNativePlatform?.() ? import('@capacitor/haptics').catch(() => null) : Promise.resolve(null));

export const haptic = (strength: Strength = 'light') => {
  if (typeof window === 'undefined') return;
  void loadNative().then((mod) => {
    try {
      if (mod) {
        if (strength === 'success') void mod.Haptics.notification({ type: mod.NotificationType.Success });
        else void mod.Haptics.impact({ style: strength === 'medium' ? mod.ImpactStyle.Medium : mod.ImpactStyle.Light });
      } else {
        navigator.vibrate?.(strength === 'light' ? 6 : strength === 'medium' ? 14 : [10, 40, 18]);
      }
    } catch {}
  });
};
