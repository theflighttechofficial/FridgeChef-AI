import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installApiClient } from './ai/apiClient';
import { initDynamicColor } from './theme/dynamicColor';
import { migrateLegacyUserData } from './state/userData';

migrateLegacyUserData();
installApiClient();
initDynamicColor();
if ((window as any).Capacitor) import('./native/android').then((m) => m.initAndroid());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Keep the launch screen up briefly so the brand is readable, then fade it out
const splash = document.getElementById('boot-splash');
if (splash && splash.style.display === 'flex') {
  const shownFor = Date.now() - ((window as any).__bootSplashAt || Date.now());
  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 400);
  }, Math.max(0, 1400 - shownFor));
}
