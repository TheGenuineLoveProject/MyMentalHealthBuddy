import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "."),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        manualChunks: (id) => {
          // Core vendor chunks
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // Routing
            if (id.includes('wouter')) {
              return 'vendor-router';
            }
            // State management & queries
            if (id.includes('@tanstack') || id.includes('react-query')) {
              return 'vendor-query';
            }
            // Stripe
            if (id.includes('@stripe') || id.includes('stripe')) {
              return 'vendor-stripe';
            }
            // Icons
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'vendor-icons';
            }
            // Other vendors
            return 'vendor';
          }
          
          // Component chunks
          if (id.includes('/components/ui/')) {
            return 'components-ui';
          }
          
          // Lib chunks
          if (id.includes('/lib/')) {
            return 'lib';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').slice(-1)[0] : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: 'assets/[name]-[hash].[ext]',
        entryFileNames: 'assets/[name]-[hash].js'
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "../attached_assets")
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wouter'],
    exclude: ['@tanstack/react-query']
  }
});