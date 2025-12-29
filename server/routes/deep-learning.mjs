import { Router } from "express";

const router = Router();

// Meta-Learning Strategies - 12 evidence-based techniques
const META_LEARNING_STRATEGIES = [
  { id: "spaced-repetition", name: "Spaced Repetition", category: "Memory", description: "Review material at exponentially increasing intervals", effectiveness: "Very High", implementation: "Use flashcards with algorithms like SM-2 or Anki" },
  { id: "interleaving", name: "Interleaving Practice", category: "Skill Building", description: "Mix different topics/skills during practice sessions", effectiveness: "High", implementation: "Alternate between related subjects rather than blocking" },
  { id: "retrieval-practice", name: "Retrieval Practice", category: "Memory", description: "Actively recall information rather than re-reading", effectiveness: "Very High", implementation: "Self-test frequently, use practice problems" },
  { id: "elaboration", name: "Elaborative Interrogation", category: "Understanding", description: "Ask 'why' and 'how' questions to deepen understanding", effectiveness: "High", implementation: "After learning a fact, explain why it's true" },
  { id: "dual-coding", name: "Dual Coding", category: "Encoding", description: "Combine verbal and visual information", effectiveness: "High", implementation: "Create diagrams, mind maps, and visual representations" },
  { id: "concrete-examples", name: "Concrete Examples", category: "Understanding", description: "Connect abstract concepts to specific instances", effectiveness: "High", implementation: "Generate your own examples for each principle" },
  { id: "desirable-difficulties", name: "Desirable Difficulties", category: "Challenge", description: "Introduce productive struggle that enhances learning", effectiveness: "High", implementation: "Vary conditions, space practice, interleave topics" },
  { id: "metacognition", name: "Metacognitive Monitoring", category: "Self-Regulation", description: "Assess your own understanding and adjust strategies", effectiveness: "Very High", implementation: "Rate confidence before checking answers" },
  { id: "generation-effect", name: "Generation Effect", category: "Encoding", description: "Generate answers before being shown solutions", effectiveness: "High", implementation: "Try solving problems before studying solutions" },
  { id: "pretesting", name: "Pretesting", category: "Priming", description: "Test yourself before learning new material", effectiveness: "Medium-High", implementation: "Take diagnostic tests to identify gaps" },
  { id: "self-explanation", name: "Self-Explanation", category: "Understanding", description: "Explain material to yourself as you learn", effectiveness: "High", implementation: "Pause and explain each step in your own words" },
  { id: "teaching-others", name: "Teaching Effect", category: "Mastery", description: "Prepare to teach material to solidify understanding", effectiveness: "Very High", implementation: "Explain concepts as if teaching a beginner" }
];

// Learning Archetypes - 8 learner profiles
const LEARNING_ARCHETYPES = [
  { id: "analyst", name: "The Analyst", strengths: ["Systematic thinking", "Pattern recognition", "Logical frameworks"], challenges: ["Analysis paralysis", "Perfectionism"], optimalStrategies: ["Structured curricula", "Problem sets", "Comparative analysis"] },
  { id: "experimenter", name: "The Experimenter", strengths: ["Hands-on learning", "Trial and error", "Practical application"], challenges: ["Impatience with theory", "Scattered focus"], optimalStrategies: ["Project-based learning", "Labs", "Prototyping"] },
  { id: "connector", name: "The Connector", strengths: ["Interdisciplinary thinking", "Synthesis", "Broad knowledge"], challenges: ["Depth vs breadth tradeoff", "Overwhelm"], optimalStrategies: ["Concept mapping", "Cross-domain projects", "Discussion groups"] },
  { id: "contemplator", name: "The Contemplator", strengths: ["Deep reflection", "Philosophical inquiry", "Meaning-making"], challenges: ["Slow processing", "Isolation"], optimalStrategies: ["Journaling", "Socratic dialogue", "Long-form reading"] },
  { id: "competitor", name: "The Competitor", strengths: ["Goal-driven", "Performance focus", "Resilience"], challenges: ["Burnout", "Fixed mindset risks"], optimalStrategies: ["Gamification", "Benchmarks", "Challenges"] },
  { id: "collaborator", name: "The Collaborator", strengths: ["Social learning", "Diverse perspectives", "Accountability"], challenges: ["Dependency on others", "Group dynamics"], optimalStrategies: ["Study groups", "Pair programming", "Peer teaching"] },
  { id: "creator", name: "The Creator", strengths: ["Original thinking", "Expression", "Synthesis into products"], challenges: ["Following structure", "Finishing projects"], optimalStrategies: ["Project portfolios", "Creative assignments", "Building to learn"] },
  { id: "curator", name: "The Curator", strengths: ["Information organization", "Resource gathering", "Knowledge management"], challenges: ["Collection vs application", "Information hoarding"], optimalStrategies: ["Note-taking systems", "Knowledge bases", "Curation projects"] }
];

