// server/ai/orchestrator.mjs
//
// =====================================================================
// CONTRACT (DO NOT BREAK)
// =====================================================================
// orchestrateAIRequest({ route, message, openai, userKey })
//
// Returns:
//   {
//     ok: boolean,
//     status?: number,         // present when ok === false
//     stage: string,           // validation | safety | risk | fallback | ai
//     outcome: string,         // crisis | blocked | soft_response | success | failure
//     mode?: string,
//     response: object         // shape depends on stage/outcome
//   }
//
// This is a PURE orchestration function — NOT an Express route handler.
// DO NOT introduce `req`, `res`, `next`, or any Express idioms here.
// Identity comes in pre-resolved via `userKey`. The route layer is the
// ONLY place that touches `req`. Variable names are stable: `aiResult`
// (not `result`), `mode` is hard-coded for the post-safety branch.
// =====================================================================

import { safetyGuardInput } from "./safety/guard.mjs";
import { detectCrisis, CRISIS_RESPONSE } from "./safety/crisis.mjs";
import { classifyCrisis } from "./crisisClassifier.mjs";
import { assessRisk } from "../lib/promptEngine.mjs";
import { getProviderPolicy, canUseLiveAI } from "./providerPolicy.mjs";
import { logSafetyEvent } from "../logging/safetyLogger.mjs";
import { callAIProvider } from "./provider.mjs";
import { scoreRequest } from "./scoring.mjs";
import { loadMemory, saveMemory } from "./memory.mjs";
import { loadSummary } from "./memorySummary.mjs";
import { loadProfile, profileHasContent } from "./profileStore.mjs";
import { buildResponsePolicy, renderPolicySystemMessage } from "./responsePolicy.mjs";
import { inferEmotionalState } from "./emotionInference.mjs";
import { selectModules } from "./moduleRouter.mjs";
import { selectTool } from "./toolSelector.mjs";
import { executeTool } from "./toolExecutor.mjs";

// ================================
// FEATURE FLAGS (CONTROL LAYER)
// ================================
const ENABLE_CLASSIFIER = false;
const ENABLE_RISK = false;

