const {
	getPrompt,
	getPromptsByDomain,
	hasPrompt
} = require("../core/PromptRegistry.cjs");

function assert(condition, label) {
	if (!condition) {
		throw new Error(`FAIL: ${label}`);
	}
	console.log(`PASS: ${label}`);
}

function run() {
	const healingPrompt = getPrompt("h03_cbt_reframe");
	assert(healingPrompt !== null, "h03_cbt_reframe exists");
	assert(healingPrompt.domain === "healing", "h03_cbt_reframe domain is healing");

	const businessPrompt = getPrompt("b03_content_factory");
	assert(businessPrompt !== null, "b03_content_factory exists");
	assert(businessPrompt.domain === "business", "b03_content_factory domain is business");

	const healingPrompts = getPromptsByDomain("healing");
	assert(Object.keys(healingPrompts).length >= 8, "healing registry loaded");

	const businessPrompts = getPromptsByDomain("business");
	assert(Object.keys(businessPrompts).length >= 10, "business registry loaded");

	assert(hasPrompt("h08_safety_check") === true, "hasPrompt finds safety prompt");
	assert(hasPrompt("b10_ops_sops") === true, "hasPrompt finds ops prompt");
	assert(hasPrompt("missing_prompt") === false, "hasPrompt rejects missing prompt");

	console.log("\nALL PROMPT REGISTRY SMOKE TESTS PASSED");
}

run();