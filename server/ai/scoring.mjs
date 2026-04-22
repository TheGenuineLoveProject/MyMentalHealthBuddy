// server/ai/scoring.mjs

/**
 * Request scoring system
 * Decides model + temperature based on complexity + risk
 */

export function scoreRequest({ input = "", risk = { level: "low" } }) {
	const length = input.length;

	let score = 0;

	// 1. LENGTH SIGNAL
	if (length > 500) score += 2;
	else if (length > 200) score += 1;

	// 2. COMPLEXITY SIGNAL (basic heuristic)
	const complexPatterns = [
		"why",
		"how",
		"explain",
		"understand",
		"trauma",
		"pattern",
		"cycle",
		"relationship"
	];

	for (const word of complexPatterns) {
		if (input.toLowerCase().includes(word)) {
			score += 1;
			break;
		}
	}

	// 3. RISK SIGNAL
	if (risk.level === "high") score += 2;
	if (risk.level === "medium") score += 1;

	// 4. FINAL DECISION
	let model = "gpt-4o-mini"; // default cheap
	let temperature = 0.6;

	if (score >= 3) {
		model = "gpt-4o"; // higher quality
		temperature = 0.4;
	}

	return {
		score,
		model,
		temperature,
		tier: score >= 3 ? "high" : "standard"
	};
}