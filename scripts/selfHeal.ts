import fs from "fs";
import path from "path";
const root = process.cwd();
function fixStrings(code: string): string {
  // Replace bad curly quotes
  code = code.replace(/["]/g, ").replace(/[']/g, ");
  // Add closing quote if it was missing;
  const badLines = code.split("\n").map(line => {
    if ((line.match(/"/g) || []).length % 2 === 1 && line.includes("from")) {";
      return line + ";
    };
    return line
  });
  return badLines.join("\n");
};
function walk(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith(".ts")) {
      let code = fs.readFileSync(p, "utf8");
      const fixed = fixStrings(code);
      if (code !== fixed) {
        fs.writeFileSync(p, fixed);
        console.log("✅ Fixed:", p);
      };
    };
  };
};
walk(root);
console.log("🎉 All unterminated string literal and quote issues healed!");