#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const REPORTS_DIR = path.join(ROOT, "docs/reports");
fs.mkdirSync(REPORTS_DIR, { recursive: true });

const SERVER_INDEX = path.join(ROOT, "server/index.mjs");
const APP_JSX = path.join(ROOT, "client/src/App.jsx");

const serverRoutes = [];
if (fs.existsSync(SERVER_INDEX)) {
  const content = fs.readFileSync(SERVER_INDEX, "utf-8");
  const useRegex = /app\.use\(\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = useRegex.exec(content)) !== null) {
    serverRoutes.push(m[1]);
  }
}

const clientRoutes = [];
if (fs.existsSync(APP_JSX)) {
  const content = fs.readFileSync(APP_JSX, "utf-8");
  const routeRegex = /path="([^"]+)"/g;
  let m;
  while ((m = routeRegex.exec(content)) !== null) {
    clientRoutes.push(m[1]);
  }
}

const apiRoutes = serverRoutes.filter(r => r.startsWith("/api/") || r === "/rss.xml" || r === "/health");
const publicMounts = serverRoutes.filter(r => !r.startsWith("/api/") && r !== "/rss.xml" && r !== "/health");

let md = `# Route Snapshot Report\n\n`;
md += `Generated: ${new Date().toISOString()}\n\n`;
md += `## Server Routes (${serverRoutes.length} mounted)\n\n`;
md += `### API Routes (${apiRoutes.length})\n\n`;
for (const r of apiRoutes.sort()) md += `- \`${r}\`\n`;
md += `\n### Other Server Mounts (${publicMounts.length})\n\n`;
for (const r of publicMounts.sort()) md += `- \`${r}\`\n`;
md += `\n## Client Routes (${clientRoutes.length} defined in App.jsx)\n\n`;
const categories = {
  "Public Pages": [],
  "Auth Pages": [],
  "Protected Pages": [],
  "Admin Pages": [],
  "Tools Pages": [],
  "Learning Pages": [],
  "Legal Pages": [],
  "Other": [],
};
for (const r of clientRoutes.sort()) {
  if (r.startsWith("/admin/")) categories["Admin Pages"].push(r);
  else if (r.startsWith("/tools/") || r === "/tools") categories["Tools Pages"].push(r);
  else if (r.startsWith("/learn") || r === "/guides" || r === "/articles" || r === "/tutorials" || r === "/lessons" || r === "/training" || r === "/education" || r === "/courses" || r === "/library" || r.startsWith("/workshop") || r === "/programs") categories["Learning Pages"].push(r);
  else if (["/login", "/register", "/signup", "/sign-up", "/signin", "/sign-in", "/forgot-password", "/reset-password", "/create-account", "/login/callback"].includes(r)) categories["Auth Pages"].push(r);
  else if (["/terms", "/tos", "/privacy", "/legal", "/ethics", "/disclaimer", "/safety", "/accessibility", "/cookies"].includes(r)) categories["Legal Pages"].push(r);
  else if (["/dashboard", "/today", "/mood", "/state", "/journal", "/chat", "/ai-chat", "/therapy", "/coach", "/mentor", "/sessions", "/analytics", "/settings", "/reminders", "/voice-settings", "/profile", "/goals", "/preferences/notifications", "/preferences/safety"].includes(r) || r.startsWith("/account/")) categories["Protected Pages"].push(r);
  else if (["/", "/landing", "/healing", "/about", "/about/approach", "/values", "/features", "/testimonials", "/canva-landing", "/pricing", "/challenge", "/crisis", "/blog", "/newsletter", "/community"].includes(r) || r === "/original-home") categories["Public Pages"].push(r);
  else categories["Other"].push(r);
}
for (const [cat, routes] of Object.entries(categories)) {
  if (routes.length === 0) continue;
  md += `### ${cat} (${routes.length})\n\n`;
  for (const r of routes) md += `- \`${r}\`\n`;
  md += `\n`;
}

fs.writeFileSync(path.join(REPORTS_DIR, "route-snapshot.md"), md);
console.log("=== Route Snapshot ===");
console.log(`Server routes: ${serverRoutes.length}`);
console.log(`Client routes: ${clientRoutes.length}`);
console.log(`Report: docs/reports/route-snapshot.md`);
