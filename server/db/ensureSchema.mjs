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
const MFA_FK_SQL =
  'ALTER TABLE "mfa_login_challenges" ADD CONSTRAINT "mfa_login_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;';
const FAILURE_LIMIT = 25;
const POSTGRES_SQLSTATE_CLASSES = new Set([
  "00", "01", "02", "03", "08", "09", "0A", "0B", "0F", "0L", "0P", "0Z",
  "20", "21", "22", "23", "24", "25", "26", "27", "28", "2B", "2D", "2F",
  "34", "38", "39", "3B", "3D", "3F", "40", "42", "44", "53", "54", "55",
  "57", "58", "F0", "HV", "P0", "XX",
]);

const MFA_FK_CATALOG_SQL = sql.raw(`
SELECT
  child_ns.nspname AS child_schema,
  child.relname AS child_table,
  parent_ns.nspname AS parent_schema,
  parent.relname AS parent_table,
  c.contype,
  c.convalidated,
  c.condeferrable,
  c.condeferred,
  c.confmatchtype,
  c.confdeltype,
  c.confupdtype,
  c.conkey::text AS child_key_attnums,
  c.confkey::text AS parent_key_attnums,
  child_col.attnum AS child_user_id_attnum,
  parent_col.attnum AS parent_id_attnum,
  child_col.atttypid = 'uuid'::regtype AS child_is_uuid,
  parent_col.atttypid = 'uuid'::regtype AS parent_is_uuid,
  EXISTS (
    SELECT 1
    FROM pg_constraint pk
    WHERE pk.conrelid = parent.oid
      AND pk.contype = 'p'
      AND pk.convalidated
      AND pk.conkey = ARRAY[parent_col.attnum]::smallint[]
  ) AS parent_id_is_primary
FROM pg_constraint c
JOIN pg_class child ON child.oid = c.conrelid
JOIN pg_namespace child_ns ON child_ns.oid = child.relnamespace
JOIN pg_class parent ON parent.oid = c.confrelid
JOIN pg_namespace parent_ns ON parent_ns.oid = parent.relnamespace
JOIN pg_attribute child_col
  ON child_col.attrelid = child.oid AND child_col.attname = 'user_id' AND NOT child_col.attisdropped
JOIN pg_attribute parent_col
  ON parent_col.attrelid = parent.oid AND parent_col.attname = 'id' AND NOT parent_col.attisdropped
WHERE c.conname = 'mfa_login_challenges_user_id_users_id_fk'
  AND child_ns.nspname = 'public'
  AND child.relname = 'mfa_login_challenges'
`);

function safeGet(value, key) {
  try {
    return value?.[key];
  } catch {
    return undefined;
  }
}

export function safeSqlstate(error) {
  const seen = new WeakSet();
  let current = error;
  for (let depth = 0; depth < 8; depth += 1) {
    if ((typeof current !== "object" && typeof current !== "function") || current === null) {
      return null;
    }
    if (seen.has(current)) return null;
    seen.add(current);
    for (const key of ["code", "sqlState", "sqlstate"]) {
      const value = safeGet(current, key);
      if (
        typeof value === "string" &&
        /^[0-9A-Z]{5}$/.test(value) &&
        POSTGRES_SQLSTATE_CLASSES.has(value.slice(0, 2))
      ) {
        return value;
      }
    }
    current = safeGet(current, "cause");
  }
  return null;
}

function safeLog(log, level, text, fields) {
  try {
    const method = safeGet(log, level);
    if (typeof method === "function") method.call(log, text, fields);
  } catch {
    // Startup remains best-effort; logger failures must not expose nested errors.
  }
}

function rowsOf(result) {
  const rows = safeGet(result, "rows");
  if (Array.isArray(rows)) return rows;
  return Array.isArray(result) ? result : [];
}

