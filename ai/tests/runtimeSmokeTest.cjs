const { routePrompt } = require("../core/router.cjs");
const { trackPromptUsage } = require("../core/telemetry.cjs");
const { scorePrompt } = require("../optimization/scorer.cjs");

function assertEqual(actual, expected, label) {
	if (actual !== expected) {
		throw new Error(`${label} failed: expected "${expected}" but got "${actual}"`);
	}
	console.log(`PASS: ${label}`);
}

function assertNumber(value, label) {
	if (typeof value !== "number" || Number.isNaN(value)) {
		throw new Error(`${label} failed: expected a valid number`);
	}
	console.log(`PASS: ${label}`);
}

function run() {
	const telemetryResult = trackPromptUsage("healing", "h03_cbt_reframe", "I feel anxious");
	if (!telemetryResult || telemetryResult.promptId !== "h03_cbt_reframe") {
		throw new Error("Telemetry function failed");
	}
	console.log("PASS: telemetry");

	const healingRoute = routePrompt("healing", "I feel anxious");
	assertEqual(healingRoute, "h03_cbt_reframe", "healing route");

	const businessRoute = routePrompt("business", "create social content for newsletter growth");
	assertEqual(businessRoute, "b03_content_factory", "business route");

	const score = scorePrompt({
		usageCount: 10,
		successCount: 8,
		failureCount: 2,
		avgLatencyMs: 1200
	});

	assertNumber(score.score, "scorePrompt score");
	assertEqual(score.successRate, 0.8, "success rate");
	assertEqual(score.failureRate, 0.2, "failure rate");

	console.log("\nALL RUNTIME SMOKE TESTS PASSED");
}

run();