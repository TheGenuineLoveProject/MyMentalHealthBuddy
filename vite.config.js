import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { visualizer } from "rollup-plugin-visualizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),

    visualizer({
      filename: './bundle-report.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
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

          // DISABLED:
          // Chart libraries should stay attached to lazy chart consumers.
          // Forcing vendor-charts created eager modulepreload behavior.
          //
          // if (
          //   id.includes('/chart.js/') ||
          //   id.includes('/react-chartjs-2/') ||
          //   id.includes('/recharts/') ||
          //   id.includes('/d3-')
          // ) {
          //   return 'vendor-charts';
          // }

          if (id.includes('/framer-motion/')) return 'vendor-motion';

          if (id.includes('/date-fns/') || id.includes('/dayjs/')) return 'vendor-date';

          if (id.includes('/canvas-confetti/')) return 'vendor-confetti';

          if (
            id.includes('/react-helmet-async/') ||
            id.includes('/wouter/')
          ) return 'vendor-router';

          if (
            id.includes('/zod/') ||
            id.includes('/react-hook-form/') ||
            id.includes('/@hookform/')
          ) return 'vendor-forms';

          if (id.includes('/pages/admin/')) {
            return 'admin-suite';
          }

          if (id.includes('/pages/tools/')) {
            return 'tools-suite';
          }

          if (id.includes('/pages/pathways/')) {
            return 'pathways-suite';
          }

          if (id.includes('/pages/settings/')) {
            return 'settings-suite';
          }

          if (id.includes('/pages/account/')) {
            return 'account-suite';
          }

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
