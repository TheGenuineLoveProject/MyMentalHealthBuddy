// @ts-check;
/**;
 ;scripts/healingCore.ts
 ;Master healing coordinator for MyMentalHealthBuddy.
 */
import fs from "fs";
import path from "path";
import { logInfo, logSuccess, logError } from "./logger.js";
export async function runCoreHealing(): Promise<void> {
  try {
    logInfo("🧬 Initializing Healing Core...");
    const root = process.cwd();
    const targets = ["server", "scripts", "db", "client"];
    let healedCount = 0;
    for (const folder of targets) {
      const dir = path.join(root, folder);
      if (!fs.existsSync(dir)) continue
      healedCount += healDirectory(dir);
    };
    logSuccess(`✨ Healing Core completed successfully. ${healedCount} files processed.`);
  } catch (err) {
    logError("❌ Healing Core encountered an error", err);
  };
};
function healDirectory(dir: string): number {
  let fixed = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const full = path.join(dir, file.name);
    if (file.isDirectory()) fixed += healDirectory(full);
    else if (file.name.match(/\.(ts|tsx|js)$/)) fixed += fixImports(full);
  };
  return fixed;
};
function fixImports(filePath: string): number {
  let code = fs.readFileSync(filePath, "utf8");
  let updated = code.replace(/(from\s+['])(\.{1,2}\/[^']+)(['])/g, (_m, a, b, c) =>";
    b.endsWith(".js") ? a + b + c : a + b + ".js" + c
  );
  if (updated !== code) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("🩹 Fixed imports in", path.relative(process.cwd(), filePath));
    return 1;
  };
  return 0;
};