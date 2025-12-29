// server/routes/wisdom.mjs
// New A→Z 360° Intellectual Intelligence Products
import express from "express";
import { requireAuth, optionalAuth } from "../middleware/auth.mjs";

const router = express.Router();

// ============================================================================
// WISDOM DATABASE - 30 Philosophy Quotes from World Traditions
// ============================================================================
const WISDOM_QUOTES = [
  { id: 1, source: "Marcus Aurelius", tradition: "Stoicism", quote: "You have power over your mind - not outside events. Realize this, and you will find strength.", reflection: "What aspects of today can you control?" },
  { id: 2, source: "Thich Nhat Hanh", tradition: "Buddhism", quote: "No mud, no lotus.", reflection: "How might your current difficulty be preparing you for growth?" },
  { id: 3, source: "Rumi", tradition: "Sufism", quote: "The wound is the place where the Light enters you.", reflection: "What has a past wound taught you?" },
  { id: 4, source: "Epictetus", tradition: "Stoicism", quote: "It's not what happens to you, but how you react to it that matters.", reflection: "Can you choose a different response today?" },
  { id: 5, source: "Lao Tzu", tradition: "Taoism", quote: "Nature does not hurry, yet everything is accomplished.", reflection: "Where might patience serve you better than force?" },
  { id: 6, source: "Viktor Frankl", tradition: "Existentialism", quote: "Between stimulus and response there is a space. In that space is our power to choose our response.", reflection: "Can you find that space today?" },
  { id: 7, source: "Buddha", tradition: "Buddhism", quote: "Pain is inevitable. Suffering is optional.", reflection: "What meaning can you create from current difficulty?" },
  { id: 8, source: "Seneca", tradition: "Stoicism", quote: "We suffer more often in imagination than in reality.", reflection: "Is your mind creating suffering that isn't here yet?" },
  { id: 9, source: "Pema Chödrön", tradition: "Buddhism", quote: "You are the sky. Everything else is just the weather.", reflection: "Can you witness your emotions without becoming them?" },
  { id: 10, source: "Carl Jung", tradition: "Depth Psychology", quote: "Until you make the unconscious conscious, it will direct your life and you will call it fate.", reflection: "What pattern might be running you from below?" },
  { id: 11, source: "Kahlil Gibran", tradition: "Mysticism", quote: "Your pain is the breaking of the shell that encloses your understanding.", reflection: "What understanding is trying to emerge?" },
  { id: 12, source: "Alan Watts", tradition: "Zen Buddhism", quote: "Muddy water is best cleared by leaving it alone.", reflection: "What might resolve itself if you stopped trying to fix it?" },
  { id: 13, source: "Brené Brown", tradition: "Modern Psychology", quote: "Vulnerability is the birthplace of innovation, creativity and change.", reflection: "Where could vulnerability open new doors?" },
  { id: 14, source: "Confucius", tradition: "Confucianism", quote: "It does not matter how slowly you go as long as you do not stop.", reflection: "What small step can you take today?" },
  { id: 15, source: "Simone Weil", tradition: "Christian Mysticism", quote: "Attention is the rarest and purest form of generosity.", reflection: "Who deserves your full attention today?" },
  { id: 16, source: "Krishnamurti", tradition: "Non-dualism", quote: "The ability to observe without evaluating is the highest form of intelligence.", reflection: "Can you observe without immediately judging?" },
  { id: 17, source: "Mary Oliver", tradition: "Contemplative Poetry", quote: "Tell me, what is it you plan to do with your one wild and precious life?", reflection: "What matters most to you right now?" },
  { id: 18, source: "Rabindranath Tagore", tradition: "Hindu Mysticism", quote: "Let me not pray to be sheltered from dangers, but to be fearless in facing them.", reflection: "What fear is asking to be faced?" },
  { id: 19, source: "Aristotle", tradition: "Greek Philosophy", quote: "Knowing yourself is the beginning of all wisdom.", reflection: "What did you learn about yourself this week?" },
  { id: 20, source: "Martin Buber", tradition: "Jewish Philosophy", quote: "All real living is meeting.", reflection: "How present are you in your relationships?" },
  { id: 21, source: "Meister Eckhart", tradition: "Christian Mysticism", quote: "If the only prayer you ever say in your entire life is thank you, it will be enough.", reflection: "What are you grateful for in this moment?" },
  { id: 22, source: "William James", tradition: "Pragmatism", quote: "Act as if what you do makes a difference. It does.", reflection: "What small action could ripple outward?" },
  { id: 23, source: "Ram Dass", tradition: "Hindu-Buddhist Synthesis", quote: "The quieter you become, the more you can hear.", reflection: "What might emerge in stillness?" },
  { id: 24, source: "Søren Kierkegaard", tradition: "Existentialism", quote: "Life can only be understood backwards; but it must be lived forwards.", reflection: "What will future-you understand about today?" },
  { id: 25, source: "Hafiz", tradition: "Sufism", quote: "Fear is the cheapest room in the house. I would like to see you living in better conditions.", reflection: "What room in your inner house are you occupying?" },
  { id: 26, source: "Albert Camus", tradition: "Absurdism", quote: "In the midst of winter, I found there was, within me, an invincible summer.", reflection: "What inner strength have you forgotten?" },
  { id: 27, source: "Thomas Merton", tradition: "Contemplative Christianity", quote: "We are not at peace with others because we are not at peace with ourselves.", reflection: "Where does inner conflict show up in your relationships?" },
  { id: 28, source: "Shunryu Suzuki", tradition: "Zen Buddhism", quote: "In the beginner's mind there are many possibilities, but in the expert's mind there are few.", reflection: "Where might beginner's mind serve you?" },
  { id: 29, source: "Hannah Arendt", tradition: "Political Philosophy", quote: "Thinking and moral considerations cannot be replaced by knowledge.", reflection: "What ethical question deserves your reflection?" },
  { id: 30, source: "Pierre Teilhard de Chardin", tradition: "Christian Mysticism", quote: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.", reflection: "How does this perspective shift your day?" },
];

// ============================================================================
// 25 MENTAL MODELS LIBRARY - Cognitive Architecture Lab
// ============================================================================
const MENTAL_MODELS = [
  { id: 1, name: "First Principles Thinking", category: "Reasoning", description: "Break down complex problems into basic elements and build up from there.", question: "What are the fundamental truths here, not the assumptions?", practice: "Pick a belief you hold. Ask 'why?' five times until you reach bedrock." },
  { id: 2, name: "Second-Order Thinking", category: "Reasoning", description: "Consider the consequences of the consequences.", question: "And then what? What happens after that?", practice: "For a decision you're facing, map out 3 layers of consequences." },
  { id: 3, name: "Inversion", category: "Reasoning", description: "Flip the problem: instead of asking how to succeed, ask how to fail.", question: "What would guarantee failure here?", practice: "List 5 ways to definitely fail at your current goal. Now avoid those." },
  { id: 4, name: "Circle of Competence", category: "Self-Awareness", description: "Know what you know, and know what you don't know.", question: "Am I operating inside or outside my expertise?", practice: "Map your competence: core (expert), adjacent (learning), outside (defer)." },
  { id: 5, name: "Hanlon's Razor", category: "Relationships", description: "Never attribute to malice what can be explained by misunderstanding or error.", question: "Could this be incompetence or accident, not ill intent?", practice: "Recall a recent frustration. What innocent explanation might fit?" },
  { id: 6, name: "Occam's Razor", category: "Reasoning", description: "The simplest explanation is usually correct.", question: "What's the simplest explanation that fits all the facts?", practice: "For a complex situation, write the 1-sentence simplest story." },
  { id: 7, name: "Probabilistic Thinking", category: "Reasoning", description: "Think in likelihoods, not certainties.", question: "What's the probability, not just the possibility?", practice: "Assign a percentage to an uncertain outcome. Revisit after." },
  { id: 8, name: "Feedback Loops", category: "Systems", description: "Outputs become inputs that amplify or dampen the original effect.", question: "Is this a reinforcing (snowball) or balancing (thermostat) loop?", practice: "Identify one positive and one negative feedback loop in your life." },
  { id: 9, name: "Leverage Points", category: "Systems", description: "Small changes in the right places can produce large effects.", question: "Where's the high-leverage intervention point?", practice: "In a problem you're facing, find the 1 change that would matter most." },
  { id: 10, name: "Map vs Territory", category: "Epistemology", description: "The map (our mental model) is not the territory (reality).", question: "Is my map out of date or incomplete?", practice: "Find one area where your beliefs might not match current reality." },
  { id: 11, name: "Confirmation Bias Awareness", category: "Self-Awareness", description: "We seek information that confirms what we already believe.", question: "What would prove me wrong? Am I looking for that?", practice: "Actively seek one piece of evidence against your current view." },
  { id: 12, name: "Opportunity Cost", category: "Decision-Making", description: "Every choice forecloses alternatives.", question: "What am I giving up by choosing this?", practice: "Before a commitment, explicitly name what you're saying no to." },
  { id: 13, name: "Sunk Cost Fallacy", category: "Decision-Making", description: "Past investments shouldn't dictate future decisions.", question: "If I were starting fresh, would I make this choice?", practice: "Identify something you continue only because of past investment." },
  { id: 14, name: "Pareto Principle (80/20)", category: "Effectiveness", description: "80% of effects come from 20% of causes.", question: "What's the vital few vs. the trivial many?", practice: "Identify the 20% of activities producing 80% of your results." },
  { id: 15, name: "Reciprocity", category: "Relationships", description: "People tend to return favors and treatment.", question: "What am I putting out that's coming back to me?", practice: "Give something genuine with no expectation. Notice what shifts." },
  { id: 16, name: "Scarcity Mindset vs. Abundance Mindset", category: "Self-Awareness", description: "Scarcity creates anxiety; abundance enables generosity.", question: "Am I operating from fear of lack or trust in enough?", practice: "Catch yourself in scarcity thinking. What's actually abundant?" },
  { id: 17, name: "Regret Minimization", category: "Decision-Making", description: "Project to age 80 and ask what you'd regret not doing.", question: "At 80, will I regret not trying this?", practice: "Apply this to a decision you're avoiding." },
  { id: 18, name: "Via Negativa", category: "Effectiveness", description: "Sometimes improvement comes from removal, not addition.", question: "What should I subtract rather than add?", practice: "Identify one thing to remove that would improve your life." },
  { id: 19, name: "Antifragility", category: "Resilience", description: "Some things gain from disorder and stress.", question: "How can this stressor make me stronger?", practice: "Reframe a current challenge as a strengthening force." },
  { id: 20, name: "Compounding", category: "Growth", description: "Small consistent actions accumulate exponentially.", question: "What small thing done daily would compound?", practice: "Choose one 5-minute practice to maintain for 30 days." },
  { id: 21, name: "Ergodicity", category: "Risk", description: "What's true for the group isn't necessarily true for the individual.", question: "Would I survive if this goes wrong? Or just survive on average?", practice: "Evaluate a risk: is it recoverable for YOU, not just statistically?" },
  { id: 22, name: "Theory of Constraints", category: "Systems", description: "Every system has one bottleneck that limits throughput.", question: "What's the ONE constraint limiting my progress?", practice: "Find and address just the bottleneck, ignore other optimizations." },
  { id: 23, name: "Hormesis", category: "Growth", description: "Small doses of stress can be beneficial.", question: "Is this stress dose beneficial or harmful?", practice: "Add one small, voluntary challenge this week." },
  { id: 24, name: "Pre-Mortem", category: "Planning", description: "Before starting, imagine the project failed. Ask why.", question: "If this failed, what would have caused it?", practice: "Run a pre-mortem on your next project before beginning." },
  { id: 25, name: "Steel Man", category: "Reasoning", description: "Argue against the strongest version of opposing views.", question: "What's the best case for the other side?", practice: "Take a view you disagree with. Make the best argument for it." },
];

// ============================================================================
// SYSTEMS THINKING ARCHETYPES
// ============================================================================
const SYSTEM_ARCHETYPES = [
  { id: 1, name: "Fixes that Fail", pattern: "A quick fix causes unintended consequences that worsen the original problem.", question: "What side effects might this solution create?", example: "Taking painkillers for stress headaches without addressing stress." },
  { id: 2, name: "Shifting the Burden", pattern: "A symptomatic solution diverts attention from the fundamental solution.", question: "Am I treating symptoms or root causes?", example: "Caffeine for tiredness vs. improving sleep habits." },
  { id: 3, name: "Limits to Growth", pattern: "A reinforcing loop hits a limiting factor that slows growth.", question: "What constraint will eventually limit this growth?", example: "Startup growth hitting market saturation or team capacity." },
  { id: 4, name: "Success to the Successful", pattern: "The winner gets resources that further increase winning.", question: "What early advantages are compounding?", example: "Popular content getting more visibility, further increasing popularity." },
  { id: 5, name: "Tragedy of the Commons", pattern: "Individuals acting in self-interest deplete a shared resource.", question: "What shared resource am I depleting?", example: "Team members overworking to impress, burning out the team culture." },
  { id: 6, name: "Escalation", pattern: "Each side's actions trigger stronger reactions from the other.", question: "Am I in an escalation loop?", example: "Arguments where each person raises their voice to be heard." },
  { id: 7, name: "Accidental Adversaries", pattern: "Partners become adversaries through well-intentioned actions.", question: "How might my helpful action be perceived as hostile?", example: "Offering unsolicited advice that feels like criticism." },
  { id: 8, name: "Growth and Underinvestment", pattern: "Growth creates demand that isn't met due to underinvestment.", question: "What capacity do I need to build before the next growth phase?", example: "Growing a business without building infrastructure to support it." },
];

// ============================================================================
// META-LEARNING TECHNIQUES
// ============================================================================
const LEARNING_TECHNIQUES = [
  { id: 1, name: "Spaced Repetition", description: "Review material at increasing intervals to strengthen memory.", practice: "Use flashcards with expanding review periods: 1 day, 3 days, 1 week, 2 weeks, 1 month." },
  { id: 2, name: "Active Recall", description: "Test yourself rather than passively re-reading.", practice: "Close the book and write down what you remember before checking." },
  { id: 3, name: "Interleaving", description: "Mix different topics or skills in a single session.", practice: "Instead of drilling one thing, alternate between 3 related topics." },
  { id: 4, name: "Elaboration", description: "Connect new material to what you already know.", practice: "After learning something, explain how it connects to 3 things you already understand." },
  { id: 5, name: "Concrete Examples", description: "Anchor abstract concepts with specific examples.", practice: "For every new concept, generate 3 real-world examples from your life." },
  { id: 6, name: "Dual Coding", description: "Combine verbal and visual representations.", practice: "Draw a diagram, mind map, or picture alongside your notes." },
  { id: 7, name: "Generation Effect", description: "Generate answers before being shown them.", practice: "Predict what you'll learn before reading. Then compare." },
  { id: 8, name: "Reflection", description: "Periodically pause to synthesize and evaluate what you've learned.", practice: "End each learning session with: 'What did I learn? What's still unclear?'" },
];

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Daily Wisdom Oracle
router.get("/daily", (_req, res) => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const index = dayOfYear % WISDOM_QUOTES.length;
  const wisdom = WISDOM_QUOTES[index];
  
  res.json({
    ok: true,
    wisdom,
    dayOfYear,
    totalWisdom: WISDOM_QUOTES.length,
    title: "Daily Wisdom Oracle",
  });
});

