#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const REPORTS_DIR = path.join(ROOT, "docs/reports");
fs.mkdirSync(REPORTS_DIR, { recursive: true });

const BASE = process.argv[2] || "http://localhost:5000";

const PUBLIC_PAGES = [
  "/", "/about", "/pricing", "/blog", "/newsletter", "/crisis",
  "/community", "/tools", "/login", "/register", "/learn",
  "/about/approach", "/values", "/features", "/landing",
  "/terms", "/privacy", "/safety", "/ethics", "/disclaimer",
  "/roadmap", "/our-story", "/press", "/courses", "/coming-soon",
];

const HEALTH_ENDPOINTS = [
  "/api/health",
  "/health",
];

const API_ENDPOINTS = [
  { path: "/api/auth/user", expectAuth: true },
  { path: "/api/mood", expectAuth: true },
  { path: "/api/journal", expectAuth: true },
  { path: "/api/blog", expectAuth: false },
  { path: "/api/leads", expectAuth: false },
  { path: "/api/health", expectAuth: false },
];

function probe(url) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve({ status: 0, error: "TIMEOUT" }), 5000);
    try {
      const req = http.get(url, { timeout: 5000 }, (res) => {
        clearTimeout(timeout);
        let body = "";
        res.on("data", (d) => body += d.toString().substring(0, 500));
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, bodyPreview: body.substring(0, 200) }));
      });
      req.on("error", (err) => {
        clearTimeout(timeout);
        resolve({ status: 0, error: err.message });
      });
    } catch (e) {
      clearTimeout(timeout);
      resolve({ status: 0, error: e.message });
    }
  });
}

async function run() {
  console.log("=== Route Probes ===");
  console.log(`Base: ${BASE}\n`);

  const results = [];

  for (const page of PUBLIC_PAGES) {
    const url = `${BASE}${page}`;
    const r = await probe(url);
    const pass = r.status === 200 || r.status === 302 || r.status === 301;
    results.push({ path: page, type: "page", status: r.status, pass, error: r.error || null });
    console.log(`${pass ? "PASS" : "FAIL"} ${page} -> ${r.status || r.error}`);
  }

  for (const ep of HEALTH_ENDPOINTS) {
    const url = `${BASE}${ep}`;
    const r = await probe(url);
    const pass = r.status === 200;
    results.push({ path: ep, type: "health", status: r.status, pass, error: r.error || null });
    console.log(`${pass ? "PASS" : "FAIL"} ${ep} -> ${r.status || r.error}`);
  }

  for (const ep of API_ENDPOINTS) {
    const url = `${BASE}${ep.path}`;
    const r = await probe(url);
    const pass = ep.expectAuth ? (r.status === 401 || r.status === 403 || r.status === 200) : (r.status === 200 || r.status === 302);
    results.push({ path: ep.path, type: "api", status: r.status, pass, expectAuth: ep.expectAuth, error: r.error || null });
    console.log(`${pass ? "PASS" : "FAIL"} ${ep.path} -> ${r.status || r.error}${ep.expectAuth ? " (auth expected)" : ""}`);
  }

  const passCount = results.filter(r => r.pass).length;
  const failCount = results.filter(r => !r.pass).length;

  let md = `# Route Probe Report\n\n`;
  md += `Generated: ${new Date().toISOString()}\n`;
  md += `Base URL: ${BASE}\n\n`;
  md += `## Summary\n\n`;
  md += `| Result | Count |\n|--------|-------|\n`;
  md += `| PASS | ${passCount} |\n`;
  md += `| FAIL | ${failCount} |\n`;
  md += `| Total | ${results.length} |\n\n`;

  md += `## Public Pages\n\n`;
  md += `| Path | Status | Result |\n|------|--------|--------|\n`;
  for (const r of results.filter(x => x.type === "page")) {
    md += `| \`${r.path}\` | ${r.status || r.error} | ${r.pass ? "PASS" : "FAIL"} |\n`;
  }

  md += `\n## Health Endpoints\n\n`;
  md += `| Path | Status | Result |\n|------|--------|--------|\n`;
  for (const r of results.filter(x => x.type === "health")) {
    md += `| \`${r.path}\` | ${r.status || r.error} | ${r.pass ? "PASS" : "FAIL"} |\n`;
  }

  md += `\n## API Endpoints\n\n`;
  md += `| Path | Status | Auth Expected | Result |\n|------|--------|---------------|--------|\n`;
  for (const r of results.filter(x => x.type === "api")) {
    md += `| \`${r.path}\` | ${r.status || r.error} | ${r.expectAuth ? "yes" : "no"} | ${r.pass ? "PASS" : "FAIL"} |\n`;
  }

  if (failCount > 0) {
    md += `\n## Failed Routes\n\n`;
    for (const r of results.filter(x => !x.pass)) {
      md += `- **${r.path}** — Status: ${r.status || r.error}\n`;
    }
  }

  fs.writeFileSync(path.join(REPORTS_DIR, "probe-routes.md"), md);
  console.log(`\n${passCount} PASS / ${failCount} FAIL`);
  console.log(`Report: docs/reports/probe-routes.md`);
}

run().catch(console.error);
