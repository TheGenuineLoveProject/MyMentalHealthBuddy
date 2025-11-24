import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@ui": "/src/components/ui",
      "@layout": "/src/components/layout",
      "@lib": "/src/lib",
    },
  },
  server: {
    host: true,
    strictPort: false,
    port: 5173,
    allowedHosts: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});