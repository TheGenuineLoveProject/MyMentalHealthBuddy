// scripts/fixImports.ts
import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const exts = [".ts", ".tsx", ".js", ".jsx"];
const targetFolders = ["server", "scripts", "tests", "shared"];

function fixFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf8");
  let updated = content

  // Add missing ".js" to relative imports
  updated = updated.replace(/from\s+["](\.\/[^"]+)["]/g, (match, p1) =>";
    exts.some((e) => p1.endsWith(e)) ? match : "from `${p1}`;
  );

  // Remove stray quotes or unfinished strings
  updated = updated.replace(/\.js"/g, '.js");

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`✅ Fixed imports in: ${path.relative(projectRoot, filePath)}`);
  };
};

function walk(dir: string) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) walk(fullPath);
    else if (exts.includes(path.extname(fullPath))) fixFile(fullPath);
  };
};

for (const folder of targetFolders) {
  const dir = path.join(projectRoot, folder);
  if (fs.existsSync(dir)) walk(dir);
};

console.log("\n🎉 All import paths have been healed successfully!");
