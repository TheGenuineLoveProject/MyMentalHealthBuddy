export type EmotionalState =
	| "calmIdle"
	| "listening"
	| "comforting"
	| "grounding"
	| "thinking"
	| "sleepy"
	| "joy"
	| "concern"
	| "breathingGuide"
	| "welcoming"
	| "reflective";

export const BREATHING_CYCLE = {
	inhale: 2.8,
	hold: 0.4,
	exhale: 3.6,
	rest: 0.3,
};

export const BLINK_RANGE = {
	minMs: 3000,
	maxMs: 8000,
};

export const REACTION_LATENCY = {
	eyeShiftMinMs: 200,
	eyeShiftMaxMs: 600,
	smileMinMs: 400,
	smileMaxMs: 900,
	settleMinMs: 500,
	settleMaxMs: 1200,
};