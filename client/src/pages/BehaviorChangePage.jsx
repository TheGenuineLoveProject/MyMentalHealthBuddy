import { useState } from "react";
import { Link } from "wouter";
import SafetyFooter from "../components/ui/SafetyFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { ArrowLeft, Target, Brain, CheckCircle2, Zap, TrendingUp, AlertCircle, Lightbulb, ArrowRight, RefreshCw, Award, Calendar, BarChart3 } from 'lucide-react';
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const BEHAVIOR_CLARITY = {
  what: "Science-based behavior change frameworks including habit science, tiny habits, and sustainable change strategies.",
  who: "Anyone wanting to build new habits, break unwanted patterns, or make lasting positive changes.",
  when: "When starting new goals, struggling with consistency, or wanting to understand why change is hard.",
  why: "Understanding the science of behavior change makes it easier to work with your brain rather than against it.",
  howSteps: [
    "Learn the habit loop (cue → routine → reward)",
    "Start with tiny habits attached to existing routines",
    "Design your environment to make good choices automatic",
    "Celebrate small wins to wire in the new behavior"
  ],
  whereLinkText: "Explore daily routines",
  whereHref: "/daily-routines"
};

const BEHAVIOR_EXAMPLES = [
  {
    level: "beginner",
    title: "Understanding your current habits",
    situation: "You want to stop scrolling social media before bed but can't seem to break the pattern.",
    action: "Map the habit loop: Cue (lying in bed), Routine (scrolling), Reward (distraction from thoughts). Now you can intervene.",
    result: "You understand why willpower alone doesn't work and can design a better approach."
  },
  {
    level: "intermediate",
    title: "Attaching a tiny habit",
    situation: "You want to start meditating but never seem to find the time.",
    action: "Use Tiny Habits: 'After I pour my morning coffee, I will take three deep breaths.' Start absurdly small.",
    result: "The anchor habit (coffee) reminds you. The tiny behavior (3 breaths) grows into a meditation practice."
  },
  {
    level: "advanced",
    title: "Designing your environment",
    situation: "You keep buying junk food despite wanting to eat healthier.",
    action: "Redesign your environment: don't keep junk food at home, prep healthy snacks on Sunday, put fruit visible on counter.",
    result: "Good choices become automatic because you've removed friction from healthy options and added it to unhealthy ones."
  }
];

