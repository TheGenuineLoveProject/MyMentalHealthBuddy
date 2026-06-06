import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Search, ChevronDown, ChevronUp, Lightbulb, Heart, Brain, Sparkles } from "lucide-react";
import SafetyFooter from "../components/ui/ReflectionFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

const glossaryTerms = [
  {
    term: "Anxiety",
    category: "Emotional States",
    definition: "A natural response to stress characterized by feelings of worry, nervousness, or unease about something with an uncertain outcome.",
    explanation: "Anxiety is your body's built-in alarm system. It helped our ancestors survive by alerting them to danger. In modern life, this same system can activate in response to everyday stressors like work deadlines, social situations, or health concerns.",
    examples: [
      "Physical symptoms: racing heart, sweaty palms, tight chest, shallow breathing",
      "Mental symptoms: racing thoughts, difficulty concentrating, imagining worst-case scenarios",
      "Behavioral: avoiding certain situations, seeking reassurance, restlessness"
    ],
    copingStrategies: ["Deep breathing exercises", "Grounding techniques (5-4-3-2-1)", "Progressive muscle relaxation", "Limiting caffeine intake"],
    relatedTerms: ["Stress", "Panic Attack", "Fight-or-Flight Response"]
  },
  {
    term: "Attachment Style",
    category: "Relationships",
    definition: "The pattern of emotional bonding and relating to others that develops in early childhood and influences adult relationships.",
    explanation: "Your attachment style is like an emotional blueprint formed in your earliest relationships. It shapes how you connect with others, handle conflict, and regulate emotions in relationships. The good news is that attachment styles can evolve with awareness and healing work.",
    examples: [
      "Secure: Comfortable with intimacy and independence, trusts others easily",
      "Anxious: Craves closeness, fears abandonment, needs frequent reassurance",
      "Avoidant: Values independence, uncomfortable with deep emotional intimacy",
      "Disorganized: Conflicted about closeness, may oscillate between seeking and avoiding connection"
    ],
    copingStrategies: ["Learn your attachment style through self-reflection", "Practice communicating needs directly", "Develop self-soothing skills", "Seek therapy for deep attachment work"],
    relatedTerms: ["Inner Child", "Trauma Bonding", "Boundaries"]
  },
  {
    term: "Boundaries",
    category: "Self-Care",
    definition: "The limits and rules we set for ourselves within relationships to protect our physical, emotional, and mental well-being.",
    explanation: "Boundaries are like invisible fences that define where you end and others begin. They communicate what you will and won't accept, and they protect your energy, time, and emotional health. Healthy boundaries are essential for self-respect and maintaining balanced relationships.",
    examples: [
      "Physical: 'I need personal space when I'm upset'",
      "Emotional: 'I can't be your therapist; please speak to a professional'",
      "Time: 'I don't answer work emails after 6pm'",
      "Mental: 'I won't engage in gossip or negative talk about others'"
    ],
    copingStrategies: ["Start small with low-stakes situations", "Use 'I' statements when setting boundaries", "Remember that 'No' is a complete sentence", "Expect pushback and stay firm"],
    relatedTerms: ["Self-Worth", "Codependency", "People-Pleasing"]
  },
  {
    term: "Cognitive Distortions",
    category: "Thought Patterns",
    definition: "Irrational or exaggerated thought patterns that reinforce negative thinking and emotions.",
    explanation: "Cognitive distortions are like mental filters that twist reality. Our brains create these shortcuts, often as protection, but they can keep us stuck in negative thinking cycles. Recognizing these patterns is the first step to changing them.",
    examples: [
      "All-or-nothing thinking: 'If I'm not perfect, I'm a failure'",
      "Catastrophizing: 'If I make a mistake, everything will fall apart'",
      "Mind reading: 'They didn't text back, so they must hate me'",
      "Should statements: 'I should always be productive'"
    ],
    copingStrategies: ["Keep a thought journal", "Challenge thoughts with evidence", "Ask: 'What would I tell a friend?'", "Practice cognitive restructuring"],
    relatedTerms: ["Negative Self-Talk", "CBT", "Core Beliefs"]
  },
  {
    term: "Dissociation",
    category: "Trauma Responses",
    definition: "A mental process of disconnecting from one's thoughts, feelings, surroundings, or sense of identity as a protective response.",
    explanation: "Dissociation is like your mind's emergency escape hatch. When experiences feel too overwhelming, your brain can create distance to protect you. While this was helpful during trauma, ongoing dissociation can interfere with daily life and healing.",
    examples: [
      "Feeling like you're watching yourself from outside your body",
      "Zoning out or losing chunks of time",
      "Feeling emotionally numb or disconnected",
      "The world feeling unreal or dreamlike"
    ],
    copingStrategies: ["Grounding techniques using the 5 senses", "Cold water on face or hands", "Describe your surroundings out loud", "Gentle movement like stretching"],
    relatedTerms: ["Trauma", "Depersonalization", "Grounding"]
  },
  {
    term: "Emotional Regulation",
    category: "Skills",
    definition: "The ability to manage and respond to emotional experiences in healthy, adaptive ways.",
    explanation: "Emotional regulation is like having a thermostat for your feelings. It doesn't mean suppressing emotions, but rather recognizing them, understanding them, and choosing how to express them appropriately. This skill can be learned and strengthened at any age.",
    examples: [
      "Taking a pause before reacting when angry",
      "Using breathing techniques during stress",
      "Identifying and naming your emotions",
      "Choosing healthy outlets for difficult feelings"
    ],
    copingStrategies: ["Practice naming emotions specifically", "Use the STOP technique (Stop, Take a breath, Observe, Proceed)", "Build a toolkit of healthy coping strategies", "Track emotional patterns in a journal"],
    relatedTerms: ["Mindfulness", "Window of Tolerance", "Co-regulation"]
  },
  {
    term: "Fight-or-Flight Response",
    category: "Nervous System",
    definition: "The body's automatic physiological reaction to perceived threats, preparing you to either confront or flee from danger.",
    explanation: "This is your survival system in action. When your brain detects danger (real or perceived), it floods your body with stress hormones to prepare for action. In modern life, this system can activate for non-life-threatening stressors, causing anxiety symptoms.",
    examples: [
      "Racing heart and rapid breathing",
      "Tunnel vision and heightened alertness",
      "Sweating and muscle tension",
      "Digestive system slowing down"
    ],
    copingStrategies: ["Deep belly breathing to activate calm", "Physical movement to discharge stress hormones", "Cold water on face to trigger dive reflex", "Grounding in the present moment"],
    relatedTerms: ["Anxiety", "Nervous System Regulation", "Freeze Response"]
  },
  {
    term: "Gaslighting",
    category: "Relationships",
    definition: "A form of psychological manipulation where someone causes you to question your own reality, memory, or perceptions.",
    explanation: "Gaslighting is a subtle but harmful form of emotional abuse. The manipulator denies your experience of reality to gain power and control. Over time, this can seriously damage your self-trust and mental health.",
    examples: [
      "'That never happened, you're imagining things'",
      "'You're too sensitive, I was just joking'",
      "'Everyone agrees with me, you're the problem'",
      "Denying they said something you clearly remember"
    ],
    copingStrategies: ["Keep a journal to document experiences", "Trust your own perceptions", "Seek outside perspectives from trusted people", "Consider limiting or ending the relationship"],
    relatedTerms: ["Emotional Abuse", "Narcissistic Abuse", "Boundaries"]
  },
  {
    term: "Grounding",
    category: "Coping Skills",
    definition: "Techniques that help bring your attention back to the present moment and your physical body when feeling overwhelmed or disconnected.",
    explanation: "Grounding is like dropping an anchor when you're adrift in difficult emotions or dissociation. These techniques use your senses and body to reconnect you with the here and now, reminding your nervous system that you are safe in this moment.",
    examples: [
      "5-4-3-2-1 technique using all five senses",
      "Pressing your feet firmly into the ground",
      "Holding something cold or textured",
      "Describing your surroundings in detail"
    ],
    copingStrategies: ["Practice grounding daily, not just in crisis", "Create a grounding kit with sensory items", "Find which techniques work best for you", "Use grounding as first response to overwhelm"],
    relatedTerms: ["Dissociation", "Mindfulness", "Nervous System Regulation"]
  },
  {
    term: "Hypervigilance",
    category: "Trauma Responses",
    definition: "A state of heightened alertness and sensitivity to potential threats in your environment, often resulting from trauma.",
    explanation: "Hypervigilance is like having your alarm system stuck on high alert. After trauma, your brain may continue scanning for danger even when you're safe. While exhausting, this is a normal protective response that can be calmed with healing.",
    examples: [
      "Constantly scanning rooms for exits and threats",
      "Startling easily at sudden sounds",
      "Difficulty relaxing or sleeping",
      "Reading into people's expressions and tone"
    ],
    copingStrategies: ["Create environments that feel safe", "Practice nervous system regulation daily", "Remind yourself: 'I am safe in this moment'", "Gradual exposure to safe situations"],
    relatedTerms: ["PTSD", "Anxiety", "Nervous System Dysregulation"]
  },
  {
    term: "Inner Child",
    category: "Healing",
    definition: "The part of your psyche that retains the emotions, memories, and experiences from childhood, including unmet needs and wounds.",
    explanation: "Your inner child holds the joy, wonder, and vulnerability of your younger self, as well as any pain or unmet needs from childhood. Healing work often involves connecting with and nurturing this part of yourself to resolve old wounds.",
    examples: [
      "Feeling disproportionately upset by rejection",
      "Craving validation or approval from authority figures",
      "Difficulty playing or being spontaneous",
      "Recreating childhood dynamics in adult relationships"
    ],
    copingStrategies: ["Write letters to your younger self", "Look at childhood photos with compassion", "Meet childhood needs now (play, rest, comfort)", "Reparenting practices in therapy"],
    relatedTerms: ["Attachment Style", "Trauma", "Reparenting"]
  },
  {
    term: "Mindfulness",
    category: "Practices",
    definition: "The practice of bringing your full attention to the present moment without judgment.",
    explanation: "Mindfulness is about being fully here, right now. Instead of dwelling on the past or worrying about the future, you observe the present moment with curiosity and acceptance. Regular practice rewires your brain for calm and clarity.",
    examples: [
      "Noticing the sensation of breathing",
      "Eating slowly and savoring each bite",
      "Observing thoughts without getting caught up in them",
      "Being fully present during conversations"
    ],
    copingStrategies: ["Start with just 1-2 minutes daily", "Use everyday activities as practice", "Try guided meditations", "Be patient—it's called 'practice' for a reason"],
    relatedTerms: ["Meditation", "Present Moment Awareness", "Non-judgment"]
  },
  {
    term: "Nervous System Regulation",
    category: "Body-Mind",
    definition: "The ability to move between states of activation and calm in response to life's demands, maintaining balance in your autonomic nervous system.",
    explanation: "Your nervous system has different modes: activated (fight/flight), shut down (freeze), and balanced (rest/digest). Regulation means having the flexibility to shift between states as needed and to return to calm after stress.",
    examples: [
      "Recovering from stress within a reasonable time",
      "Being able to tolerate discomfort without overwhelming",
      "Accessing calm even during challenging situations",
      "Recognizing when you're dysregulated"
    ],
    copingStrategies: ["Daily vagus nerve exercises", "Regular deep breathing practice", "Movement and physical exercise", "Co-regulation with safe people"],
    relatedTerms: ["Vagus Nerve", "Window of Tolerance", "Polyvagal Theory"]
  },
  {
    term: "Rumination",
    category: "Thought Patterns",
    definition: "The tendency to repetitively think about causes, consequences, and symptoms of negative experiences without reaching resolution.",
    explanation: "Rumination is like a mental hamster wheel—going over the same thoughts again and again without getting anywhere. While it feels like problem-solving, it actually keeps you stuck and intensifies negative emotions.",
    examples: [
      "Replaying conversations and thinking 'I should have said...'",
      "Asking 'why' questions that have no answers",
      "Dwelling on past mistakes or embarrassments",
      "Analyzing problems without taking action"
    ],
    copingStrategies: ["Schedule 'worry time' to contain rumination", "Engage in absorbing activities", "Practice thought-stopping techniques", "Take small action steps instead"],
    relatedTerms: ["Anxiety", "Depression", "Cognitive Distortions"]
  },
  {
    term: "Self-Compassion",
    category: "Self-Care",
    definition: "Treating yourself with the same kindness, understanding, and care that you would offer a good friend during difficult times.",
    explanation: "Self-compassion is the antidote to harsh self-criticism. It involves recognizing your suffering, understanding that imperfection is part of being human, and offering yourself warmth and understanding rather than judgment.",
    examples: [
      "Speaking to yourself gently after making a mistake",
      "Allowing yourself to rest without guilt",
      "Acknowledging your pain is valid",
      "Giving yourself permission to be imperfect"
    ],
    copingStrategies: ["Practice the self-compassion break", "Ask: 'What would I say to a friend?'", "Write yourself a compassionate letter", "Use soothing touch (hand on heart)"],
    relatedTerms: ["Self-Love", "Inner Critic", "Self-Worth"]
  },
  {
    term: "Shame",
    category: "Emotional States",
    definition: "A painful emotion arising from the belief that you are fundamentally flawed, unworthy, or bad as a person.",
    explanation: "Unlike guilt ('I did something bad'), shame says 'I am bad.' It's one of the most painful human emotions and often hides beneath other feelings like anger or withdrawal. Shame thrives in secrecy and dissolves in connection.",
    examples: [
      "Feeling unworthy of love or belonging",
      "Hiding parts of yourself from others",
      "Intense self-criticism and self-loathing",
      "Fear of being 'found out' as inadequate"
    ],
    copingStrategies: ["Share your shame with trusted others", "Recognize shame as a human emotion, not truth", "Practice self-compassion", "Challenge shame-based beliefs"],
    relatedTerms: ["Vulnerability", "Self-Worth", "Inner Critic"]
  },
  {
    term: "Somatic",
    category: "Body-Mind",
    definition: "Relating to the body, particularly how physical sensations store and express emotional experiences.",
    explanation: "Your body holds the score of your experiences. Emotions aren't just mental—they're felt in the body. Somatic approaches to healing work with body sensations to release stored tension and trauma.",
    examples: [
      "Tight shoulders from carrying stress",
      "Butterflies in stomach from anxiety",
      "Chest tightness during grief",
      "Body tension when triggered"
    ],
    copingStrategies: ["Body scan meditation", "Shaking or trembling to release tension", "Yoga and mindful movement", "Somatic experiencing therapy"],
    relatedTerms: ["Trauma", "Nervous System", "Body Memory"]
  },
  {
    term: "Trauma",
    category: "Experiences",
    definition: "An emotional response to a deeply distressing or disturbing event that overwhelms your ability to cope and leaves lasting effects on your functioning and well-being.",
    explanation: "Trauma isn't about the event itself, but about how your nervous system responded to it. What's traumatic for one person may not be for another. Trauma can stem from single incidents, ongoing experiences, or developmental wounds.",
    examples: [
      "Big 'T' trauma: accidents, assault, natural disasters",
      "Little 't' trauma: emotional neglect, bullying, divorce",
      "Complex trauma: ongoing childhood abuse or neglect",
      "Vicarious trauma: witnessing others' suffering"
    ],
    copingStrategies: ["Seek trauma-informed professional support", "Build safety and stability first", "Practice nervous system regulation", "Be patient with your healing timeline"],
    relatedTerms: ["PTSD", "Healing", "Nervous System Dysregulation"]
  },
  {
    term: "Triggers",
    category: "Trauma Responses",
    definition: "Stimuli that activate distressing memories, emotions, or reactions connected to past experiences, often occurring automatically.",
    explanation: "Triggers are like emotional landmines—something in the present (a smell, sound, situation) activates your nervous system as if the past danger is happening now. Understanding your triggers is key to managing them.",
    examples: [
      "Certain smells that remind you of a person or place",
      "Tone of voice similar to a past abuser",
      "Anniversaries of difficult events",
      "Physical sensations that mimic past experiences"
    ],
    copingStrategies: ["Identify and track your triggers", "Create safety plans for known triggers", "Use grounding techniques when triggered", "Work with a therapist on trigger processing"],
    relatedTerms: ["Trauma", "PTSD", "Flashbacks"]
  },
  {
    term: "Vulnerability",
    category: "Growth",
    definition: "The courage to show up authentically and be seen, even when there's no guarantee of the outcome.",
    explanation: "Vulnerability isn't weakness—it's the birthplace of connection, creativity, and courage. It means allowing yourself to be truly seen, accepting uncertainty, and taking emotional risks. True intimacy requires vulnerability.",
    examples: [
      "Asking for help when you need it",
      "Expressing your true feelings",
      "Trying something new despite fear of failure",
      "Admitting when you don't know something"
    ],
    copingStrategies: ["Start small with trusted people", "Recognize vulnerability as strength", "Practice self-compassion when it feels scary", "Remember: you can't have connection without vulnerability"],
    relatedTerms: ["Authenticity", "Shame", "Connection"]
  },
  {
    term: "Window of Tolerance",
    category: "Nervous System",
    definition: "The optimal zone of arousal where you can function effectively, think clearly, and process emotions without becoming overwhelmed or shut down.",
    explanation: "Your window of tolerance is like your emotional bandwidth. Within it, you can handle stress and stay connected. Outside it, you may become hyperaroused (anxious, reactive) or hypoaroused (numb, disconnected). Healing expands your window.",
    examples: [
      "Inside window: can think clearly, feel emotions manageable",
      "Above window (hyperarousal): panic, rage, anxiety",
      "Below window (hypoarousal): numbness, depression, freeze",
      "Triggers can push you outside your window"
    ],
    copingStrategies: ["Learn to recognize your window", "Practice returning to window with regulation", "Gradually expand your window over time", "Respect your limits while gently stretching them"],
    relatedTerms: ["Nervous System Regulation", "Trauma", "Emotional Regulation"]
  }
];

