import { describe, expect, it } from "vitest";

import { deriveGovernance } from "../deriveGovernance";

describe("deriveGovernance", () => {
  it("preserves backward compatibility when escalation is omitted", () => {
    const result = deriveGovernance({
      route: "/chat",
      healingFlow: false,
      crisisDetected: false,
      vulnerable: false,
    });

    expect(result.overrideState.monetizationSuspended).toBe(false);
    expect(result.overrideState.conversionDisabled).toBe(false);
    expect(result.overrideState.paywallsBlocked).toBe(false);
    expect(result.overrideState.upgradePromptsBlocked).toBe(false);
    expect(result.overrideState.analyticsRestricted).toBe(false);

    expect(typeof result.monetizationGate.allowed).toBe("boolean");
  });

  it("preserves vulnerable state independently from escalation", () => {
    const result = deriveGovernance({
      route: "/mood",
      healingFlow: false,
      crisisDetected: false,
      vulnerable: true,
      escalation: false,
    });

    expect(result.overrideState.monetizationSuspended).toBe(false);

    expect(typeof result.monetizationGate.allowed).toBe("boolean");
  });

  it("supports explicit escalation independently from vulnerability", () => {
    const result = deriveGovernance({
      route: "/buddy",
      healingFlow: false,
      crisisDetected: false,
      vulnerable: true,
      escalation: true,
    });

    expect(result.overrideState.monetizationSuspended).toBe(true);
    expect(result.overrideState.conversionDisabled).toBe(true);
    expect(result.overrideState.paywallsBlocked).toBe(true);
    expect(result.overrideState.upgradePromptsBlocked).toBe(true);
    expect(result.overrideState.analyticsRestricted).toBe(true);

    expect(result.monetizationGate.allowed).toBe(true);
  });

  it("enforces crisis dominance inside healing flows", () => {
    const result = deriveGovernance({
      route: "/journal",
      healingFlow: true,
      crisisDetected: true,
      vulnerable: true,
    });

    expect(result.overrideState.monetizationSuspended).toBe(true);
    expect(result.overrideState.conversionDisabled).toBe(true);
    expect(result.overrideState.paywallsBlocked).toBe(true);
    expect(result.overrideState.upgradePromptsBlocked).toBe(true);
    expect(result.overrideState.analyticsRestricted).toBe(true);

    expect(typeof result.monetizationGate.allowed).toBe("boolean");
  });
});