const behaviorModules = [
  {
    id: "habit-science",
    title: "The Science of Habits",
    icon: Brain,
    colorStyle: { color: 'var(--glp-sage-deep)' },
    bgColorStyle: { background: 'var(--glp-sage-10)' },
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
    colorStyle: { color: 'var(--glp-gold)' },
    bgColorStyle: { background: 'var(--glp-gold-30)' },
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
    colorStyle: { color: 'var(--glp-sage)' },
    bgColorStyle: { background: 'var(--glp-sage-10)' },
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
    colorStyle: { color: 'var(--glp-sage)' },
    bgColorStyle: { background: 'var(--glp-sage-10)' },
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
    colorStyle: { color: 'var(--glp-rose)' },
    bgColorStyle: { background: 'var(--glp-rose-15)' },
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
    colorStyle: { color: 'var(--glp-sage-deep)' },
    bgColorStyle: { background: 'var(--glp-sage-10)' },
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
  <WellnessPageShell
    title="BehaviorChangePage"
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
      <SEO title="Behavior Change — The Genuine Love Project" description="Explore gentle approaches to building healthier habits." />


    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm mb-4 transition" style={{ color: 'var(--glp-sage)' }} data-testid="link-back">
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

          <BenefitsBlock
            benefits={[
              "Science-backed behavior change frameworks",
              "Tiny habits method and implementation steps",
              "Build sustainable habits at your own pace"
            ]}
            duration="10–20 min per module"
            control="Start small and scale gradually"
            disclaimer="Educational behavior science—not clinical advice. If you need crisis help, visit"
            crisisLink="/crisis"
            variant="minimal"
            className="mb-6"
          />

          <ClarityCard {...BEHAVIOR_CLARITY} variant="compact" className="mb-6" />

          <ExamplesAccordion 
            examples={BEHAVIOR_EXAMPLES} 
            title="See how others build new habits"
            className="mb-8"
          />

          <div className="card-bordered mb-8" style={{ background: 'var(--glp-sage-10)' }}>
            <div className="flex items-start gap-4">
              <Lightbulb className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: 'var(--glp-sage)' }} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>The Science of Change</h3>
                <p className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.8 }}>
                  Lasting behavior change isn't about willpower—it's about understanding how habits work and designing 
                  systems that make good behaviors automatic. This guide draws from the latest research in behavioral 
                  science, including the work of BJ Fogg, James Clear, and CBT principles.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-heading-md text-teal mb-6">6-Step Implementation Framework</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {implementationSteps.map((item) => (
                <div 
                  key={item.step}
                  className="card-bordered p-4"
                  data-testid={`card-step-${item.step}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--glp-sage-10)', color: 'var(--glp-sage-deep)' }}>
                      {item.step}
                    </span>
                    <h3 className="font-semibold" style={{ color: 'var(--glp-ink)' }}>{item.title}</h3>
                  </div>
                  <p className="text-sm ml-11" style={{ color: 'var(--glp-sage)' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Behavior change modules">
            {behaviorModules.map(module => {
              const ModuleIcon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={selectedModule.id === module.id 
                    ? { background: 'var(--glp-sage-deep)', color: 'var(--glp-paper)' }
                    : { background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)', color: 'var(--glp-ink)' }}
                  data-testid={`button-module-${module.id}`}
                  id={`tab-${module.id}`}
                  role="tab"
                  aria-selected={selectedModule.id === module.id}
                  aria-controls={`panel-${module.id}`}
                >
                  <ModuleIcon className="h-4 w-4 inline mr-2" aria-hidden="true" />
                  {module.title}
                </button>
              );
            })}
          </div>

          <div className="card-bordered mb-8" style={selectedModule.bgColorStyle} role="tabpanel" id={`panel-${selectedModule.id}`} aria-labelledby={`tab-${selectedModule.id}`}>
            <div className="flex items-center gap-3 mb-4">
              {(() => { const SelectedIcon = selectedModule.icon; return <SelectedIcon className="h-8 w-8" style={selectedModule.colorStyle} aria-hidden="true" />; })()}
              <h2 className="text-heading-lg" style={{ color: 'var(--glp-ink)' }}>{selectedModule.title}</h2>
            </div>
            
            <p className="mb-6" style={{ color: 'var(--glp-ink)', opacity: 0.8 }}>{selectedModule.content.overview}</p>

            <div className="space-y-6">
              {selectedModule.content.keyPoints.map((point, index) => (
                <div 
                  key={index}
                  className="rounded-xl p-5"
                  style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
                >
                  <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
                    <CheckCircle2 className="h-5 w-5" style={selectedModule.colorStyle} />
                    {point.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--glp-sage)' }}>{point.description}</p>
                  <div className="rounded-lg p-4" style={selectedModule.bgColorStyle}>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--glp-sage)' }}>Example:</p>
                    <p className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.8 }}>{point.example}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl p-5" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
                <ArrowRight className="h-5 w-5" style={selectedModule.colorStyle} />
                Action Steps
              </h3>
              <ol className="space-y-2">
                {selectedModule.content.actionSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm" style={{ color: 'var(--glp-sage)' }}>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium" style={{ ...selectedModule.bgColorStyle, ...selectedModule.colorStyle }}>
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
                <Award className="h-6 w-6" style={{ color: 'var(--glp-sage)' }} />
                <h3 className="text-heading-md text-teal">Healing Journeys</h3>
              </div>
              <p className="text-body-sm" style={{ color: 'var(--glp-sage)' }}>
                Structured multi-week programs to transform specific areas of your life
              </p>
            </Link>
            <Link href="/research" className="card-bordered hover:shadow-md transition-shadow" data-testid="link-research">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-6 w-6" style={{ color: 'var(--glp-sage-deep)' }} />
                <h3 className="text-heading-md text-teal">Research & Evidence</h3>
              </div>
              <p className="text-body-sm" style={{ color: 'var(--glp-sage)' }}>
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

          <SafetyFooter variant="default" />
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