export async function orchestrateAIRequest({
        route = "/api/ai/chat",
        message = "",
        openai = null,
        userKey = "anonymous",
} = {}) {
        const trimmed = String(message || "").trim();

        if (!trimmed) {
                return {
                        ok: false,
                        status: 400,
                        stage: "validation",
                        response: { error: "Message required" },
                };
        }

        const guarded = safetyGuardInput(trimmed);

        if (guarded?.blocked && guarded?.crisis) {
                logSafetyEvent({
                        route,
                        type: "crisis_short_circuit",
                        category: "crisis",
                        severity: "high",
                        signal: "safety_guard_crisis",
                });

                return {
                        ok: true,
                        stage: "safety",
                        outcome: "crisis",
                        mode: "crisis_response",
                        response: {
                                isCrisis: true,
                                reply: guarded.response?.reply || CRISIS_RESPONSE.reply,
                                resources: guarded.response?.resources || CRISIS_RESPONSE.resources,
                                signals: ["safety_guard_crisis"],
                                action: "escalate_immediately",
                        },
                };
        }

        if (guarded?.blocked) {
                logSafetyEvent({
                        route,
                        type: "blocked_request",
                        category: "policy",
                        severity: "medium",
                        signal: "blocked_pattern",
                });

                return {
                        ok: false,
                        status: 400,
                        stage: "safety",
                        outcome: "blocked",
                        response: {
                                blocked: true,
                                reply:
                                        guarded.response?.reply ||
                                        "I can’t help with that, but I can help with grounding, reflection, or a safer next step.",
                        },
                };
        }

        const cleanText = guarded?.cleanText || trimmed;

        if (detectCrisis(cleanText)) {
                logSafetyEvent({
                        route,
                        type: "keyword_crisis_match",
                        category: "crisis",
                        severity: "high",
                        signal: "keyword_match",
                });

                return {
                        ok: true,
                        stage: "safety",
                        outcome: "crisis",
                        mode: "crisis_response",
                        response: {
                                isCrisis: true,
                                reply: CRISIS_RESPONSE.reply,
                                resources: CRISIS_RESPONSE.resources,
                                signals: ["keyword_match"],
                                action: "escalate_immediately",
                        },
                };
        }

        let classifierScore = 0;
        try {
                if (ENABLE_CLASSIFIER && openai) {
                        const classifierResult = await classifyCrisis(openai, cleanText);

                        classifierScore =
                                String(classifierResult || "").trim() === "CRISIS" ? 1 : 0;
                }
        } catch (err) {
                logSafetyEvent({
                        route,
                        type: "classifier_error",
                        category: "classifier",
                        severity: "low",
                        signal: "classifier_failed",
                        meta: { message: err?.message || "unknown" },
                });
        }

        let risk = { level: "low" };
        try {
                if (ENABLE_RISK) {
                        risk = assessRisk(cleanText) || { level: "low" };
                }
        } catch (err) {
                logSafetyEvent({
                        route,
                        type: "risk_engine_error",
                        category: "risk",
                        severity: "low",
                        signal: "risk_engine_failed",
                        meta: { message: err?.message || "unknown" },
                });
        }

        const isCrisis = classifierScore >= 1 || risk?.level === "high";

        if (isCrisis) {
                logSafetyEvent({
                        route,
                        type: "risk_escalation",
                        category: "crisis",
                        severity: "high",
                        signal: classifierScore >= 1 ? "classifier_high" : "risk_engine_high",
                });

                return {
                        ok: true,
                        stage: "risk",
                        outcome: "crisis",
                        mode: "crisis_response",
                        response: {
                                isCrisis: true,
                                reply: CRISIS_RESPONSE.reply,
                                resources: CRISIS_RESPONSE.resources,
                                signals: [
                                        classifierScore >= 1 ? "classifier_high" : "risk_engine_high",
                                ],
                                action: "escalate_immediately",
                        },
                };
        }

        const providerPolicy = getProviderPolicy();

        if (!canUseLiveAI(providerPolicy)) {
                // Even in fallback we surface the suggested module + tool so the UI
                // can show an exercise card (e.g. "Try box breathing while I'm offline").
                const fbProfile = loadProfile(userKey);
                const fbModules = selectModules({ profile: fbProfile, input: cleanText });
                const fbTool = selectTool({
                        modules: fbModules,
                        profile: fbProfile,
                        input: cleanText,
                });
                const fbToolPayload = executeTool(fbTool);
                return {
                        ok: true,
                        stage: "fallback",
                        outcome: "soft_response",
                        mode: "fallback",
                        providerPolicy,
                        cleanText,
                        response: {
                                reply:
                                        "I’m here with you. I can’t reach my full thinking right now, " +
                                        "but you’re not alone — take a slow breath, and tell me what’s on your mind.",
                                source: "fallback",
                                modelUsed: null,
                                latencyMs: 0,
                                modules: fbModules,
                                tool: fbToolPayload,
                        },
                };
        }

        // ================================
        // SCORING + MEMORY (pre-provider)
        // ================================
        const scoring = scoreRequest({ input: cleanText, risk });
        const memory = loadMemory(userKey);
        const summary = loadSummary(userKey);
        const profile = loadProfile(userKey);
        const modules = selectModules({ profile, input: cleanText });
        const inferredStates = inferEmotionalState(cleanText);
        const policy = buildResponsePolicy({ risk, profile, scoring, modules, inferredStates });

        // Tool selection runs BEFORE policy rendering so an active exercise can
        // override the "1–2 step cap" constraint that otherwise governs guidance.
        // Without this precedence note the model gets contradictory instructions
        // (cap to 2 steps vs. walk the user through the full exercise verbatim).
        const tool = selectTool({ modules, profile, input: cleanText });
        const toolPayload = executeTool(tool);
        if (toolPayload) {
                policy.constraints.push(
                        "An Active exercise is present — follow all listed steps verbatim; the 1–2 step cap does not apply.",
                );
        }
        const policyMsg = renderPolicySystemMessage(policy);

        const aiResult = await callAIProvider({
                openai,
                input: cleanText,
                mode: "normal",
                risk,
                route,
                history: memory,
                summary,
                profile,
                policyMsg,
                modules,
                toolPayload,
                inferredStates,
                modelOverride: scoring.model,
                temperatureOverride: scoring.temperature,
                extraTelemetry: {
                        tier: scoring.tier,
                        score: scoring.score,
                        memoryUsed: memory.length > 0,
                        memorySize: memory.length,
                        hasSummary: !!summary,
                        hasProfile: profileHasContent(profile),
                        policy: {
                                level: risk?.level || "low",
                                tier: scoring?.tier || "standard",
                                interventions: policy.interventions.length,
                                modules,
                                inferredStates,
                        },
                        toolId: toolPayload?.tool?.id || null,
                        toolType: toolPayload?.tool?.type || null,
                        moduleCount: modules.length,
                },
        });

        if (!aiResult.ok) {
                return {
                        ok: false,
                        status: 500,
                        stage: "ai",
                        outcome: "failure",
                        response: { error: aiResult.error || "AI provider failed" },
                };
        }

        // Persist conversation memory (skip on crisis — already short-circuited above).
        // Fire-and-forget: the AI summarization step inside saveMemory takes ~1.8s
        // when history > 12, so we MUST NOT await it on the request path. saveMemory
        // has its own try/catch; the .catch() here is belt-and-suspenders so an
        // unhandled rejection cannot crash the process.
        if (!isCrisis) {
                saveMemory(userKey, cleanText, aiResult.reply, openai).catch((err) => {
                        console.warn("orchestrator: saveMemory background error:", err?.message);
                });
        }

        return {
                ok: true,
                stage: "ai",
                outcome: "success",
                response: {
                        reply: aiResult.reply,
                        source: "openai",
                        modelUsed: aiResult.modelUsed,
                        latencyMs: aiResult.latency,
                        modules,
                        tool: toolPayload,
                },
        };
}
