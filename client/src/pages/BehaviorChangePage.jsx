import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Target, 
  Repeat,
  Brain,
  CheckCircle2,
  Circle,
  Zap,
  Clock,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Award,
  Calendar,
  BarChart3
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";

const behaviorModules = [
  {
    id: "habit-science",
    title: "The Science of Habits",
    icon: Brain,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    content: {
      overview: "Habits are automatic behaviors triggered by cues. Understanding the habit loop—cue, routine, reward—is the foundation of behavior change.",
      keyPoints: [
        {
          title: "The Habit Loop",
          description: "Every habit follows a neurological pattern: Cue (trigger) → Routine (behavior) → Reward (benefit). Your brain saves effort by automating repeated behaviors.",
          example: "Cue: Feeling stressed. Routine: Scroll social media. Reward: Temporary distraction. To change this, keep the cue and reward but change the routine to something healthier like deep breathing."
        },
        {
          title: "Neuroplasticity",
          description: "Your brain physically changes when you repeat behaviors. New neural pathways form and strengthen with practice—this is why consistency matters more than intensity.",
          example: "Each time you meditate, you strengthen the neural pathways for calm and focus. After 8 weeks of daily practice, brain scans show measurable changes in the amygdala."
        },
        {
          title: "Willpower is Limited",
          description: "Relying on willpower alone fails because it depletes throughout the day. Instead, design your environment and systems to make good choices automatic.",
          example: "Don't keep junk food in the house (environment design) rather than trying to resist it each time (willpower). Make the healthy choice the easy choice."
        }
      ],
      actionSteps: [
        "Identify one habit you want to change",
        "Map out the current cue → routine → reward loop",
        "Keep the cue and reward, design a new routine",
        "Practice the new routine consistently for 21-66 days"
      ]
    }
  },
  {
    id: "tiny-habits",
    title: "Tiny Habits Method",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    content: {
      overview: "Dr. BJ Fogg's research shows that tiny changes—behaviors taking less than 30 seconds—are the most reliable path to lasting change. Start small, grow from there.",
      keyPoints: [
        {
          title: "The Fogg Behavior Model",
          description: "Behavior happens when Motivation, Ability, and Prompt come together at the same moment: B = MAP. Make the behavior tiny enough that you can do it even when motivation is low.",
          example: "Instead of 'exercise for 30 minutes,' start with 'do 2 pushups after I use the bathroom.' The prompt (bathroom) triggers the tiny behavior (2 pushups) that's easy to do."
        },
        {
          title: "Anchor to Existing Habits",
          description: "Attach new behaviors to habits you already do reliably. After I [existing habit], I will [tiny new habit].",
          example: "After I pour my morning coffee, I will write one thing I'm grateful for. The coffee habit anchors the gratitude practice."
        },
        {
          title: "Celebration is Key",
          description: "Immediately celebrate after completing the tiny habit. Positive emotions wire the behavior into your brain faster than repetition alone.",
          example: "After doing your 2 pushups, say 'I'm awesome!' or do a little fist pump. This emotional spike tells your brain 'do this again.'"
        }
      ],
      actionSteps: [
        "Choose one behavior you want to develop",
        "Shrink it to take less than 30 seconds",
        "Find an anchor habit to attach it to",
        "Create a celebration that feels genuine to you",
        "Practice the sequence: anchor → tiny habit → celebration"
      ]
    }
  },
  {
    id: "cbt-basics",
    title: "Cognitive Restructuring",
    icon: RefreshCw,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    content: {
      overview: "Cognitive Behavioral Therapy (CBT) shows that thoughts, feelings, and behaviors are interconnected. By changing thought patterns, we can change how we feel and act.",
      keyPoints: [
        {
          title: "The CBT Triangle",
          description: "Thoughts influence feelings, feelings influence behaviors, and behaviors reinforce thoughts. This cycle can spiral negatively or positively—you can intervene at any point.",
          example: "Thought: 'I'm going to fail.' Feeling: Anxiety. Behavior: Avoid the task. New thought: 'I can try my best.' New feeling: Manageable nervousness. New behavior: Take action."
        },
        {
          title: "Cognitive Distortions",
          description: "Common thinking errors include: all-or-nothing thinking, catastrophizing, mind reading, emotional reasoning, and should statements. Recognizing these is the first step.",
          example: "Catastrophizing: 'If I make a mistake, everything will be ruined.' Reality check: 'Mistakes are normal and rarely catastrophic. What's the most likely outcome?'"
        },
        {
          title: "Thought Challenging",
          description: "When you notice an upsetting thought, ask: What's the evidence for and against this thought? What would I tell a friend? What's another way to see this?",
          example: "Thought: 'Nobody likes me.' Evidence against: 'My friend called yesterday. My coworker invited me to lunch.' Alternative: 'Some people like me, and relationships take effort.'"
        }
      ],
      actionSteps: [
        "Notice when you feel upset and identify the thought",
        "Name the cognitive distortion (if applicable)",
        "Examine the evidence for and against the thought",
        "Generate a more balanced alternative thought",
        "Notice how the new thought affects your feelings"
      ]
    }
  },
  {
    id: "motivation",
    title: "Motivation & Drive",
    icon: TrendingUp,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    content: {
      overview: "Motivation is unreliable but can be cultivated. Understanding intrinsic vs. extrinsic motivation and learning to harness both leads to sustainable change.",
      keyPoints: [
        {
          title: "Intrinsic vs. Extrinsic",
          description: "Intrinsic motivation (doing something for its own sake) is more sustainable than extrinsic (doing it for rewards/avoiding punishment). Connect behaviors to your core values.",
          example: "Extrinsic: 'I exercise to lose weight for summer.' Intrinsic: 'I exercise because I value feeling strong and energetic.' The intrinsic reason sustains when the external goal fades."
        },
        {
          title: "The Motivation Wave",
          description: "Motivation naturally fluctuates. Instead of waiting for motivation, build systems and habits that carry you through low-motivation periods.",
          example: "Schedule workouts at the same time daily. When motivation is low, the habit and schedule carry you. Don't negotiate with yourself about whether to go—just follow the system."
        },
        {
          title: "Progress Creates Motivation",
          description: "Seeing progress generates motivation. Track small wins, celebrate milestones, and make progress visible to yourself.",
          example: "Use a habit tracker, streak counter, or journal. Seeing a 30-day streak of meditation motivates you to continue more than remembering why you started."
        }
      ],
      actionSteps: [
        "Connect your desired behavior to your core values",
        "Create a system that doesn't rely on feeling motivated",
        "Track your progress visually (calendar, app, journal)",
        "Celebrate small wins to build momentum",
        "When motivation drops, return to 'why' and simplify the behavior"
      ]
    }
  },
  {
    id: "breaking-habits",
    title: "Breaking Bad Habits",
    icon: AlertCircle,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    content: {
      overview: "Stopping unwanted habits requires different strategies than building new ones. Focus on disrupting the cue, adding friction, and replacing rather than just eliminating.",
      keyPoints: [
        {
          title: "Make It Invisible",
          description: "Remove cues that trigger the unwanted behavior. Out of sight, out of mind—environment design is more powerful than willpower.",
          example: "To stop mindless snacking: keep snacks out of sight or don't buy them. To stop phone scrolling: keep phone in another room. Remove the cue entirely."
        },
        {
          title: "Add Friction",
          description: "Make the unwanted behavior harder to do. Every step of friction reduces the likelihood you'll follow through.",
          example: "To reduce TV time: unplug the TV and put the remote in a drawer. The effort of setup gives you a moment to choose consciously."
        },
        {
          title: "Replace, Don't Erase",
          description: "Habits fill a need. Instead of trying to eliminate a behavior, replace it with a healthier one that meets the same need.",
          example: "If you stress-eat for comfort, replace with: calling a friend, taking a walk, or doing breathing exercises. The need for comfort remains—just find a healthier way to meet it."
        }
      ],
      actionSteps: [
        "Identify the need or reward the bad habit fulfills",
        "Find a healthier behavior that meets the same need",
        "Remove cues and triggers from your environment",
        "Add friction to make the bad habit harder",
        "Practice the replacement behavior when urges arise"
      ]
    }
  },
  {
    id: "consistency",
    title: "Building Consistency",
    icon: Calendar,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    content: {
      overview: "Consistency beats intensity. Small, regular actions compound over time into remarkable results. The key is making consistency easy and sustainable.",
      keyPoints: [
        {
          title: "Never Miss Twice",
          description: "Missing one day doesn't ruin a habit—missing two starts a new pattern. The rule: never miss twice in a row. Get back on track immediately.",
          example: "Missed your morning meditation? Do a 2-minute version before bed. The point isn't perfection—it's preventing one miss from becoming a pattern."
        },
        {
          title: "Identity-Based Habits",
          description: "Instead of focusing on outcomes, focus on becoming the type of person who does the behavior. Each action is a vote for your identity.",
          example: "Instead of 'I want to run a marathon,' think 'I am a runner.' Each run—even a short one—reinforces that identity. The behavior follows the identity."
        },
        {
          title: "The 2-Minute Rule",
          description: "When you don't feel like doing the habit, commit to just 2 minutes. Often, starting is the hardest part, and momentum carries you further.",
          example: "Don't want to work out? Commit to just putting on workout clothes. Don't want to meditate? Just sit for 2 minutes. Starting is everything."
        }
      ],
      actionSteps: [
        "Define who you want to become (identity, not outcome)",
        "Commit to the 2-minute version on hard days",
        "Use a habit tracker to maintain awareness",
        "Apply the 'never miss twice' rule religiously",
        "Review and adjust your systems weekly"
      ]
    }
  }
];

