import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }) as any,
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: false,
    watch: { usePolling: true },
    hmr: {
      overlay: true
    }
  },
  preview: { port: 4173 },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, '../../attached_assets')
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['wouter'],
          'query': ['@tanstack/react-query'],
          'ui': ['lucide-react']
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff2?|ttf|otf|eot/i.test(ext || '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wouter', '@tanstack/react-query', 'lucide-react'],
    exclude: [],
    esbuildOptions: {
      target: 'esnext',
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  json: {
    stringify: true
  }
});
