// server/ai/providerPolicy.mjs

export function getProviderPolicy() {
	const model =
		process.env.AI_MODEL ||
		process.env.OPENAI_MODEL ||
		"gpt-4o-mini";

	const enabled =
		Boolean(process.env.OPENAI_API_KEY) ||
		Boolean(process.env.AI_INTEGRATIONS_OPENAI_API_KEY);

	return {
		provider: "openai",
		enabled,
		model,
		timeoutMs: Number(process.env.AI_TIMEOUT_MS || 12000),
		maxTokens: Number(process.env.AI_MAX_TOKENS || 500),
		temperature: Number(process.env.AI_TEMPERATURE || 0.7),
		retries: Number(process.env.AI_RETRIES || 1),
	};
}

export function canUseLiveAI(policy = getProviderPolicy()) {
	return Boolean(policy?.enabled);
}