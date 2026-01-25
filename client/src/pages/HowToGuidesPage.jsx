import { useState } from "react";
import { Link } from "wouter";
import SafetyFooter from "../components/ui/SafetyFooter";
import { 
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
  ArrowLeft, 
  BookOpen,
  ChevronRight,
  ChevronDown,
  Wind,
  Anchor,
  Heart,
  Brain,
  Sparkles,
  Moon,
  Sun,
  Eye,
  Flower2,
  CheckCircle2,
  Clock,
  Target,
  Lightbulb,
  Play
} from "lucide-react";

const toolGuides = [
  {
    id: "breathing",
    name: "Breathing Exercises",
    icon: Wind,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    link: "/breathing",
    overview: "Controlled breathing is the fastest way to shift your nervous system from stress to calm. Different breathing patterns create different effects.",
    whenToUse: [
      "When feeling anxious or overwhelmed",
      "Before stressful situations (presentations, difficult conversations)",
      "When you can't sleep",
      "During panic attacks",
      "As a daily calming practice"
    ],
    stepByStep: [
      { step: "Find a comfortable position", detail: "Sit or lie down. Place one hand on your chest and one on your belly." },
      { step: "Choose a technique", detail: "For calming: 4-7-8 breath. For focus: Box breathing. For quick relief: Physiological sigh." },
      { step: "Start slowly", detail: "Begin with 3-4 cycles. Don't force it—gentle breathing is more effective than forceful." },
      { step: "Focus on the exhale", detail: "Long exhales activate your parasympathetic nervous system (rest and digest)." },
      { step: "Practice regularly", detail: "2-3 times daily for 5 minutes builds your capacity to self-regulate." }
    ],
    tips: [
      "If you feel dizzy, return to normal breathing",
      "Practice when calm first—it's harder to learn during stress",
      "Set phone reminders for regular practice",
      "Pair with grounding for maximum effect"
    ],
    duration: "2-10 minutes"
  },
  {
    id: "grounding",
    name: "Grounding Techniques",
    icon: Anchor,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    link: "/grounding",
    overview: "Grounding brings you back to the present moment when your mind is stuck in the past (trauma) or future (anxiety). It uses your senses to reconnect with the here-and-now.",
    whenToUse: [
      "When feeling triggered or having flashbacks",
      "During dissociation or feeling 'out of your body'",
      "When anxiety is spiraling",
      "Before or after difficult therapy sessions",
      "Anytime you feel disconnected from the present"
    ],
    stepByStep: [
      { step: "Notice you need grounding", detail: "Signs: racing thoughts, feeling distant, physical tension, emotional flooding." },
      { step: "Try the 5-4-3-2-1 technique", detail: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste." },
      { step: "Engage your body", detail: "Feel your feet on the floor. Press your back into the chair. Notice the temperature." },
      { step: "Use strong sensations if needed", detail: "Hold ice, splash cold water on face, smell strong scents (peppermint, coffee)." },
      { step: "Speak out loud", detail: "Say your name, the date, where you are. 'I am [name]. It is [date]. I am safe in [location].'" }
    ],
    tips: [
      "Create a 'grounding kit' with sensory items (scented lotion, textured object, photo)",
      "Practice when you're NOT triggered to build the skill",
      "Combine with breathing for stronger effect",
      "Move your body—walking is excellent grounding"
    ],
    duration: "1-10 minutes"
  },
  {
    id: "meditation",
    name: "Meditation",
    icon: Brain,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    link: "/meditation",
    overview: "Meditation trains your attention and awareness. Regular practice changes brain structure and improves emotional regulation, focus, and well-being.",
    whenToUse: [
      "Daily, ideally at a consistent time",
      "When you need mental clarity",
      "To process difficult emotions",
      "Before making important decisions",
      "To build long-term resilience"
    ],
    stepByStep: [
      { step: "Set up your space", detail: "Find a quiet spot. Sit comfortably—no special posture required. Set a timer." },
      { step: "Close your eyes and settle", detail: "Take 3 deep breaths. Let your body relax. There's nowhere else to be." },
      { step: "Choose your anchor", detail: "Focus on breath, body sensations, or a word/phrase. This is your home base." },
      { step: "Notice when mind wanders", detail: "This is the actual practice! Noticing = the mental pushup. Gently return to anchor." },
      { step: "End with intention", detail: "Before opening eyes, set an intention to carry the calm with you." }
    ],
    tips: [
      "Start with just 5 minutes—consistency beats duration",
      "Guided meditations are great for beginners",
      "Thoughts during meditation are normal, not failure",
      "Same time daily helps build the habit",
      "There's no 'good' or 'bad' meditation—showing up is success"
    ],
    duration: "5-30 minutes"
  },
  {
    id: "affirmations",
    name: "Affirmations",
    icon: Sparkles,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    link: "/affirmations",
    overview: "Affirmations are positive statements that, when repeated consistently, can rewire negative thought patterns and build new neural pathways for self-belief.",
    whenToUse: [
      "Morning routine to set the tone for the day",
      "When negative self-talk is active",
      "Before challenging situations",
      "To reinforce new beliefs you're building",
      "During mirror work for self-love practice"
    ],
    stepByStep: [
      { step: "Choose relevant affirmations", detail: "Select 3-5 affirmations that address your specific struggles or goals." },
      { step: "Make them believable", detail: "If 'I love myself' feels too far, try 'I'm learning to accept myself.'" },
      { step: "Speak with emotion", detail: "Say them out loud with feeling. Emotion accelerates neural rewiring." },
      { step: "Repeat consistently", detail: "Say them morning and night, ideally looking in a mirror." },
      { step: "Write them down", detail: "Journaling affirmations engages different brain regions and deepens the practice." }
    ],
    tips: [
      "Present tense is most effective: 'I am' not 'I will be'",
      "Combine with visualization for stronger impact",
      "Record yourself and listen during commutes",
      "If an affirmation causes distress, soften it",
      "Post sticky notes in visible places"
    ],
    duration: "2-5 minutes"
  },
  {
    id: "journaling",
    name: "Journaling",
    icon: BookOpen,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    link: "/journal",
    overview: "Journaling externalizes thoughts, helps process emotions, reveals patterns, and provides a record of your growth. It's one of the most versatile healing tools.",
    whenToUse: [
      "Daily for reflection and processing",
      "When overwhelmed by thoughts or emotions",
      "To work through decisions",
      "After significant experiences",
      "To track moods and identify patterns"
    ],
    stepByStep: [
      { step: "Set the scene", detail: "Find a private space. Use a dedicated journal or digital tool. Remove distractions." },
      { step: "Start without pressure", detail: "Begin with 'Right now I feel...' or use a prompt. Don't worry about quality." },
      { step: "Write freely", detail: "Let thoughts flow without editing. Spelling, grammar, handwriting don't matter." },
      { step: "Include emotions and body sensations", detail: "Not just events—how did things make you FEEL? Where do you feel it in your body?" },
      { step: "Close with reflection", detail: "What did you learn? What do you need? End with one thing you're grateful for." }
    ],
    tips: [
      "Handwriting engages the brain differently than typing",
      "Use prompts when you're stuck",
      "Review past entries to see growth",
      "Try different formats: free-writing, gratitude, tracking",
      "Burn or delete entries that feel heavy to release them"
    ],
    duration: "10-20 minutes"
  },
  {
    id: "self-care",
    name: "Self-Care",
    icon: Heart,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    link: "/self-care",
    overview: "Self-care is intentionally meeting your needs to maintain physical, emotional, and mental health. It's not selfish—it's essential for sustainable wellbeing.",
    whenToUse: [
      "Daily, as a non-negotiable practice",
      "When feeling depleted or burned out",
      "Before and after stressful periods",
      "When you notice you've been neglecting yourself",
      "Preventively, not just reactively"
    ],
    stepByStep: [
      { step: "Assess your current state", detail: "What do you need most right now? Physical rest? Emotional connection? Mental stimulation?" },
      { step: "Choose appropriate care", detail: "Match the activity to the need. Tired? Rest. Lonely? Connect. Overwhelmed? Simplify." },
      { step: "Schedule it", detail: "Put self-care in your calendar like any important appointment. Protect this time." },
      { step: "Be fully present", detail: "Don't multitask during self-care. Put away your phone. Be with the experience." },
      { step: "Start small", detail: "5 minutes counts. A walk counts. A cup of tea counts. Don't wait for big blocks of time." }
    ],
    tips: [
      "Create a 'self-care menu' for different situations",
      "Include all dimensions: physical, emotional, mental, social, spiritual",
      "Self-care should feel nourishing, not indulgent",
      "Learn to say no to protect your energy",
      "Notice what refills you vs. what depletes you"
    ],
    duration: "5 minutes to several hours"
  }
];

function GuideCard({ guide, isExpanded, onToggle }) {
  return (
  <WellnessPageShell
    title="HowToGuidesPage"
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

    <div className={`card-bordered ${guide.bgColor} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left"
        data-testid={`button-guide-${guide.id}`}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
            <guide.icon className={`h-6 w-6 ${guide.color}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{guide.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              {guide.duration}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className={`h-5 w-5 ${guide.color}`} />
        ) : (
          <ChevronRight className={`h-5 w-5 ${guide.color}`} />
        )}
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">{guide.overview}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Target className={`h-5 w-5 ${guide.color}`} />
              When to Use
            </h4>
            <ul className="space-y-2">
              {guide.whenToUse.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className={`h-4 w-4 ${guide.color} flex-shrink-0 mt-0.5`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Play className={`h-5 w-5 ${guide.color}`} />
              Step-by-Step Instructions
            </h4>
            <ol className="space-y-3">
              {guide.stepByStep.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full ${guide.bgColor} ${guide.color} flex items-center justify-center text-xs font-bold`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.step}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Lightbulb className={`h-5 w-5 ${guide.color}`} />
              Pro Tips
            </h4>
            <ul className="space-y-2">
              {guide.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className={`${guide.color}`}>•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <Link 
            href={guide.link}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${guide.bgColor} ${guide.color} font-medium text-sm hover:opacity-80 transition`}
            data-testid={`link-tool-${guide.id}`}
          >
            Try {guide.name} Now
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function HowToGuidesPage() {
  const [expandedGuide, setExpandedGuide] = useState(null);

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
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">How-To Guides</h1>
                <p className="text-lead">Step-by-step instructions for using each wellness tool effectively</p>
              </div>
            </div>
          </header>

          <div className="card-bordered mb-8 bg-indigo-50 dark:bg-indigo-900/20">
            <div className="flex items-start gap-4">
              <Lightbulb className="h-6 w-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Getting the Most from Your Practice</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Each tool in our platform is designed to support your healing journey. These guides explain when to use each tool, 
                  provide step-by-step instructions, and share tips for maximum benefit. Start with the tools that resonate most 
                  with your current needs—there's no right or wrong order.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {toolGuides.map(guide => (
              <GuideCard
                key={guide.id}
                guide={guide}
                isExpanded={expandedGuide === guide.id}
                onToggle={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
              />
            ))}
          </div>

          <SafetyFooter variant="default" />
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
