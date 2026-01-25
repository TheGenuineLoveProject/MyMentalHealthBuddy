import { Link } from "wouter";
import { 
  ArrowLeft, Lightbulb, ChevronDown, ChevronUp, 
  Clock, Target, Star, CheckCircle2, ArrowRight
} from "lucide-react";
import { useState } from "react";

const practicalExamples = [
  {
    id: "anxiety-panic",
    category: "Managing Anxiety",
    title: "When Anxiety Hits at Work",
    scenario: "You're in a meeting and suddenly feel your heart racing, palms sweating, and mind going blank. You're afraid others will notice.",
    steps: [
      { step: "Pause", detail: "Excuse yourself briefly if possible, or ground yourself in your chair" },
      { step: "5-4-3-2-1 Grounding", detail: "Name 5 things you see, 4 you feel (chair, feet on floor), 3 you hear" },
      { step: "Box Breathing", detail: "Inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 3 times" },
      { step: "Reality Check", detail: "Ask yourself: 'What's the worst that could happen? Have I survived this before?'" },
      { step: "Return Gently", detail: "When ready, refocus on the present conversation without judgment" }
    ],
    outcome: "This typically takes 2-3 minutes and helps your nervous system shift from fight-or-flight back to calm.",
    relatedTools: ["/grounding", "/breathing"],
    timeNeeded: "2-5 minutes"
  },
  {
    id: "negative-thoughts",
    category: "Cognitive Reframing",
    title: "Challenging 'I'm Not Good Enough' Thoughts",
    scenario: "You receive constructive feedback at work and immediately think 'I'm terrible at my job, everyone knows I'm a fraud.'",
    steps: [
      { step: "Notice the Thought", detail: "Catch it without judgment: 'I'm having the thought that I'm not good enough'" },
      { step: "Identify the Distortion", detail: "This is 'all-or-nothing thinking' and 'mind reading' (assuming others think this)" },
      { step: "Examine Evidence", detail: "What evidence supports this? What contradicts it? Have you received positive feedback?" },
      { step: "Consider Alternatives", detail: "Could there be another explanation? Feedback helps growth, not proof of failure" },
      { step: "Balanced Thought", detail: "Replace with: 'I received feedback on one area. I'm learning and growing'" }
    ],
    outcome: "You feel calmer and can view the feedback as helpful rather than threatening.",
    relatedTools: ["/cognitive-tools", "/behavior-change"],
    timeNeeded: "5-10 minutes"
  },
  {
    id: "sleep-difficulty",
    category: "Sleep Issues",
    title: "Can't Fall Asleep Due to Racing Thoughts",
    scenario: "It's 11pm and your mind keeps replaying tomorrow's to-do list or past conversations. The more you try to sleep, the more awake you feel.",
    steps: [
      { step: "Accept Wakefulness", detail: "Stop fighting it. Resistance increases anxiety about not sleeping" },
      { step: "Body Scan", detail: "Starting from toes, slowly notice and relax each body part up to your head" },
      { step: "Thought Dump", detail: "Keep a notepad by bed. Write down everything on your mind to 'store' it for tomorrow" },
      { step: "4-7-8 Breathing", detail: "Inhale 4, hold 7, exhale 8. This activates your parasympathetic system" },
      { step: "Visualization", detail: "Imagine a peaceful place in detail—sounds, smells, sensations" }
    ],
    outcome: "By removing pressure to sleep and calming your body, sleep usually comes within 15-20 minutes.",
    relatedTools: ["/sleep-guide", "/meditation"],
    timeNeeded: "15-20 minutes"
  },
  {
    id: "anger-response",
    category: "Emotional Regulation",
    title: "When Someone Triggers Your Anger",
    scenario: "A family member makes a critical comment and you feel rage building. You want to lash out but know you'll regret it.",
    steps: [
      { step: "Pause Before Responding", detail: "Count to 10 silently. This creates space between trigger and reaction" },
      { step: "Physical Release", detail: "If possible, leave briefly. Splash cold water on face or grip ice cubes" },
      { step: "Name the Feeling", detail: "Say internally: 'I'm feeling angry because I feel criticized/disrespected'" },
      { step: "Find the Need", detail: "Under anger is usually hurt, fear, or unmet need. What do you really need here?" },
      { step: "Choose Your Response", detail: "Decide: respond now calmly, address later, or let it go. You have choices" }
    ],
    outcome: "You preserve the relationship while honoring your feelings. You can address issues when calmer.",
    relatedTools: ["/emotional-intelligence", "/stress-response"],
    timeNeeded: "5-10 minutes"
  },
  {
    id: "morning-routine",
    category: "Building Habits",
    title: "Creating a Consistent Morning Routine",
    scenario: "You want to start your day intentionally but always end up rushing, scrolling your phone, and feeling behind before the day begins.",
    steps: [
      { step: "Start Small", detail: "Begin with ONE habit. Just 2-5 minutes. Don't overhaul everything at once" },
      { step: "Anchor It", detail: "Attach your new habit to something you already do: 'After I turn off my alarm, I will...'" },
      { step: "Prepare the Night Before", detail: "Set out clothes, prep breakfast, place phone across room" },
      { step: "Make It Easy", detail: "Reduce friction: yoga mat out, journal on pillow, coffee preset" },
      { step: "Celebrate Small Wins", detail: "After completing, say 'Good job' or give yourself a mental high-five" }
    ],
    outcome: "After 2-3 weeks, the habit becomes automatic. Then add another small habit if desired.",
    relatedTools: ["/daily-routines", "/behavior-change"],
    timeNeeded: "5 minutes initially"
  },
  {
    id: "self-compassion",
    category: "Self-Compassion",
    title: "When You Made a Mistake and Feel Shame",
    scenario: "You forgot an important deadline, said something you regret, or made an error that affected others. You're consumed with shame and self-criticism.",
    steps: [
      { step: "Acknowledge the Pain", detail: "Place hand on heart. Say: 'This is a moment of suffering. This hurts'" },
      { step: "Common Humanity", detail: "Remind yourself: 'Everyone makes mistakes. Imperfection is part of being human'" },
      { step: "What Would You Tell a Friend?", detail: "Imagine a friend made this mistake. What kind words would you offer?" },
      { step: "Offer Yourself Those Words", detail: "Say to yourself what you'd say to that friend" },
      { step: "Take Repair Action", detail: "If possible, apologize or fix what can be fixed. Then practice letting go" }
    ],
    outcome: "Shame transforms into healthy accountability without the toxic self-attack that prevents growth.",
    relatedTools: ["/affirmations", "/soul-wellness"],
    timeNeeded: "5-15 minutes"
  },
  {
    id: "overwhelm",
    category: "Stress Management",
    title: "Feeling Completely Overwhelmed",
    scenario: "You have too many demands—work, family, responsibilities—and feel paralyzed, unable to start anything because everything feels urgent.",
    steps: [
      { step: "Stop and Breathe", detail: "Take 3 deep breaths. You cannot think clearly in overwhelm state" },
      { step: "Brain Dump", detail: "Write down EVERYTHING on your mind. Get it out of your head onto paper" },
      { step: "Identify ONE Thing", detail: "Ask: 'What is the single most important thing I need to do today?'" },
      { step: "Break It Down", detail: "What is the very next physical action? Make it tiny and specific" },
      { step: "Do That One Thing", detail: "Focus only on that action. Completion builds momentum" }
    ],
    outcome: "Overwhelm decreases when you stop trying to hold everything in your mind and take one concrete step.",
    relatedTools: ["/stress-response", "/cognitive-tools"],
    timeNeeded: "10-15 minutes"
  },
  {
    id: "boundary-setting",
    category: "Healthy Boundaries",
    title: "Saying No When You Usually Say Yes",
    scenario: "A colleague asks you to take on extra work (again). You're already stretched thin, but you're afraid of conflict or being seen as unhelpful.",
    steps: [
      { step: "Pause Before Answering", detail: "Say 'Let me check my schedule' instead of automatic yes" },
      { step: "Check Your Body", detail: "Do you feel dread, resentment, exhaustion at the thought? That's data" },
      { step: "Prepare Your No", detail: "Simple and kind: 'I can't take this on right now, but I hope you find support'" },
      { step: "Expect Discomfort", detail: "Guilt is normal when setting new boundaries. It doesn't mean you're wrong" },
      { step: "Affirm Your Choice", detail: "Remind yourself: 'I'm protecting my energy so I can show up fully elsewhere'" }
    ],
    outcome: "With practice, boundaries become easier. You preserve energy for what truly matters.",
    relatedTools: ["/emotional-intelligence", "/how-to-guides"],
    timeNeeded: "Varies"
  }
];

