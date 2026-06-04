import fs from "fs";
import path from "path";

const ROOT = "client/src/components";

const registry = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
    } else if (
      full.endsWith(".jsx") ||
      full.endsWith(".tsx") ||
      full.endsWith(".js") ||
      full.endsWith(".ts")
    ) {
      const content = fs.readFileSync(full, "utf8");

      registry.push({
        component: path.basename(full),
        path: full,
        lines: content.split("\n").length,
        usesHelmet:
          content.includes("<Helmet") ||
          content.includes("PageSEO"),
        usesProtectedRoute:
          content.includes("ProtectedRoute"),
      });
    }
  }
}

walk(ROOT);

registry.sort((a,b)=>
  a.component.localeCompare(b.component)
);

fs.writeFileSync(
  "codex/components/componentRegistry.json",
  JSON.stringify(registry,null,2)
);

console.log("GREEN: component registry generated");
console.log(`COMPONENTS: ${registry.length}`);
