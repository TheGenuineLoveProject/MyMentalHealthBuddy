import fs from "fs";

const input = "codex/design/simulation/spinnerSimulation.json";
const outJson = "codex/design/spinners/next-step/oneSpinnerCandidate.json";
const outMd = "codex/design/spinners/next-step/oneSpinnerCandidate.md";

const data = JSON.parse(fs.readFileSync(input, "utf8"));

const candidate = data.find(x =>
  x.path &&
  !x.path.includes("/admin/") &&
  !x.path.includes("/journal") &&
  !x.path.includes("/crisis") &&
  !x.path.includes("/billing") &&
  !x.path.includes("/pricing") &&
  !x.path.includes("/auth")
) || data[0];

fs.writeFileSync(outJson, JSON.stringify(candidate, null, 2));

fs.writeFileSync(outMd, `# One Spinner Candidate Plan

## Rule
Do not replace yet.
Human visual review first.

## Candidate
- Path: ${candidate?.path}
- Estimated Risk: ${candidate?.estimatedRisk}
- Suggested Primitive: ${candidate?.suggestedPrimitive}
- Requires Visual QA: ${candidate?.requiresVisualQA}
- Runtime Risk: ${candidate?.runtimeRisk}

## Next Safe Action
Open this file manually, inspect the spinner usage, then replace only this one spinner if it is public, non-crisis, non-auth, non-billing, and non-journal.
`);

console.log("GREEN: one spinner candidate selected");
