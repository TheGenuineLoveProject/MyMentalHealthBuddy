// drizzle.config.ts (root)
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schema.mjs",   // ⬅️ points to the file we just fixed
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Use your Neon/Postgres URL env var here
    url: process.env.DATABASE_URL ?? "",
  },
});