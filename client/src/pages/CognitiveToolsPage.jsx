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
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";

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
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
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
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
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
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
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
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
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
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Cognitive Tools</h1>
                <p className="text-lead">Reframe thoughts, challenge patterns, and build mental clarity</p>
              </div>
            </div>
          </header>

          <div className="card-bordered mb-8 bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-start gap-4">
              <RefreshCw className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cognitive Behavioral Therapy Foundations</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  CBT is one of the most researched and effective approaches for managing anxiety, depression, and stress. 
                  It's based on the principle that our thoughts, feelings, and behaviors are interconnected. By changing 
                  unhelpful thought patterns, we can change how we feel and act.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-heading-md text-teal mb-4">5-Step Thought Challenge</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {thoughtChallengeSteps.map((item) => (
                <div 
                  key={item.step}
                  className="card-bordered p-4"
                  data-testid={`card-step-${item.step}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </span>
                    <item.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{item.description}</p>
                  <ul className="space-y-1">
                    {item.questions.map((q, i) => (
                      <li key={i} className="text-xs text-[var(--sage-500)] flex items-start gap-1">
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
            <h2 className="text-heading-md text-teal mb-4">Common Cognitive Distortions</h2>
            <p className="text-body-sm text-[var(--sage-600)] mb-4">
              These are thinking errors our minds make automatically. Recognizing them is the first step to challenging them.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {cognitiveDistortions.map((distortion, index) => (
                <div 
                  key={index}
                  className="card-bordered"
                  data-testid={`card-distortion-${index}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">{distortion.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{distortion.description}</p>
                  
                  <div className="space-y-2">
                    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3">
                      <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Distorted Thought:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{distortion.example}"</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Balanced Reframe:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">"{distortion.reframe}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-heading-md text-teal mb-4">Mental Exercises</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mentalExercises.map((exercise) => (
                <div 
                  key={exercise.id}
                  className={`card-bordered ${exercise.bgColor} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => setSelectedExercise(selectedExercise === exercise.id ? null : exercise.id)}
                  data-testid={`card-exercise-${exercise.id}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-gray-800">
                      <exercise.icon className={`h-6 w-6 ${exercise.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{exercise.name}</h3>
                      <p className="text-xs text-[var(--sage-500)]">{exercise.duration}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{exercise.description}</p>
                  
                  {selectedExercise === exercise.id && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-3">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">How to Practice:</h4>
                      <ol className="space-y-2">
                        {exercise.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full ${exercise.bgColor} ${exercise.color} flex items-center justify-center text-xs font-medium`}>
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
            <Link href="/behavior-change" className="card-bordered hover:shadow-md transition-shadow" data-testid="link-behavior">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-6 w-6 text-amber-500" />
                <h3 className="text-heading-md text-teal">Behavior Change Guide</h3>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                Learn the science of habits and evidence-based strategies for lasting change
              </p>
            </Link>
            <Link href="/journal" className="card-bordered hover:shadow-md transition-shadow" data-testid="link-journal">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="h-6 w-6 text-rose-500" />
                <h3 className="text-heading-md text-teal">Journal</h3>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
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

          <footer className="card-bordered bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mt-8">
            <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
              <strong>Important:</strong> These cognitive tools are most effective when practiced regularly. For persistent 
              negative thought patterns, anxiety, or depression, please work with a licensed therapist who can provide 
              personalized guidance.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
