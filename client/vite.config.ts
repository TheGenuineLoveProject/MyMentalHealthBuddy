import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "my-mental-health-buddy.replit.app",
      "*.spock.replit.dev",
    ],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      }
    }
  }
});