import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function listFiles(dir, { max = 5000 } = {}) {
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

      // Skip noisy/huge folders
      if (
        e.isDirectory() &&
        ["node_modules", ".git", "dist", "build", ".next", ".cache", ".turbo"].includes(e.name)
      ) {
        continue;
      }

      if (e.isDirectory()) stack.push(full);
      else out.push(full);
    }
  }
  return out;
}

function scanTodos() {
  try {
    const cmd =
      `grep -RIn "TODO\\|FIXME" ` +
      `server client scripts --include="*.mjs" --include="*.js" --include="*.ts" --include="*.tsx" --include="*.jsx" ` +
      `2>/dev/null | grep -v node_modules || true`;
    const res = execSync(cmd, { encoding: "utf8" });
    return res.split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function scanEmptyFiles(fileList) {
  const empties = [];
  for (const f of fileList) {
    const text = safeRead(f);
    if (text.trim().length === 0) empties.push(f);
  }
  return empties;
}

function scanEnvVars(required) {
  return required.map((key) => ({ key, set: Boolean(process.env[key]) }));
}

function findRoutes(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mjs") || f.endsWith(".js"))
    .map((f) => path.join(dir, f));
}

function findPages(dir) {
  if (!fs.existsSync(dir)) return [];
  const all = listFiles(dir);
  return all.filter((f) => f.endsWith(".tsx") || f.endsWith(".jsx"));
}

function main() {
  const report = {
    timestamp: new Date().toISOString(),
    project: path.basename(ROOT),
    routes: [],
    pages: [],
    emptyFiles: [],
    todos: [],
    env: [],
    notes: [],
  };

  const routeFiles = findRoutes(path.join(ROOT, "server/routes"));
  const pageFiles = findPages(path.join(ROOT, "client/src/pages"));

  // Routes summary
  for (const f of routeFiles) {
    const text = safeRead(f);
    report.routes.push({
      file: path.relative(ROOT, f),
      empty: text.trim().length === 0,
      hasTodo: /TODO|FIXME/.test(text),
      exportsRouter: /export\s+default\s+router|module\.exports\s*=/.test(text),
    });
  }

  // Pages summary
  for (const f of pageFiles) {
    const text = safeRead(f);
    report.pages.push({
      file: path.relative(ROOT, f),
      hasTodo: /TODO|FIXME/.test(text),
      length: text.length,
    });
  }

  // Empty files anywhere (excluding big dirs by listFiles)
  const allFiles = listFiles(ROOT);
  report.emptyFiles = scanEmptyFiles(allFiles).map((f) => path.relative(ROOT, f));

  // TODOs
  report.todos = scanTodos();

  // Required env vars (adjust as needed)
  report.env = scanEnvVars([
    "DATABASE_URL",
    "SESSION_SECRET",
    "OPENAI_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ]);

  // Helpful notes
  const missingEnv = report.env.filter((x) => !x.set).map((x) => x.key);
  if (missingEnv.length) {
    report.notes.push(`Missing env vars: ${missingEnv.join(", ")}`);
  }

  fs.writeFileSync("audit-report.json", JSON.stringify(report, null, 2), "utf8");
  console.log("✅ Platform audit complete: audit-report.json");
  console.log(`Routes: ${report.routes.length} | Pages: ${report.pages.length} | TODO lines: ${report.todos.length}`);
}

main();