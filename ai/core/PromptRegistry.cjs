const registry = {
	healing: {
		h01_intake: {
			id: "h01_intake",
			domain: "healing",
			file: "ai/healing/prompts/h01_intake.md",
			description: "Initial emotional intake prompt"
		},
		h02_journal_reflect: {
			id: "h02_journal_reflect",
			domain: "healing",
			file: "ai/healing/prompts/h02_journal_reflect.md",
			description: "Journaling and reflection prompt"
		},
		h03_cbt_reframe: {
			id: "h03_cbt_reframe",
			domain: "healing",
			file: "ai/healing/prompts/h03_cbt_reframe.md",
			description: "CBT-style reframe prompt"
		},
		h04_act_values: {
			id: "h04_act_values",
			domain: "healing",
			file: "ai/healing/prompts/h04_act_values.md",
			description: "ACT values clarification prompt"
		},
		h05_breathing_grounding: {
			id: "h05_breathing_grounding",
			domain: "healing",
			file: "ai/healing/prompts/h05_breathing_grounding.md",
			description: "Breathing and grounding prompt"
		},
		h06_sleep_reset: {
			id: "h06_sleep_reset",
			domain: "healing",
			file: "ai/healing/prompts/h06_sleep_reset.md",
			description: "Sleep reset prompt"
		},
		h07_conflict_script: {
			id: "h07_conflict_script",
			domain: "healing",
			file: "ai/healing/prompts/h07_conflict_script.md",
			description: "Conflict conversation support prompt"
		},
		h08_safety_check: {
			id: "h08_safety_check",
			domain: "healing",
			file: "ai/healing/prompts/h08_safety_check.md",
			description: "Safety-aware escalation prompt"
		}
	},

	business: {
		b01_offer_design: {
			id: "b01_offer_design",
			domain: "business",
			file: "ai/business/prompts/b01_offer_design.md",
			description: "Offer design prompt"
		},
		b02_funnel_map: {
			id: "b02_funnel_map",
			domain: "business",
			file: "ai/business/prompts/b02_funnel_map.md",
			description: "Funnel mapping prompt"
		},
		b03_content_factory: {
			id: "b03_content_factory",
			domain: "business",
			file: "ai/business/prompts/b03_content_factory.md",
			description: "Content production prompt"
		},
		b04_email_sequences: {
			id: "b04_email_sequences",
			domain: "business",
			file: "ai/business/prompts/b04_email_sequences.md",
			description: "Email sequence prompt"
		},
		b05_seo_briefs: {
			id: "b05_seo_briefs",
			domain: "business",
			file: "ai/business/prompts/b05_seo_briefs.md",
			description: "SEO brief prompt"
		},
		b06_competitive_scan: {
			id: "b06_competitive_scan",
			domain: "business",
			file: "ai/business/prompts/b06_competitive_scan.md",
			description: "Competitive scan prompt"
		},
		b07_pricing_packaging: {
			id: "b07_pricing_packaging",
			domain: "business",
			file: "ai/business/prompts/b07_pricing_packaging.md",
			description: "Pricing and packaging prompt"
		},
		b08_retention_loyalty: {
			id: "b08_retention_loyalty",
			domain: "business",
			file: "ai/business/prompts/b08_retention_loyalty.md",
			description: "Retention and loyalty prompt"
		},
		b09_partnerships: {
			id: "b09_partnerships",
			domain: "business",
			file: "ai/business/prompts/b09_partnerships.md",
			description: "Partnerships prompt"
		},
		b10_ops_sops: {
			id: "b10_ops_sops",
			domain: "business",
			file: "ai/business/prompts/b10_ops_sops.md",
			description: "Operations and SOPs prompt"
		}
	}
};

function getPrompt(promptId) {
	for (const domain of Object.keys(registry)) {
		if (registry[domain][promptId]) {
			return registry[domain][promptId];
		}
	}
	return null;
}

function getPromptsByDomain(domain) {
	return registry[domain] || {};
}

function hasPrompt(promptId) {
	return Boolean(getPrompt(promptId));
}

module.exports = {
	registry,
	getPrompt,
	getPromptsByDomain,
	hasPrompt
};