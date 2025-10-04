/**
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "rolldown-vite";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer()
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner()
          )
        ]
      : [])
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@shared": path.resolve(import.meta.dirname, "..", "shared"),
      "@assets": path.resolve(import.meta.dirname, "..", "attached_assets")
    }
  },
  root: ".",
  css: {
    transformer: "lightningcss",
    lightningcss: {
      cssModules: {
        dashedIdents: true
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext"
    }
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "..", "dist/public"),
    emptyOutDir: true,
    target: "esnext",
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "stripe-vendor": ["@stripe/react-stripe-js", "@stripe/stripe-js"],
          "tanstack-vendor": ["@tanstack/react-query"]
        }
      }
    },
    modulePreload: {
      polyfill: true
    },
    sourcemap: true,
    minify: "esbuild"
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
      clearScreen: false,
      logLevel: "info"
    }
  }
});
