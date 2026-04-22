import fs from "node:fs";
import path from "node:path";

const LOG_PATH = path.join(process.cwd(), "logs", "ai-telemetry.jsonl");

function ensureLogFile() {
	const dir = path.dirname(LOG_PATH);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function estimateCost(model, inputTokens = 0, outputTokens = 0) {
	// Rough pricing (adjust later if needed)
	const pricing = {
		"gpt-4o-mini": { input: 0.00000015, output: 0.0000006 }
	};

	const p = pricing[model] || pricing["gpt-4o-mini"];

	return (
		inputTokens * p.input +
		outputTokens * p.output
	);
}

export function logAICall({
	route,
	model,
	latencyMs,
	inputTokens,
	outputTokens,
	success,
}) {
	try {
		ensureLogFile();

		const costUsd = estimateCost(model, inputTokens, outputTokens);

		const entry = {
			type: "ai_call",
			timestamp: new Date().toISOString(),
			route,
			model,
			latencyMs,
			tokens: {
				input: inputTokens,
				output: outputTokens
			},
			costUsd,
			success
		};

		fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + "\n");
	} catch (err) {
		// Silent fail (never break request flow)
		console.error("Telemetry error:", err.message);
	}
}