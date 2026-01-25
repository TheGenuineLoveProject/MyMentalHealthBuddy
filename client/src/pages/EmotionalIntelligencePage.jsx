import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Heart, Brain, Eye, Ear, MessageCircle, Users, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const EQ_CLARITY = {
  what: "Tools to develop emotional intelligence—the skills to understand, manage, and express your emotions effectively.",
  who: "Anyone wanting to improve self-awareness, empathy, relationships, or emotional regulation.",
  when: "As part of personal growth work, or when you notice patterns in your emotional responses you'd like to understand better.",
  why: "Emotional intelligence is the foundation of healthy relationships and personal wellbeing—and it can be developed at any age.",
  howSteps: [
    "Explore the Emotion Wheel to build emotional vocabulary",
    "Learn about the five EQ pillars and identify areas for growth",
    "Try the practice exercises for each pillar",
    "Apply Daily EQ Practice techniques throughout your day"
  ],
  whereLinkText: "Explore cognitive tools",
  whereHref: "/cognitive-tools"
};

const EQ_EXAMPLES = [
  {
    level: "beginner",
    title: "Building emotional vocabulary",
    situation: "You often feel 'bad' but struggle to name specific emotions.",
    action: "Use the Emotion Wheel to identify the specific emotion you're feeling—is it disappointment, loneliness, or frustration?",
    result: "Naming the emotion precisely helps you understand what you need and how to address it."
  },
  {
    level: "intermediate",
    title: "Practicing self-regulation",
    situation: "You notice you react strongly to criticism and want to respond more thoughtfully.",
    action: "Use 'The Pause' exercise—count to 10 before responding when triggered, and ask yourself what emotion is underneath.",
    result: "You create space between stimulus and response, allowing for more intentional reactions."
  },
  {
    level: "advanced",
    title: "Developing empathy skills",
    situation: "You want to be more attuned to others' emotions in your relationships.",
    action: "Practice Active Listening in conversations—listen to understand rather than to respond. Ask 'What might they be experiencing?'",
    result: "Your relationships deepen as others feel truly heard and understood by you."
  }
];

const emotionWheel = {
  core: [
    { name: "Joy", color: "bg-yellow-400", variants: ["Happy", "Excited", "Grateful", "Proud", "Hopeful", "Amused", "Content", "Peaceful"] },
    { name: "Sadness", color: "bg-blue-400", variants: ["Lonely", "Disappointed", "Grief", "Helpless", "Hurt", "Regretful", "Ashamed", "Empty"] },
    { name: "Anger", color: "bg-red-400", variants: ["Frustrated", "Irritated", "Resentful", "Jealous", "Betrayed", "Violated", "Hostile", "Bitter"] },
    { name: "Fear", color: "bg-purple-400", variants: ["Anxious", "Insecure", "Worried", "Nervous", "Panicked", "Terrified", "Overwhelmed", "Vulnerable"] },
    { name: "Surprise", color: "bg-orange-400", variants: ["Shocked", "Amazed", "Confused", "Startled", "Curious", "Awe", "Moved", "Perplexed"] },
    { name: "Disgust", color: "bg-green-400", variants: ["Contempt", "Revulsion", "Loathing", "Disapproval", "Judgment", "Aversion", "Distaste", "Repulsed"] }
  ]
};

