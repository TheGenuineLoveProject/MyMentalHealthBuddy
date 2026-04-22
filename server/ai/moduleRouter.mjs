// server/ai/moduleRouter.mjs
//
// Intervention Module Router.
// Selects which evidence-backed intervention modules apply to the current
// turn, based on the user's profile (long-term signal) and current input
// (immediate signal). Modules are then translated into policy additions
// inside responsePolicy.mjs.
//
// Pure function — no I/O, no side effects, never throws.
// Adding a new module = add an entry to MODULE_REGISTRY + a selector below.

export const MODULE_REGISTRY = {
        anxiety: {
                interventions: ["breathing", "5-4-3-2-1"],
                tag: "anxiety_regulation",
        },
        thought_pattern: {
                interventions: ["cognitive_reframe"],
                tag: "cbt_core",
        },
        emotional_processing: {
                interventions: ["name_feeling", "body_location", "feeling_needs"],
                tag: "act_ifs",
        },
        loop_detection: {
                interventions: ["pattern_inquiry"],
                tag: "behavioral_loop",
        },
        relationship: {
                interventions: ["needs_vs_expressed", "repair_focus"],
                tag: "relationship_intelligence",
        },
        self_regulation: {
                interventions: ["chunking"],
                tag: "self_regulation",
        },
        awareness: {
                interventions: ["pattern_inquiry"],
                tag: "awareness_expansion",
        },
        growth: {
                interventions: ["values_alignment"],
                tag: "growth_meaning",
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
const RELATIONSHIP_RE = /partner|spouse|husband|wife|boyfriend|girlfriend|friend|family|conflict|fight|argu/i;
const VALUES_RE = /meaning|purpose|values|who am i|identity|direction/i;

/**
 * @returns {string[]} ordered list of module ids; empty array if none.
 */
export function selectModules({ profile = null, input = "" } = {}) {
        const modules = [];
        const text = String(input || "");

        if (ANXIETY_RE.test(text)) modules.push("anxiety");
        if (THOUGHT_LOOP_RE.test(text)) modules.push("thought_pattern");
        if (OVERWHELM_RE.test(text)) {
                modules.push("emotional_processing");
                modules.push("self_regulation");
        }
        if (RELATIONSHIP_RE.test(text)) modules.push("relationship");
        if (VALUES_RE.test(text)) modules.push("growth");

        // Profile-driven (long-term signals)
        if (Array.isArray(profile?.behavior_loops) && profile.behavior_loops.length > 0) {
                modules.push("loop_detection");
        }
        if (
                Array.isArray(profile?.emotional_patterns) &&
                profile.emotional_patterns.some((p) => /anxiet|racing/i.test(String(p)))
        ) {
                modules.push("anxiety");
        }
        if (
                Array.isArray(profile?.emotional_patterns) &&
                profile.emotional_patterns.some((p) => /insomnia|sleep/i.test(String(p)))
        ) {
                modules.push("self_regulation");
        }
        if (Array.isArray(profile?.values) && profile.values.length > 0) {
                modules.push("growth");
        }

        // Awareness module always available once we have any pattern data
        const hasPatternData =
                (profile?.emotional_patterns?.length || 0) > 0 ||
                (profile?.triggers?.length || 0) > 0;
        if (hasPatternData) modules.push("awareness");

        // Dedupe preserving order
        return Array.from(new Set(modules));
}

/**
 * Resolve module ids to interventions + tags via the registry.
 * Unknown ids are silently ignored (forward-compatible).
 */
export function resolveModules(moduleIds = []) {
        const interventions = [];
        const tags = [];
        for (const id of moduleIds) {
                const entry = MODULE_REGISTRY[id];
                if (!entry) continue;
                interventions.push(...entry.interventions);
                tags.push(entry.tag);
        }
        return { interventions, tags };
}
