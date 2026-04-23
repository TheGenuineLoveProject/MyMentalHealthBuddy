// server/ai/responsePolicy.mjs
//
// Adaptive Response Policy Layer.
// Converts signals (risk, profile, scoring) into a single style/intervention
// contract that gets injected as a system message into the provider.
//
// Pure function — no I/O, no side effects, never throws.

import { resolveModules } from "./moduleRouter.mjs";

export function buildResponsePolicy({ risk, profile, scoring, modules = [], inferredStates = [] } = {}) {
        const level = risk?.level || "low";
        const tier = scoring?.tier || "standard";
        const states = Array.isArray(inferredStates) ? inferredStates : [];

        // Base defaults
        let tone = "warm, validating, non-clinical";
        let verbosity = tier === "high" ? "moderate" : "concise";
        let structure = "reflect → validate → 1–2 options";
        const constraints = [
                "no diagnosis",
                "no medical/legal advice",
                "avoid absolute claims",
                // Validation-line precision: emotional acknowledgment leads, brief.
                "Open with a short emotional acknowledgment (max 6–8 words) that reflects feeling, not facts, before any guidance.",
                "Vary the phrasing of that opening across responses — never reuse the same sentence as a recent turn, and do not echo any phrase-bank hint verbatim.",
                // Cognitive load cap when we're not actively walking through an exercise.
                "Keep guidance to 1–2 concrete steps unless the user is mid-exercise.",
                // Escalation guardrail.
                "If emotional intensity rises within the message, slow the pace and prioritize grounding.",
        ];
        const interventions = ["reflection", "grounding", "small_next_step"];

        // Risk escalation. assessRisk currently emits only "low" | "high" | "none";
        // adding speculative branches would be dead code. Extend here when
        // assessRisk gains finer-grained levels.
        if (level === "high") {
                tone = "calm, steady, grounding";
                verbosity = "concise";
                structure = "acknowledge → immediate grounding → resources";
                interventions.length = 0;
                interventions.push("grounding", "safety", "resource_signpost");
                constraints.push("do not overwhelm with options");
        }

        // Profile-informed tweaks (defensive — profile may be null or partial)
        const supportNeeds = Array.isArray(profile?.support_needs)
                ? profile.support_needs
                : [];
        const emotionalPatterns = Array.isArray(profile?.emotional_patterns)
                ? profile.emotional_patterns
                : [];
        const riskFlags = Array.isArray(profile?.risk_flags)
                ? profile.risk_flags
                : [];

        if (supportNeeds.some((n) => /reassur/i.test(String(n)))) {
                interventions.push("reassurance");
        }
        if (supportNeeds.some((n) => /ground/i.test(String(n)))) {
                interventions.push("grounding");
        }
        if (emotionalPatterns.some((p) => /anxiet|anxious|racing/i.test(String(p)))) {
                interventions.push("breathing", "5-4-3-2-1");
        }
        if (emotionalPatterns.some((p) => /insomnia|sleep/i.test(String(p)))) {
                interventions.push("sleep_hygiene_micro_tip");
        }
        if (riskFlags.length > 0) {
                constraints.push("monitor for escalation cues");
        }

        // Profile-driven personalization: shape constraints from learned patterns.
        if (emotionalPatterns.some((p) => /withdraw|isolat|shut down|shut-down/i.test(String(p)))) {
                constraints.push("Encourage staying present rather than withdrawing or isolating.");
        }

        // Inferred-state tone shaping (gated to non-crisis paths so the high-risk
        // grounding tone lock above is preserved). Tone is resolved via an explicit
        // priority map — the highest-priority state in `states` wins on tone, while
        // every active state still contributes its associated interventions. This
        // replaces the previous implicit last-write-wins ordering, which was
        // brittle to refactor and hard to reason about.
        const STATE_TONE_PRIORITY = [
                ["overwhelm", "slow, grounding, simplifying"],
                ["sadness", "tender, slow, validating"],
                ["self_doubt", "reassuring, stabilizing"],
                ["avoidance", "gentle, non-pressuring"],
                ["anxiety", "calm, steadying"],
        ];
        if (level !== "high" && states.length > 0) {
                for (const [stateId, stateTone] of STATE_TONE_PRIORITY) {
                        if (states.includes(stateId)) {
                                tone = stateTone;
                                break;
                        }
                }
                if (states.includes("overwhelm")) verbosity = "concise";
                if (states.includes("self_doubt")) interventions.push("self_compassion_prompt");
                if (states.includes("anxiety")) interventions.push("breathing", "grounding");
        }

        // Module-driven interventions (resolved via MODULE_REGISTRY).
        // Modules layer ON TOP of profile-driven tweaks — they don't replace them.
        // Structure: the first module that proposes a structure (in priority-sorted
        // order from selectModules) wins, unless we're in high-risk mode where the
        // grounding-first structure is locked.
        if (Array.isArray(modules) && modules.length > 0) {
                const resolved = resolveModules(modules);
                interventions.push(...resolved.interventions);
                if (level !== "high" && resolved.structure) {
                        structure = resolved.structure;
                }
        }

        // Dedupe interventions while preserving order
        const seen = new Set();
        const uniqueInterventions = [];
        for (const item of interventions) {
                if (!seen.has(item)) {
                        seen.add(item);
                        uniqueInterventions.push(item);
                }
        }

        return {
                tone,
                verbosity,
                structure,
                interventions: uniqueInterventions,
                constraints,
        };
}

export function renderPolicySystemMessage(policy) {
        if (!policy) return "";
        const { tone, verbosity, structure, interventions, constraints } = policy;
        return [
                "Response policy (follow strictly):",
                `- Tone: ${tone}`,
                `- Verbosity: ${verbosity}`,
                `- Structure: ${structure}`,
                `- Interventions: ${(interventions || []).join(", ")}`,
                `- Constraints: ${(constraints || []).join("; ")}`,
        ].join("\n");
}
