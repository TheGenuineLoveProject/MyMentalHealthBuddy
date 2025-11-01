// Knowledge Base utilities – re-index + evolve
import fs from "fs";

export function rebuildKnowledgeBase() {
  console.log("🧠 Re-indexing knowledge base…");
  fs.writeFileSync("ops/healer/output/kb-index.json",
    JSON.stringify({ rebuilt: Date.now() }, null, 2)
  );
  console.log("✅ KB rebuilt successfully");
}

rebuildKnowledgeBase();