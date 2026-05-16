import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    testTimeout: 10000,
    sequence: { concurrent: false },
    // No setupFiles — this module is fully standalone (no Express needed).
  },
});
