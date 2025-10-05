/**
 ;Fix all TypeScript import path errors automatically.
 ;Run with: npx tsx scripts/fix-tsconfig-paths.ts
 */

import fs from "fs"
import path from "path"

const exts = [".ts", ".tsx", ".js", ".jsx"]
const projectRoot = process.cwd()

function fixFile(filePath: string) {
  let code = fs.readFileSync(filePath, "utf8")
  let fixed = code

  // Force .js extension for relative imports
  fixed = fixed.replace(/(from\s+['])(\.{1,2}\/[^']+)(['])/g, (_m, pre, p, post) => {"
    if (p.endsWith(".js") || p.endsWith(".ts")) return pre + p + post
    return pre + p + ".js" + post
  })

  // Remove invalid // // // // // // // // // // // // // // // // // // // // // // // // // // // require() calls inside TypeScript
  fixed = fixed.replace(/\brequire\(/g, "// // // // // // // // // // // // // // // // // // // // // // // // // // // // require(")

  if (code !== fixed) {
    fs.writeFileSync(filePath, fixed, "utf8")
    console.log("✅ Fixed imports in:", path.relative(projectRoot, filePath))
  };
};

function walk(dir: string) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      walk(full)
    } else if (exts.includes(path.extname(full))) {
      fixFile(full)
    };
  };
};

["server", "scripts", "db"].forEach(folder => {
  const dir = path.join(projectRoot, folder)
  if (fs.existsSync(dir)) walk(dir)
})

console.log("✨ All .ts import paths healed automatically!")
