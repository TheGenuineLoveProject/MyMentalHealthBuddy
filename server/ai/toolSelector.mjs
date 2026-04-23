// server/ai/toolSelector.mjs
//
// Tool selector. Given the priority-sorted module ids from selectModules
// (string[]), the user's profile, and the cleaned input, pick at most ONE
// tool to surface. Tools are bound to modules via the `module` field in TOOLS.
//
// Pure function — no I/O, no side effects, never throws.

import { TOOLS } from "./tools.mjs";

/**
 * @param {{ modules?: string[], profile?: object, input?: string }} args
 * @returns {object|null} a TOOLS entry or null
 */
export function selectTool({ modules = [], profile = null, input = "" } = {}) {
        const moduleIds = Array.isArray(modules) ? modules : [];
        const text = String(input || "");

        // 1. Module-driven (priority order from selectModules is preserved).
        //    First module that has a bound tool wins.
        for (const id of moduleIds) {
                const match = Object.values(TOOLS).find((t) => t.module === id);
                if (match) return match;
        }

        // 2. Profile-aware fallback: chronic anxiety pattern → box_breathing
        const patterns = Array.isArray(profile?.emotional_patterns)
                ? profile.emotional_patterns
                : [];
        if (patterns.some((p) => /anxiet/i.test(String(p)))) {
                return TOOLS.box_breathing;
        }

        // 3. Input-keyword fallback for the high-leverage overload signal
        if (/overwhelm|too much|burnout/i.test(text)) {
                return TOOLS.overload_reset;
        }

        return null;
}
