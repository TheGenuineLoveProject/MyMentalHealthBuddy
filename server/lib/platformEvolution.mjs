// server/lib/platformEvolution.mjs
// Platform Evolution Control Tool v1 — AUDIT-ONLY governance engine.
//
// Read-only static scanner. It NEVER mutates files, routes, schema, auth,
// payments, crisis/clinical content, or user data. It only inspects the
// source tree and returns a structured report (findings + score +
// recommendations) for the admin "Platform Evolution" panel.
//
// Canonical owner: this module is the single source for static-source
// governance scans. It is deliberately distinct from server/routes/sop.mjs
// (SOP Monitor = live runtime route-status probes) and from
// scripts/heal-360.mjs (runtime health snapshots) to avoid duplicate
// ownership. Scanners here answer "is the codebase coherent?", not
// "is the running service healthy?".

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const IGNORE_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "coverage", ".cache",
  ".local", ".agents", "attached_assets", ".upm", ".config", "tmp",
]);

const SOURCE_EXTS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);

// Frontend files that legitimately contain /api/* strings as metadata
// (tool catalogs, rbac permission maps) rather than live calls — excluded
// from the orphaned-route scan to avoid false positives.
const API_METADATA_EXCLUDES = [
  "client/src/config/toolCategories.js",
  "client/src/pages/admin/_adminToolsShared.js",
  "client/src/lumi-rbac/middleware/rbacMiddleware.ts",
];

const MAX_FINDINGS_PER_CATEGORY = 60;

// Orphaned /api prefixes that are intentional-by-design. They are NOT hidden —
// they are downgraded from "warning" to documented "info" with the reason, so
// the audit stays honest while distinguishing genuine gaps from known ones.
const KNOWN_INTENTIONAL_ORPHANS = {
  pathways: {
    reason: "Progress endpoint for the not-yet-built Pathways progress feature; the frontend query is `enabled: false` so it never fires (no runtime 404). Wire the route when the feature is built.",
    files: ["client/src/pages/pathways/PathwaysHome.jsx"],
  },
};

function walk(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".") {
      // allow walking into the repo but skip dotfiles/dotdirs at any level
      if (entry.isDirectory()) continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(full, acc);
    } else if (entry.isFile()) {
      acc.push(full);
    }
  }
  return acc;
}

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}

function readSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function inTree(relPath, prefixes) {
  return prefixes.some((pre) => relPath.startsWith(pre));
}

// ---------------------------------------------------------------------------
// Scanners — each returns { findings: [...], note? }. A finding is
// { severity: 'critical'|'warning'|'info', message, location, recommendation }.
// Every scanner is wrapped by run() so one failure cannot break the audit.
// ---------------------------------------------------------------------------

const ARTIFACT_PATTERNS = [
  /\.bak$/i, /\.bak-[\w.-]+$/i, /\.STABLE$/i, /\.orig$/i, /\.old$/i,
  /~$/, /\.disabled$/i, /\.phase-[\w.-]+\.bak$/i, /\.v\d+\.bak$/i,
  /\.copy(\.\w+)?$/i, /\.rej$/i,
];

function scanArtifactPollution(files) {
  const findings = [];
  for (const f of files) {
    const r = rel(f);
    if (!inTree(r, ["server/", "client/src/", "shared/"])) continue;
    const base = path.basename(r);
    if (ARTIFACT_PATTERNS.some((re) => re.test(base))) {
      findings.push({
        severity: "warning",
        message: `Backup/stale artifact committed in source tree: ${base}`,
        location: r,
        recommendation: "Remove from source tree or relocate outside server/, client/src/, shared/ (with approval — non-destructive).",
      });
    }
  }
  return { findings };
}

function scanDuplicateOwnership(files) {
  const byBase = new Map();
  for (const f of files) {
    const r = rel(f);
    if (!r.startsWith("client/src/")) continue;
    const ext = path.extname(r);
    if (!SOURCE_EXTS.has(ext)) continue;
    const base = path.basename(r);
    // index.* legitimately repeats across folders — not a duplicate-owner signal.
    if (/^index\.(js|jsx|ts|tsx)$/.test(base)) continue;
    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(r);
  }
  const findings = [];
  for (const [base, paths] of byBase) {
    if (paths.length > 1) {
      findings.push({
        severity: "info",
        message: `Duplicate basename "${base}" in ${paths.length} locations — verify single canonical owner.`,
        location: paths.join("  |  "),
        recommendation: "Confirm which copy is canonical; consolidate or document the distinction to prevent drift.",
      });
    }
  }
  return { findings };
}