function isExactMfaFkRow(row) {
  if (!row || (typeof row !== "object" && typeof row !== "function")) return false;
  const childAttnum = Number(safeGet(row, "child_user_id_attnum"));
  const parentAttnum = Number(safeGet(row, "parent_id_attnum"));
  return (
    safeGet(row, "child_schema") === "public" &&
    safeGet(row, "child_table") === "mfa_login_challenges" &&
    safeGet(row, "parent_schema") === "public" &&
    safeGet(row, "parent_table") === "users" &&
    safeGet(row, "contype") === "f" &&
    safeGet(row, "convalidated") === true &&
    safeGet(row, "condeferrable") === false &&
    safeGet(row, "condeferred") === false &&
    safeGet(row, "confmatchtype") === "s" &&
    safeGet(row, "confdeltype") === "c" &&
    safeGet(row, "confupdtype") === "a" &&
    safeGet(row, "child_key_attnums") === `{${childAttnum}}` &&
    safeGet(row, "parent_key_attnums") === `{${parentAttnum}}` &&
    safeGet(row, "child_is_uuid") === true &&
    safeGet(row, "parent_is_uuid") === true &&
    safeGet(row, "parent_id_is_primary") === true
  );
}

async function hasExactMfaFk(database) {
  const rows = rowsOf(await database.execute(MFA_FK_CATALOG_SQL));
  return rows.length === 1 && isExactMfaFkRow(rows[0]);
}

function loadStatements(readCanonical) {
  const raw = readCanonical(CANONICAL_SQL_PATH, "utf8");
  return raw
    .split(/-->\s*statement-breakpoint/)
    .map((s) =>
      s
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
}

export function createEnsureSchema({
  database = db,
  log = logger,
  readCanonical = readFileSync,
} = {}) {
  let bootstrapped = false;

  return async function ensureSchemaInjected() {
    if (bootstrapped) return { ok: true, cached: true };

    let statements;
    try {
      statements = loadStatements(readCanonical);
    } catch (error) {
      const sqlstate = safeSqlstate(error);
      const failure = { category: "schema_read_failed", sqlstate };
      safeLog(log, "warn", "[ensureSchema] canonical schema read failed; continuing", failure);
      bootstrapped = true;
      return { ok: false, ran: 0, failed: [failure], failedCount: 1, omittedFailures: 0 };
    }

    const results = { ok: true, ran: 0, failed: [], failedCount: 0, omittedFailures: 0 };
    const recordFailure = (category, error) => {
      results.failedCount += 1;
      if (results.failed.length < FAILURE_LIMIT) {
        results.failed.push({ category, sqlstate: safeSqlstate(error) });
      } else {
        results.omittedFailures += 1;
      }
    };

    for (const stmt of statements) {
      const isMfaFk = stmt === MFA_FK_SQL;
      try {
        if (isMfaFk && (await hasExactMfaFk(database))) {
          continue;
        }
        await database.execute(sql.raw(stmt));
        results.ran += 1;
      } catch (error) {
        if (isMfaFk && safeSqlstate(error) === "42710") {
          try {
            if (await hasExactMfaFk(database)) continue;
          } catch (recheckError) {
            recordFailure("mfa_fk_catalog_recheck_failed", recheckError);
            continue;
          }
          recordFailure("mfa_fk_definition_conflict", error);
          continue;
        }
        recordFailure(isMfaFk ? "mfa_fk_statement_failed" : "schema_statement_failed", error);
      }
    }

    if (results.failedCount > 0) {
      safeLog(log, "warn", "[ensureSchema] schema statements failed; continuing", {
        category: "schema_bootstrap_failures",
        failedCount: results.failedCount,
        omittedFailures: results.omittedFailures,
        failures: results.failed,
      });
      results.ok = false;
    } else {
      safeLog(log, "info", "[ensureSchema] canonical schema bootstrap completed", {
        category: "schema_bootstrap_complete",
        ran: results.ran,
      });
    }
    bootstrapped = true;
    return results;
  };
}

export const ensureSchema = createEnsureSchema();