const eqPillars = [
  {
    id: "self-awareness",
    name: "Self-Awareness",
    icon: Eye,
    description: "Recognizing and understanding your own emotions as they happen",
    skills: [
      "Identifying emotions accurately",
      "Understanding triggers",
      "Recognizing body sensations",
      "Knowing your strengths and limits"
    ],
    exercises: [
      { name: "Emotion Check-In", description: "Pause 3x daily and ask: 'What am I feeling right now?'" },
      { name: "Body Scan", description: "Notice where emotions show up in your body" },
      { name: "Trigger Journal", description: "Track what situations activate strong emotions" }
    ]
  },
  {
    id: "self-regulation",
    name: "Self-Regulation",
    icon: Brain,
    description: "Managing your emotions and impulses effectively",
    skills: [
      "Pausing before reacting",
      "Staying calm under pressure",
      "Adapting to change",
      "Thinking before acting"
    ],
    exercises: [
      { name: "The Pause", description: "Count to 10 before responding when triggered" },
      { name: "Reframing", description: "Find an alternative perspective on upsetting situations" },
      { name: "Physical Release", description: "Use movement to process intense emotions" }
    ]
  },
  {
    id: "motivation",
    name: "Motivation",
    icon: Sparkles,
    description: "Using emotions to drive yourself toward your goals",
    skills: [
      "Setting meaningful goals",
      "Persisting despite setbacks",
      "Finding intrinsic motivation",
      "Maintaining optimism"
    ],
    exercises: [
      { name: "Values Clarification", description: "Identify what truly matters to you" },
      { name: "Small Wins", description: "Break goals into achievable steps" },
      { name: "Setback Reframe", description: "Find learning in every challenge" }
    ]
  },
  {
    id: "empathy",
    name: "Empathy",
    icon: Heart,
    description: "Understanding and sharing the feelings of others",
    skills: [
      "Reading emotional cues",
      "Taking others' perspectives",
      "Sensing unspoken feelings",
      "Showing genuine concern"
    ],
    exercises: [
      { name: "Active Listening", description: "Listen to understand, not to respond" },
      { name: "Perspective Taking", description: "Ask: 'What might they be experiencing?'" },
      { name: "Validation Practice", description: "Acknowledge others' feelings before problem-solving" }
    ]
  },
  {
    id: "social-skills",
    name: "Social Skills",
    icon: Users,
    description: "Managing relationships and navigating social situations effectively",
    skills: [
      "Communicating clearly",
      "Resolving conflicts",
      "Building rapport",
      "Collaborating effectively"
    ],
    exercises: [
      { name: "I-Statements", description: "Express needs using 'I feel... when... because...'" },
      { name: "Conflict Navigation", description: "Seek understanding before being understood" },
      { name: "Appreciation Practice", description: "Express genuine appreciation daily" }
    ]
  }
];

const eqAssessment = [
  { question: "I can easily name what emotion I'm feeling in the moment", pillar: "self-awareness" },
  { question: "I stay calm and think clearly when under pressure", pillar: "self-regulation" },
  { question: "I bounce back quickly from setbacks and disappointments", pillar: "motivation" },
  { question: "I can sense how others are feeling without them telling me", pillar: "empathy" },
  { question: "I handle conflicts in a way that strengthens relationships", pillar: "social-skills" },
  { question: "I understand how my emotions affect my behavior", pillar: "self-awareness" },
  { question: "I can manage strong emotions without being overwhelmed", pillar: "self-regulation" },
  { question: "I persist toward goals even when progress is slow", pillar: "motivation" },
  { question: "I'm good at seeing things from others' points of view", pillar: "empathy" },
  { question: "I communicate my needs clearly and respectfully", pillar: "social-skills" }
];

function PillarCard({ pillar, isSelected, onSelect }) {
  return (
  <WellnessPageShell
    title="EmotionalIntelligencePage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
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
      <SEO title="Emotional Intelligence — The Genuine Love Project" description="Develop awareness and skills for emotional wellbeing." />


    <button
      onClick={onSelect}
      className="text-left p-6 rounded-2xl transition-all"
      style={isSelected 
        ? { background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)', boxShadow: 'var(--glp-shadow-lg)', transform: 'scale(1.05)' }
        : { background: 'var(--glp-paper)' }}
      data-testid={`button-pillar-${pillar.id}`}
    >
      <pillar.icon className="h-8 w-8 mb-4" style={{ color: isSelected ? 'var(--glp-paper)' : 'var(--glp-sage)' }} />
      <h3 className="font-semibold mb-2" style={{ color: isSelected ? 'var(--glp-paper)' : 'var(--glp-ink)' }}>
        {pillar.name}
      </h3>
      <p className="text-sm" style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--glp-sage)' }}>
        {pillar.description}
      </p>
    </button>
  );
}

