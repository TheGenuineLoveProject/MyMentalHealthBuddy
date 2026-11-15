import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const presentation = fileURLToPath(new URL("./fixtures/social-manual-presentation.jsx", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-query"],
    alias: [
      { find: "@/components/SEO", replacement: presentation },
      { find: "lucide-react", replacement: presentation },
      { find: "react-icons/si", replacement: presentation },
      { find: "react-icons/fa", replacement: presentation },
      { find: "wouter", replacement: presentation },
      { find: "@", replacement: fileURLToPath(new URL("../../client/src", import.meta.url)) },
    ],
  },
  test: {
    include: ["tests/unit/social-manual-preparation.test.jsx"],
    environment: "jsdom",
    testTimeout: 10000,
  },
});
