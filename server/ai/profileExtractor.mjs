// server/ai/profileExtractor.mjs
//
// LLM-driven structured profile extraction.
// Returns a JSON object matching EMPTY_PROFILE shape; never throws.

import { logAICall } from "./aiTelemetry.mjs";
import { EMPTY_PROFILE } from "./profileStore.mjs";

const MODEL = "gpt-4o-mini";
const TELEMETRY_ROUTE = "/ai/internal/profile";

const SYSTEM_PROMPT = `You analyze a conversation between a user and a supportive assistant and extract a structured profile of the user.

Return ONLY valid JSON matching EXACTLY this shape (no prose, no markdown, no code fence):

{
  "emotional_patterns": [],
  "triggers": [],
  "relationship_themes": [],
  "coping_strategies": [],
  "support_needs": [],
  "risk_flags": [],
  "core_beliefs": [],
  "behavior_loops": [],
  "values": []
}

Field guidance:
- "core_beliefs" = recurring self-statements ("I'm not enough", "I have to be perfect")
- "behavior_loops" = stimulus → response patterns ("when stressed → withdraws from partner")
- "values" = what the user explicitly cares about ("creativity", "being a good parent")

Rules:
- Each value MUST be an array of short strings (max 8 words each).
- Only include items strongly supported by the conversation. Empty arrays are fine.
- "risk_flags" should ONLY contain neutral, non-clinical observations (e.g. "reports persistent insomnia"). Never include diagnoses or crisis terms.
- Do NOT include personally identifying information (names, addresses, employers, etc.).
- Be specific and actionable, not generic. Prefer "anxiety before public speaking" over "anxiety".`;

export async function extractProfile({ openai, history }) {
        const start = Date.now();

        if (!openai || !Array.isArray(history) || history.length === 0) {
                logAICall({
                        route: TELEMETRY_ROUTE,
                        model: MODEL,
                        latencyMs: 0,
                        inputTokens: 0,
                        outputTokens: 0,
                        success: false,
                        extra: { purpose: "profile_extraction", reason: "no_input_or_client" },
                });
                return null;
        }

        try {
                const text = history
                        .map((m) => `${m.role}: ${m.content}`)
                        .join("\n");

                const response = await openai.chat.completions.create({
                        model: MODEL,
                        messages: [
                                { role: "system", content: SYSTEM_PROMPT },
                                { role: "user", content: text },
                        ],
                        temperature: 0.2,
                        response_format: { type: "json_object" },
                });

                const raw = response.choices?.[0]?.message?.content || "{}";
                let parsed;
                try {
                        parsed = JSON.parse(raw);
                } catch {
                        parsed = {};
                }

                // Coerce to known shape: drop unknown values, force arrays of strings
                const cleaned = { ...EMPTY_PROFILE };
                for (const key of Object.keys(EMPTY_PROFILE)) {
                        const v = parsed[key];
                        cleaned[key] = Array.isArray(v)
                                ? v
                                          .filter((x) => typeof x === "string" && x.trim())
                                          .map((x) => x.trim().slice(0, 120))
                                : [];
                }

                logAICall({
                        route: TELEMETRY_ROUTE,
                        model: MODEL,
                        latencyMs: Date.now() - start,
                        inputTokens: response.usage?.prompt_tokens || 0,
                        outputTokens: response.usage?.completion_tokens || 0,
                        success: true,
                        extra: { purpose: "profile_extraction" },
                });

                return cleaned;
        } catch (err) {
                console.warn("Profile extraction failed:", err.message);
                logAICall({
                        route: TELEMETRY_ROUTE,
                        model: MODEL,
                        latencyMs: Date.now() - start,
                        inputTokens: 0,
                        outputTokens: 0,
                        success: false,
                        extra: {
                                purpose: "profile_extraction",
                                reason: err?.message || "unknown",
                        },
                });
                return null;
        }
}
