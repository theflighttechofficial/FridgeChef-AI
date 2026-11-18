import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // '/' for the server and the Android app; '/FridgeChef-AI/' for the GitHub Pages demo
    base: process.env.VITE_BASE || '/',
    plugins: [
      react(),
      tailwindcss(),
      {
        // The server fills in %SITE_URL% per request; a static build has to do it here
        name: 'static-site-url',
        transformIndexHtml(html: string) {
          const site = process.env.VITE_SITE_URL;
          return site ? html.replaceAll('%SITE_URL%', site.replace(/\/+$/, '')) : html;
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Libraries change rarely: keep them in their own files so an app update does not re-download them
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return;
            if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
            if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
