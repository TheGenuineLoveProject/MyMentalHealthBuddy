// server/ai/profileStore.mjs
//
// Per-user structured profile storage.
// Separate from short-term memory and summary text — this layer holds
// distilled, structured facts about the user that accumulate over time.

import fs from "fs";
import path from "path";

const PROFILE_DIR = path.resolve("data/memory-profile");

// Canonical empty profile shape. New keys added here are forward-compatible
// because mergeProfiles unions whatever keys exist.
export const EMPTY_PROFILE = {
        emotional_patterns: [],
        triggers: [],
        relationship_themes: [],
        coping_strategies: [],
        support_needs: [],
        risk_flags: [],
        // Module-system fields (added with module router):
        core_beliefs: [],
        behavior_loops: [],
        values: [],
};

function ensureDir() {
        if (!fs.existsSync(PROFILE_DIR)) {
                fs.mkdirSync(PROFILE_DIR, { recursive: true });
        }
}

// Sanitize userId to prevent path traversal (same rule as memory.mjs)
function getFile(userId) {
        const safeId = String(userId || "anonymous")
                .replace(/[^a-zA-Z0-9_-]/g, "_")
                .slice(0, 100) || "anonymous";
        return path.join(PROFILE_DIR, `${safeId}.json`);
}

export function loadProfile(userId) {
        try {
                ensureDir();
                const file = getFile(userId);
                if (!fs.existsSync(file)) return null;
                const data = JSON.parse(fs.readFileSync(file, "utf-8"));
                return { ...EMPTY_PROFILE, ...data };
        } catch {
                return null;
        }
}

export function saveProfile(userId, profile) {
        try {
                ensureDir();
                const file = getFile(userId);
                fs.writeFileSync(file, JSON.stringify(profile, null, 2));
        } catch (err) {
                console.warn("Profile save failed:", err.message);
        }
}

/**
 * Merge a freshly-extracted profile into an existing one.
 * Append/update semantics — never overwrite blindly.
 * - Arrays are unioned and de-duplicated (case-insensitive on strings).
 * - Items are bounded per category (cap = 20) to prevent unbounded growth.
 * - Unknown categories from `fresh` are passed through (forward-compatible).
 */
export function mergeProfiles(existing, fresh, cap = 20) {
        const base = existing || EMPTY_PROFILE;
        const incoming = fresh || {};
        const out = { ...base };

        const allKeys = new Set([
                ...Object.keys(base),
                ...Object.keys(incoming),
        ]);

        for (const key of allKeys) {
                const a = Array.isArray(base[key]) ? base[key] : [];
                const b = Array.isArray(incoming[key]) ? incoming[key] : [];

                const seen = new Set();
                const merged = [];
                for (const item of [...a, ...b]) {
                        if (item == null) continue;
                        const norm =
                                typeof item === "string"
                                        ? item.trim().toLowerCase()
                                        : JSON.stringify(item);
                        if (!norm || seen.has(norm)) continue;
                        seen.add(norm);
                        merged.push(item);
                }

                out[key] = merged.slice(-cap);
        }

        return out;
}

/**
 * True iff the profile contains any signal worth injecting into a prompt.
 */
export function profileHasContent(profile) {
        if (!profile || typeof profile !== "object") return false;
        return Object.values(profile).some(
                (v) => Array.isArray(v) && v.length > 0,
        );
}

/**
 * Render a profile as a compact bullet list for system-prompt injection.
 * Hard char-cap so the prompt stays bounded even if profile growth bypasses
 * mergeProfiles (e.g. via direct file edit). At ~4 chars/token this is ~1k tokens.
 *
 * Categories are rendered in PRIORITY ORDER so that if truncation fires, the
 * safety- and need-critical fields survive and the lowest-priority fields
 * (e.g. values, growth-oriented data) get dropped first.
 */
const PROMPT_CHAR_CAP = 4000;
const RENDER_PRIORITY = [
        "risk_flags",            // safety-critical — must survive truncation
        "support_needs",         // immediate user need
        "emotional_patterns",    // most actionable for tone matching
        "triggers",              // pairs with patterns
        "coping_strategies",     // proven-helpful tools to recommend
        "behavior_loops",        // pattern-level insight
        "core_beliefs",          // depth work
        "relationship_themes",   // contextual
        "values",                // long-horizon, drop first
];
export function formatProfileForPrompt(profile) {
        if (!profileHasContent(profile)) return "";
        const lines = ["Known user profile (cumulative):"];
        const seenKeys = new Set();

        const renderKey = (key) => {
                const vals = profile[key];
                if (!Array.isArray(vals) || vals.length === 0) return;
                const label = key.replace(/_/g, " ");
                const items = vals
                        .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
                        .join("; ");
                lines.push(`- ${label}: ${items}`);
        };

        // Priority pass first
        for (const key of RENDER_PRIORITY) {
                renderKey(key);
                seenKeys.add(key);
        }
        // Forward-compat: any new categories not in RENDER_PRIORITY render last
        for (const key of Object.keys(profile)) {
                if (seenKeys.has(key)) continue;
                renderKey(key);
        }

        const out = lines.join("\n");
        return out.length > PROMPT_CHAR_CAP
                ? out.slice(0, PROMPT_CHAR_CAP) + "\n…(truncated)"
                : out;
}