function scanOrphanedRoutes(files) {
  // Collect frontend first-segment /api/<seg> references (excluding metadata files).
  const called = new Map(); // seg -> Set(locations)
  for (const f of files) {
    const r = rel(f);
    if (!r.startsWith("client/src/")) continue;
    if (API_METADATA_EXCLUDES.includes(r)) continue;
    const txt = readSafe(f);
    // Strip comments first so documentation / annotations that merely mention an
    // /api path are never miscounted as live calls — only real code references
    // count. (Block comments + full-line // comments; mid-line URLs untouched.)
    const code = txt
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .split("\n")
      .filter((line) => !line.trim().startsWith("//"))
      .join("\n");
    const re = /\/api\/([a-zA-Z0-9_-]+)/g;
    let m;
    while ((m = re.exec(code)) !== null) {
      const seg = m[1];
      if (!called.has(seg)) called.set(seg, new Set());
      if (called.get(seg).size < 3) called.get(seg).add(r);
    }
  }
  // Collect server mounts app.use("/api/<seg>" and direct app.get/post("/api/<seg>".
  const mounted = new Set();
  const appText = readSafe(path.join(ROOT, "server/app.mjs"));
  const mountRe = /app\.(?:use|get|post|put|patch|delete|all)\(\s*["'`]\/api\/([a-zA-Z0-9_-]+)/g;
  let mm;
  while ((mm = mountRe.exec(appText)) !== null) mounted.add(mm[1]);
  // Also count direct route handlers anywhere in server (replitAuth etc.) only if wired.
  const findings = [];
  for (const [seg, locs] of called) {
    if (!mounted.has(seg)) {
      const known = KNOWN_INTENTIONAL_ORPHANS[seg];
      const locArr = [...locs];
      // Downgrade to documented "info" ONLY when every reference sits inside the
      // declared file scope. A reference from any other file is a genuine new
      // orphan and must stay a "warning" so regressions are never masked.
      const downgraded = known && locArr.length > 0 && locArr.every((l) => known.files.some((f) => l.includes(f)));
      findings.push({
        severity: downgraded ? "info" : "warning",
        message: downgraded
          ? `Known intentional orphan: /api/${seg}/* has no app.mjs mount (by design).`
          : `Frontend references /api/${seg}/* but no matching mount exists in server/app.mjs.`,
        location: locArr.join("  |  ") || "(client)",
        recommendation: downgraded ? known.reason : "Wire the route in server/app.mjs, repoint the call to the correct endpoint, or remove the dead reference.",
      });
    }
  }
  return { findings, note: `${called.size} frontend /api prefixes vs ${mounted.size} mounts.` };
}

// A reviewed, intentional deferral (e.g. a graceful 501 for an unconfigured
// provider, or a documented pass-through stub) can be suppressed with an inline
// `platform-evolution-ignore` comment on the matched line or the line above it.
//
// Policy is machine-enforced, not comment-enforced. A sentinel only suppresses
// a finding when it (a) lives inside a COMMENT (not a string/code literal) and
// (b) carries a MEANINGFUL reason — at least one real word once comment closers
// (`*/`, `-->`, `}`) are stripped. A bare, whitespace-only, or closer-only
// marker does NOT suppress, so silent blanket ignores cannot accumulate and the
// token appearing inside a string literal cannot accidentally hide findings.
function meaningfulReason(raw) {
  const cleaned = (raw || "")
    .replace(/^[\s:—–-]+/, "")     // leading separators after the marker / category
    .replace(/-->\s*$/, "")         // <!-- html --> closer
    .replace(/\*\/\s*\}?\s*$/, "")  // /* block */ and JSX {/* */} closer
    .replace(/[}\s]+$/, "")         // trailing braces / whitespace
    .trim();
  return /[a-z]{3,}/i.test(cleaned) ? cleaned : "";
}

