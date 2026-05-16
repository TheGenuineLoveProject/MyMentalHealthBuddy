/**
 * Integration smoke tests · isolated vitest config.
 *
 * Same isolation pattern as the per-module configs (lumi-circadian,
 * lumi-rituals, lumi-scenes, etc.). Bypasses the project-level vitest
 * setup which would spin up an Express server on port 5000 and conflict
 * with the running dev workflow.
 *
 * Run from repo root:
 *   npx vitest run --config client/src/lumi-integration/tests/vitest.config.mjs
 */

import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    include: [path.resolve(__dirname, "**/*.test.{ts,tsx}")],
    environment: "node",
    globals: false,
    setupFiles: [],
    reporters: "default",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../"),
      "@/design-system": path.resolve(__dirname, "../../design-system"),
    },
  },
});
