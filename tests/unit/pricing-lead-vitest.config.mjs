import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: {
    "@": fileURLToPath(new URL("../../client/src", import.meta.url)),
    "@pricing-under-test": process.env.MMHB_PRICING_SOURCE || fileURLToPath(new URL("../../client/src/pages/Pricing.jsx", import.meta.url)),
    "@newsletter-under-test": process.env.MMHB_NEWSLETTER_SOURCE || fileURLToPath(new URL("../../client/src/components/NewsletterSignup.jsx", import.meta.url)),
  } },
  test: { include: ["tests/unit/pricing-lead-capture.test.jsx"], environment: "jsdom" },
});