function PillarDetail({ pillar }) {
  return (
    <div className="rounded-2xl p-8 shadow-lg" style={{ background: 'var(--glp-paper)' }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}>
          <pillar.icon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--glp-ink)' }}>{pillar.name}</h2>
          <p style={{ color: 'var(--glp-sage)' }}>{pillar.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl p-6" style={{ background: 'var(--glp-sage-10)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--glp-ink)' }}>Key Skills</h3>
          <ul className="space-y-3">
            {pillar.skills.map((skill, idx) => (
              <li key={idx} className="flex items-center gap-3" style={{ color: 'var(--glp-ink)', opacity: 0.8 }}>
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--glp-sage)' }} />
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, var(--glp-sage-10), var(--glp-sage-15))' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--glp-ink)' }}>Practice Exercises</h3>
          <div className="space-y-4">
            {pillar.exercises.map((exercise, idx) => (
              <div key={idx}>
                <h4 className="font-medium" style={{ color: 'var(--glp-sage-deep)' }}>{exercise.name}</h4>
                <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{exercise.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmotionWheelSection() {
  const [selectedCore, setSelectedCore] = useState(null);

  return (
    <div className="rounded-2xl p-8 shadow-lg" style={{ background: 'var(--glp-paper)' }}>
      <h2 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--glp-ink)' }}>Emotion Wheel</h2>
      <p className="text-center mb-8" style={{ color: 'var(--glp-sage)' }}>
        Click a core emotion to explore its nuanced variations. Naming emotions precisely increases emotional intelligence.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {emotionWheel.core.map((emotion) => (
          <button
            key={emotion.name}
            onClick={() => setSelectedCore(selectedCore === emotion.name ? null : emotion.name)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${emotion.color} text-white hover:opacity-90 ${selectedCore === emotion.name ? "ring-4 ring-offset-2" : ""}`}
            style={selectedCore === emotion.name ? { ringColor: 'var(--glp-sage)' } : {}}
            data-testid={`button-emotion-${emotion.name.toLowerCase()}`}
          >
            {emotion.name}
          </button>
        ))}
      </div>

      {selectedCore && (
        <div className="rounded-xl p-6" style={{ background: 'var(--glp-sage-10)' }}>
          <h3 className="font-semibold mb-4 text-center" style={{ color: 'var(--glp-ink)' }}>
            Variations of {selectedCore}
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {emotionWheel.core.find(e => e.name === selectedCore)?.variants.map((variant, idx) => (
              <span key={idx} className="px-4 py-2 rounded-full text-sm shadow-sm" style={{ background: 'var(--glp-paper)', color: 'var(--glp-ink)' }}>
                {variant}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmotionalIntelligencePage() {
  const [selectedPillar, setSelectedPillar] = useState(eqPillars[0]);

  useSEO({
    title: "Emotional Intelligence",
    description: "Develop self-awareness, empathy, and emotional regulation skills. Explore the emotion wheel and EQ pillars for deeper understanding.",
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--glp-sage-10), var(--glp-paper))' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 transition-colors mb-8" style={{ color: 'var(--glp-sage)' }} data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}>
            <Heart className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--glp-ink)' }}>Emotional Intelligence Toolkit</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-sage)' }}>
            Develop the skills to understand, manage, and express your emotions effectively.
            Emotional intelligence is the foundation of healthy relationships and personal wellbeing.
          </p>
        </div>

        <BenefitsBlock
          benefits={[
            "Explore the emotion wheel and EQ pillars for deeper understanding",
            "Practical exercises for self-awareness and self-regulation",
            "All data stays local—your emotional journey remains private"
          ]}
          duration="10–20 min per pillar"
          control="Explore at your own pace"
          disclaimer="Educational emotional support—not therapy. If you need crisis help, visit"
          crisisLink="/crisis"
          variant="minimal"
          className="mb-8"
        />

        <ClarityCard {...EQ_CLARITY} variant="compact" className="mb-6" />

        <ExamplesAccordion 
          examples={EQ_EXAMPLES} 
          title="See how others develop emotional intelligence"
          className="mb-8"
        />

        <div className="mb-12">
          <EmotionWheelSection />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--glp-ink)' }}>The Five Pillars of Emotional Intelligence</h2>
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {eqPillars.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                isSelected={selectedPillar.id === pillar.id}
                onSelect={() => setSelectedPillar(pillar)}
              />
            ))}
          </div>
          <PillarDetail pillar={selectedPillar} />
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'linear-gradient(135deg, var(--glp-gold-30), var(--glp-rose-15))' }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--glp-ink)' }}>Daily EQ Practice</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl p-6" style={{ background: 'var(--glp-paper)' }}>
              <div className="text-3xl mb-4">🌅</div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Morning Check-In</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                Before starting your day, pause and ask: "What am I feeling? What do I need today?"
              </p>
            </div>
            <div className="rounded-xl p-6" style={{ background: 'var(--glp-paper)' }}>
              <div className="text-3xl mb-4">🌊</div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Emotion Surfing</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                When strong emotions arise, observe them like waves—they rise, peak, and pass.
              </p>
            </div>
            <div className="rounded-xl p-6" style={{ background: 'var(--glp-paper)' }}>
              <div className="text-3xl mb-4">🌙</div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Evening Reflection</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                Review your emotional journey today. What triggered you? How did you respond?
              </p>
            </div>
          </div>
        </div>

        <RelatedNextSteps 
          steps={[
            { title: "Self-Compassion", description: "Cultivate kindness toward yourself", path: "/self-compassion" },
            { title: "Cognitive Tools", description: "Work with thoughts and patterns", path: "/cognitive-tools" },
            { title: "Journal Reflection", description: "Explore your emotional insights", path: "/guided-journaling" },
          ]}
          title="Continue Your Journey"
        />

        <SafetyFooter variant="prominent" />
      </div>
    </div>
  </WellnessPageShell>
  );
}
