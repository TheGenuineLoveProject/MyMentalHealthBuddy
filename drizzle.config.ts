// drizzle.config.ts - root (project-level) config

import type { Config } from "drizzle-kit";

const config: Config = {
  schema: "./server/db/schema.mjs",   // unified schema file
  out: "./drizzle/migrations",       // migrations folder
  driver: "pg",                      // using pg (node-postgres)
  dialect: "postgresql",             // <-- fixes "dialect" error
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "",
  },
};

export default config;