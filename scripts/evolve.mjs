#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, join } from "path";
import { execSync } from "child_process";

const ROOT = resolve(import.meta.dirname || ".", "..");
const OK = "\x1b[32m✓\x1b[0m";
const FAIL = "\x1b[31m✗\x1b[0m";
const WARN = "\x1b[33m⚠\x1b[0m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
const DIM = "\x1b[2m";

let passed = 0;
let failed = 0;
let warnings = 0;
const issues = [];
const sections = [];

function check(label, ok, detail) {
  if (ok) {
    console.log(`  ${OK} ${label}`);
    passed++;
  } else {
    console.log(`  ${FAIL} ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
    issues.push({ label, detail });
  }
}

function warn(label, detail) {
  console.log(`  ${WARN} ${label}${detail ? ` — ${detail}` : ""}`);
  warnings++;
}

function section(title) {
  console.log(`\n${BOLD}▸ ${title}${RESET}`);
  sections.push(title);
}

function fileExists(rel) {
  return existsSync(join(ROOT, rel));
}

function readFile(rel) {
  try { return readFileSync(join(ROOT, rel), "utf-8"); } catch { return null; }
}

function runCmd(cmd) {
  try { return execSync(cmd, { cwd: ROOT, stdio: "pipe", timeout: 60000 }).toString(); } catch (e) { return e.stdout ? e.stdout.toString() : null; }
}

function runScript(script) {
  try {
    const result = execSync(`node ${script}`, { cwd: ROOT, stdio: "pipe", timeout: 60000 }).toString();
    return { ok: true, output: result };
  } catch (e) {
    return { ok: false, output: e.stdout ? e.stdout.toString() : e.message };
  }
}

console.log(`\n${BOLD}╔══════════════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}║  The Genuine Love Project — Evolution Report      ║${RESET}`);
console.log(`${BOLD}╚══════════════════════════════════════════════════╝${RESET}`);
console.log(`${DIM}  Safe evolution · Additive only · Privacy-first${RESET}`);
console.log(`${DIM}  ${new Date().toISOString()}${RESET}`);

section("1. Critical Files");
const criticalFiles = [
  "server/index.mjs",
  "server/dev.mjs",
  "client/src/App.jsx",
  "shared/schema.mjs",
  "client/src/pages/BlogIndex.jsx",
  "client/src/pages/BlogPost.jsx",
  "client/src/pages/Newsletter.jsx",
  "client/src/pages/admin/AdminSocial.jsx",
  "server/routes/blog.mjs",
  "server/routes/social-enterprise.mjs",
  "server/routes/redirects.mjs",
  "server/routes/newsletter.mjs",
  "PLATFORM_LOCK.md",
  "docs/PLATFORM_LOCK.md",
];
for (const f of criticalFiles) {
  const found = fileExists(f);
  check(f, found, "missing");
}

section("2. Build Integrity");
const pkgJson = readFile("package.json");
let pkg = null;
try { pkg = JSON.parse(pkgJson); } catch {}
check("package.json parseable", !!pkg, "invalid JSON");
if (pkg) {
  check("build script defined", !!pkg.scripts?.build, "no build script");
  check("dev script defined", !!pkg.scripts?.dev, "no dev script");
  check("db:push script defined", !!pkg.scripts?.["db:push"], "no db:push script");
}

const lockfileExists = fileExists("package-lock.json") || fileExists("pnpm-lock.yaml") || fileExists("yarn.lock");
check("Lockfile present", lockfileExists, "no lockfile found");

const runBuild = process.argv.includes("--build");
if (runBuild) {
  const buildResult = runCmd("npx vite build --mode production 2>&1 | tail -20");
  if (buildResult !== null) {
    const hasBuiltIn = buildResult.includes("built in");
    const hasFatalError = buildResult.includes("ERROR") && !hasBuiltIn;
    check("Vite production build", hasBuiltIn || !hasFatalError, hasFatalError ? "build errors detected" : "");
  } else {
    check("Vite production build", false, "build command failed or timed out");
  }
} else {
  const viteConfig = fileExists("vite.config.ts") || fileExists("vite.config.js");
  check("Vite config present", viteConfig, "missing vite config");
  console.log(`  ${DIM}(use --build flag to run full production build)${RESET}`);
}

section("3. Database Connection");
const dbUrl = process.env.DATABASE_URL;
check("DATABASE_URL set", !!dbUrl, "missing env var");
if (dbUrl) {
  const validFormat = dbUrl.startsWith("postgres") && dbUrl.includes("@");
  check("DATABASE_URL format valid", validFormat, "URL doesn't look like a Postgres connection string");
  check("Drizzle config exists", fileExists("drizzle.config.ts") || fileExists("drizzle.config.js"), "missing drizzle config");
  check("Schema file exists", fileExists("shared/schema.mjs") || fileExists("shared/schema.ts"), "missing schema");
}

section("4. Link Audit");
const linkResult = runScript("scripts/audit-links.mjs");
check("Link audit runs", linkResult.ok, "script failed");
check("docs/LINK_AUDIT_REPORT.md generated", fileExists("docs/LINK_AUDIT_REPORT.md"), "missing report");

section("5. API Wiring Audit");
const apiResult = runScript("scripts/audit-api-usage.mjs");
check("API wiring audit runs", apiResult.ok, "script failed");
check("docs/API_WIRING_REPORT.md generated", fileExists("docs/API_WIRING_REPORT.md"), "missing report");

section("6. Security Audit");
const secResult = runScript("scripts/security-audit.mjs");
check("Security audit runs", secResult.ok || secResult.output.includes("PASS") || secResult.output.includes("WARN"), "script failed");
check("docs/SECURITY_STATUS.md generated", fileExists("docs/SECURITY_STATUS.md"), "missing report");

section("7. Publishing Loop");
const blogMjs = readFile("server/routes/blog.mjs") || "";
check("Blog API: GET list", blogMjs.includes('router.get("/",') || blogMjs.includes("router.get('/',"), "missing public list endpoint");
check("Blog API: GET slug", blogMjs.includes('router.get("/:slug"') || blogMjs.includes("/:slug"), "missing single post endpoint");
check("Blog API: POST create", blogMjs.includes('router.post("/",') || blogMjs.includes("router.post('/',"), "missing create endpoint");

const newsletterMjs = readFile("server/routes/newsletter.mjs") || "";
check("Newsletter: subscribe endpoint", newsletterMjs.includes("subscribe") || newsletterMjs.includes("router.post"), "missing subscribe");

section("8. Enterprise Social Console");
const adminSocial = readFile("client/src/pages/admin/AdminSocial.jsx") || "";
const socialFeatures = [
  ["Pipeline board", "PipelineBoard"],
  ["Weekly Queue", "WeeklyQueueView"],
  ["Post Editor", "PostEditor"],
  ["Per-platform captions", "Per-Platform Captions"],
  ["Copy buttons", "CopyButton"],
  ["Safety checks", "safetyCheck"],
  ["Banned phrases", "BANNED_PHRASES"],
  ["UTM Builder", "buildUtm"],
  ["Tracked links", "createTrackedLink"],
  ["Audit log", "AuditLogPanel"],
  ["Blog repurpose", "RepurposePanel"],
  ["Campaign modal", "CampaignModal"],
  ["Status transitions", "transitionPost"],
];
for (const [label, token] of socialFeatures) {
  check(label, adminSocial.includes(token), "missing");
}

const socialMjs = readFile("server/routes/social-enterprise.mjs") || "";
const socialEndpoints = [
  ["GET /posts", "router.get(\"/posts\""],
  ["POST /post", "router.post(\"/post\""],
  ["PUT /post/:id", "router.put(\"/post/:id\""],
  ["POST submit", "/submit"],
  ["POST approve", "/approve"],
  ["POST mark-posted", "/mark-posted"],
  ["GET /signals", "/signals"],
  ["GET /audit", "/audit"],
  ["GET /campaigns", "/campaigns"],
  ["POST /campaigns", "router.post(\"/campaigns\""],
  ["POST /build-utm", "/build-utm"],
  ["GET /weekly-queue", "/weekly-queue"],
  ["POST /generate-from-blog", "/generate-from-blog"],
  ["GET /click-stats", "/click-stats"],
];
for (const [label, token] of socialEndpoints) {
  check(`Social API: ${label}`, socialMjs.includes(token), "missing");
}

section("9. Redirect Tracking");
const redirectsMjs = readFile("server/routes/redirects.mjs") || "";
check("Redirects: slug handler", redirectsMjs.includes("/:slug"), "missing slug handler");
check("Redirects: click counter", redirectsMjs.includes("clicks") || redirectsMjs.includes("click"), "missing click tracking");

section("10. Security & Secrets");
const knownSecrets = ["ADMIN_TOKEN", "PERPLEXITY_API_KEY"];
for (const s of knownSecrets) {
  if (process.env[s]) {
    check(`Secret: ${s}`, true);
  } else {
    warn(`Secret: ${s}`, "not set — may be needed for full functionality");
  }
}

const indexMjs = readFile("server/index.mjs") || "";
check("Helmet security headers", indexMjs.includes("helmet"), "missing");
check("Rate limiting configured", indexMjs.includes("rateLimit") || indexMjs.includes("rate-limit") || indexMjs.includes("rateLimiter"), "missing");
check("CORS configured", indexMjs.includes("cors"), "missing");

section("11. Server Parity");
const devMjs = readFile("server/dev.mjs") || "";
const devRouteCount = (devMjs.match(/app\.use\(/g) || []).length;
const prodRouteCount = (indexMjs.match(/app\.use\(/g) || []).length;
check(
  `Server route mounts (dev: ${devRouteCount}, prod: ${prodRouteCount})`,
  Math.abs(devRouteCount - prodRouteCount) <= 5,
  `mismatch: dev=${devRouteCount} vs prod=${prodRouteCount}`
);

section("12. Enterprise Docs");
const enterpriseDocs = [
  "docs/PLATFORM_LOCK.md",
  "docs/LINK_AUDIT_REPORT.md",
  "docs/API_WIRING_REPORT.md",
  "docs/SECURITY_STATUS.md",
  "docs/PUBLISHING_RUNBOOK.md",
];
for (const doc of enterpriseDocs) {
  check(doc, fileExists(doc), "missing");
}

console.log(`\n${BOLD}╔══════════════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}║  Results                                          ║${RESET}`);
console.log(`${BOLD}╚══════════════════════════════════════════════════╝${RESET}`);
console.log(`  ${OK} Passed:   ${passed}`);
if (warnings > 0) console.log(`  ${WARN} Warnings: ${warnings}`);
if (failed > 0) {
  console.log(`  ${FAIL} Failed:   ${failed}`);
  console.log(`\n  ${BOLD}Issues to address:${RESET}`);
  for (const iss of issues) {
    console.log(`    ${FAIL} ${iss.label}${iss.detail ? ` — ${iss.detail}` : ""}`);
  }
}

const score = Math.round((passed / (passed + failed)) * 100);
const grade = score >= 95 ? "A+" : score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "D";
console.log(`\n  ${BOLD}Platform Confidence: ${score}% (${grade})${RESET}`);

let reportMd = `# Evolution Report\n\n`;
reportMd += `Generated: ${new Date().toISOString()}\n\n`;
reportMd += `## Summary\n\n`;
reportMd += `- Passed: ${passed}\n`;
reportMd += `- Warnings: ${warnings}\n`;
reportMd += `- Failed: ${failed}\n`;
reportMd += `- Score: ${score}% (${grade})\n\n`;

if (issues.length > 0) {
  reportMd += `## Issues\n\n`;
  for (const iss of issues) {
    reportMd += `- **${iss.label}**${iss.detail ? `: ${iss.detail}` : ""}\n`;
  }
  reportMd += `\n`;
}

reportMd += `## Status: ${failed === 0 ? "PASS" : "NEEDS ATTENTION"}\n\n`;
if (failed === 0) {
  reportMd += `All checks passed. Platform is enterprise-ready for safe evolution.\n`;
} else {
  reportMd += `${failed} issue(s) need attention before deployment.\n`;
}

const docsDir = join(ROOT, "docs");
if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });
writeFileSync(join(docsDir, "EVOLUTION_REPORT.md"), reportMd);
console.log(`\n  Report written to docs/EVOLUTION_REPORT.md`);

if (score >= 90) {
  console.log(`  ${DIM}Ready for safe evolution.${RESET}\n`);
} else if (score >= 70) {
  console.log(`  ${DIM}Mostly healthy — address issues above before publishing.${RESET}\n`);
} else {
  console.log(`  ${DIM}Needs attention — resolve critical issues first.${RESET}\n`);
}

process.exit(failed > 0 ? 1 : 0);
