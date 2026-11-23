import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["tests/unit/ai-client-timeout.test.mjs"], environment: "node" },
});
