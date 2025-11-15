import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    // Use Vite's built-in vendor chunking strategy - eliminates empty chunks
    splitVendorChunkPlugin()
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
    hmr: {
      // In Replit, Vite runs as middleware through Express on port 5000
      // HMR WebSocket should connect to the same host/port as the page
      port: 5000,
      timeout: 10000, // Increase timeout for cloud environment
      overlay: false // Disable error overlay to reduce noise in dev
    }
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
        // Let Vite's splitVendorChunkPlugin handle ALL chunking automatically
        // No manual chunks - eliminates empty chunk artifacts
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        entryFileNames: 'assets/[name]-[hash].js'
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
