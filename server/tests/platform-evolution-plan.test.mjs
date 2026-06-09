import { describe, it, expect } from "vitest";
import { __planInternals } from "../lib/platformEvolution.mjs";

const { buildRemediationPlan } = __planInternals;

const categories = [
  { id: "loading-risks", findings: [{ severity: "info", location: "client/src/pages/Big.jsx", recommendation: "split it" }] },
  { id: "orphaned-routes", findings: [{ severity: "warning", location: "client/src/x.jsx", recommendation: "repoint it" }] },
  { id: "artifact-pollution", findings: [{ severity: "warning", location: "a.bak", recommendation: "quarantine it" }] },
  { id: "exposed-stubs", findings: [] },
];

describe("remediation planner (audit-only guidance layer)", () => {
  it("ranks the most severe finding first", () => {
    const plan = buildRemediationPlan(categories);
    expect(plan.actions[0].severity).toBe("warning");
  });

  it("among equal severity, puts the smallest-engine quick-win first", () => {
    const plan = buildRemediationPlan(categories);
    const warnings = plan.actions.filter((a) => a.severity === "warning").map((a) => a.category);
    expect(warnings).toEqual(["artifact-pollution", "orphaned-routes"]);
  });

  it("dedupes by category+location and exposes nextAction", () => {
    const dup = [...categories, { id: "artifact-pollution", findings: [{ severity: "warning", location: "a.bak", recommendation: "quarantine it" }] }];
    const plan = buildRemediationPlan(dup);
    expect(plan.totalActionable).toBe(3);
    expect(plan.nextAction.category).toBe("artifact-pollution");
  });

  it("emits stable priority numbers and a human-readable action per item", () => {
    const plan = buildRemediationPlan(categories);
    expect(plan.actions[0].priority).toBe(1);
    expect(plan.actions.every((a) => typeof a.action === "string" && a.action.length > 0)).toBe(true);
  });

  it("tolerates empty / missing input without throwing", () => {
    expect(buildRemediationPlan([]).actions).toEqual([]);
    expect(buildRemediationPlan(undefined).nextAction).toBeNull();
  });
});
