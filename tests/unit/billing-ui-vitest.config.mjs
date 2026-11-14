import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom", "@tanstack/react-query"], alias: {
    "@": fileURLToPath(new URL("../../client/src", import.meta.url)),
    "@billing-under-test": process.env.MMHB_BILLING_SOURCE || fileURLToPath(new URL("../../client/src/pages/account/Billing.jsx", import.meta.url)),
  } },
  test: { include: ["tests/unit/billing-ui.test.jsx"], environment: "jsdom" },
});
