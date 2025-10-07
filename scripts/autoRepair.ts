// scripts/autoRepair.ts
import fs from "fs";
import path from "path";
console.log("🩹 Auto-Repair System Activated");
// Directories to check (no /src/ folder needed)
const targetDirs = ["server", "shared", "scripts", "types"];
function walk(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList; // skip if folder missing
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) walk(fullPath, fileList);
    else if (/\.(ts|tsx)$/.test(file)) fileList.push(fullPath);
  }
  return fileList;
}
function healFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf8");
  const patterns = [
    { bad: /;+/g, good: ";" },
    { bad: /==\s*=/g, good: "===" },
    { bad: /console\.log\(.*\);{2,}/g, good: "console.log();" },
    { bad: /import\s+\{\s*default\s*\}\s+from\s+['"].+['"];?/g, good: "" },
    { bad: /\s+$/gm, good: "" }, // remove trailing spaces
  ];
  let fixed = false;
  for (const { bad, good } of patterns) {
    if (bad.test(content)) {
      content = content.replace(bad, good);
      fixed = true;
    }
  }
  if (fixed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Healed: ${filePath}`);
  }
}
for (const dir of targetDirs) {
  const files = walk(path.join(process.cwd(), dir));
  files.forEach(healFile);
}
console.log("✨ Auto-Repair Complete! All active folders healed.");