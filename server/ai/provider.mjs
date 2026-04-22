// server/ai/provider.mjs
import { logAICall } from "./telemetry.mjs";

const DEFAULT_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
const FALLBACK_MODEL = "gpt-4o-mini"; // safe fallback

const TIMEOUT_MS = 12000;
const MAX_RETRIES = 2;

/**
 * Core provider call with timeout
 */
async function callOpenAIWithTimeout(openai, payload) {
        return Promise.race([
                openai.chat.completions.create(payload),
                new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("AI timeout")), TIMEOUT_MS)
                )
        ]);
}

/**
 * Main provider function
 */
export async function callAIProvider({
        openai,
        input,
        mode = "normal",
        risk = { level: "low" },
        route = "/api/ai/chat"
}) {
        if (!openai) {
                throw new Error("OpenAI client not available");
        }

        let lastError = null;
        let lastModel = DEFAULT_MODEL;
        const overallStart = Date.now();

        const modelsToTry = [
                DEFAULT_MODEL,
                ...(DEFAULT_MODEL !== FALLBACK_MODEL ? [FALLBACK_MODEL] : [])
        ];

        for (const model of modelsToTry) {
                lastModel = model;
                for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                        try {
                                const start = Date.now();

                                const response = await callOpenAIWithTimeout(openai, {
                                        model,
                                        messages: [
                                                {
                                                        role: "system",
                                                        content:
                                                                mode === "crisis"
                                                                        ? "You are a calm, supportive crisis assistant. Be brief, grounding, and prioritize safety."
                                                                        : "You are a supportive, emotionally intelligent assistant."
                                                },
                                                {
                                                        role: "user",
                                                        content: input
                                                }
                                        ],
                                        temperature: risk.level === "high" ? 0.2 : 0.6
                                });

                                const latency = Date.now() - start;

                                logAICall({
                                        route,
                                        model,
                                        latencyMs: latency,
                                        inputTokens: response.usage?.prompt_tokens || 0,
                                        outputTokens: response.usage?.completion_tokens || 0,
                                        success: true
                                });

                                return {
                                        ok: true,
                                        modelUsed: model,
                                        latency,
                                        reply: response.choices?.[0]?.message?.content || ""
                                };

                        } catch (err) {
                                lastError = err;

                                console.warn(`AI attempt failed (model=${model}, try=${attempt})`, err.message);

                                // retry same model first
                                if (attempt < MAX_RETRIES) continue;

                                // otherwise break to try next model
                                break;
                        }
                }
        }

        // total failure
        logAICall({
                route,
                model: lastModel,
                latencyMs: Date.now() - overallStart,
                inputTokens: 0,
                outputTokens: 0,
                success: false
        });

        return {
                ok: false,
                error: lastError?.message || "AI provider failed"
        };
}
