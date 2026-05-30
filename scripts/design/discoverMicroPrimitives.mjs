import fs from "fs";
import path from "path";

const ROOT = "client/src";

const registry = {
  spinner: [],
  badge: [],
  avatar: [],
  skeleton: [],
  divider: [],
  chip: [],
  emptyState: []
};

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  for (const item of fs.readdirSync(dir)) {

    const full = path.join(dir, item);

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
      continue;
    }

    if (
      !full.endsWith(".jsx") &&
      !full.endsWith(".tsx")
    ) continue;

    const content = fs.readFileSync(full, "utf8");

    if (
      /spinner|loading/gi.test(content)
    ) {
      registry.spinner.push(full);
    }

    if (
      /badge|pill|chip/gi.test(content)
    ) {
      registry.badge.push(full);
    }

    if (
      /avatar|profileimage|profilepic/gi.test(content)
    ) {
      registry.avatar.push(full);
    }

    if (
      /skeleton|shimmer/gi.test(content)
    ) {
      registry.skeleton.push(full);
    }

    if (
      /divider|separator|border-t/gi.test(content)
    ) {
      registry.divider.push(full);
    }

    if (
      /emptystate|nothing here|no data/gi.test(content)
    ) {
      registry.emptyState.push(full);
    }
  }
}

walk(ROOT);

fs.writeFileSync(
  "codex/design/micro/microPrimitiveAudit.json",
  JSON.stringify(registry, null, 2)
);

const md = `# Micro Primitive Audit

## RULE
Audit only.
No extraction yet.
No consolidation yet.

## Spinner Candidates
${registry.spinner.map(x => `- ${x}`).join("\n")}

## Badge Candidates
${registry.badge.map(x => `- ${x}`).join("\n")}

## Avatar Candidates
${registry.avatar.map(x => `- ${x}`).join("\n")}

## Skeleton Candidates
${registry.skeleton.map(x => `- ${x}`).join("\n")}

## Divider Candidates
${registry.divider.map(x => `- ${x}`).join("\n")}

## Empty State Candidates
${registry.emptyState.map(x => `- ${x}`).join("\n")}
`;

fs.writeFileSync(
  "codex/design/micro/microPrimitiveAudit.md",
  md
);

console.log("GREEN: micro primitive audit complete");

console.log({
  spinners: registry.spinner.length,
  badges: registry.badge.length,
  avatars: registry.avatar.length,
  skeletons: registry.skeleton.length,
  dividers: registry.divider.length,
  emptyStates: registry.emptyState.length
});
