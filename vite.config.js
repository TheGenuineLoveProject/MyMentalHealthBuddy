import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  root: resolve(__dirname, 'client'),
  build: {
    outDir: resolve(__dirname, 'client/dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'client/index.html'),
      output: {
        format: 'es',
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/@tanstack/react-query/')) return 'vendor-query';
          if (id.includes('/react-dom/') || id.includes('/react/')) return 'vendor-react';
          if (id.includes('/lucide-react/')) return 'vendor-lucide';
          if (id.includes('/react-icons/')) return 'vendor-icons';
          if (id.includes('/chart.js/') || id.includes('/react-chartjs-2/')) return 'vendor-charts';
          if (id.includes('/canvas-confetti/')) return 'vendor-confetti';
          if (id.includes('/react-helmet-async/') || id.includes('/wouter/')) return 'vendor-router';
          if (id.includes('/zod/') || id.includes('/react-hook-form/') || id.includes('/@hookform/')) return 'vendor-forms';
          return undefined;
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'client/src'),
      '@shared': resolve(__dirname, 'shared'),
      '@assets': resolve(__dirname, 'attached_assets')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query']
  }
});
