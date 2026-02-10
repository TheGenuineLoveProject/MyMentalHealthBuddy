#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
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
}

function fileExists(rel) {
  return existsSync(join(ROOT, rel));
}

function readFile(rel) {
  try { return readFileSync(join(ROOT, rel), "utf-8"); } catch { return null; }
}

function runCmd(cmd) {
  try { return execSync(cmd, { cwd: ROOT, stdio: "pipe", timeout: 30000 }).toString(); } catch { return null; }
}

console.log(`\n${BOLD}╔══════════════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}║  The Genuine Love Project — Platform Evolve Check ║${RESET}`);
console.log(`${BOLD}╚══════════════════════════════════════════════════╝${RESET}`);
console.log(`${DIM}  Safe evolution · Additive only · Privacy-first${RESET}`);
console.log(`${DIM}  ${new Date().toISOString()}${RESET}`);

section("1. Critical Files");
const criticalFiles = [
  "server/index.mjs",
  "server/dev.mjs",
  "client/src/App.jsx",
  "shared/schema.mjs",  // or shared/schema.ts
  "client/src/pages/BlogIndex.jsx",
  "client/src/pages/BlogPost.jsx",
  "client/src/pages/admin/NarrativeOpsConsole.jsx",
  "server/routes/blog.mjs",
  "server/routes/social-enterprise.mjs",
  "client/src/components/NewsletterSignup.jsx",
];
for (const f of criticalFiles) {
  const base = f.replace(/\s*\/\/.*$/, "").trim();
  const altExt = base.endsWith(".mjs") ? base.replace(".mjs", ".ts") : base.endsWith(".ts") ? base.replace(".ts", ".mjs") : null;
  const found = fileExists(base) || (altExt && fileExists(altExt));
  check(base, found, "missing");
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

const runBuild = process.argv.includes("--build");
if (runBuild) {
  const buildResult = runCmd("npx vite build --mode production 2>&1 | tail -10");
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

section("4. Route Wiring");
const appJsx = readFile("client/src/App.jsx") || "";
const routeMatches = appJsx.match(/<Route\s+path="/g);
const routeCount = routeMatches ? routeMatches.length : 0;
check(`Frontend routes defined (${routeCount})`, routeCount > 50, `only ${routeCount} routes found`);

const blogRouteOk = appJsx.includes('path="/blog"') && appJsx.includes("BlogIndex");
check("/blog wired to BlogIndex", blogRouteOk, "blog route uses static ConfigRoute");

const blogSlugOk = appJsx.includes('path="/blog/:slug"') && appJsx.includes("BlogPost");
check("/blog/:slug wired to BlogPost", blogSlugOk, "blog post route missing");

const crisisRouteOk = appJsx.includes('path="/crisis"');
check("/crisis route exists", crisisRouteOk, "crisis route missing");

section("5. Publishing Loop");
const blogMjs = readFile("server/routes/blog.mjs") || "";
check("Blog API: GET /", blogMjs.includes('router.get("/",'), "missing public list endpoint");
check("Blog API: GET /:slug", blogMjs.includes('router.get("/:slug"'), "missing single post endpoint");
check("Blog API: POST /", blogMjs.includes('router.post("/",'), "missing create endpoint");
check("Blog API: RSS feed", blogMjs.includes("/rss"), "no RSS endpoint");
check("Blog API: Admin publish", blogMjs.includes("/publish"), "no publish workflow");
check("Blog API: Comments", blogMjs.includes("/comments"), "no comment system");

const socialMjs = readFile("server/routes/social-enterprise.mjs") || "";
check("Social API: generate-from-blog", socialMjs.includes("generate-from-blog"), "blog-to-social missing");
check("Social API: campaigns", socialMjs.includes("/campaigns"), "campaigns missing");
check("Social API: weekly-queue", socialMjs.includes("weekly-queue"), "weekly queue missing");
check("Social API: UTM builder", socialMjs.includes("build-utm") || socialMjs.includes("utm"), "UTM missing");
check("Social API: audit log", socialMjs.includes("/audit"), "audit log missing");
check("Social API: signals", socialMjs.includes("/signals"), "signals missing");

const newsletterExists = fileExists("client/src/components/NewsletterSignup.jsx");
const blogIndexHasNewsletter = (readFile("client/src/pages/BlogIndex.jsx") || "").includes("NewsletterSignup");
check("Newsletter signup in BlogIndex", newsletterExists && blogIndexHasNewsletter, "newsletter not integrated in blog");

section("6. Security & Secrets");
const knownSecrets = ["ADMIN_TOKEN", "PERPLEXITY_API_KEY", "GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"];
for (const s of knownSecrets) {
  if (process.env[s]) {
    check(`Secret: ${s}`, true);
  } else {
    warn(`Secret: ${s}`, "not set — may be needed for full functionality");
  }
}

const devMjs = readFile("server/dev.mjs") || "";
const indexMjs = readFile("server/index.mjs") || "";
check("Helmet security headers (prod)", indexMjs.includes("helmet"), "missing");
check("Rate limiting configured", indexMjs.includes("rateLimit") || indexMjs.includes("rate-limit") || indexMjs.includes("rateLimiter"), "missing");
check("CORS configured", indexMjs.includes("cors"), "missing");

section("7. Enterprise Social Console");
const narrativeConsole = readFile("client/src/pages/admin/NarrativeOpsConsole.jsx") || "";
const consoleFeatures = [
  ["Pipeline tab", "pipeline"],
  ["Campaigns tab", "campaigns"],
  ["Weekly Queue tab", "weekly"],
  ["UTM Builder tab", "utm"],
  ["Signals tab", "signals"],
  ["Audit Log tab", "audit"],
  ["Multi-platform support", "PLATFORM_INFO"],
  ["Copy buttons", "CopyBtn"],
  ["Status transitions", "transitionMutation"],
  ["Blog-to-social repurposing", "blogToSocialMutation"],
  ["Schedule modal", "scheduleMutation"],
  ["Safety checks", "safetyErrors"],
];
for (const [label, token] of consoleFeatures) {
  check(label, narrativeConsole.includes(token), "missing");
}

section("8. Accessibility & SEO");
check("SEO component exists", fileExists("client/src/components/SEO.jsx") || fileExists("client/src/components/SEO.tsx"));
const hasA11yToolbar = fileExists("client/src/components/AccessibilityToolbar.jsx") || fileExists("client/src/components/a11y/AccessibilityToolbar.jsx");
check("Accessibility toolbar", hasA11yToolbar || appJsx.includes("AccessibilityToolbar"), "missing");
check("SafetyFooter component", fileExists("client/src/components/ui/SafetyFooter.jsx"));

section("9. Server Parity");
const devRouteCount = (devMjs.match(/app\.use\(/g) || []).length;
const prodRouteCount = (indexMjs.match(/app\.use\(/g) || []).length;
check(
  `Server route mounts (dev: ${devRouteCount}, prod: ${prodRouteCount})`,
  Math.abs(devRouteCount - prodRouteCount) <= 3,
  `mismatch: dev=${devRouteCount} vs prod=${prodRouteCount}`
);

const devAuthRoute = devMjs.includes("/api/auth");
const prodAuthRoute = indexMjs.includes("/api/auth");
check("Auth route in dev server", devAuthRoute, "missing");
check("Auth route in prod server", prodAuthRoute, "missing");

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
if (score >= 90) {
  console.log(`  ${DIM}Ready for safe evolution.${RESET}\n`);
} else if (score >= 70) {
  console.log(`  ${DIM}Mostly healthy — address issues above before publishing.${RESET}\n`);
} else {
  console.log(`  ${DIM}Needs attention — resolve critical issues first.${RESET}\n`);
}

process.exit(failed > 0 ? 1 : 0);