function lineIgnoreReason(line) {
  const s = line || "";
  // line-level marker = `platform-evolution-ignore` NOT followed by `-file`.
  const idx = s.search(/platform-evolution-ignore(?!-file)/i);
  if (idx < 0) return "";
  const before = s.slice(0, idx);
  // the marker must sit inside a comment, not a string/code literal
  if (!/(\/\/|\/\*|<!--|#)/.test(before) && !/^\s*\*\s/.test(before)) return "";
  const after = s.slice(idx).replace(/^platform-evolution-ignore\s*:?/i, "");
  return meaningfulReason(after);
}

function hasIgnoreSentinel(lines, idx) {
  return Boolean(lineIgnoreReason(lines[idx] || "")) ||
    (idx > 0 && Boolean(lineIgnoreReason(lines[idx - 1] || "")));
}

// File-level suppression for cases where a line-level sentinel is awkward
// (e.g. the matched text sits inside a JSX attribute). Requires a matching
// `platform-evolution-ignore-file: <category>` (or blanket) marker AND a
// meaningful reason after it.
function fileHasIgnore(txt, category) {
  const m = txt.match(/platform-evolution-ignore-file(?:\s*:\s*([a-z-]+))?(.*)$/im);
  if (!m) return false;
  const cat = m[1];
  const reason = meaningfulReason(m[2]);
  if (!reason) return false;
  if (cat && cat !== category) return false;
  return true;
}

// Exposed for unit tests only — not part of the public audit surface.
export const __sentinelInternals = { meaningfulReason, lineIgnoreReason, hasIgnoreSentinel, fileHasIgnore };

// PHASE113IB_PLATFORM_EVOLUTION_SELF_MARKER_FILTER: the audit engine must not count its own detector/remediation language
// as shipped product incompleteness. Product files remain fully scanned.
function isPlatformEvolutionSelfFile(r) {
  return r === "server/lib/platformEvolution.mjs";
}

const STUB_RE = /\b(TODO|FIXME|XXX|HACK)\b|not implemented|notImplemented|res\.status\(\s*501\s*\)/i; // platform-evolution-ignore: detector pattern definition, not a shipped stub

function scanExposedStubs(files) {
  const findings = [];
  for (const f of files) {
    const r = rel(f);
    if (isPlatformEvolutionSelfFile(r)) continue;
    if (!inTree(r, ["client/src/", "server/"])) continue;
    if (!SOURCE_EXTS.has(path.extname(r))) continue;
    if (/\.test\.|\.spec\./.test(r)) continue;
    const txt = readSafe(f);
    const lines = txt.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (STUB_RE.test(line)) {
        if (hasIgnoreSentinel(lines, i)) continue;
        findings.push({
          severity: "info",
          message: line.trim().slice(0, 160),
          location: `${r}:${i + 1}`,
          recommendation: "Complete the implementation or document the deferral as intentional (e.g. graceful 501 for unconfigured providers).",
        });
        if (findings.length >= MAX_FINDINGS_PER_CATEGORY) return { findings, truncated: true };
      }
    }
  }
  return { findings };
}

function scanStaleContent(files) {
  const findings = [];
  for (const f of files) {
    const r = rel(f);
    if (isPlatformEvolutionSelfFile(r)) continue;
    if (!r.startsWith("client/src/")) continue;
    if (!SOURCE_EXTS.has(path.extname(r))) continue;
    const txt = readSafe(f);
    if (fileHasIgnore(txt, "stale-content")) continue;
    const lines = txt.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (/coming soon/i.test(lines[i])) {
        if (hasIgnoreSentinel(lines, i)) continue;
        findings.push({
          severity: "info",
          message: lines[i].trim().slice(0, 160),
          location: `${r}:${i + 1}`,
          recommendation: "Verify the feature is not already live; if it is, replace the placeholder copy. Keep only for genuinely unbuilt features.",
        });
        if (findings.length >= MAX_FINDINGS_PER_CATEGORY) return { findings, truncated: true };
      }
    }
  }
  return { findings };
}

