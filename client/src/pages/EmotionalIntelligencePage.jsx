import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Heart, Brain, Eye, Ear, MessageCircle, Users, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";

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
    <button
      onClick={onSelect}
      className={`text-left p-6 rounded-2xl transition-all ${isSelected 
        ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg scale-105" 
        : "bg-white dark:bg-slate-800 hover:shadow-md"}`}
      data-testid={`button-pillar-${pillar.id}`}
    >
      <pillar.icon className={`h-8 w-8 mb-4 ${isSelected ? "text-white" : "text-indigo-500"}`} />
      <h3 className={`font-semibold mb-2 ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
        {pillar.name}
      </h3>
      <p className={`text-sm ${isSelected ? "text-white/80" : "text-slate-600 dark:text-slate-400"}`}>
        {pillar.description}
      </p>
    </button>
  );
}

function PillarDetail({ pillar }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <pillar.icon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{pillar.name}</h2>
          <p className="text-slate-600 dark:text-slate-400">{pillar.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Key Skills</h3>
          <ul className="space-y-3">
            {pillar.skills.map((skill, idx) => (
              <li key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Practice Exercises</h3>
          <div className="space-y-4">
            {pillar.exercises.map((exercise, idx) => (
              <div key={idx}>
                <h4 className="font-medium text-indigo-700 dark:text-indigo-300">{exercise.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{exercise.description}</p>
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">Emotion Wheel</h2>
      <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
        Click a core emotion to explore its nuanced variations. Naming emotions precisely increases emotional intelligence.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {emotionWheel.core.map((emotion) => (
          <button
            key={emotion.name}
            onClick={() => setSelectedCore(selectedCore === emotion.name ? null : emotion.name)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${emotion.color} text-white hover:opacity-90 ${selectedCore === emotion.name ? "ring-4 ring-offset-2 ring-slate-400" : ""}`}
            data-testid={`button-emotion-${emotion.name.toLowerCase()}`}
          >
            {emotion.name}
          </button>
        ))}
      </div>

      {selectedCore && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-center">
            Variations of {selectedCore}
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {emotionWheel.core.find(e => e.name === selectedCore)?.variants.map((variant, idx) => (
              <span key={idx} className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 text-sm shadow-sm">
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white mb-6">
            <Heart className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Emotional Intelligence Toolkit</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Develop the skills to understand, manage, and express your emotions effectively.
            Emotional intelligence is the foundation of healthy relationships and personal wellbeing.
          </p>
        </div>

        <div className="mb-12">
          <EmotionWheelSection />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">The Five Pillars of Emotional Intelligence</h2>
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

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">Daily EQ Practice</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
              <div className="text-3xl mb-4">🌅</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Morning Check-In</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Before starting your day, pause and ask: "What am I feeling? What do I need today?"
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
              <div className="text-3xl mb-4">🌊</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Emotion Surfing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                When strong emotions arise, observe them like waves—they rise, peak, and pass.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
              <div className="text-3xl mb-4">🌙</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Evening Reflection</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
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

        <div className="text-center py-8 border-t border-slate-200 dark:border-slate-800 mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Developing emotional intelligence is a lifelong journey. Be patient and compassionate with yourself.
            For deeper work, consider working with a therapist or coach.
          </p>
        </div>
      </div>
    </div>
  );
}
