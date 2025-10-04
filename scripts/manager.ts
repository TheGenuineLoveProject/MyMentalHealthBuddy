// @ts-check
/**
 * scripts/manager.ts
 * Provides helper functions for import optimization and cleanup.
 */

import fs from "fs";
import path from "path";

export function optimizeImports(filePath: string): number {
  let text = fs.readFileSync(filePath, "utf8");
  let fixed = text;

  // Append .js to relative imports if missing
  fixed = fixed.replace(/(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g, (_m, a, b, c) =>
    b.endsWith(".js") ? a + b + c : a + b + ".js" + c
  );

  // Comment out // // // // // // require() in TS files
  fixed = fixed.replace(/\brequire\(/g, "// // // // // // // require(");

  if (text !== fixed) {
    fs.writeFileSync(filePath, fixed, "utf8");
    console.log("🩹 Fixed imports in:", path.relative(process.cwd(), filePath));
    return 1;
  }
  return 0;
}