function scanLoadingRisks(files) {
  const findings = [];
  for (const f of files) {
    const r = rel(f);
    if (!r.startsWith("client/src/")) continue;
    if (!SOURCE_EXTS.has(path.extname(r))) continue;
    const txt = readSafe(f);
    const lineCount = txt.split("\n").length;
    if (lineCount > 1500) {
      findings.push({
        severity: "info",
        message: `Large source file (${lineCount} lines) — heavy parse/maintenance and code-split candidate.`,
        location: r,
        recommendation: "Consider splitting into smaller modules / lazy-loaded chunks to reduce load and cognitive risk.",
      });
    }
  }
  findings.sort((a, b) => {
    const an = parseInt(a.message.match(/\((\d+) lines/)?.[1] || "0", 10);
    const bn = parseInt(b.message.match(/\((\d+) lines/)?.[1] || "0", 10);
    return bn - an;
  });
  return { findings: findings.slice(0, MAX_FINDINGS_PER_CATEGORY) };
}

// 1-based line number for a character offset — for findings located by regex
// match index rather than line iteration.
function lineAt(txt, idx) {
  let n = 1;
  for (let i = 0; i < idx && i < txt.length; i++) if (txt[i] === "\n") n++;
  return n;
}

// Strip comments so documentation / TODO notes that merely MENTION a path or
// number are never mistaken for real code. Removes block comments, full-line
// `//` and JSDoc `*` lines, and trailing `//` comments (guarding URL `://`).
// Used by safety checks where a false "covered" reading is the dangerous
// direction (BHCE asymmetric risk).
function stripComments(txt) {
  return (txt || "")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (t.startsWith("//") || t.startsWith("*")) return "";
      return line.replace(/([^:])\/\/.*$/, "$1");
    })
    .join("\n");
}



