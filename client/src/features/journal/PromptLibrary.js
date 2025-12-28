cat > client/src/features/journal/PromptLibrary.js <<'EOF'
export const PROMPT_SETS = {
  clarity: [
    "What is the smallest true sentence about what I’m feeling right now?",
    "If I could reduce this moment to one solvable piece, what is it?",
    "What do I know for sure—and what am I only guessing?"
  ],
  nervousSystem: [
    "Where in my body do I feel tension, and what might it be protecting?",
    "What would “safe enough” look like for the next 10 minutes?",
    "What would I do right now if I trusted I’m allowed to go slowly?"
  ],
  selfRespect: [
    "What boundary would be an act of love, not conflict?",
    "Where am I asking myself to shrink, and what is one honest alternative?",
    "What does self-respect look like in a 2-minute action today?"
  ],
  meaning: [
    "What part of me is trying to grow through this?",
    "If this struggle had a message, what might it be asking me to learn?",
    "What would “progress” look like that I can actually sustain?"
  ]
};
EOF