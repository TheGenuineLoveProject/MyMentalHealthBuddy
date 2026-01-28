import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  test: {
    setupFiles: ["./tests/vitest.setup.mjs"],
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    sequence: { concurrent: false },
  },

  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      react: "react",
      "react-dom": "react-dom",
    },
  },
});