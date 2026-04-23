import { MODULES } from "./modules.mjs";

// server/ai/moduleRouter.mjs
//
// Intervention Module Router.
//
// Pure module — no I/O, no logging side effects, never throws.
// `selectModules({profile, input})` returns an ordered, deduped, priority-sorted
// list of module ids capped at MAX_MODULES. `resolveModules(ids)` materializes
// those ids into the interventions/tags/structure they contribute to the policy.

const MAX_MODULES = 2;

// MODULE_REGISTRY:
//   interventions[]: appended into the policy's intervention list
//   tag:             coarse classifier label (telemetry-friendly)
//   priority:        1 (general) → 3 (specific high-leverage) — used to cap
//                    which modules survive when many fire at once
//   structure:       optional response shape; first non-null in the resolved
//                    set wins (when level !== "high"), letting CBT-shaped or
//                    feeling-shaped flows replace the default structure
export const MODULE_REGISTRY = {
        anxiety: {
                interventions: ["breathing", "5-4-3-2-1"],
                tag: "anxiety_regulation",
                priority: 2,
                structure: "ground → slow breath → reframe",
        },
        thought_pattern: {
                interventions: ["cognitive_reframe"],
                tag: "cbt_core",
                priority: 3,
                structure: "reflect → identify thought → reframe → small next step",
        },
        emotional_processing: {
                interventions: ["name_feeling", "body_location", "feeling_needs"],
                tag: "act_ifs",
                priority: 2,
                structure: "feel → locate → need",
        },
        loop_detection: {
                interventions: ["pattern_inquiry", "interrupt_pattern"],
                tag: "behavioral_loop",
                priority: 3,
                structure: "identify loop → break loop",
        },
        relationship: {
                interventions: ["needs_vs_expressed", "repair_focus"],
                tag: "relationship_intelligence",
                priority: 2,
                structure: "clarify need → communicate",
        },
        self_regulation: {
                interventions: ["chunking", "next_small_step"],
                tag: "self_regulation",
                priority: 1,
                structure: null,
        },
        awareness: {
                interventions: ["pattern_inquiry"],
                tag: "awareness_expansion",
                priority: 1,
                structure: null,
        },
        growth: {
                interventions: ["values_alignment"],
                tag: "growth_meaning",
                priority: 1,
                structure: null,
        },
};

const ANXIETY_RE = /anxious|anxiety|panic|worry|racing thought|on edge/i;
// Match "can't" / "cant" / "cannot" / "can not" — common negation forms in journaling
const CANT_FRAG = "(?:can(?:'t|not|t)|can\\s+not)";
const THOUGHT_LOOP_RE = new RegExp(
        `${CANT_FRAG}\\s+stop\\s+thinking|stuck in my head|rumin|over[- ]?think|same thought`,
        "i",
);
const OVERWHELM_RE = new RegExp(
        `overwhelm|too much|${CANT_FRAG}\\s+cope|drowning|burn(?:ed)?\\s?out`,
        "i",
);
const RELATIONSHIP_RE = /partner|spouse|husband|wife|boyfriend|girlfriend|friend|family|conflict|fight|argu|relationship/i;
const VALUES_RE = /meaning|purpose|values|who am i|identity|direction/i;
// Input-side loop detection (in addition to profile.behavior_loops trigger below)
const LOOP_RE = /\balways\b|every ?time|same\s+pattern|same\s+cycle|keeps?\s+happening|happens?\s+again/i;

/**
 * @returns {string[]} priority-sorted, deduped list of module ids (capped at MAX_MODULES).
 */
export function selectModules({ profile = null, input = "" } = {}) {
        const candidates = [];
        const text = String(input || "");

        // Input-driven (immediate context)
        if (ANXIETY_RE.test(text)) candidates.push("anxiety");
        if (THOUGHT_LOOP_RE.test(text)) candidates.push("thought_pattern");
        if (OVERWHELM_RE.test(text)) {
                candidates.push("emotional_processing");
                candidates.push("self_regulation");
        }
        if (RELATIONSHIP_RE.test(text)) candidates.push("relationship");
        if (VALUES_RE.test(text)) candidates.push("growth");
        if (LOOP_RE.test(text)) candidates.push("loop_detection");

        // Profile-driven (long-term signals)
        if (Array.isArray(profile?.behavior_loops) && profile.behavior_loops.length > 0) {
                candidates.push("loop_detection");
        }
        if (
                Array.isArray(profile?.emotional_patterns) &&
                profile.emotional_patterns.some((p) => /anxiet|racing/i.test(String(p)))
        ) {
                candidates.push("anxiety");
        }
        if (
                Array.isArray(profile?.emotional_patterns) &&
                profile.emotional_patterns.some((p) => /insomnia|sleep/i.test(String(p)))
        ) {
                candidates.push("self_regulation");
        }
        if (Array.isArray(profile?.values) && profile.values.length > 0) {
                candidates.push("growth");
        }

        // Awareness fallback once we have any pattern data
        const hasPatternData =
                (profile?.emotional_patterns?.length || 0) > 0 ||
                (profile?.triggers?.length || 0) > 0;
        if (hasPatternData) candidates.push("awareness");

        // Dedupe (preserve first-seen order — input-driven before profile-driven so
        // immediate context wins ties under the priority-stable sort below) and drop
        // any unknown ids defensively so they cannot occupy a MAX_MODULES slot.
        const unique = Array.from(new Set(candidates)).filter(
                (id) => MODULE_REGISTRY[id],
        );

        // Stable sort by registry priority desc; unknown ids (defensive) sink to 0
        const sorted = unique.slice().sort((a, b) => {
                const pa = MODULE_REGISTRY[a]?.priority ?? 0;
                const pb = MODULE_REGISTRY[b]?.priority ?? 0;
                return pb - pa;
        });

        return sorted.slice(0, MAX_MODULES);
}

/**
 * Resolve module ids into their interventions, tags, and the first non-null
 * structure proposed by the resolved set (in input order).
 *
 * Unknown ids are silently ignored (forward-compatible for future registry growth).
 */
export function resolveModules(moduleIds = []) {
        const interventions = [];
        const tags = [];
        let structure = null;
        for (const id of moduleIds) {
                const entry = MODULE_REGISTRY[id];
                if (!entry) continue;
                interventions.push(...entry.interventions);
                tags.push(entry.tag);
                if (structure == null && entry.structure) structure = entry.structure;
        }
        return { interventions, tags, structure };
}
