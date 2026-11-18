/**
 * Entry point. In the Android app a copy of the account that survived a reinstall is put back
 * first, because the rest of the app reads its saved state as soon as it loads.
 */
import './index.css';

const start = async () => {
  if ((window as any).Capacitor?.isNativePlatform?.()) {
    const vault = await import('./native/deviceVault');
    await vault.restoreVault();
    vault.startVaultMirror();
  } else {
    // Ask the browser not to clear this site's data when storage runs low
    navigator.storage?.persist?.().catch(() => {});
  }
  await import('./boot');
};

void start();
