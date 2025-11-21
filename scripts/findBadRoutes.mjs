// scripts/findBadRoutes.mjs
// Scan Express routes for invalid path patterns like "/:" (no param name).

import fs from "node:fs";
import path from "node:path";

const serverRoot = path.join(process.cwd(), "server");

// Walk all files under a directory
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (/\.(js|mjs|ts)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(serverRoot);

const routeRegex =
  /(app|router)\.(get|post|put|delete|patch|use)\s*\(\s*['"`]([^'"`]+)['"`]/g;

console.log("🔍 Scanning server routes for invalid path patterns...\n");

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  let match;
  let printedHeader = false;

  while ((match = routeRegex.exec(text)) !== null) {
    const [fullMatch, kind, method, routePath] = match;

    // Look for "/:" where there is **no** name after the colon
    const badColon = /\/:(?![A-Za-z0-9_])/;
    if (badColon.test(routePath)) {
      if (!printedHeader) {
        console.log(`📄 File: ${path.relative(process.cwd(), file)}`);
        printedHeader = true;
      }
      console.log(
        `  ⚠️  Suspicious route: "${routePath}"  (${kind}.${method})`
      );
    }
  }

  if (printedHeader) {
    console.log("");
  }
}

console.log("✅ Scan finished. If nothing was printed above, this error is coming from a different pattern (send me a screenshot of any results).");