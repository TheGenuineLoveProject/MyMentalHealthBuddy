#!/usr/bin/env node
// helpers/test-db-reset.mjs
// Reset test database tables for clean test runs

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { sql } from "drizzle-orm";

const { Pool } = pg;

async function resetTestDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL environment variable not set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);

  console.log("[test-db-reset] Starting database reset...");

  try {
    const tablesToReset = [
      "user_achievements",
      "tool_sessions",
      "daily_quests",
      "wellness_streaks",
      "user_progress",
      "ai_messages",
      "journals",
      "moods",
      "webhook_events",
      "subscriptions",
      "password_reset_tokens",
      "audit_log",
    ];

    for (const table of tablesToReset) {
      try {
        await db.execute(sql.raw(`TRUNCATE TABLE "${table}" CASCADE`));
        console.log(`  ✓ Truncated ${table}`);
      } catch (err) {
        console.log(`  - Skipped ${table} (may not exist)`);
      }
    }

    console.log("[test-db-reset] Database reset complete!");
  } catch (err) {
    console.error("[test-db-reset] Error:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetTestDatabase();
