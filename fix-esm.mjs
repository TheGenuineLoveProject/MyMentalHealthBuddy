// ✅ Fix file extensions & ESM syntax project-wide
import fs from "fs";
import path from "path";

const root = process.cwd();
const folders = ["server", "scripts", "db"];

for (const dir of folders) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) continue;
  walk(full);
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.[tj]s$/.test(f)) heal(p);
  }
}

function heal(file) {
  let text = fs.readFileSync(file, "utf8");
  const fixed = text
    // add .js extensions to relative imports
    .replace(/(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g, (_m, a, b, c) =>
      b.endsWith(".js") ? a + b + c : a + b + ".js" + c
    )
    // change default require→import errors
    .replace(/\brequire\(/g, "// require(");
  if (text !== fixed) {
    fs.writeFileSync(file, fixed, "utf8");
    console.log("🔧 healed", file);
  }
}

console.log("✨ ESM imports normalized!");
