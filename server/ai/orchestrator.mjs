// server/ai/orchestrator.mjs

import { safetyGuardInput } from "./safety/guard.mjs";
import { detectCrisis, CRISIS_RESPONSE } from "./safety/crisis.mjs";
import { classifyCrisis } from "./crisisClassifier.mjs";
import { assessRisk } from "../lib/promptEngine.mjs";
import { getProviderPolicy, canUseLiveAI } from "./providerPolicy.mjs";
import { logSafetyEvent } from "../logging/safetyLogger.mjs";
import { callAIProvider } from "./provider.mjs";

// ================================
// FEATURE FLAGS (CONTROL LAYER)
// ================================
const ENABLE_CLASSIFIER = false;
const ENABLE_RISK = false;


export async function orchestrateAIRequest({
        route = "/api/ai/chat",
        message = "",
        openai = null,
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

        if (classifierScore >= 1 || risk?.level === "high") {
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
                return {
                        ok: true,
                        stage: "provider",
                        outcome: "fallback",
                        mode: "fallback",
                        providerPolicy,
                        cleanText,
                        response: {
                                ok: true,
                                reply:
                                        "I’m here with you. I can’t reach my full thinking right now, " +
                                        "but you’re not alone — take a slow breath, and tell me what’s on your mind.",
                                source: "fallback",
                        },
                };
        }

        const aiResult = await callAIProvider({
                openai,
                input: cleanText,
                mode: "normal",
                risk,
        });

        if (!aiResult.ok) {
                return {
                        ok: false,
                        status: 500,
                        stage: "ai",
                        response: {
                                error: "AI unavailable. Please try again.",
                        },
                };
        }

        return {
                ok: true,
                stage: "provider",
                outcome: "live_ai",
                mode: "live_ai",
                providerPolicy,
                cleanText,
                response: {
                        ok: true,
                        reply: aiResult.reply,
                        source: "openai",
                        modelUsed: aiResult.modelUsed,
                        latencyMs: aiResult.latency,
                },
        };
}