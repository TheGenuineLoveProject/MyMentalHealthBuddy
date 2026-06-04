export type LumiEmotion =
	| "calm"
	| "grounded"
	| "hopeful"
	| "sleepy"
	| "reflective"
	| "supportive";

export interface LumiState {
	emotion: LumiEmotion;
	scene: string;
	energy: number;
	circadianMode: "morning" | "day" | "evening" | "night";
	motionIntensity: number;
}