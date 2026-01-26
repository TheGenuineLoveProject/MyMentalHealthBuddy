import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DUP = path.join(ROOT, "reports", "dup-scan", "latest.json");
const COL = path.join(ROOT, "reports", "collisions", "latest.json");

const OUT_DIR = path.join(ROOT, "reports", "keepers");
const OUT_JSON = path.join(OUT_DIR, "latest.json");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function safeReadJson(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}

function pickKeeper(files) {
  // deterministic keeper heuristic: prefer shorter path (less “backup/old/tmp”),
  // and prefer src/ or server/ over misc.
  const score = (f) => {
    const lower = f.toLowerCase();
    let s = 0;
    if (lower.includes("backup") || lower.includes("old") || lower.includes("tmp")) s += 50;
    if (lower.includes("_quarantine")) s += 100;
    if (lower.startsWith("src/")) s -= 10;
    if (lower.startsWith("server/")) s -= 8;
    if (lower.startsWith("client/")) s -= 6;
    s += f.length / 50;
    return s;
  };
  return [...files].sort((a, b) => score(a) - score(b))[0];
}

function main() {
  ensureDir(OUT_DIR);

  const dup = safeReadJson(DUP);
  const col = safeReadJson(COL);

  const recommendations = [];

  if (dup?.clusters?.length) {
    for (const c of dup.clusters) {
      const keeper = pickKeeper(c.files);
      const quarantine = c.files.filter(f => f !== keeper);
      recommendations.push({
        type: "identical-file-dup",
        hash: c.hash,
        keeper,
        quarantine,
        action: "CONSOLIDATE_IMPORTS_TO_KEEPER_ONLY; QUARANTINE_OTHERS",
      });
    }
  }

  if (col?.routeCollisions?.length) {
    for (const r of col.routeCollisions) {
      recommendations.push({
        type: "route-collision",
        key: r.key,
        files: r.files,
        action: "CHOOSE_SINGLE_ROUTE_REGISTRATION_POINT; REMOVE_DUPLICATE_REGISTRATIONS",
      });
    }
  }

  if (col?.tableCollisions?.length) {
    for (const t of col.tableCollisions) {
      recommendations.push({
        type: "schema-collision",
        table: t.name,
        files: t.files,
        action: "MERGE_TO_SINGLE_SCHEMA_DEFINITION; ENSURE_MIGRATIONS_MATCH",
      });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    inputs: { dup: fs.existsSync(DUP), collisions: fs.existsSync(COL) },
    recommendations,
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));

  console.log("keeper-audit: recommendations:", recommendations.length);
  if (recommendations.length) process.exitCode = 1;
  else console.log("keeper-audit: PASS (no recommendations).");
}

main();