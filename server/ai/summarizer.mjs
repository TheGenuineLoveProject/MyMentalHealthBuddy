// server/ai/summarizer.mjs
import { logAICall } from "./telemetry.mjs";

/**
 * AI-powered semantic summarization of conversation history.
 * Returns "" on any failure so callers never crash. All calls (success
 * and failure) are logged to ai-telemetry.jsonl with route
 * "/ai/internal/summarize" and purpose "summary" so dashboards can
 * split summarizer cost from user-facing chat cost.
 */
export async function summarizeWithAI({ openai, history }) {
        const TELEMETRY_ROUTE = "/ai/internal/summarize";
        const MODEL = "gpt-4o-mini";
        const start = Date.now();

        if (!openai) {
                logAICall({
                        route: TELEMETRY_ROUTE,
                        model: MODEL,
                        latencyMs: 0,
                        inputTokens: 0,
                        outputTokens: 0,
                        success: false,
                        extra: { purpose: "summary", reason: "no_openai_client" },
                });
                return "";
        }

        try {
                const text = (Array.isArray(history) ? history : [])
                        .map((m) => `${m.role}: ${m.content}`)
                        .join("\n");

                const response = await openai.chat.completions.create({
                        model: MODEL,
                        messages: [
                                {
                                        role: "system",
                                        content:
                                                "Summarize the user's emotional patterns, key themes, and needs. Be concise, structured, and preserve meaning.",
                                },
                                {
                                        role: "user",
                                        content: text,
                                },
                        ],
                        temperature: 0.3,
                });

                const summary = response.choices?.[0]?.message?.content || "";

                logAICall({
                        route: TELEMETRY_ROUTE,
                        model: MODEL,
                        latencyMs: Date.now() - start,
                        inputTokens: response.usage?.prompt_tokens || 0,
                        outputTokens: response.usage?.completion_tokens || 0,
                        success: true,
                        extra: { purpose: "summary" },
                });

                return summary;
        } catch (err) {
                console.warn("AI summary failed:", err.message);
                logAICall({
                        route: TELEMETRY_ROUTE,
                        model: MODEL,
                        latencyMs: Date.now() - start,
                        inputTokens: 0,
                        outputTokens: 0,
                        success: false,
                        extra: { purpose: "summary", reason: err?.message || "unknown" },
                });
                return "";
        }
}
