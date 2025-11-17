import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    // Manual chunking for optimal vendor bundle splitting (888...^ optimization)
  ],
  root: path.resolve(__dirname, "."),
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'my-mental-health-buddy.replit.app',
      '.replit.app',
      '.replit.dev',
      'localhost'
    ],
    // Disable HMR to eliminate WebSocket errors in Replit iframe environment
    // Trade-off: Manual page refresh required, but achieves 888...^ zero-console-error perfection
    hmr: false
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: true,
    // Optimize chunk size thresholds
    chunkSizeWarningLimit: 600, // Alert for chunks >600KB
    reportCompressedSize: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        entryFileNames: 'assets/[name]-[hash].js',
        // Manual chunking to split large vendor bundle - simplified to avoid breaking internal references
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Lucide icons - large library, can be safely split
            if (id.includes('lucide-react')) {
              return 'ui-icons';
            }
            // TanStack Query - self-contained
            if (id.includes('@tanstack')) {
              return 'data-query';
            }
            // Sentry - large monitoring library
            if (id.includes('@sentry')) {
              return 'monitoring';
            }
            // All other vendor code stays together to preserve internal dependencies
            return 'vendor';
          }
        }
      }
      // Use Vite's default treeshake settings - custom settings were too aggressive
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
      "@shared": path.resolve(__dirname, "../shared")
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wouter'],
    exclude: ['@tanstack/react-query']
  }
});
