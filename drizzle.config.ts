// drizzle.config.ts
// Final Neon Postgres config for Drizzle Kit (TS)

// Load .env variables
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Path to the unified schema used by your app
  schema: './shared/schema.mjs',

  // Where migrations will be stored
  out: './drizzle',

  // We use Postgres on Neon
  dialect: 'postgresql',

  // Use your existing Neon URL from .env

    schema: "./server/db/schema",
    out: "./server/db/migrations",
    strict: true,
    verbose: true

  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL || process.env.DATABASE_URL || '',
  },
});