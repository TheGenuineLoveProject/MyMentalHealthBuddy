import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['server/**/*.test.mjs', 'tests/**/*.test.mjs'],
    testTimeout: 30000,
    hookTimeout: 30000,
    setupFiles: ['./tests/setup.mjs'],
  },
});
