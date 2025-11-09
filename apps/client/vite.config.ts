import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".",
  build: { outDir: "dist" },
  plugins: [react()],
  server: { port: 5173 } // Use 5173 to avoid conflict when running standalone (Express uses 5000)
});
