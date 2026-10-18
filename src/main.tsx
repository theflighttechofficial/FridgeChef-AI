import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installApiClient } from './ai/apiClient';
import { initDynamicColor } from './theme/dynamicColor';

installApiClient();
initDynamicColor();
if ((window as any).Capacitor) import('./native/android').then((m) => m.initAndroid());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