// --- Accessibility (WCAG) scanner ------------------------------------------
// High-precision, low-noise a11y checks on shipped JSX/TSX:
//  • <img> with no alt attribute → WCAG 1.1.1 (warning). alt="" is VALID
//    (decorative) and counts as present; tags using {...spread} are skipped
//    because alt may arrive via props.
//  • positive tabIndex ({1}+) → WCAG 2.4.3 focus-order anti-pattern (info).
function scanAccessibility(files) {
  const findings = [];
  for (const f of files) {
    const r = rel(f);
    if (!r.startsWith("client/src/")) continue;
    const ext = path.extname(r);
    if (ext !== ".jsx" && ext !== ".tsx") continue;
    if (/\.test\.|\.spec\./.test(r)) continue;
    const txt = readSafe(f);
    if (fileHasIgnore(txt, "accessibility")) continue;
    const lines = txt.split("\n");

    const imgRe = /<img\b[^>]*?>/gi;
    let m;
    while ((m = imgRe.exec(txt)) !== null) {
      const tag = m[0];
      if (/\balt\s*=/.test(tag)) continue;     // alt present (incl. decorative alt="")
      if (/\{\s*\.\.\./.test(tag)) continue;   // spread props may supply alt
      const ln = lineAt(txt, m.index);
      if (hasIgnoreSentinel(lines, ln - 1)) continue;
      findings.push({
        severity: "warning",
        message: "<img> without an alt attribute — screen readers cannot describe it (WCAG 1.1.1).",
        location: `${r}:${ln}`,
        recommendation: 'Add descriptive alt text, or alt="" if the image is purely decorative.',
      });
      if (findings.length >= MAX_FINDINGS_PER_CATEGORY) return { findings, truncated: true };
    }

    const tabRe = /tab[iI]ndex\s*=\s*\{?\s*["']?([0-9]+)/g;
    let t;
    while ((t = tabRe.exec(txt)) !== null) {
      if (parseInt(t[1], 10) <= 0) continue;
      const ln = lineAt(txt, t.index);
      if (hasIgnoreSentinel(lines, ln - 1)) continue;
      findings.push({
        severity: "info",
        message: `Positive tabindex (${t[1]}) overrides natural focus order (WCAG 2.4.3).`,
        location: `${r}:${ln}`,
        recommendation: "Prefer tabIndex={0} and natural DOM order over a positive tabindex.",
      });
      if (findings.length >= MAX_FINDINGS_PER_CATEGORY) return { findings, truncated: true };
    }
  }
  return { findings, note: "WCAG checks: img alt (1.1.1), focus order (2.4.3)." };
}

// --- Crisis-routing coverage scanner ---------------------------------------
// Governance kernel (BHCE asymmetric-risk rule): crisis routing — /crisis, 988,
// or Crisis Text 741741 — must be reachable from EVERY wellness surface. This
// is a SAFETY regression detector, not a style check. Crisis routing is normally
// provided globally (a banner/footer mounted in the app shell); a wellness page
// is "covered" if it OR the global shell exposes a crisis signal. An uncovered
// wellness surface is a critical safety gap.
const CRISIS_SIGNAL = /(\/crisis\b|\b988\b|741741)/i;
const WELLNESS_KEYWORDS = /(chat|mood|journal|wellness|healing|breath|meditat|affirmation|gratitude|peacescape|pathway|anxiety|depress|selfcare|self-care|check-?in|mindful|therapy|feelings|emotion)/i;
const SHELL_HINT = /(app|footer|layout|shell|crisis|nav|root)/i;

function scanCrisisRouting(files) {
  const findings = [];
  // 1) Detect whether a GLOBAL crisis net exists in the app shell.
  let globalCovered = false;
  for (const f of files) {
    const r = rel(f);
    if (!r.startsWith("client/src/")) continue;
    const ext = path.extname(r);
    if (ext !== ".jsx" && ext !== ".tsx") continue;
    if (!SHELL_HINT.test(path.basename(r, ext))) continue;
    if (CRISIS_SIGNAL.test(stripComments(readSafe(f)))) { globalCovered = true; break; }
  }

  // 2) Verify each wellness surface page is covered.
  let wellnessCount = 0;
  for (const f of files) {
    const r = rel(f);
    if (!r.startsWith("client/src/pages/")) continue;
    if (r.includes("/admin/")) continue;
    const ext = path.extname(r);
    if (ext !== ".jsx" && ext !== ".tsx") continue;
    if (/\.test\.|\.spec\./.test(r)) continue;
    const base = path.basename(r, ext);
    if (/crisis/i.test(base)) continue;        // the crisis page itself
    if (!WELLNESS_KEYWORDS.test(base)) continue;
    wellnessCount++;
    const txt = readSafe(f);
    if (fileHasIgnore(txt, "crisis-routing")) continue;
    if (CRISIS_SIGNAL.test(stripComments(txt)) || globalCovered) continue;
    findings.push({
      severity: "critical",
      message: `Wellness surface "${base}" exposes no crisis pathway (/crisis, 988, or 741741) and no global crisis net was detected.`,
      location: r,
      recommendation: "Mount the global crisis banner/footer in the app shell, or add a /crisis pathway on the page. Safety-critical (BHCE).",
    });
    if (findings.length >= MAX_FINDINGS_PER_CATEGORY) return { findings, truncated: true };
  }
  return {
    findings,
    note: `${wellnessCount} wellness surfaces; global crisis net: ${globalCovered ? "present" : "ABSENT"}.`,
  };
}

const CATEGORY_DEFS = [
  { id: "artifact-pollution", name: "Artifact Pollution", description: "Backup/stale artifacts (.bak, .STABLE, .orig, ~) committed inside source trees.", scan: scanArtifactPollution },
  { id: "orphaned-routes", name: "Orphaned Routes", description: "Frontend /api/* calls with no matching server mount.", scan: scanOrphanedRoutes },
  { id: "duplicate-ownership", name: "Duplicate Ownership", description: "Repeated component/module basenames that risk drift without a clear canonical owner.", scan: scanDuplicateOwnership },
  { id: "exposed-stubs", name: "Exposed Stubs", description: "TODO/FIXME/not-implemented/501 markers in shipped source.", scan: scanExposedStubs }, // platform-evolution-ignore: detector self-description, not a shipped stub
  { id: "stale-content", name: "Stale Content", description: "'Coming soon' copy that may sit on already-live features.", scan: scanStaleContent },
  { id: "loading-risks", name: "Loading Risks", description: "Oversized source files that are heavy-load / code-split candidates.", scan: scanLoadingRisks },
  { id: "accessibility", name: "Accessibility (WCAG)", description: "WCAG AA gaps in shipped JSX: images without alt text, positive-tabindex focus traps.", scan: scanAccessibility },
  { id: "crisis-routing", name: "Crisis Routing", description: "Wellness surfaces must expose a crisis pathway (/crisis, 988, 741741) — BHCE safety contract.", scan: scanCrisisRouting },
];

const SEVERITY_RANK = { critical: 3, warning: 2, info: 1, none: 0 };
const SEVERITY_WEIGHT = { critical: 10, warning: 4, info: 1 };
const CATEGORY_PENALTY_CAP = 25; // no single category can sink the score alone

function topSeverity(findings) {
  let top = "none";
  for (const fnd of findings) {
    if (SEVERITY_RANK[fnd.severity] > SEVERITY_RANK[top]) top = fnd.severity;
  }
  return top;
}

// Remediation planner — the AUDIT-ONLY tool's guidance layer. It turns raw
// findings into a prioritized, deduplicated action queue ordered by (1) severity
// and (2) the kernel's "smallest valid engine wins" ladder, so the quickest safe
// wins surface first. It NEVER edits anything — it only recommends what a human
// should do next. This is the in-contract realization of "continually evolve /
// refine / optimize": every run proposes the next best step, never applies it.
const REMEDIATION_ENGINE = {
  "artifact-pollution": { engine: "shell", hint: "Quarantine the artifact out of the source tree (non-destructive move)." },
  "stale-content": { engine: "copy", hint: "Replace placeholder copy if the feature is already live; smallest-engine copy/CSS fix." },
  "orphaned-routes": { engine: "react-or-route", hint: "Repoint the frontend call or mount the missing route — smallest valid engine." },
  "exposed-stubs": { engine: "impl-or-document", hint: "Complete the implementation, or document the deferral with a reasoned sentinel." },
  "loading-risks": { engine: "code-split", hint: "Split into lazy-loaded modules to cut parse and maintenance load." },
  "duplicate-ownership": { engine: "consolidate", hint: "Designate a canonical owner; quarantine or merge the duplicates." },
  "accessibility": { engine: "a11y-fix", hint: "Add alt text / fix focus order — small, high-impact WCAG fix." },
  "crisis-routing": { engine: "crisis-safety", hint: "Restore crisis-routing reachability — safety-critical, do this first." },
};
const ENGINE_RANK = { "crisis-safety": 0, shell: 1, copy: 2, "a11y-fix": 2, "react-or-route": 3, "impl-or-document": 4, "code-split": 5, consolidate: 6, review: 9 };

function buildRemediationPlan(categories, { limit = 15 } = {}) {
  const catPriority = new Map(CATEGORY_DEFS.map((d, i) => [d.id, i]));
  const items = [];
  const seen = new Set();
  for (const cat of categories || []) {
    for (const fnd of cat.findings || []) {
      const key = `${cat.id}::${fnd.location}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const meta = REMEDIATION_ENGINE[cat.id] || { engine: "review", hint: "Review and resolve." };
      items.push({
        severity: fnd.severity,
        category: cat.id,
        location: fnd.location,
        action: fnd.recommendation || cat.description || "Review and resolve.",
        engine: meta.engine,
        engineHint: meta.hint,
        _sev: SEVERITY_RANK[fnd.severity] || 0,
        _eng: ENGINE_RANK[meta.engine] || 99,
        _cat: catPriority.get(cat.id) ?? 99,
      });
    }
  }
  items.sort((a, b) =>
    b._sev - a._sev ||                       // most severe first
    a._eng - b._eng ||                       // smallest valid engine (quick win) first
    a._cat - b._cat ||                       // stable category priority
    String(a.location).localeCompare(String(b.location)),
  );
  const ranked = items.slice(0, limit).map(({ _sev, _eng, _cat, ...rest }, i) => ({ priority: i + 1, ...rest }));
  return {
    totalActionable: items.length,
    shown: ranked.length,
    nextAction: ranked[0] || null,
    actions: ranked,
  };
}

// Exposed for unit tests only — not part of the public audit surface.
export const __planInternals = { buildRemediationPlan };
export const __scannerInternals = { scanAccessibility, scanCrisisRouting };

// Short-lived in-memory cache. The scan is a synchronous full-tree walk
// (~5s); caching prevents repeated admin refreshes from blocking the event
// loop. Read-only — never persisted.
let _cache = { at: 0, report: null, running: null };
const CACHE_TTL_MS = 30000;

// --- Trend memory (best-effort, gitignored data file) -----------------------
// The audit is read-only over SOURCE. To let the tool show whether the platform
// is improving or regressing over time, we append a COMPACT health snapshot
// (score + severity counts only — never source content) to a gitignored dot-dir
// that walk() already skips. Best-effort: any IO failure degrades to "no
// history" and never blocks the audit.
const HISTORY_DIR = path.join(ROOT, ".platform-evolution");
const HISTORY_FILE = path.join(HISTORY_DIR, "history.json");
const HISTORY_MAX = 50;

function readEvolutionHistory() {
  try {
    const arr = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function appendEvolutionHistory(entry) {
  try {
    const trimmed = [...readEvolutionHistory(), entry].slice(-HISTORY_MAX);
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
    // Atomic write: stage to a pid-scoped temp file then rename, so a crash
    // mid-write can never truncate/corrupt the live history file.
    const tmp = `${HISTORY_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(trimmed));
    fs.renameSync(tmp, HISTORY_FILE);
    return trimmed;
  } catch {
    return readEvolutionHistory();
  }
}

export async function runPlatformEvolutionAudit({ force = false } = {}) {
  const now = Date.now();
  if (!force && _cache.report && now - _cache.at < CACHE_TTL_MS) {
    return { ..._cache.report, cached: true };
  }
  if (_cache.running) return _cache.running;
  _cache.running = (async () => {
    try {
      const report = await computeAudit();
      _cache = { at: Date.now(), report, running: null };
      return report;
    } catch (err) {
      _cache.running = null;
      throw err;
    }
  })();
  return _cache.running;
}

// Quarantine inventory — retired/duplicate owners are MOVED into `.quarantine/`
// (never deleted), so the audit can still account for them. `.quarantine` is a
// dot-dir that walk() deliberately skips, so we read it explicitly here for
// traceability of retired owners. Read-only.
function scanQuarantineInventory() {
  const qroot = path.join(ROOT, ".quarantine");
  const items = [];
  let batches;
  try {
    batches = fs.readdirSync(qroot, { withFileTypes: true });
  } catch {
    return items; // no quarantine dir → nothing retired
  }
  for (const b of batches) {
    if (!b.isDirectory()) continue;
    const batchDir = path.join(qroot, b.name);
    const manifest = readSafe(path.join(batchDir, "MANIFEST.txt")).trim();
    const files = [];
    const collect = (dir) => {
      let ents;
      try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const e of ents) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) collect(full);
        else if (e.isFile() && e.name !== "MANIFEST.txt") files.push(rel(full));
      }
    };
    collect(batchDir);
    items.push({ batch: b.name, manifest: manifest || null, files });
  }
  return items;
}

async function computeAudit() {
  const startedAt = Date.now();
  const files = walk(ROOT);

  const categories = [];
  let critical = 0, warning = 0, info = 0;
  let score = 100;

  for (const def of CATEGORY_DEFS) {
    let result;
    try {
      result = def.scan(files) || { findings: [] };
    } catch (err) {
      result = {
        findings: [{
          severity: "warning",
          message: `Scanner failed: ${err?.message || String(err)}`,
          location: def.id,
          recommendation: "Investigate the scanner; the audit completed the other categories.",
        }],
      };
    }
    const findings = result.findings || [];
    let catPenalty = 0;
    for (const fnd of findings) {
      if (fnd.severity === "critical") critical++;
      else if (fnd.severity === "warning") warning++;
      else info++;
      catPenalty += SEVERITY_WEIGHT[fnd.severity] || 0;
    }
    score -= Math.min(catPenalty, CATEGORY_PENALTY_CAP);
    categories.push({
      id: def.id,
      name: def.name,
      description: def.description,
      severity: topSeverity(findings),
      count: findings.length,
      truncated: !!result.truncated,
      note: result.note || null,
      findings: findings.slice(0, MAX_FINDINGS_PER_CATEGORY),
    });
  }

  score = Math.max(0, Math.round(score));
  const verdict = score >= 90 ? "green" : score >= 70 ? "amber" : "red";
  const total = critical + warning + info;

  // Trend memory: record only when the health state actually changes, so the
  // history reads as an evolution log rather than a poll log.
  const priorHistory = readEvolutionHistory();
  const previous = priorHistory.length ? priorHistory[priorHistory.length - 1] : null;
  const changed = !previous
    || previous.score !== score || previous.total !== total
    || previous.critical !== critical || previous.warning !== warning || previous.info !== info;
  const entry = { at: new Date().toISOString(), score, verdict, total, critical, warning, info };
  const history = changed ? appendEvolutionHistory(entry) : priorHistory;
  const trend = previous
    ? { previousScore: previous.score, delta: score - previous.score, direction: score > previous.score ? "up" : score < previous.score ? "down" : "flat" }
    : null;

  return {
    tool: "Platform Evolution Control Tool",
    version: "v1",
    mode: "audit-only",
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    filesScanned: files.length,
    score,
    verdict,
    summary: { total, critical, warning, info },
    categories,
    remediationPlan: buildRemediationPlan(categories),
    quarantine: scanQuarantineInventory(),
    history,
    trend,
  };
}

export default { runPlatformEvolutionAudit };
