/**
 * Isolated vitest config for client/src/lumi-conversation/tests/.
 *
 * Same pattern as v5.8.51 (checkin-flow), v5.8.52 (companion-voice),
 * v5.8.53 (calm-checkin): bypasses the project-level vitest setup which
 * spins up an Express server on port 5000 and conflicts with the running
 * dev workflow.
 *
 * Run from repo root:
 *   npx vitest run --config client/src/lumi-conversation/tests/vitest.config.mjs
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
