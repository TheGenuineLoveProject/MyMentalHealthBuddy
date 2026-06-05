import fs from "fs";
import path from "path";

const roots = ["client/src"];
const exts = [".jsx", ".tsx", ".js", ".ts"];
const findings = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !p.includes("node_modules") && !p.includes("dist")) return walk(p);
    if (e.isFile() && exts.includes(path.extname(p))) return [p];
    return [];
  });
}

for (const root of roots) {
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, "utf8");
    const buttonMatches = text.match(/<Button[\s\S]*?<\/Button>|<button[\s\S]*?<\/button>/g) || [];
    buttonMatches.forEach((b, i) => {
      const hasVisibleText = />\s*[^<{][^<]*\s*</.test(b);
      const hasAria = /aria-label=|title=/.test(b);
      const hasLink = /to=|href=|onClick=|type=/.test(b);
      if (!hasVisibleText && !hasAria) findings.push(`${file}: button_${i + 1}: missing visible label or aria-label`);
      if (!hasLink) findings.push(`${file}: button_${i + 1}: no href/to/onClick/type detected`);
    });
  }
}

fs.writeFileSync("diagnostics/phase58/ux-coherence-findings.txt", findings.join("\n") || "PASS: no obvious button label/link findings\n");
console.log(findings.length ? `FAIL: ${findings.length} UX findings` : "PASS: UX coherence scan clean");
if (findings.length) process.exitCode = 1;
