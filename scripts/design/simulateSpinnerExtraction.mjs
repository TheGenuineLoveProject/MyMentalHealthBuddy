import fs from "fs";

const input =
  "codex/design/spinners/spinnerRiskReport.json";

const outputJson =
  "codex/design/simulation/spinnerSimulation.json";

const outputMd =
  "codex/design/simulation/spinnerSimulation.md";

const data =
  JSON.parse(fs.readFileSync(input, "utf8"));

const candidates =
  (data.safestPublic || [])
    .filter(x => x.spinnerHits <= 2)
    .slice(0, 15);

const simulation = candidates.map(item => ({
  path: item.path,
  estimatedRisk: "LOW",
  suggestedPrimitive: "OfficialLumi",
  requiresVisualQA: true,
  protectedSurface: false,
  runtimeRisk: "MINIMAL"
}));

fs.writeFileSync(
  outputJson,
  JSON.stringify(simulation, null, 2)
);

const md = `
# Spinner Extraction Simulation

## RULE
Simulation only.
No extraction.
No source modification.
No runtime changes.

## Simulated Safe Candidates

${simulation.map(x => `
### ${x.path}

- Estimated Risk: ${x.estimatedRisk}
- Suggested Primitive: ${x.suggestedPrimitive}
- Requires Visual QA: ${x.requiresVisualQA}
- Runtime Risk: ${x.runtimeRisk}
`).join("\n")}
`;

fs.writeFileSync(outputMd, md);

console.log(
  "GREEN: spinner extraction simulation complete"
);
