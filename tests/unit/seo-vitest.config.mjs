import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("../../shared", import.meta.url)),
      "@seo-under-test": process.env.MMHB_SEO_SOURCE ||
        fileURLToPath(new URL("../../client/src/components/SEO.tsx", import.meta.url)),
    },
  },
  test: {
    include: ["tests/unit/seo-metadata.test.jsx"],
    environment: process.env.MMHB_JSDOM_ENV || "jsdom",
    environmentOptions: { jsdom: { url: "https://preview.example.test/" } },
  },
});
