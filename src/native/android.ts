/**
 * Android-only glue (Capacitor). Loaded lazily so the website never downloads it.
 *   - hardware back button: closes the top sheet or returns to the Fridge tab, then leaves the app
 *   - edge-to-edge status bar matching the app surface
 */
export const initAndroid = async () => {
  const { Capacitor } = await import('@capacitor/core');
  if (!Capacitor.isNativePlatform()) return;
  const [{ App }, { StatusBar, Style }, { SplashScreen }] = await Promise.all([
    import('@capacitor/app'),
    import('@capacitor/status-bar'),
    import('@capacitor/splash-screen'),
  ]);
  document.documentElement.classList.add('native-app');
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
  SplashScreen.hide().catch(() => {});

  App.addListener('backButton', () => {
    // Listeners call preventDefault() when they handled the back press
    const event = new Event('fridgechef:back', { cancelable: true });
    if (window.dispatchEvent(event)) App.minimizeApp();
  });
};
