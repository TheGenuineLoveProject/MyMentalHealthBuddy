import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/leads-route.test.mjs"],
    environment: "node",
  },
});
