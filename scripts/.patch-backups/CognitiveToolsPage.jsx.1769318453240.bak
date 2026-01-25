import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Brain,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  Scale,
  MessageSquare,
  Eye,
  Target,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Shield
} from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const COGNITIVE_CLARITY = {
  what: "Evidence-based cognitive tools from CBT and DBT to identify and reframe unhelpful thinking patterns.",
  who: "Anyone experiencing negative self-talk, anxiety spirals, or wanting to understand their thought patterns.",
  when: "When you notice recurring negative thoughts, before/after stressful situations, or during daily reflection.",
  why: "Your thoughts shape your emotions and behaviors. Learning to catch and examine thoughts gives you power to change your inner experience.",
  howSteps: [
    "Learn to recognize common cognitive distortions",
    "Practice the 4-step thought challenge process",
    "Try the interactive reframe tool with your own thoughts",
    "Notice patterns in your thinking over time"
  ],
  whereLinkText: "Explore emotional intelligence",
  whereHref: "/emotional-intelligence"
};

const COGNITIVE_EXAMPLES = [
  {
    level: "beginner",
    title: "Recognizing a distortion",
    situation: "You notice yourself thinking 'Everyone thinks I'm stupid' after a meeting.",
    action: "Review the cognitive distortions list and identify this as 'Mind Reading'—assuming you know what others think.",
    result: "Simply naming the distortion creates distance from the thought and opens space for questioning it."
  },
  {
    level: "intermediate",
    title: "Challenging a thought",
    situation: "After a mistake at work, you think 'I'm a total failure.'",
    action: "Use the thought challenge steps: catch the thought, identify 'All-or-Nothing Thinking,' examine evidence, create a balanced reframe.",
    result: "You replace the thought with 'I made a mistake, but I've also had many successes. One error doesn't define me.'"
  },
  {
    level: "advanced",
    title: "Breaking an anxiety spiral",
    situation: "You notice catastrophic thinking: 'If I mess this up, everything will fall apart.'",
    action: "Use the interactive reframe tool. List evidence for/against, calculate realistic probability, create a coping plan.",
    result: "The spiral breaks as you realize the feared outcome is unlikely, and even if it happened, you could cope."
  }
];

const cognitiveDistortions = [
  {
    name: "All-or-Nothing Thinking",
    description: "Seeing things in black and white categories. If performance falls short of perfect, you see yourself as a total failure.",
    example: "I got a B on the test, so I'm a complete failure.",
    reframe: "I did well on most of the test. One imperfect result doesn't define my abilities. What can I learn for next time?"
  },
  {
    name: "Catastrophizing",
    description: "Expecting the worst possible outcome, or exaggerating the importance of problems.",
    example: "If I make a mistake in this presentation, my career is over.",
    reframe: "What's the most likely outcome? Even if I stumble, it's one presentation among many. What's the evidence my career would be 'over'?"
  },
  {
    name: "Mind Reading",
    description: "Assuming you know what others are thinking, usually that they're thinking negatively about you.",
    example: "They didn't respond to my text—they must be mad at me.",
    reframe: "I don't actually know what they're thinking. There are many possible explanations. I can ask directly if I'm worried."
  },
  {
    name: "Fortune Telling",
    description: "Predicting things will turn out badly without evidence.",
    example: "I know the interview will go terribly. I won't get the job.",
    reframe: "I can't actually predict the future. What evidence do I have it will go badly? What if it goes well?"
  },
  {
    name: "Emotional Reasoning",
    description: "Assuming that because you feel a certain way, it must be true.",
    example: "I feel like a burden to my friends, so I must be one.",
    reframe: "Feelings aren't facts. What evidence contradicts this feeling? Would my friends agree I'm a burden?"
  },
  {
    name: "Should Statements",
    description: "Criticizing yourself or others with 'shoulds,' 'musts,' or 'oughts.'",
    example: "I should have handled that better. I shouldn't feel this way.",
    reframe: "I did what I could with what I knew. 'Should' adds guilt to suffering. What can I do now?"
  },
  {
    name: "Labeling",
    description: "Attaching a negative label to yourself or others based on a single event.",
    example: "I forgot the meeting—I'm such an idiot.",
    reframe: "Making a mistake doesn't define who I am. I forgot once; that doesn't make me 'an idiot.'"
  },
  {
    name: "Personalization",
    description: "Blaming yourself for things that aren't your fault or within your control.",
    example: "The team project failed because of me.",
    reframe: "Many factors contributed to this outcome. What was actually within my control? What was outside it?"
  }
];

