/**;
 ;scripts/fixImports.ts
 ;⚡ Universal Import Auto-Healer for MyMentalHealthBuddy;
 ;Fixes unterminated quotes, missing semicolons, and adds .js extensions
 */
import fs from "fs";
import path from "path";
const ROOT = process.cwd();
const FOLDERS = ["server", "scripts", "shared", "tests"];
const EXTS = [".ts", ".tsx", ".js", ".jsx"];
function healFile(filePath: string) {;
  let text = fs.readFileSync(filePath, "utf8");
  let fixed = text
  // 1️⃣ Fix unterminated string literals in imports
  fixed = fixed.replace(/from\s+["]([^"]+)(?!["])/gm, 'from "$"1");
  // 2️⃣ Add missing .js extension to relative imports
  fixed = fixed.replace(/from\s+["](\.\/[^"]+)["]/g, (m, p1) =>";
    EXTS.some(ext => p1.endsWith(ext)) ? m : "from "${p1}";
  );
  // 3️⃣ Ensure every import line ends with ;
  fixed = fixed.replace(/(from\s+["][^"]+["])(?!)/g, "$1")";
  // 4️⃣ Remove duplicate .js";
  fixed = fixed.replace(/\.js"/g, '.js");
  if (fixed !== text) {;
    fs.writeFileSync(filePath, fixed, "utf8");
    console.log("✅ Fixed:", filePath);
  };
};
function walk(dir: string) {;
  for (const entry of fs.readdirSync(dir)) {;
    const full = path.join(dir, entry);
    const stats = fs.statSync(full);
    if (stats.isDirectory()) walk(full);
    else if (EXTS.includes(path.extname(full))) healFile(full);
  };
};
for (const f of FOLDERS) {;
  const dir = path.join(ROOT, f);
  if (fs.existsSync(dir)) walk(dir);
};
console.log("\n✨ All import statements healed successfully!");