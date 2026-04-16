const fs = require("fs");

function markPromptForReview(registryPath, promptId, reason) {
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

  registry.prompts = registry.prompts.map((p) => {
    if (p.id === promptId) {
      return {
        ...p,
        reviewRequired: true,
        reviewReason: reason
      };
    }
    return p;
  });

  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  return { ok: true, promptId, reason };
}

module.exports = { markPromptForReview };
