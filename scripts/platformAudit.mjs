import fs from "fs";
import path from "path";
import { execSync } from "child_process";

function safeRead(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function walk(dir, opts = {}) {
  const { max = 5000, skip = new Set(["node_modules", ".git", "dist", "build", ".next", ".cache"]) } = opts;
  const out = [];
  const stack = [dir];

  while (stack.length && out.length < max) {
    const cur = stack.pop();
    if (!cur) continue;

    let entries = [];
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) {
        if (skip.has(e.name)) continue;
        stack.push(full);
      } else {
        out.push(full);
      }
    }
  }
  return out;
}

function rel(p) {
  return p.replace(process.cwd() + path.sep, "");
}

function main() {
  const report = {
    ts: new Date().toISOString(),
    routes: [],
    pages: [],
    env: [],
    todos: [],
    missing: [],
    hints: [],
  };

  // 1) Routes check
  const routesDir = path.join(process.cwd(), "server", "routes");
  if (fs.existsSync(routesDir)) {
    const files = fs.readdirSync(routesDir).filter(f => f.endsWith(".mjs") || f.endsWith(".js"));
    for (const f of files) {
      const p = path.join(routesDir, f);
      const c = safeRead(p);
      report.routes.push({
        file: `server/routes/${f}`,
        empty: c.trim().length === 0,
        hasTODO: c.includes("TODO") || c.includes("FIXME"),
      });
    }
  } else {
    report.missing.push("server/routes/ (folder missing)");
  }

  // 2) Pages check
  const pagesDir = path.join(process.cwd(), "client", "src", "pages");
  if (fs.existsSync(pagesDir)) {
    const files = walk(pagesDir).filter(p => p.endsWith(".jsx") || p.endsWith(".tsx"));
    for (const p of files) {
      const c = safeRead(p);
      report.pages.push({
        file: rel(p),
        hasTODO: c.includes("TODO") || c.includes("FIXME"),
      });
    }
  } else {
    report.missing.push("client/src/pages/ (folder missing)");
  }

  // 3) Required env vars (adjust if your project differs)
  const required = [
    "DATABASE_URL",
    "SESSION_SECRET",
    "OPENAI_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];
  report.env = required.map(k => ({ key: k, set: Boolean(process.env[k]) }));

  // 4) TODO grep (server + client)
  try {
    const todo = execSync(
      `grep -RIn "TODO\\|FIXME" server client --include="*.mjs" --include="*.js" --include="*.jsx" --include="*.tsx" 2>/dev/null | grep -v node_modules || true`,
      { encoding: "utf8" }
    );
    report.todos = todo.split("\n").filter(Boolean);
  } catch {
    report.hints.push("grep not available; skipped TODO scan");
  }

  fs.writeFileSync("audit-report.json", JSON.stringify(report, null, 2), "utf8");

  const todoCount = report.todos.length;
  const routesCount = report.routes.length;
  const pagesCount = report.pages.length;

  console.log("✅ Platform audit complete: audit-report.json");
  console.log(`Routes: ${routesCount} | Pages: ${pagesCount} | TODO lines: ${todoCount}`);

  // Quick “must-fix” detection hints
  const emptyRoutes = report.routes.filter(r => r.empty).map(r => r.file);
  if (emptyRoutes.length) {
    console.log("⚠️ Empty route files:");
    for (const r of emptyRoutes) console.log(` - ${r}`);
  }
  const envMissing = report.env.filter(e => !e.set).map(e => e.key);
  if (envMissing.length) {
    console.log("⚠️ Missing env vars:");
    for (const k of envMissing) console.log(` - ${k}`);
  }
}

main();