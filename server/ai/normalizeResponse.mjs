export function normalizeAIResponse(result) {
	// Hard safety: never return undefined/null
	if (!result || typeof result !== "object") {
		return {
			ok: false,
			status: 500,
			stage: "normalize",
			outcome: "invalid_result",
			response: {
				error: "Invalid AI response"
			}
		};
	}

	// Ensure base structure
	const safe = {
		ok: Boolean(result.ok),
		status: result.status || (result.ok ? 200 : 500),
		stage: result.stage || "unknown",
		outcome: result.outcome || (result.ok ? "success" : "failure"),
		response: result.response || {}
	};

	// Ensure response object exists
	if (typeof safe.response !== "object") {
		safe.response = { error: "Malformed response payload" };
	}

	// Guarantee reply exists for success cases
	if (safe.ok && !safe.response.reply) {
		safe.response.reply = "I'm here with you.";
	}

	// Guarantee error exists for failure cases
	if (!safe.ok && !safe.response.error) {
		safe.response.error = "Unknown error";
	}

	return safe;
}