function ExampleCard({ example }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="card-bordered"
      data-testid={`card-example-${example.id}`}
    >
      <div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-[var(--sage-500)] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {example.category}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">{example.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{example.scenario}</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {example.timeNeeded}
          </span>
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3" /> {example.steps.length} steps
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Step-by-Step:</h4>
          <div className="space-y-3">
            {example.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--teal-100)] dark:bg-teal-900/30 text-[var(--teal-600)] flex items-center justify-center text-sm font-medium">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{step.step}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <CheckCircle2 className="h-4 w-4 inline mr-1" />
              <strong>Expected Outcome:</strong> {example.outcome}
            </p>
          </div>

          {example.relatedTools.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Related:</span>
              {example.relatedTools.map((tool, idx) => (
                <Link 
                  key={idx}
                  href={tool}
                  className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                >
                  {tool.slice(1).replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExamplesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...new Set(practicalExamples.map(e => e.category))];

  const filteredExamples = activeCategory === "All"
    ? practicalExamples
    : practicalExamples.filter(e => e.category === activeCategory);

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-teal">
                <Lightbulb className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Practical Examples</h1>
                <p className="text-lead">Real-life scenarios with step-by-step guidance</p>
              </div>
            </div>
          </header>

          <div className="card-bordered bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mb-6">
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>How to Use These Examples:</strong> Read the scenario, then follow the steps in order. 
                  Click any example to expand the full walkthrough. Related tools are linked for deeper learning.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeCategory === cat
                    ? "bg-[var(--teal-600)] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredExamples.map((example, index) => (
              <ExampleCard key={index} example={example} />
            ))}
          </div>

          <footer className="mt-8 card-bordered bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              These examples are educational guides, not clinical advice. Everyone's experience is unique. 
              If you're struggling, please reach out to a mental health professional.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
