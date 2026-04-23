// server/ai/toolExecutor.mjs
//
// Tool executor. Turns a TOOLS entry into the structured payload the
// orchestrator returns to the client and the provider injects into the prompt.
//
// Pure function — no I/O, no side effects, never throws.

const INTROS = {
        box_breathing:
                "Let's slow things down together with one short breathing round.",
        grounding_54321: "Let's gently anchor you in the present moment.",
        thought_reframe:
                "Let's look at the thought carefully instead of letting it run the whole story.",
        emotional_checkin: "Let's slow down and notice what you're feeling.",
        relationship_repair:
                "Let's prepare your thoughts so the conversation is clearer and kinder.",
        pattern_interrupt:
                "Let's identify the loop and create one interruption point.",
        overload_reset:
                "Let's reduce the load and choose one manageable next step.",
};

const DEFAULT_CLOSING = "Take what serves you. You know yourself best.";

export function executeTool(tool /* unused: input */) {
        if (!tool) return null;
        return {
                tool: {
                        id: tool.id,
                        title: tool.title,
                        type: tool.type,
                        durationMin: tool.durationMin,
                },
                exercise: {
                        intro: INTROS[tool.id] || `Let's work through: ${tool.title}`,
                        steps: tool.steps,
                        closing: DEFAULT_CLOSING,
                },
        };
}
