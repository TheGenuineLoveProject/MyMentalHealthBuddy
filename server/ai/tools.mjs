// server/ai/tools.mjs
//
// Tool Catalog. Each tool is bound to a module id from MODULE_REGISTRY in
// server/ai/moduleRouter.mjs. Tools are evidence-informed micro-exercises the
// model can execute concretely instead of giving general advice.
//
// Pure data — no I/O, no side effects.

export const TOOLS = {
        box_breathing: {
                id: "box_breathing",
                module: "anxiety",
                title: "Box Breathing",
                type: "interactive_exercise",
                durationMin: 2,
                steps: [
                        "Inhale for 4",
                        "Hold for 4",
                        "Exhale for 4",
                        "Hold for 4",
                ],
                prompt: "Guide the user through one calm round of box breathing.",
        },
        grounding_54321: {
                id: "grounding_54321",
                module: "anxiety",
                title: "5-4-3-2-1 Grounding",
                type: "interactive_exercise",
                durationMin: 3,
                steps: [
                        "Name 5 things you can see",
                        "Name 4 things you can feel",
                        "Name 3 things you can hear",
                        "Name 2 things you can smell",
                        "Name 1 thing you can taste",
                ],
                prompt: "Guide the user through the 5-4-3-2-1 grounding exercise.",
        },
        thought_reframe: {
                id: "thought_reframe",
                // NOTE: mapped to MY module id `thought_pattern` (advisor recipe used `cognitive_reframe`).
                module: "thought_pattern",
                title: "Thought Reframe",
                type: "worksheet",
                durationMin: 5,
                steps: [
                        "What is the thought?",
                        "What evidence supports it?",
                        "What evidence challenges it?",
                        "What is a more balanced thought?",
                ],
                prompt: "Help the user examine and reframe a distressing thought.",
        },
        emotional_checkin: {
                id: "emotional_checkin",
                module: "emotional_processing",
                title: "Emotion Check-In",
                type: "reflective_exercise",
                durationMin: 4,
                steps: [
                        "Name the feeling",
                        "Where do you feel it in your body?",
                        "What does this feeling need?",
                ],
                prompt: "Guide the user through a brief emotional check-in.",
        },
        relationship_repair: {
                id: "relationship_repair",
                module: "relationship",
                title: "Repair Conversation Prep",
                type: "conversation_prep",
                durationMin: 6,
                steps: [
                        "What happened?",
                        "What do you feel?",
                        "What do you need?",
                        "What repair request do you want to make?",
                ],
                prompt: "Help the user prepare for a repair-oriented conversation.",
        },
        pattern_interrupt: {
                id: "pattern_interrupt",
                // NOTE: mapped to MY module id `loop_detection` (advisor recipe used `behavioral_loop`).
                module: "loop_detection",
                title: "Pattern Interrupt",
                type: "pattern_tool",
                durationMin: 5,
                steps: [
                        "What pattern keeps repeating?",
                        "What triggers it?",
                        "What happens right before it starts?",
                        "What is one interrupt move?",
                ],
                prompt: "Help the user identify and interrupt a repeating behavioral loop.",
        },
        overload_reset: {
                id: "overload_reset",
                module: "self_regulation",
                title: "Overload Reset",
                type: "regulation_tool",
                durationMin: 3,
                steps: [
                        "Name the heaviest task",
                        "Decide what can wait",
                        "Choose one next tiny step",
                ],
                prompt: "Help the user reduce overwhelm and choose one next step.",
        },
};
