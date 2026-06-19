// scripts/generate-canonical-schema.mjs
// Regenerates server/db/schema.canonical.sql from the canonical Drizzle models
// in shared/schema.mjs. Run this after any schema change:
//   node scripts/generate-canonical-schema.mjs
//
// Pipeline: drizzle-kit generate (dry-run, writes SQL only) -> transform every
// CREATE TABLE / CREATE INDEX to its IF NOT EXISTS form so the result is safe to
// re-apply against an existing database. ensureSchema.mjs applies this file at
// boot so fresh databases / restores self-heal to the full schema.
//
// This script touches NO database. It is deterministic and non-destructive.

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const OUT = "server/db/schema.canonical.sql";
const DRIZZLE_KIT_BIN = join("node_modules", ".bin", "drizzle-kit");

if (!existsSync(DRIZZLE_KIT_BIN)) {
  console.error("[generate-canonical-schema] drizzle-kit is not installed locally.");
  console.error("[generate-canonical-schema] The committed server/db/schema.canonical.sql remains the boot-time canonical schema.");
  console.error("[generate-canonical-schema] To regenerate intentionally, install a vetted drizzle-kit version in a controlled dependency phase.");
  process.exit(1);
}

const tmp = mkdtempSync(join(tmpdir(), "drizzle-gen-"));
try {
  execFileSync(
    DRIZZLE_KIT_BIN,
    ["generate", "--dialect", "postgresql", "--schema", "./shared/schema.mjs", "--out", tmp],
    { stdio: "inherit" },
  );

  const sqlFile = readdirSync(tmp).find((f) => f.endsWith(".sql"));
  if (!sqlFile) throw new Error("drizzle-kit produced no .sql file");

  const generated = readFileSync(join(tmp, sqlFile), "utf8");
  const transformed = generated
    .split("\n")
    .map((line) =>
      line
        .replace(/^CREATE TABLE "/, 'CREATE TABLE IF NOT EXISTS "')
        .replace(/^CREATE INDEX "/, 'CREATE INDEX IF NOT EXISTS "')
        .replace(/^CREATE UNIQUE INDEX "/, 'CREATE UNIQUE INDEX IF NOT EXISTS "'),
    )
    .join("\n");

  const header = [
    "-- server/db/schema.canonical.sql",
    "-- AUTO-GENERATED canonical schema bootstrap (idempotent, IF NOT EXISTS).",
    "-- Source of truth: shared/schema.mjs (the Drizzle models the app queries).",
    "-- Applied non-blocking at boot by server/db/ensureSchema.mjs so a fresh",
    "-- database / disaster-recovery restore self-heals to the full schema.",
    "-- Statements are separated by drizzle statement breakpoint markers.",
    "--",
    "-- REGENERATE after any shared/schema.mjs change:",
    "--   node scripts/generate-canonical-schema.mjs",
    "--",
    "",
  ].join("\n");

  writeFileSync(OUT, header + transformed);
  const tables = (transformed.match(/CREATE TABLE IF NOT EXISTS/g) || []).length;
  const indexes = (transformed.match(/CREATE INDEX IF NOT EXISTS/g) || []).length;
  console.log(`[generate-canonical-schema] wrote ${OUT}: ${tables} tables, ${indexes} indexes`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
