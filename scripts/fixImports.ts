// scripts/fixImports.ts — safe, fast, first-party only
import fs from "fs";
import path from "path";

// Scan these project folders only (adjust as needed)
const ROOTS = ["MyMentalHealthBuddy", "server", "scripts", "src"].map(p =>
  path.join(process.cwd(), p)
);

// never touch third-party or build outputs
const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", ".vite", ".next", ".turbo", ".cache"
]);

const EXTS = [".ts", ".tsx", ".js", ".mjs", ".cjs"];

const FIXES: Array<[RegExp, string]> = [
  [/\.j\.js"s"/g, ".js"],
  [/child_process/g, "child_process"],
  [/node:fs/g, "node:fs"],
  [/@jest\/global"s"/g, "@jest/globals"],
  [/console\.log\("([^"`]*?)\$\{([^}]+)\}([^"`]*?)"\)/g, "console.log(`$1\${$2}$3`)"],
  [/performance\.mark\("([^"`]*?)\$\{([^}]+)\}([^"`]*?)"\)/g, "performance.mark(`$1\${$2}$3`)"],
  [/\{\;/g, "{"], [/\;\}/g, "}"], [/;0\./g, "* 0."]
];

function healText(t: string) { return FIXES.reduce((s,[rx,repl])=>s.replace(rx,repl), t); }

function healFile(fp: string) {
  const txt = fs.readFileSync(fp, "utf8");
  const out = healText(txt);
  if (out !== txt) { fs.writeFileSync(fp, out); console.log("🩹 Fixed:", fp); }
}

function walk(dir: string) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (EXTS.some(e => name.endsWith(e))) healFile(p);
  }
}

for (const r of ROOTS) if (fs.existsSync(r)) walk(r);
console.log("✅ All import/template/semicolon repairs complete");
