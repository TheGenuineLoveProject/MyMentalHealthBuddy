// server/logging/aiLogger.mjs

import fs from "fs";
import path from "path";

const LOG_DIR = path.resolve("logs");
const AI_LOG_FILE = path.join(LOG_DIR, "ai-logs.jsonl");

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Safe stringify (avoids crashes on circular JSON)
function safeStringify(obj) {
	try {
		return JSON.stringify(obj);
	} catch {
		return JSON.stringify({
			error: "Failed to stringify object",
			fallback: true
		});
	}
}

// Generate lightweight request ID
function generateId() {
	return `ai_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Core logger
function writeLog(entry) {
	const line = safeStringify(entry) + "\n";
	fs.appendFile(AI_LOG_FILE, line, (err) => {
		if (err) {
			console.error("AI Logger Write Failed:", err.message);
		}
	});
}

// PUBLIC: log success
export function logAISuccess({
	route = "unknown",
	model = "unknown",
	latencyMs = 0,
	inputLength = 0,
	outputLength = 0
}) {
	writeLog({
		id: generateId(),
		type: "success",
		route,
		model,
		latencyMs,
		inputLength,
		outputLength,
		timestamp: new Date().toISOString()
	});
}

// PUBLIC: log failure
export function logAIFailure({
	route = "unknown",
	model = "unknown",
	error = "unknown",
	latencyMs = 0,
	inputLength = 0
}) {
	writeLog({
		id: generateId(),
		type: "failure",
		route,
		model,
		error: typeof error === "string" ? error : error?.message || "unknown",
		latencyMs,
		inputLength,
		timestamp: new Date().toISOString()
	});
}

// PUBLIC: log fallback usage (CRITICAL for mental health system)
export function logAIFallback({
	route = "unknown",
	reason = "unknown",
	inputLength = 0
}) {
	writeLog({
		id: generateId(),
		type: "fallback",
		route,
		reason,
		inputLength,
		timestamp: new Date().toISOString()
	});
}

// PUBLIC: log safety trigger (VERY IMPORTANT)
export function logAISafetyEvent({
	route = "unknown",
	category = "unknown",
	severity = "unknown"
}) {
	writeLog({
		id: generateId(),
		type: "safety",
		route,
		category,
		severity,
		timestamp: new Date().toISOString()
	});
}