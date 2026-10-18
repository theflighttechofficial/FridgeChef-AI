import type { CapacitorConfig } from '@capacitor/cli';

// Android app: the Vite build in dist/ is bundled into the APK. Cloud AI features call the
// FridgeChef server set by VITE_API_BASE_URL at build time (or the Server URL in Settings);
// without one the app runs on the person's own API key and the on-device recipe model.
const config: CapacitorConfig = {
  appId: 'ai.fridgechef.app',
  appName: 'FridgeChef',
  webDir: 'dist',
  android: {
    backgroundColor: '#0f1412',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 600,
      backgroundColor: '#0f1412',
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: true,
      style: 'DARK',
    },
  },
};

export default config;
