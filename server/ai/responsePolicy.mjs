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
        // Phase 4 (v1.20): explicit 3-part micro-structure enforced at the
        // system-message layer. The model still has freedom of phrasing, but
        // sequencing and length are now contractual rather than implied.
        let structure = "validation (≤8 words, mirror feeling) → grounding or clarity (1 sentence) → one small step (1 sentence)";
        const constraints = [
                "no diagnosis",
                "no medical/legal advice",
                "avoid absolute claims",
                // Phase 4 (v1.20): validation-line precision tightened from
                // 6–8 → 4–8 words per advisor brief. Shorter openers feel
                // more immediate ("That sounds heavy.") and less performative.
                "Open with a short emotional acknowledgment (4–8 words) that reflects feeling, not facts, before any guidance.",
                "Vary the phrasing of that opening across responses — never reuse the same sentence as a recent turn, and do not echo any phrase-bank hint verbatim.",
                // Phase 4 (v1.20): tighten cognitive load — ONE concrete step
                // per turn instead of 1–2. Mid-exercise (tool walking) still
                // gets to expand because executeTool injects its own script.
                "Limit guidance to ONE concrete next step per turn unless the user is mid-exercise.",
                // Phase 4 (v1.20): cap total response length so replies stay
                // human-scale. Crisis path overrides via its own structure.
                "Keep the entire reply to 2–3 sentences total when not mid-exercise.",
                // Phase 4 (v1.20): outlaw filler reassurance. The phrase
                // "you are not alone" is intentionally allow-listed for the
                // crisis branch (high-risk path injects its own resources).
                "Avoid generic reassurance phrases such as \"I'm here for you\" or \"I understand how you feel\"; reserve \"you are not alone\" for crisis-routing replies only.",
                // Phase 4 (v1.20): every reply must land somewhere — an
                // action the user can actually take, or a perspective shift
                // (reframe). Pure sentiment without traction is not allowed.
                "Every reply must contain either a concrete action the user can take now OR a clear reframe — never sentiment alone.",
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
        // Phase 4 (v1.20): state-specific tone strings sharpened per advisor
        // brief. Each string now carries a directive cue the model can pattern
        // against (e.g. "one small step" for overwhelm, "no praise inflation"
        // for self_doubt) rather than abstract adjectives alone.
        const STATE_TONE_PRIORITY = [
                ["overwhelm", "slow, grounding, simplifying — emphasize one small step, reduce choices"],
                ["sadness", "tender, slow, validating — no urgency, sit with the feeling"],
                ["self_doubt", "neutral, reframing — no praise inflation, no judgment"],
                ["avoidance", "gentle, non-pressuring — invite, do not push"],
                ["anxiety", "calm, steadying, present-moment focused — slow language, grounding verbs"],
        ];
        // Module → state fallback: when inference returns nothing but a module
        // fired, derive a probable state so the tone branch still runs instead
        // of falling through to default. Adapted from the advisor's
        // `inferredStates[0] ?? modules[0]?.name` lever — our `modules` are
        // already string ids (not objects), so we just map id → state.
        const MODULE_TO_STATE = {
                anxiety: "anxiety",
                thought_pattern: "self_doubt",
                emotional_processing: "sadness",
                loop_detection: "self_doubt",
                relationship: "sadness",
                self_regulation: "overwhelm",
                awareness: "avoidance",
                growth: null,
        };
        const moduleFallbackState =
                states.length === 0 && Array.isArray(modules) && modules.length > 0
                        ? MODULE_TO_STATE[modules[0]] ?? null
                        : null;
        const effectiveStates = states.length > 0
                ? states
                : moduleFallbackState
                        ? [moduleFallbackState]
                        : [];

        if (level !== "high" && effectiveStates.length > 0) {
                for (const [stateId, stateTone] of STATE_TONE_PRIORITY) {
                        if (effectiveStates.includes(stateId)) {
                                tone = stateTone;
                                break;
                        }
                }
                if (effectiveStates.includes("overwhelm")) verbosity = "concise";
                if (effectiveStates.includes("self_doubt")) interventions.push("self_compassion_prompt");
                if (effectiveStates.includes("anxiety")) interventions.push("breathing", "grounding");
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
        // Phase 4 (v1.20): render constraints as a numbered list rather than
        // a single `;`-joined run-on sentence. The flat-sentence form was
        // weakening per-constraint salience for the model — adherence to
        // later items (length cap, action-or-reframe) was less consistent
        // than to earlier ones. A numbered list keeps each rule as its own
        // attended unit. Tone/verbosity/structure/interventions retain the
        // single-line dash form because they're singular values, not lists.
        const constraintLines = (constraints || [])
                .map((c, i) => `  ${i + 1}. ${c}`)
                .join("\n");
        return [
                "Response policy (follow strictly):",
                `- Tone: ${tone}`,
                `- Verbosity: ${verbosity}`,
                `- Structure: ${structure}`,
                `- Interventions: ${(interventions || []).join(", ")}`,
                "- Constraints:",
                constraintLines,
        ].join("\n");
}
