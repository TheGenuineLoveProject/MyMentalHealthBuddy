// fix-extensions.ts (verbose version)
import fs from "fs";
import path from "path";

let totalFiles = 0;
let totalChanges = 0;

function walkAndFix(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkAndFix(full);
    } else if (full.endsWith(".ts")) {
      totalFiles++;
      let content = fs.readFileSync(full, "utf8");
      const updated = content.replace(
        /from\s+['"](\.\/[^'"]+)(?<!\.js)['"]/g,
        (_m, p1) => `from '${p1}.js'`
      );
      if (content !== updated) {
        totalChanges++;
        fs.writeFileSync(full, updated, "utf8");
        console.log(`✅ Fixed imports in: ${full}`);
      }
    }
  }
}

["server", "scripts", "db"].forEach(walkAndFix);

console.log(`✨ Checked ${totalFiles} .ts files`);
console.log(`💡 Updated ${totalChanges} files with missing .js extensions`);