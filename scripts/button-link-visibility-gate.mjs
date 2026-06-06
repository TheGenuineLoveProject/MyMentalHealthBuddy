import fs from "node:fs";
import path from "node:path";

const roots = ["client/src"].filter(fs.existsSync);
const exts = new Set([".jsx", ".tsx"]);
const files = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (["node_modules", "dist", "build", ".git", "_quarantine"].includes(item.name)) continue;
      walk(full);
    } else if (exts.has(path.extname(item.name))) {
      files.push(full);
    }
  }
}

for (const root of roots) walk(root);

const failures = [];
const warnings = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const emptyButton = text.match(/<button\b[^>]*>\s*<\/button>/gi);
  const emptyAria = text.match(/aria-label=(["'])\s*\1/gi);
  const emptyHref = text.match(/href=(["'])\s*\1|to=(["'])\s*\2/gi);
  const blackTextRisk = text.match(/color:\s*['"]black['"]|text-black|#000000|#000\b/gi);

  if (emptyButton) failures.push(`EMPTY_BUTTON ${file}`);
  if (emptyAria) failures.push(`EMPTY_ARIA_LABEL ${file}`);
  if (emptyHref) failures.push(`EMPTY_LINK_TARGET ${file}`);
  if (blackTextRisk) warnings.push(`BLACK_TEXT_CONTRAST_REVIEW ${file}`);
}

fs.mkdirSync("diagnostics/phase82", { recursive: true });
fs.writeFileSync("diagnostics/phase82/button-link-visibility-failures.txt", failures.join("\n") + (failures.length ? "\n" : ""));
fs.writeFileSync("diagnostics/phase82/button-link-visibility-warnings.txt", warnings.join("\n") + (warnings.length ? "\n" : ""));

if (failures.length) {
  console.log("BUTTON_LINK_VISIBILITY_GATE_FAIL");
  for (const f of failures.slice(0, 200)) console.log(f);
  process.exit(1);
}

console.log("BUTTON_LINK_VISIBILITY_GATE_PASS");
console.log(`warnings=${warnings.length}`);
for (const w of warnings.slice(0, 120)) console.log(`WARN ${w}`);