const thoughtChallengeSteps = [
  {
    step: 1,
    title: "Catch the Thought",
    icon: Eye,
    description: "Notice when you're feeling upset. Ask: What just went through my mind?",
    questions: ["What situation triggered this feeling?", "What exactly am I telling myself?", "What's the specific thought causing distress?"]
  },
  {
    step: 2,
    title: "Identify the Distortion",
    icon: AlertTriangle,
    description: "Check if the thought fits any cognitive distortion patterns.",
    questions: ["Am I thinking in all-or-nothing terms?", "Am I mind reading or fortune telling?", "Am I catastrophizing or using 'should' statements?"]
  },
  {
    step: 3,
    title: "Examine the Evidence",
    icon: Scale,
    description: "Look at the facts objectively, like a scientist or lawyer would.",
    questions: ["What evidence supports this thought?", "What evidence contradicts it?", "Am I confusing feelings with facts?"]
  },
  {
    step: 4,
    title: "Consider Alternatives",
    icon: Lightbulb,
    description: "Generate other possible interpretations of the situation.",
    questions: ["What would I tell a friend in this situation?", "What's another way to look at this?", "What would a neutral observer think?"]
  },
  {
    step: 5,
    title: "Create a Balanced Thought",
    icon: RefreshCw,
    description: "Formulate a more realistic, balanced perspective.",
    questions: ["What's a more balanced way to see this?", "What's the most likely outcome?", "How might I feel about this in a week/month/year?"]
  }
];

const mentalExercises = [
  {
    id: "thought-log",
    name: "Thought Log",
    icon: MessageSquare,
    duration: "10 min",
    description: "A structured way to track and challenge unhelpful thoughts. Write down the situation, your automatic thought, the emotion, evidence for/against, and a balanced alternative.",
    steps: [
      "Describe the situation briefly",
      "Write the automatic thought exactly",
      "Rate the emotion (0-100%) and name it",
      "List evidence supporting the thought",
      "List evidence against the thought",
      "Write a balanced alternative thought",
      "Re-rate the emotion"
    ]
  },
  {
    id: "worry-time",
    name: "Scheduled Worry Time",
    icon: Target,
    duration: "15 min",
    description: "Rather than worrying all day, contain worries to a specific time. When worries arise, postpone them to your scheduled worry time.",
    steps: [
      "Schedule 15-20 minutes daily for worrying",
      "When a worry arises, write it down briefly",
      "Tell yourself: 'I'll think about this during worry time'",
      "Return focus to the present",
      "During worry time, review your list",
      "For each worry, decide: Is this actionable?",
      "If yes, plan one small action. If no, practice letting it go"
    ]
  },
  {
    id: "behavioral-experiment",
    name: "Behavioral Experiment",
    icon: Lightbulb,
    duration: "Varies",
    description: "Test your negative predictions through action. If you believe something bad will happen, set up a small experiment to check if it's true.",
    steps: [
      "Identify a negative prediction you hold",
      "Rate how strongly you believe it (0-100%)",
      "Design a small experiment to test it",
      "Predict what will happen",
      "Conduct the experiment",
      "Record what actually happened",
      "Compare prediction vs. reality",
      "Update your belief based on evidence"
    ]
  },
  {
    id: "decatastrophizing",
    name: "Decatastrophizing",
    icon: Shield,
    duration: "10 min",
    description: "When you're catastrophizing, work through best, worst, and most likely outcomes. Often, the most likely is manageable.",
    steps: [
      "Identify the catastrophic thought",
      "Ask: What's the WORST that could happen?",
      "Ask: How would I cope if that happened?",
      "Ask: What's the BEST that could happen?",
      "Ask: What's the MOST LIKELY outcome?",
      "Focus on the most likely scenario",
      "Create a coping plan if needed"
    ]
  }
];

