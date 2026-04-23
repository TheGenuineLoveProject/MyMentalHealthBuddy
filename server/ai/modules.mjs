// server/ai/modules.mjs

export const MODULES = {
	anxiety: {
		triggers: /anxious|panic|worry|overthinking/i,
		interventions: ["breathing", "5-4-3-2-1", "grounding"],
		structure: "ground → slow breath → reframe",
		priority: 2
	},

	cognitive_reframe: {
		triggers: /why do I|I keep thinking|I can't stop/i,
		interventions: ["identify_thought", "challenge_thought", "reframe"],
		structure: "identify → challenge → reframe",
		priority: 3
	},

	emotional_processing: {
		triggers: /sad|overwhelmed|empty|hurt/i,
		interventions: ["name_feeling", "body_awareness", "needs_check"],
		structure: "feel → locate → need",
		priority: 2
	},

	relationship: {
		triggers: /partner|relationship|fight|argument/i,
		interventions: ["needs_vs_expression", "repair_prompt"],
		structure: "clarify need → communicate",
		priority: 2
	},

	behavioral_loop: {
		triggers: /always|every time|pattern|cycle/i,
		interventions: ["pattern_detection", "interrupt_pattern"],
		structure: "identify loop → break loop",
		priority: 3
	},

	self_regulation: {
		triggers: /stress|burnout|too much/i,
		interventions: ["reduce_load", "next_small_step"],
		structure: "simplify → act",
		priority: 1
	}
};