import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DRY_RUN = process.env.DRY_RUN !== "0";
const TARGET_DIRS = [
  "client/src/pages",
  "client/src/pages/generated",
];

const EXTS = new Set([".js", ".jsx", ".ts", ".tsx"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (EXTS.has(path.extname(entry.name))) out.push(p);
  }
  return out;
}

function shouldSkip(filePath, content) {
  const rel = filePath.replace(ROOT + path.sep, "");
  // Skip auth/legal/admin heavy pages if you want:
  const skipPatterns = [
    "/auth/",
    "/legal/",
    "/admin/",
  ];
  if (skipPatterns.some((s) => rel.includes(s))) return true;
  if (content.includes("WellnessPageShell")) return true;
  return false;
}

function injectShell(content, relPath) {
  // Minimal heuristic: look for default export component returning JSX.
  // If we can't confidently patch, do nothing.
  const hasReact = content.includes("react") || content.includes("React");
  const hasReturn = content.includes("return (") || content.includes("return(");
  if (!hasReturn) return { changed: false, next: content, reason: "no-return-jsx" };

  // Add import (best-effort): place after existing imports.
  const importLine =
    `import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";\n` +
    `import { pickBenefits } from "@/lib/benefits";\n`;

  let next = content;

  // If no import block, bail
  const firstImportIdx = next.indexOf("import ");
  if (firstImportIdx === -1) {
    return { changed: false, next: content, reason: "no-import-block" };
  }

  // Insert imports if missing
  if (!next.includes('WellnessPageShell')) {
    // insert after last import line
    const importMatches = [...next.matchAll(/^import .*\n/gm)];
    if (importMatches.length === 0) return { changed: false, next: content, reason: "no-import-lines" };
    const last = importMatches[importMatches.length - 1];
    const insertPos = last.index + last[0].length;
    next = next.slice(0, insertPos) + importLine + next.slice(insertPos);
  }

  // Add a default “clarity + examples” block near top of component:
  // We try to inject near the first "return (" occurrence.
  const returnIdx = next.indexOf("return (");
  if (returnIdx === -1) return { changed: false, next: content, reason: "return-not-found" };

  // Wrap the returned JSX in WellnessPageShell by replacing `return (` with `return (<WellnessPageShell ...>`
  // and closing before the final `);` of that return.
  // This is best-effort; if structure is too complex, you can apply manually on flagged files.
  const title = path.basename(relPath).replace(path.extname(relPath), "");
  const shellOpen =
`return (
  <WellnessPageShell
    title="${title}"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >
`;

  next = next.slice(0, returnIdx) + shellOpen + next.slice(returnIdx + "return (".length);

  // Close shell: find the last occurrence of `);` at end-of-return.
  // Best-effort: replace the last `);` in file with `</WellnessPageShell>\n  );`
  const lastReturnClose = next.lastIndexOf(");");
  if (lastReturnClose === -1) return { changed: false, next: content, reason: "no-close-paren" };

  next =
    next.slice(0, lastReturnClose) +
    `</WellnessPageShell>\n  );` +
    next.slice(lastReturnClose + 2);

  return { changed: true, next, reason: hasReact ? "patched" : "patched-no-react" };
}

function main() {
  const results = [];
  for (const dir of TARGET_DIRS) {
    const abs = path.join(ROOT, dir);
    const files = walk(abs);
    for (const f of files) {
      const rel = f.replace(ROOT + path.sep, "");
      const content = fs.readFileSync(f, "utf8");
      if (shouldSkip(f, content)) continue;

      const { changed, next, reason } = injectShell(content, rel);
      if (!changed) {
        results.push({ file: rel, action: "SKIP", reason });
        continue;
      }

      results.push({ file: rel, action: DRY_RUN ? "DRY_PATCH" : "PATCH", reason });

      if (!DRY_RUN) {
        fs.writeFileSync(f + ".bak", content, "utf8");
        fs.writeFileSync(f, next, "utf8");
      }
    }
  }

  const reportDir = path.join(ROOT, "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const outPath = path.join(reportDir, "wellness-shell-patch-report.md");

  const lines = [
    `# Wellness Shell Patch Report`,
    `Generated: ${new Date().toISOString()}`,
    ``,
    `Mode: ${DRY_RUN ? "DRY_RUN" : "APPLY"}`,
    ``,
    `## Results`,
    ...results.map(r => `- **${r.action}** ${r.file} (${r.reason})`),
    ``,
  ];
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");

  console.log(`Wrote report: ${outPath}`);
  console.log(`Patched files: ${results.filter(r => r.action.includes("PATCH")).length}`);
}

main();