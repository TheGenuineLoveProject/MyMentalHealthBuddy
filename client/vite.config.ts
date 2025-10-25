/**;
 ;© 2025 Aaliyah Draws Art LLC. All rights reserved.
 ;Unauthorized copying or distribution of this file is prohibited.
 ;Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Replit-safe fallback import (prevents missing module errors)
const safeImport = async (pkg: string) => {
  try {
    return await import(pkg);
  } catch {
    console.warn(`⚠️ Optional Replit plugin `${pkg}` not found, skipping...`);
    return null;
  }
};

export default defineConfig(async () => {
  await safeImport("@replit/vite-plugin-cartographer");
  await safeImport("@replit/vite-plugin-dev-banner");

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true
    },
    resolve: {
      alias: {
        "@": "/src"
      }
    }
  };
});
