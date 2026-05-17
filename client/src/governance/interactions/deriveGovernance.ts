import { CrisisOverrideEngine } from "./CrisisOverrideEngine";
import { MonetizationBoundaryValidator } from "./MonetizationBoundaryValidator";

export interface DeriveGovernanceInput {
        route: string;
        healingFlow: boolean;
        crisisDetected: boolean;
        /**
         * Surface-local "vulnerable" signal — drives the monetization-gate
         * `isVulnerable` input and the canonical `data-vulnerable` attr.
         */
        vulnerable: boolean;
        /**
         * Optional surface-local escalation signal — drives the override engine's
         * `escalationRequired` independently of `vulnerable`. Surfaces where
         * vulnerability ≠ escalation (e.g. BuddyPanel: vulnerable spans
         * sad/anxious/overwhelmed/crisis but escalation is only the
         * dysregulated subset overwhelmed/crisis) must pass this explicitly.
         *
         * When omitted, defaults to `healingFlow || vulnerable` — preserves the
         * v5.8.128 single-signal behavior for callers (e.g. AIChatPanel) that
         * have no independent escalation dimension.
         */
        escalation?: boolean;
}

export interface DeriveGovernanceOutput {
        overrideState: ReturnType<typeof CrisisOverrideEngine.getOverrideState>;
        monetizationGate: ReturnType<typeof MonetizationBoundaryValidator.validate>;
}

export function deriveGovernance(
        input: DeriveGovernanceInput,
): DeriveGovernanceOutput {
        const escalationRequired =
                input.escalation ?? (input.healingFlow || input.vulnerable);

        const overrideState = CrisisOverrideEngine.getOverrideState({
                crisisDetected: input.crisisDetected,
                escalationRequired,
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
