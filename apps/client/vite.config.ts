// vite.config.js — 8888888888888888888888888^ refined & Canva-safe edition
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,

    // 👇 Allow both localhost + your live tunnel (for Canva OAuth)
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.replit.app',
      '.replit.dev',
      'genuineloveapi.loca.lt'  // 🌍 your tunnel host
    ],

    // Disable HMR to eliminate WebSocket errors in Replit iframe environment
    // Trade-off: Manual page refresh required, but achieves 888...^ zero-console-error perfection
    hmr: false,

    // Optional but recommended: auto-open preview & handle HTTPS proxies
    open: false,
    https: false,
  },
  preview: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'genuineloveapi.loca.lt'
    ],
  },
});