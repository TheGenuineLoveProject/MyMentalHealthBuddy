import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "_quarantine/**",
      "client/dist/**",
      ".replit",
      "**/*.test.js",
      "**/*.test.mjs",
      "attached_assets/**",
      "public/**",
      "scripts/**",
      "automation/**",
      "helpers/**",
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": "off",
      "prefer-const": "warn",
      "no-empty": "warn",
    },
  },
];
