import { CrisisOverrideEngine } from "./CrisisOverrideEngine";
import { MonetizationBoundaryValidator } from "./MonetizationBoundaryValidator";

export interface DeriveGovernanceInput {
        route: string;
        healingFlow: boolean;
        crisisDetected: boolean;
        vulnerable: boolean;
}

export interface DeriveGovernanceOutput {
        overrideState: ReturnType<typeof CrisisOverrideEngine.getOverrideState>;
        monetizationGate: ReturnType<typeof MonetizationBoundaryValidator.validate>;
}

export function deriveGovernance(
        input: DeriveGovernanceInput,
): DeriveGovernanceOutput {
        const overrideState = CrisisOverrideEngine.getOverrideState({
                crisisDetected: input.crisisDetected,
                escalationRequired: input.healingFlow || input.vulnerable,
        });

        const monetizationGate = MonetizationBoundaryValidator.validate({
                route: input.route,
                action: "any-business-action",
                emotionalState: {
                        crisisDetected: input.crisisDetected,
                        isVulnerable: input.crisisDetected || input.vulnerable,
                },
        });

        return { overrideState, monetizationGate };
}
