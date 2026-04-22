// server/ai/responsePolicy.mjs
//
// Adaptive Response Policy Layer.
// Converts signals (risk, profile, scoring) into a single style/intervention
// contract that gets injected as a system message into the provider.
//
// Pure function — no I/O, no side effects, never throws.

export function buildResponsePolicy({ risk, profile, scoring } = {}) {
        const level = risk?.level || "low";
        const tier = scoring?.tier || "standard";

        // Base defaults
        let tone = "warm, validating, non-clinical";
        let verbosity = tier === "high" ? "moderate" : "concise";
        let structure = "reflect → validate → 1–2 options";
        const constraints = [
                "no diagnosis",
                "no medical/legal advice",
                "avoid absolute claims",
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
