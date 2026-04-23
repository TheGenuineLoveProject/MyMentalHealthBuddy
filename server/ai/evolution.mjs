export function analyzeSystem({ telemetry = [] }) {
	const issues = [];

	const slow = telemetry.filter(t => t.latencyMs > 2000);
	if (slow.length > 0) {
		issues.push("High latency detected");
	}

	const failures = telemetry.filter(t => !t.success);
	if (failures.length > 0) {
		issues.push("Failure rate elevated");
	}

	return issues;
}