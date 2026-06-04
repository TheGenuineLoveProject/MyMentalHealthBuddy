// =============================================================================
// route-registry.mjs — shared, read-only route registry collector.
//
// Statically parses the single-source-of-truth route registry
// (client/src/content/routes.js) together with the per-category route modules
// under client/src/content/routes/*.js. It does NOT import the app at runtime
// (routes.js pulls in lucide-react / React), so it is safe to run in plain Node.
//
// Governance: read-only. Never mutates source. Used by the manifest snapshot
// generator and the registry duplicate auditor. No route movement, no refactor.
// =============================================================================
import fs from "node:fs";
import path from "node:path";

export const ROUTES_FILE = "client/src/content/routes.js";
export const MODULES_DIR = "client/src/content/routes";

// Routes that must always remain present AND keep their governance invariants
// (expected category, and protected flag where applicable). If any of these
// disappears OR loses its expected classification, integrity has been broken.
export const PROTECTED_SENTINELS = [
  { route: "/", category: "landing" },
  { route: "/healing", category: "landing" },
  { route: "/pricing", category: "landing" },
  { route: "/crisis", category: "ai" },
  { route: "/dashboard", category: "core" },
  { route: "/journal", category: "core" },
  { route: "/admin", category: "admin" },
  { route: "/account/sessions", category: "account", protected: true },
  { route: "/account/delete", category: "account", protected: true },
  { route: "/admin/billing", category: "admin", protected: true },
];

function parseBlocks(content, sourceFile) {
  const lines = content.split("\n");
  const out = [];
  let cur = null;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^ {2}\{\s*$/.test(l)) {
      cur = { start: i, txt: [] };
      continue;
    }
    if (cur) {
      cur.txt.push(l);
      if (/^ {2}\},?\s*$/.test(l)) {
        const t = cur.txt.join("\n");
        const m = (re) => {
          const r = t.match(re);
          return r ? r[1] : null;
        };
        const route = m(/^\s*route:\s*['"]([^'"]+)['"]/m);
        if (route) {
          out.push({
            route,
            category: m(/^\s*category:\s*['"]([^'"]+)['"]/m),
            aliasOf: m(/^\s*aliasOf:\s*['"]([^'"]+)['"]/m),
            component: m(/^\s*(?:customComponent|component):\s*['"]([^'"]+)['"]/m),
            protected: /^\s*protected:\s*true/m.test(t),
            isAuthPage: /^\s*isAuthPage:\s*true/m.test(t),
            sourceFile,
            line: cur.start + 1,
          });
        }
        cur = null;
      }
    }
  }
  return out;
}

// Derives the set of registry module files ACTUALLY wired into the runtime
// route array, by reading routes.js's own `import ... from "./routes/X.js"`
// statements. This is the source of truth — never a directory glob — so unrelated
// helper files (routeRegistry.js, index.js) or stub/empty modules in the same
// directory can never inflate the count or create false drift.
export function registryModuleFiles() {
  const content = fs.readFileSync(ROUTES_FILE, "utf8");
  const re = /from\s+['"]\.\/routes\/([A-Za-z0-9_-]+\.js)['"]/g;
  const files = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    const fp = path.join(MODULES_DIR, m[1]);
    if (fs.existsSync(fp) && !files.includes(fp)) files.push(fp);
  }
  return files.sort();
}

// Returns the full, flat list of route entries across the registry + the
// wired-in modules, in source order (routes.js inline first, then modules).
export function collectRoutes() {
  const all = [];
  all.push(...parseBlocks(fs.readFileSync(ROUTES_FILE, "utf8"), ROUTES_FILE));
  for (const fp of registryModuleFiles()) {
    all.push(...parseBlocks(fs.readFileSync(fp, "utf8"), fp));
  }
  return all;
}

// Groups entries by duplicate `route` path. Returns [path, entries[]] pairs
// only where the same path appears more than once anywhere in the registry.
export function findDuplicates(routes) {
  const seen = new Map();
  for (const r of routes) {
    if (!seen.has(r.route)) seen.set(r.route, []);
    seen.get(r.route).push(r);
  }
  return [...seen.entries()].filter(([, v]) => v.length > 1);
}

export function countBy(routes, key) {
  const out = {};
  for (const r of routes) {
    const k = r[key] || "(none)";
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

// Validates each sentinel is present AND keeps its expected category /
// protected flag. Returns a list of human-readable violation strings.
export function validateSentinels(routes) {
  const byPath = new Map(routes.map((r) => [r.route, r]));
  const violations = [];
  for (const s of PROTECTED_SENTINELS) {
    const r = byPath.get(s.route);
    if (!r) {
      violations.push(`${s.route}: missing from registry`);
      continue;
    }
    if (s.category && r.category !== s.category) {
      violations.push(
        `${s.route}: category drift (expected ${s.category}, got ${r.category || "(none)"})`,
      );
    }
    if (s.protected && !r.protected) {
      violations.push(`${s.route}: lost protected:true flag`);
    }
  }
  return violations;
}

// Compares baseline.byCategory to the current per-category counts. Returns a
// list of drift strings. Catches reclassification / category-shift regressions
// that a total-count parity check alone would miss.
export function categoryDrift(currentByCategory, baselineByCategory) {
  if (!baselineByCategory) return [];
  const drift = [];
  const cats = new Set([
    ...Object.keys(currentByCategory),
    ...Object.keys(baselineByCategory),
  ]);
  for (const c of cats) {
    const now = currentByCategory[c] || 0;
    const base = baselineByCategory[c] || 0;
    if (now !== base) drift.push(`${c}: ${base} -> ${now}`);
  }
  return drift;
}

// Independent count of top-level route fields (4-space indent), decoupled from
// the block parser's brace-indentation assumptions. Used by selfCheck so a
// future formatting change that breaks one parsing strategy fails loudly
// instead of silently under-collecting.
function lineRouteCount(content) {
  return (content.match(/^ {4}route:\s*['"][^'"]+['"]/gm) || []).length;
}

// Cross-checks the block-parsed route total against the independent line count
// across routes.js + modules. Returns null if consistent, else a message.
export function selfCheck(routes) {
  let lineTotal = lineRouteCount(fs.readFileSync(ROUTES_FILE, "utf8"));
  for (const fp of registryModuleFiles()) {
    lineTotal += lineRouteCount(fs.readFileSync(fp, "utf8"));
  }
  if (routes.length !== lineTotal) {
    return `parser self-check mismatch: block-parse ${routes.length} vs line-count ${lineTotal} (possible silent under-collection)`;
  }
  return null;
}
