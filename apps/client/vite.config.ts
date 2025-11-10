// vite.config.js — 8888888888888888888888888^ refined & Canva-safe edition
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,

    // 👇 Allow both localhost + your live tunnel (for Canva OAuth)
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'genuineloveapi.loca.lt'  // 🌍 your tunnel host
    ],

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