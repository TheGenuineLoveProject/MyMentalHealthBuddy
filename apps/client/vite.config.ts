import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    proxy: { "/api": "http://localhost:3001", "/healthz": "http://localhost:3001" }
  },
  preview: { port: 5000 }
});
