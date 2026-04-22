// server/logging/safetyLogger.mjs

import fs from "node:fs";
import path from "node:path";

const LOG_DIR = path.resolve("logs");
const SAFETY_LOG_FILE = path.join(LOG_DIR, "safety-events.jsonl");

if (!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR, { recursive: true });
}

function safeStringify(obj) {
	try {
		return JSON.stringify(obj);
	} catch {
		return JSON.stringify({
			type: "logger_error",
			message: "Failed to stringify safety log payload",
			timestamp: new Date().toISOString(),
		});
	}
}

function writeSafetyLog(entry) {
	fs.appendFile(
		SAFETY_LOG_FILE,
		`${safeStringify(entry)}\n`,
		(err) => {
			if (err) console.error("Safety logger write failed:", err.message);
		}
	);
}

function makeId() {
	return `safe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function logSafetyEvent({
	route = "unknown",
	type = "safety_event",
	category = "unknown",
	severity = "unknown",
	signal = "unknown",
	meta = {},
} = {}) {
	writeSafetyLog({
		id: makeId(),
		route,
		type,
		category,
		severity,
		signal,
		meta,
		timestamp: new Date().toISOString(),
	});
}