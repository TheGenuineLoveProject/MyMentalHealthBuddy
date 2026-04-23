// server/ai/emotionInference.mjs
//
// Subtle emotional state inference layer.
//
// Pure function — no I/O, no side effects, never throws. Returns an array of
// state ids drawn from a fixed vocabulary. These states feed the response
// policy's TONE branch; module selection (which intervention/tool to surface)
// remains the job of moduleRouter.mjs. The two layers are complementary:
// moduleRouter answers "what to do," emotionInference answers "how to say it."
//
// Vocabulary (stable — telemetry/policy depend on these ids):
//   anxiety       — racing thoughts / what-ifs / can't stop thinking
//   overwhelm     — capacity-exceeded / "everything" / "too much"
//   sadness       — depleted / "tired of" / meaning-loss
//   avoidance     — deflection / "deal with later" / "don't want to"
//   self_doubt    — self-attacking / "always mess up" / "not good enough"
//
// Pattern policy: indirect/suppressed phrasing wins over direct keywords.
// Direct keywords (anxious, sad) are intentionally NOT matched here — those
// already fire moduleRouter; this layer catches the language users use when
// they DON'T name the feeling.

const PATTERNS = {
        anxiety: /overthink|over-think|what if|what-if|racing|can'?t stop thinking|cant stop thinking|spiraling|spiralling/i,
        overwhelm: /too much|so much|everything|can'?t handle|cant handle|stacking up|piling up|drowning|under water|(?:a )?lot going on|lots? (?:going on|happening)|too many things|all at once/i,
        sadness: /tired of|pointless|nothing matters|what'?s the point|whats the point|empty inside|numb/i,
        avoidance: /deal (?:with )?(?:it )?later|push(?:ing)? (?:it )?(?:aside|away|down)|ignore|don'?t want to (?:think|deal|talk)|dont want to (?:think|deal|talk)/i,
        self_doubt: /always mess (?:things )?up|always screw (?:things )?up|not good enough|never good enough|something wrong with me|(?:i am|i'?m|im) (?:such )?(?:a |an )?(?:failure|loser|idiot|mess|burden)|hate (?:my ?self|who i am)|i can'?t do anything right|cant do anything right/i,
};

export function inferEmotionalState(text = "") {
        if (typeof text !== "string" || !text.trim()) return [];
        const out = [];
        for (const key of Object.keys(PATTERNS)) {
                if (PATTERNS[key].test(text)) out.push(key);
        }
        return out;
}