router.get("/all", (_req, res) => {
  res.json({
    ok: true,
    wisdom: WISDOM_QUOTES,
    total: WISDOM_QUOTES.length,
  });
});

router.get("/random", (_req, res) => {
  const wisdom = WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)];
  res.json({ ok: true, wisdom });
});

// Mental Models Library
router.get("/models", (_req, res) => {
  res.json({
    ok: true,
    models: MENTAL_MODELS,
    total: MENTAL_MODELS.length,
    categories: [...new Set(MENTAL_MODELS.map(m => m.category))],
  });
});

router.get("/models/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const model = MENTAL_MODELS.find(m => m.id === id);
  if (!model) return res.status(404).json({ ok: false, error: "Model not found" });
  res.json({ ok: true, model });
});

router.get("/models/category/:category", (req, res) => {
  const category = req.params.category;
  const models = MENTAL_MODELS.filter(m => m.category.toLowerCase() === category.toLowerCase());
  res.json({ ok: true, models, total: models.length });
});

// Systems Thinking
router.get("/systems", (_req, res) => {
  res.json({
    ok: true,
    archetypes: SYSTEM_ARCHETYPES,
    total: SYSTEM_ARCHETYPES.length,
    description: "Common system behavior patterns to recognize in life and work",
  });
});

router.get("/systems/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const archetype = SYSTEM_ARCHETYPES.find(a => a.id === id);
  if (!archetype) return res.status(404).json({ ok: false, error: "Archetype not found" });
  res.json({ ok: true, archetype });
});

// Meta-Learning
router.get("/learning", (_req, res) => {
  res.json({
    ok: true,
    techniques: LEARNING_TECHNIQUES,
    total: LEARNING_TECHNIQUES.length,
    description: "Evidence-based techniques to accelerate learning",
  });
});

// Wisdom Synthesis - Combine multiple frameworks
router.get("/synthesis", (_req, res) => {
  const randomQuote = WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)];
  const randomModel = MENTAL_MODELS[Math.floor(Math.random() * MENTAL_MODELS.length)];
  const randomArchetype = SYSTEM_ARCHETYPES[Math.floor(Math.random() * SYSTEM_ARCHETYPES.length)];

  res.json({
    ok: true,
    synthesis: {
      wisdom: randomQuote,
      mentalModel: randomModel,
      systemArchetype: randomArchetype,
      integrationPrompt: `Consider: How might "${randomModel.name}" help you respond to "${randomQuote.source}'s" wisdom in a situation where "${randomArchetype.name}" is at play?`,
    },
    title: "Wisdom Synthesis",
    description: "Cross-domain integration for deeper understanding",
  });
});

export default router;
