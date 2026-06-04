import type { CrisisOverrideEngine } from "./CrisisOverrideEngine";
import type { MonetizationBoundaryValidator } from "./MonetizationBoundaryValidator";

type OverrideState = ReturnType<typeof CrisisOverrideEngine.getOverrideState>;
type MonetizationGate = ReturnType<typeof MonetizationBoundaryValidator.validate>;

export interface BuildGovernanceAttrsInput {
        surface: string;
        healingFlow: boolean;
        crisisDetected: boolean;
        vulnerable: boolean;
        overrideState: OverrideState;
        monetizationGate: MonetizationGate;
}

export type GovernanceAttrs = Record<`data-${string}`, "true" | "false">;

const b = (v: boolean): "true" | "false" => (v ? "true" : "false");

export function buildGovernanceAttrs(
        input: BuildGovernanceAttrsInput,
): GovernanceAttrs {
        return {
                [`data-${input.surface}-governed`]: "true",
                "data-healing-flow": b(input.healingFlow),
                "data-crisis-active": b(input.crisisDetected),
                "data-vulnerable": b(input.vulnerable),
                "data-monetization-suspended": b(input.overrideState.monetizationSuspended),
                "data-monetization-allowed": b(input.monetizationGate.allowed),
                "data-conversion-disabled": b(input.overrideState.conversionDisabled),
                "data-paywalls-blocked": b(input.overrideState.paywallsBlocked),
                "data-upgrade-prompts-blocked": b(input.overrideState.upgradePromptsBlocked),
                "data-analytics-restricted": b(input.overrideState.analyticsRestricted),
        } as GovernanceAttrs;
}

