import { sql } from "drizzle-orm";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { db } from "./connection.mjs";
import { logger } from "../utils/logger.mjs";

// Canonical schema bootstrap.
//
// shared/schema.mjs is the source of truth for the schema; server/db/schema.canonical.sql
// is its generated, idempotent (IF NOT EXISTS) SQL form (regenerate with
// `node scripts/generate-canonical-schema.mjs`). Applying it lets a fresh database
// or a disaster-recovery restore self-heal to the full schema on first boot.
//
// SAFETY: this is invoked NON-BLOCKING, AFTER the HTTP server is already listening
// (see server/app.mjs). It must never block port-open or crash boot — a DB hang at
// boot previously caused a port-never-opened crash-loop. Every statement is wrapped;
// failures are logged and swallowed, never thrown.

const __dirname = dirname(fileURLToPath(import.meta.url));
const CANONICAL_SQL_PATH = join(__dirname, "schema.canonical.sql");

let bootstrapped = false;

function loadStatements() {
  const raw = readFileSync(CANONICAL_SQL_PATH, "utf8");
  // drizzle-kit emits the breakpoint marker standalone after CREATE TABLE but
  // INLINE after CREATE INDEX (e.g. `...("col");--> statement-breakpoint`), so we
  // must split on the marker wherever it appears. This is safe because the marker
  // never appears in a comment or a statement (the header/regen script avoid the
  // literal), so it only ever delimits real statements.
  return raw
    .split(/-->\s*statement-breakpoint/)
    .map((s) =>
      s
        // strip standalone SQL comment lines (header + breakpoint remnants)
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
}

export async function ensureSchema() {
  if (bootstrapped) return { ok: true, cached: true };

  let statements;
  try {
    statements = loadStatements();
  } catch (err) {
    logger.warn(`[ensureSchema] could not load canonical schema: ${err?.message || err}`);
    bootstrapped = true;
    return { ok: false, ran: 0, failed: [{ stmt: CANONICAL_SQL_PATH, message: String(err) }] };
  }

  const results = { ok: true, ran: 0, failed: [] };
  for (const stmt of statements) {
    try {
      await db.execute(sql.raw(stmt));
      results.ran += 1;
    } catch (err) {
      results.failed.push({ stmt: stmt.split("\n")[0], message: err?.message || String(err) });
    }
  }

  if (results.failed.length > 0) {
    logger.warn("[ensureSchema] some statements failed (continuing):", results.failed);
    results.ok = false;
  } else {
    logger.info(`[ensureSchema] bootstrapped ${results.ran} statements`);
  }
  bootstrapped = true;
  return results;
}
