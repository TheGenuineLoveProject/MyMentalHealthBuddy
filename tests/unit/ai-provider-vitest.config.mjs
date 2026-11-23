import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    dedupe: ["openai"],
    alias: {
      "@provider-under-test": process.env.MMHB_AI_PROVIDER_SOURCE || fileURLToPath(new URL("../../server/ai/provider.mjs", import.meta.url)),
    },
  },
  test: { include: ["tests/unit/ai-provider-runtime.test.mjs"], environment: "node" },
});
