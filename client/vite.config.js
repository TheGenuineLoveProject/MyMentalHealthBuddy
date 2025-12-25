import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@assets": path.resolve(import.meta.dirname, "../attached_assets"),
    }
  },

    server: {
      port: 5173,
      strictPort: true,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('wouter') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
            if (id.includes('zod')) {
              return 'vendor-validation';
            }
            if (id.includes('@sentry')) {
              return 'vendor-sentry';
            }
          }
        },
      },
    },
  }
});