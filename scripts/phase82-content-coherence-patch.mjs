import fs from "node:fs";
import path from "node:path";

const roots = ["client/src/pages", "client/src/components", "client/src/content", "client/src/data"].filter(fs.existsSync);
const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".md"]);
const files = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (["_quarantine", "node_modules", "dist", "build", ".git"].includes(item.name)) continue;
      walk(full);
    } else if (exts.has(path.extname(item.name))) {
      files.push(full);
    }
  }
}

for (const root of roots) walk(root);

const replacements = [
  [/literally change your brain/gi, "support meaningful mental and emotional practice over time"],
  [/literally rewires?/gi, "helps practice new supportive patterns"],
  [/rewires? neural pathways/gi, "supports practicing new supportive thought patterns"],
  [/rewiring neural pathways/gi, "practicing new supportive thought patterns"],
  [/rewire your inner critic/gi, "practice responding to your inner critic with compassion"],
  [/rewire anxious thought patterns/gi, "practice responding to anxious thought patterns"],
  [/rewiring old attachment patterns/gi, "practicing new relationship patterns"],
  [/rewiring my nervous system/gi, "supporting my nervous system with practice"],
  [/brain scans show measurable changes/gi, "research suggests consistent practice may support measurable changes"],
  [/increases prefrontal cortex density \(self-regulation\) while reducing amygdala volume \(fear response\)/gi, "may support attention, self-regulation, and stress-response skills over time"],
  [/increases gray matter in areas responsible for learning, memory, emotional regulation/gi, "has been associated in some studies with changes related to learning, memory, and emotional regulation"],
  [/Self-guided healing can support your journey significantly/gi, "Self-guided wellness tools may support reflection and daily coping"],
  [/AI-powered mental wellness platform designed to support self-love, healing, and emotional growth/gi, "educational mental wellness platform designed to support self-reflection, emotional skills, and personal growth"],
  [/24\/7 AI wellness companion/gi, "AI-guided wellness reflection companion"],
  [/Unlimited AI chat sessions/gi, "Expanded AI-guided reflection sessions"],
  [/therapy engine/gi, "wellness support engine"],
  [/Guided therapy sessions/gi, "Guided wellness sessions"],
  [/Crisis Stabilizer/gi, "Crisis Resources"],
  [/1000\+ wellness tools/gi, "expanded wellness tools"]
];

const touched = [];

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  for (const [pattern, replacement] of replacements) {
    src = src.replace(pattern, replacement);
  }
  if (src !== before) {
    fs.mkdirSync(".local/phase82-backups", { recursive: true });
    const safeName = file.replace(/[\/\\]/g, "__");
    fs.writeFileSync(`.local/phase82-backups/${safeName}.before`, before);
    fs.writeFileSync(file, src);
    touched.push(file);
  }
}

fs.mkdirSync("diagnostics/phase82", { recursive: true });
fs.writeFileSync("diagnostics/phase82/content-coherence-patched-files.txt", touched.join("\n") + (touched.length ? "\n" : ""));
console.log(`PATCHED_FILES=${touched.length}`);
for (const file of touched) console.log(file);