const implementationSteps = [
  { step: 1, title: "Choose One Focus", description: "Select one behavior to change. Trying to change multiple behaviors at once dilutes your energy and reduces success rates." },
  { step: 2, title: "Make It Tiny", description: "Shrink the behavior to something you can do in 30 seconds or less. This ensures you can do it even on your worst days." },
  { step: 3, title: "Anchor It", description: "Attach the new behavior to something you already do reliably. This leverages existing neural pathways." },
  { step: 4, title: "Celebrate Immediately", description: "Create a genuine positive emotion right after completing the behavior. This wires it into your brain." },
  { step: 5, title: "Track Progress", description: "Make your progress visible with a simple tracking method. Seeing progress creates motivation." },
  { step: 6, title: "Scale Gradually", description: "Once the tiny version is automatic (usually 2-4 weeks), gradually increase duration or intensity." }
];

export default function BehaviorChangePage() {
  const [selectedModule, setSelectedModule] = useState(behaviorModules[0]);

  useSEO({
    title: "Behavior Change",
    description: "Science-backed tools for building healthy habits, breaking patterns, and sustainable behavior change for your wellness journey.",
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
              <div className="icon-container icon-xl icon-gradient-teal">
                <Target className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Behavior Change Guide</h1>
                <p className="text-lead">Evidence-based strategies to build habits and transform your life</p>
              </div>
            </div>
          </header>

          <div className="card-bordered mb-8 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-start gap-4">
              <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">The Science of Change</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Lasting behavior change isn't about willpower—it's about understanding how habits work and designing 
                  systems that make good behaviors automatic. This guide draws from the latest research in behavioral 
                  science, including the work of BJ Fogg, James Clear, and CBT principles.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-heading-md text-teal mb-4">6-Step Implementation Framework</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {implementationSteps.map((item) => (
                <div 
                  key={item.step}
                  className="card-bordered p-4"
                  data-testid={`card-step-${item.step}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--teal-100)] text-[var(--teal-600)] flex items-center justify-center font-bold">
                      {item.step}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 ml-11">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-2 mb-8">
            {behaviorModules.map(module => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedModule.id === module.id 
                    ? 'bg-[var(--teal-600)] text-white' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[var(--teal-400)]'
                }`}
                data-testid={`button-module-${module.id}`}
              >
                <module.icon className="h-4 w-4 inline mr-2" />
                {module.title}
              </button>
            ))}
          </div>

          <div className={`card-bordered ${selectedModule.bgColor} mb-8`}>
            <div className="flex items-center gap-3 mb-4">
              <selectedModule.icon className={`h-8 w-8 ${selectedModule.color}`} />
              <h2 className="text-heading-lg text-gray-900 dark:text-white">{selectedModule.title}</h2>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedModule.content.overview}</p>

            <div className="space-y-6">
              {selectedModule.content.keyPoints.map((point, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className={`h-5 w-5 ${selectedModule.color}`} />
                    {point.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{point.description}</p>
                  <div className={`${selectedModule.bgColor} rounded-lg p-4`}>
                    <p className="text-xs font-medium text-[var(--sage-500)] mb-1">Example:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{point.example}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <ArrowRight className={`h-5 w-5 ${selectedModule.color}`} />
                Action Steps
              </h3>
              <ol className="space-y-2">
                {selectedModule.content.actionSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full ${selectedModule.bgColor} ${selectedModule.color} flex items-center justify-center text-xs font-medium`}>
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <section className="grid md:grid-cols-2 gap-6 mb-8">
            <Link href="/healing-journeys" className="card-bordered hover:shadow-md transition-shadow" data-testid="link-journeys">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-6 w-6 text-indigo-500" />
                <h3 className="text-heading-md text-teal">Healing Journeys</h3>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                Structured multi-week programs to transform specific areas of your life
              </p>
            </Link>
            <Link href="/research" className="card-bordered hover:shadow-md transition-shadow" data-testid="link-research">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-6 w-6 text-purple-500" />
                <h3 className="text-heading-md text-teal">Research & Evidence</h3>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                The scientific foundations behind behavior change principles
              </p>
            </Link>
          </section>

          <RelatedNextSteps 
            steps={[
              { title: "Daily Routines", description: "Build sustainable daily wellness habits", path: "/daily-routines" },
              { title: "Gratitude Practice", description: "Cultivate appreciation and positivity", path: "/gratitude" },
              { title: "Journal Reflection", description: "Track your progress and insights", path: "/guided-journaling" },
            ]}
            title="Continue Your Journey"
          />

          <footer className="card-bordered bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mt-8">
            <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
              <strong>Remember:</strong> Behavior change takes time and patience. Be compassionate with yourself through setbacks—they're 
              part of the process. For deeply ingrained patterns, consider working with a therapist or coach.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
