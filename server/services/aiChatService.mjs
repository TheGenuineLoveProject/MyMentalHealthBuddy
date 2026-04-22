// server/services/aiChatService.mjs

import { orchestrateAIRequest } from "../ai/orchestrator.mjs";
import { chatCompletion } from "../utils/aiClient.mjs";
import {
	logAISuccess,
	logAIFailure,
	logAIFallback,
} from "../logging/aiLogger.mjs";
import { upgradeTherapyReply } from "../engine/therapyIntelligence.mjs";

function buildDeterministicFallback(message = "") {
	const t = String(message || "").toLowerCase();

	if (t.includes("anxious") || t.includes("panic") || t.includes("worried")) {
		return [
			"It sounds like your system may be on high alert right now.",
			"Try this short grounding sequence:",
			"1. Name 5 things you can see.",
			"2. Name 4 things you can feel.",
			"3. Take one slow breath in for 4 and out for 6.",
			"What feels most uncertain right now?",
			"Take what serves you. You know yourself best.",
		].join("\n");
	}

	if (t.includes("overwhelmed") || t.includes("too much") || t.includes("can't cope")) {
		return [
			"It makes sense that things feel heavy right now.",
			"Let’s reduce the load into one small next step:",
			"1. What is the heaviest piece?",
			"2. What can wait?",
			"3. What is one kind action you can take in the next 10 minutes?",
			"Take what serves you. You know yourself best.",
		].join("\n");
	}

	return [
		"I’m here with you.",
		"Would you like to explore this using one of these paths?",
		"- what happened",
		"- what I'm feeling",
		"- what I need",
		"- one small next step",
		"Take what serves you. You know yourself best.",
	].join("\n");
}

export async function runAIChat({
	route = "/api/ai/chat",
	message = "",
	history = [],
	openai = null,
} = {}) {
	const startedAt = Date.now();

	const decision = await orchestrateAIRequest({
		route,
		message,
		openai,
	});

	if (!decision.ok && decision.response?.error) {
		return {
			status: decision.status || 400,
			body: decision.response,
		};
	}

	if (decision.mode === "crisis_response") {
		return {
			status: 200,
			body: decision.response,
		};
	}

	if (decision.mode === "fallback") {
		const reply = buildDeterministicFallback(decision.cleanText);

		logAIFallback({
			route,
			reason: "provider_not_configured",
			inputLength: decision.cleanText.length,
		});

		let therapy = null;
		try {
			const upgraded = upgradeTherapyReply(reply, {
				message: decision.cleanText,
				history,
			});
			therapy = upgraded?.therapy || null;
		} catch {}

		return {
			status: 200,
			body: {
				ok: true,
				reply,
				therapy,
				source: "fallback",
				historyUsed: history.length,
			},
		};
	}

	const policy = decision.providerPolicy;

	try {
		const aiMessages = [
			...history,
			{ role: "user", content: decision.cleanText },
		];

		const aiResult = await chatCompletion({
			messages: aiMessages,
			model: policy.model,
			temperature: policy.temperature,
			maxTokens: policy.maxTokens,
			timeoutMs: policy.timeoutMs,
			retries: policy.retries,
		});

		if (!aiResult?.success || !aiResult?.content) {
			const reply = buildDeterministicFallback(decision.cleanText);

			logAIFallback({
				route,
				reason: aiResult?.error || "ai_unavailable",
				inputLength: decision.cleanText.length,
			});

			let therapy = null;
			try {
				const upgraded = upgradeTherapyReply(reply, {
					message: decision.cleanText,
					history,
				});
				therapy = upgraded?.therapy || null;
			} catch {}

			return {
				status: 200,
				body: {
					ok: true,
					reply,
					therapy,
					source: "fallback",
					historyUsed: history.length,
				},
			};
		}

		const latencyMs = Date.now() - startedAt;
		const reply = aiResult.content;

		logAISuccess({
			route,
			model: policy.model,
			latencyMs,
			inputLength: decision.cleanText.length,
			outputLength: reply.length,
		});

		let therapy = null;
		try {
			const upgraded = upgradeTherapyReply(reply, {
				message: decision.cleanText,
				history,
			});
			therapy = upgraded?.therapy || null;
		} catch {}

		return {
			status: 200,
			body: {
				ok: true,
				reply,
				therapy,
				source: "openai",
				historyUsed: history.length,
			},
		};
	} catch (err) {
		logAIFailure({
			route,
			model: policy.model,
			error: err,
			latencyMs: Date.now() - startedAt,
			inputLength: decision.cleanText.length,
		});

		const reply = buildDeterministicFallback(decision.cleanText);

		logAIFallback({
			route,
			reason: err?.message || "live_ai_exception",
			inputLength: decision.cleanText.length,
		});

		let therapy = null;
		try {
			const upgraded = upgradeTherapyReply(reply, {
				message: decision.cleanText,
				history,
			});
			therapy = upgraded?.therapy || null;
		} catch {}

		return {
			status: 200,
			body: {
				ok: true,
				reply,
				therapy,
				source: "fallback",
				historyUsed: history.length,
			},
		};
	}
}