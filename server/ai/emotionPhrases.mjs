// server/ai/emotionPhrases.mjs
//
// Lightweight, deterministic phrase banks per inferred emotional state.
// These are NOT used as forced output — the provider injects them as a
// "possible tones, vary naturally" hint so the model can pick texture
// without sounding repetitive across sessions. Keep entries short
// (validation-line scale: 6–8 words, no advice, no questions).

export const EMOTION_PHRASES = {
        anxiety: [
                "Your mind won't slow down.",
                "That tension feels constant.",
                "Everything feels like it's spinning.",
                "Your thoughts keep pulling you in.",
        ],
        overwhelm: [
                "That's a lot to carry.",
                "Everything feels like too much.",
                "It's all stacking up.",
                "That weight adds up quickly.",
        ],
        self_doubt: [
                "That hits your confidence hard.",
                "You're being tough on yourself.",
                "That doubt feels heavy.",
                "You're questioning yourself a lot.",
        ],
        sadness: [
                "That feels really heavy.",
                "There's a quiet weight there.",
                "That kind of hurt lingers.",
                "It's sitting deep right now.",
        ],
        avoidance: [
                "That's a hard thing to face.",
                "Stepping back makes sense here.",
                "Some things take time to approach.",
                "It's okay to move slowly.",
        ],
};

/**
 * Returns a "phrase | phrase | phrase" hint string for the highest-priority
 * inferred state, or null if none match. Uses the same priority order as
 * responsePolicy.mjs so the hint and the chosen tone stay aligned.
 */
export function getEmotionHint(inferredStates = []) {
        if (!Array.isArray(inferredStates) || inferredStates.length === 0) return null;
        const PRIORITY = ["overwhelm", "sadness", "self_doubt", "avoidance", "anxiety"];
        for (const id of PRIORITY) {
                if (inferredStates.includes(id) && EMOTION_PHRASES[id]) {
                        return EMOTION_PHRASES[id].join(" | ");
                }
        }
        return null;
}