// Cognitive Load Principles - 10 instructional design rules
const COGNITIVE_LOAD_PRINCIPLES = [
  { id: "chunking", name: "Chunking", description: "Break information into manageable units of 4-7 items", application: "Present complex material in digestible segments" },
  { id: "worked-examples", name: "Worked Examples", description: "Show step-by-step solutions before asking for problem-solving", application: "Model expert thinking before independent practice" },
  { id: "scaffolding", name: "Scaffolding", description: "Provide temporary support that's gradually removed", application: "Start with hints and remove as competence builds" },
  { id: "modality", name: "Modality Principle", description: "Use both visual and auditory channels to increase capacity", application: "Combine diagrams with narration rather than text" },
  { id: "redundancy", name: "Redundancy Reduction", description: "Avoid presenting the same information in multiple formats", application: "Don't read text that's already on screen" },
  { id: "coherence", name: "Coherence Principle", description: "Remove extraneous content that doesn't support learning goals", application: "Cut interesting but irrelevant tangents" },
  { id: "signaling", name: "Signaling", description: "Highlight essential material to guide attention", application: "Use bold, color, or arrows for key concepts" },
  { id: "segmenting", name: "Segmenting", description: "Allow learner control over pace of presentation", application: "Break videos into segments with pause points" },
  { id: "pretraining", name: "Pretraining", description: "Teach component concepts before the full system", application: "Learn vocabulary before grammar rules" },
  { id: "spatial-contiguity", name: "Spatial Contiguity", description: "Place related text and graphics near each other", application: "Integrate labels into diagrams rather than legends" }
];

// Routes
router.get("/strategies", (_req, res) => {
  res.json({ success: true, data: META_LEARNING_STRATEGIES });
});

router.get("/strategies/:id", (req, res) => {
  const strategy = META_LEARNING_STRATEGIES.find(s => s.id === req.params.id);
  if (!strategy) {
    return res.status(404).json({ success: false, error: "Strategy not found" });
  }
  res.json({ success: true, data: strategy });
});

router.get("/archetypes", (_req, res) => {
  res.json({ success: true, data: LEARNING_ARCHETYPES });
});

router.get("/archetypes/:id", (req, res) => {
  const archetype = LEARNING_ARCHETYPES.find(a => a.id === req.params.id);
  if (!archetype) {
    return res.status(404).json({ success: false, error: "Archetype not found" });
  }
  res.json({ success: true, data: archetype });
});

router.get("/cognitive-load", (_req, res) => {
  res.json({ success: true, data: COGNITIVE_LOAD_PRINCIPLES });
});

router.get("/daily-learning", (_req, res) => {
  const today = new Date();
  const strategyIndex = today.getDate() % META_LEARNING_STRATEGIES.length;
  const principleIndex = today.getDay();
  
  res.json({
    success: true,
    data: {
      date: today.toISOString().split('T')[0],
      focusStrategy: META_LEARNING_STRATEGIES[strategyIndex],
      cognitiveGuideline: COGNITIVE_LOAD_PRINCIPLES[principleIndex % COGNITIVE_LOAD_PRINCIPLES.length],
      practicePrompt: `Apply ${META_LEARNING_STRATEGIES[strategyIndex].name} to something you're currently learning.`
    }
  });
});

export default router;