export default function CognitiveToolsPage() {
  const [selectedExercise, setSelectedExercise] = useState(null);

  useSEO({
    title: "Cognitive Tools",
    description: "CBT-based cognitive tools for identifying and reframing negative thought patterns. Learn about cognitive distortions and build mental resilience.",
  });

  return (
  <WellnessPageShell
    title="CognitiveToolsPage"
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

    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-purple">
                <Brain className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-page-title">Cognitive Tools</h1>
                <p className="text-lead">Reframe thoughts, challenge patterns, and build mental clarity</p>
              </div>
            </div>
          </header>

          <BenefitsBlock
            benefits={[
              "CBT-based tools for identifying cognitive distortions",
              "5-step thought challenge framework",
              "Practical exercises like thought logs and worry time"
            ]}
            duration="10–20 min per tool"
            control="Practice at your own pace"
            disclaimer="Educational CBT tools—not therapy. If you need crisis help, visit"
            crisisLink="/crisis"
            variant="minimal"
            className="mb-6"
          />

          <ClarityCard {...COGNITIVE_CLARITY} variant="compact" className="mb-6" />

          <ExamplesAccordion 
            examples={COGNITIVE_EXAMPLES} 
            title="See how others use cognitive tools"
            className="mb-8"
          />

          <div className="card-bordered mb-8 rounded-xl p-6" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}>
            <div className="flex items-start gap-4">
              <RefreshCw className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: 'var(--glp-sage-deep)' }} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Cognitive Behavioral Therapy Foundations</h3>
                <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                  CBT is one of the most researched and effective approaches for managing anxiety, depression, and stress. 
                  It's based on the principle that our thoughts, feelings, and behaviors are interconnected. By changing 
                  unhelpful thought patterns, we can change how we feel and act.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-heading-md mb-4" style={{ color: 'var(--glp-sage-deep)' }}>5-Step Thought Challenge</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {thoughtChallengeSteps.map((item) => (
                <div 
                  key={item.step}
                  className="card-bordered p-4 rounded-xl"
                  style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
                  data-testid={`card-step-${item.step}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }}>
                      {item.step}
                    </span>
                    <item.icon className="h-5 w-5" style={{ color: 'var(--glp-sage-deep)' }} />
                  </div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--glp-ink)' }}>{item.title}</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--glp-sage)' }}>{item.description}</p>
                  <ul className="space-y-1">
                    {item.questions.map((q, i) => (
                      <li key={i} className="text-xs flex items-start gap-1" style={{ color: 'var(--glp-sage)' }}>
                        <HelpCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-heading-md mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Common Cognitive Distortions</h2>
            <p className="text-body-sm mb-4" style={{ color: 'var(--glp-sage)' }}>
              These are thinking errors our minds make automatically. Recognizing them is the first step to challenging them.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {cognitiveDistortions.map((distortion, index) => (
                <div 
                  key={index}
                  className="card-bordered rounded-xl p-5"
                  style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
                  data-testid={`card-distortion-${index}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5" style={{ color: 'var(--glp-gold)' }} />
                    <h3 className="font-semibold" style={{ color: 'var(--glp-ink)' }}>{distortion.name}</h3>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--glp-sage)' }}>{distortion.description}</p>
                  
                  <div className="space-y-2">
                    <div className="rounded-lg p-3" style={{ background: 'var(--glp-rose-15)' }}>
                      <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--glp-rose)' }}>
                        <XCircle className="h-3 w-3" /> Distorted Thought:
                      </p>
                      <p className="text-sm italic" style={{ color: 'var(--glp-ink)' }}>"{distortion.example}"</p>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'var(--glp-sage-10)' }}>
                      <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--glp-sage)' }}>
                        <CheckCircle2 className="h-3 w-3" /> Balanced Reframe:
                      </p>
                      <p className="text-sm" style={{ color: 'var(--glp-ink)' }}>"{distortion.reframe}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-heading-md mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Mental Exercises</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mentalExercises.map((exercise) => (
                <div 
                  key={exercise.id}
                  className="card-bordered cursor-pointer hover:shadow-md transition-shadow rounded-xl p-5"
                  style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}
                  onClick={() => setSelectedExercise(selectedExercise === exercise.id ? null : exercise.id)}
                  data-testid={`card-exercise-${exercise.id}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg" style={{ background: 'var(--glp-paper)' }}>
                      <exercise.icon className="h-6 w-6" style={{ color: 'var(--glp-sage-deep)' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--glp-ink)' }}>{exercise.name}</h3>
                      <p className="text-xs" style={{ color: 'var(--glp-sage)' }}>{exercise.duration}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3" style={{ color: 'var(--glp-sage)' }}>{exercise.description}</p>
                  
                  {selectedExercise === exercise.id && (
                    <div className="rounded-lg p-4 mt-3" style={{ background: 'var(--glp-paper)' }}>
                      <h4 className="font-medium mb-3" style={{ color: 'var(--glp-ink)' }}>How to Practice:</h4>
                      <ol className="space-y-2">
                        {exercise.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--glp-sage)' }}>
                            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }}>
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6 mb-8">
            <Link href="/behavior-change" className="card-bordered hover:shadow-md transition-shadow rounded-xl p-5" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }} data-testid="link-behavior">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-6 w-6" style={{ color: 'var(--glp-gold)' }} />
                <h3 className="text-heading-md" style={{ color: 'var(--glp-sage-deep)' }}>Behavior Change Guide</h3>
              </div>
              <p className="text-body-sm" style={{ color: 'var(--glp-sage)' }}>
                Learn the science of habits and evidence-based strategies for lasting change
              </p>
            </Link>
            <Link href="/journal" className="card-bordered hover:shadow-md transition-shadow rounded-xl p-5" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }} data-testid="link-journal">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="h-6 w-6" style={{ color: 'var(--glp-rose)' }} />
                <h3 className="text-heading-md" style={{ color: 'var(--glp-sage-deep)' }}>Journal</h3>
              </div>
              <p className="text-body-sm" style={{ color: 'var(--glp-sage)' }}>
                Practice thought logs and cognitive exercises in your private journal
              </p>
            </Link>
          </section>

          <RelatedNextSteps 
            steps={[
              { title: "Thought Diary", description: "Track and reframe thought patterns", path: "/thought-diary" },
              { title: "Journal Reflection", description: "Deepen your cognitive insights", path: "/guided-journaling" },
              { title: "Self-Compassion", description: "Be kind to yourself", path: "/self-compassion" },
            ]}
            title="Continue Your Journey"
          />

          <SafetyFooter variant="prominent" />
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
