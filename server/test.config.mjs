import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["server/tests/**/*.test.mjs"],
    globals: true,
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