const categories = [...new Set(glossaryTerms.map(t => t.category))];

function TermCard({ term, isExpanded, onToggle }) {
  return (
  <WellnessPageShell
    title="WellnessGlossaryPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >
      <SEO title="Wellness Glossary — The Genuine Love Project" description="Key terms and definitions for wellness." />


    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        data-testid={`button-term-${term.term.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{term.term}</h3>
            <span className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full">
              {term.category}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">{term.definition}</p>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Understanding This</h4>
                <p className="text-slate-600 dark:text-slate-400">{term.explanation}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-500" />
              Examples & Signs
            </h4>
            <ul className="space-y-2">
              {term.examples.map((example, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-indigo-500 mt-1">•</span>
                  {example}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              Coping Strategies
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {term.copingStrategies.map((strategy, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-sm text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="h-4 w-4 flex-shrink-0" />
                  {strategy}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-3">Related Concepts</h4>
            <div className="flex flex-wrap gap-2">
              {term.relatedTerms.map((related, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm">
                  {related}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WellnessGlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedTerm, setExpandedTerm] = useState(null);

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white mb-6">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Wellness Glossary</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Clear definitions, examples, and coping strategies for essential mental health and wellness concepts.
            Understanding is the first step to healing.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              data-testid="input-search-glossary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedCategory === "all"
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
              data-testid="button-filter-all"
            >
              All ({glossaryTerms.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedCategory === cat
                  ? "bg-indigo-500 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
                data-testid={`button-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-12">
          {filteredTerms.length > 0 ? (
            filteredTerms.map(term => (
              <TermCard
                key={term.term}
                term={term}
                isExpanded={expandedTerm === term.term}
                onToggle={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No terms found matching your search.
            </div>
          )}
        </div>

        <SafetyFooter variant="default" />
      </div>
    </div>
  </WellnessPageShell>
  );
}
