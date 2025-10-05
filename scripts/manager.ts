// @ts-check
// ✅ scripts/manager.ts
// Provides helper functions for import optimization and cleanup.

import fs from "fs";
import path from "path";

export function optimizeImports(filePath: string): number {
  try {
    const text = fs.readFileSync(filePath, "utf8");
    let fixed = text;

    // Add ".js" to relative imports if missing (for ECMAScript modules)
    fixed = fixed.replace(
      /from\s+["'](\.{1,2}\/[^"']+)["']/g,
      (_match, p1) => (p1.endsWith(".js") ? _match : `from "${p1}.js"`)
    );

    // Comment out // require() calls in TypeScript files
    fixed = fixed.replace(/\brequire\(/g, "// // require(");

    // If something was changed, write it back
    if (text !== fixed) {
      fs.writeFileSync(filePath, fixed, "utf8");

      const relativePath: string = path.relative(process.cwd(), filePath);
      console.log(`🛠️  Fixed imports in: ${relativePath}`);

      return 1;
    }

    return 0;
  } catch (err) {
    console.error("❌ Error optimizing imports:", err);
    return 0;
  }
}

export function logInfo(msg: string): void {
  console.log(msg);
}

export function logSuccess(msg: string): void {
  console.log(msg);
}
