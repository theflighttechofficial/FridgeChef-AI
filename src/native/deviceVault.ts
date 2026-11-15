/**
 * Device vault (Android app only). The WebView's storage is erased when the app is removed, so
 * the account and everything saved with it is also copied into the app's own preferences, which
 * Android includes in its backup. On a fresh install the copy is put back before the app starts:
 * on the same phone the person is signed in straight away and carries on with their data.
 *
 * Nothing is sent to any FridgeChef server. Restore after an uninstall depends on Android backup
 * being switched on for the phone; an update installed over the app keeps everything regardless.
 */
import { ACCOUNT_KEY, VaultSnapshot, collectVaultData, planRestore } from '../state/vaultPlan';

const GROUP = 'FridgeChefVault';
const SNAPSHOT_KEY = 'snapshot.v1';
export const RESTORED_FLAG = 'fridgechef.restoredFor';
const STATUS_KEY = 'fridgechef.vaultStatus';

const plugins = async () => {
  const [{ Preferences }, { Device }] = await Promise.all([import('@capacitor/preferences'), import('@capacitor/device')]);
  await Preferences.configure({ group: GROUP });
  return { Preferences, Device };
};

const deviceIdOf = async (Device: Awaited<ReturnType<typeof plugins>>['Device']) => {
  try {
    return (await Device.getId()).identifier || '';
  } catch {
    return '';
  }
};

/** Run before the app loads: put a saved copy back when this install has no account yet. */
export const restoreVault = async () => {
  try {
    const { Preferences, Device } = await plugins();
    const [{ value }, deviceId] = await Promise.all([Preferences.get({ key: SNAPSHOT_KEY }), deviceIdOf(Device)]);
    const snapshot: VaultSnapshot | null = value ? JSON.parse(value) : null;
    const plan = planRestore(!!localStorage.getItem(ACCOUNT_KEY), snapshot, deviceId);
    if (!plan) return;
    for (const [k, v] of Object.entries(plan.writes)) localStorage.setItem(k, v);
    if (plan.autoSignIn) sessionStorage.setItem(RESTORED_FLAG, plan.name);
  } catch {
    // No copy, or it could not be read: start as a new install
  }
};

let timer: ReturnType<typeof setTimeout> | undefined;

const save = async () => {
  try {
    const { Preferences, Device } = await plugins();
    const entries: [string, string][] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k !== STATUS_KEY) entries.push([k, localStorage.getItem(k) || '']);
    }
    const data = collectVaultData(entries);
    // A deleted account must not come back after a reinstall
    if (!data[ACCOUNT_KEY]) {
      await Preferences.remove({ key: SNAPSHOT_KEY });
      nativeSet.call(localStorage, STATUS_KEY, '');
      return;
    }
    const snapshot: VaultSnapshot = { version: 1, deviceId: await deviceIdOf(Device), savedAt: new Date().toISOString(), data };
    await Preferences.set({ key: SNAPSHOT_KEY, value: JSON.stringify(snapshot) });
    nativeSet.call(localStorage, STATUS_KEY, snapshot.savedAt);
  } catch {}
};

const nativeSet = Storage.prototype.setItem;

/** Keep the copy up to date: every change to the app's storage schedules one save. */
export const startVaultMirror = () => {
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(save, 1500);
  };
  const { removeItem, clear } = Storage.prototype;
  Storage.prototype.setItem = function (key: string, value: string) {
    nativeSet.call(this, key, value);
    if (this === localStorage) schedule();
  };
  Storage.prototype.removeItem = function (key: string) {
    removeItem.call(this, key);
    if (this === localStorage) schedule();
  };
  Storage.prototype.clear = function () {
    clear.call(this);
    if (this === localStorage) schedule();
  };
  // Leaving the app is the last chance to save before it may be removed
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      clearTimeout(timer);
      void save();
    }
  });
  schedule();
};

/** When the copy was last saved (ISO date), or '' when there is none. Empty on the website. */
export const vaultSavedAt = () => {
  try {
    return localStorage.getItem(STATUS_KEY) || '';
  } catch {
    return '';
  }
};
