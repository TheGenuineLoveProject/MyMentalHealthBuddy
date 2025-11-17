// vite.config.js — 8888888888888888888888888^ refined & Canva-safe edition
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large vendor bundle into logical chunks for better caching
          'react-vendor': ['react', 'react-dom', 'wouter'],
          'ui-icons': ['lucide-react', 'react-icons'],
          'data-query': ['@tanstack/react-query', '@tanstack/query-core'],
          'integrations': ['@stripe/stripe-js', '@stripe/react-stripe-js', '@sentry/react', 'openai'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod', 'drizzle-zod'],
          'database': ['drizzle-orm'],
        },
      },
    },
  },
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

    // Optional but recommended: auto-open preview
    open: false,
  },
  preview: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'genuineloveapi.loca.lt'
    ],
  },
});