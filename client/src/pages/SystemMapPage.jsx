import { useState } from "react";
import { Link } from "wouter";
import {
  Heart, Brain, Smile, Zap, Leaf, Compass,
  ChevronRight, ArrowRight
} from "lucide-react";
import { SEO } from "@/components/SEO";
import PageTemplate from "@/components/PageTemplate";
import BenefitsBlock from "@/components/BenefitsBlock";
import SafetyFooter from "@/components/ui/SafetyFooter";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { CrisisNotice } from "@/components/PersistentDisclaimer";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const SYSTEM_LEVERS = [
  {
    id: "body",
    name: "Body",
    icon: Heart,
    color: "rose",
    description: "Sleep, food, movement, breath",
    tools: ["/tools/breath", "/check-in"],
    tinyAction: "Drink water or take 3 slow breaths",
  },
  {
    id: "mind",
    name: "Mind",
    icon: Brain,
    color: "sage",
    description: "Thoughts, attention, self-talk",
    tools: ["/tools/reframe", "/journal"],
    tinyAction: "Reframe one harsh thought into something gentler",
  },
  {
    id: "emotions",
    name: "Emotions",
    icon: Smile,
    color: "amber",
    description: "Signals, needs, regulation",
    tools: ["/mood", "/tracker"],
    tinyAction: "Name the feeling in 3 words or less",
  },
  {
    id: "behavior",
    name: "Behavior",
    icon: Zap,
    color: "purple",
    description: "Habits, skills, routines",
    tools: ["/tools", "/habits"],
    tinyAction: "Do a 2-minute version of what you're avoiding",
  },
  {
    id: "environment",
    name: "Environment",
    icon: Leaf,
    color: "teal",
    description: "People, space, time, stress",
    tools: ["/boundaries", "/support-map"],
    tinyAction: "Remove one source of friction or noise",
  },
  {
    id: "meaning",
    name: "Meaning",
    icon: Compass,
    color: "blue",
    description: "Values, identity, purpose",
    tools: ["/values", "/alignment-path"],
    tinyAction: "Name one value guiding your next decision",
  },
];

const EXAMPLES = [
  {
    level: "beginner",
    title: "Quick stabilization",
    situation: "I feel anxious and scattered.",
    action: "Body: drink water. Mind: reframe one sentence. Behavior: 60-second reset. Environment: reduce noise.",
    result: "A small stabilizing shift without needing to \"fix\" everything.",
  },
  {
    level: "intermediate",
    title: "Pattern interruption",
    situation: "I keep procrastinating on important tasks.",
    action: "Mind: identify the fear statement (\"I'll fail\"). Behavior: 2-minute start rule. Environment: remove one friction point. Meaning: connect to a value (\"integrity\").",
    result: "Behavior change without shame or pressure.",
  },
  {
    level: "advanced",
    title: "Relationship pattern",
    situation: "I notice a recurring relationship pattern I want to change.",
    action: "Emotions: name the unmet need. Environment: set a boundary. Meaning: clarify values around relationships. Behavior: practice a communication script.",
    result: "Pattern interruption through multiple system levers.",
  },
];

function LeverCard({ lever, isSelected, onSelect }) {
  const Icon = lever.icon;

  return (
    <button
      onClick={() => onSelect(lever.id)}
      className={`
        p-4 rounded-xl border text-left transition-all duration-200 w-full
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--${lever.color}-500))] focus-visible:ring-offset-2
        ${isSelected
          ? `bg-[hsl(var(--${lever.color}-100))] dark:bg-[hsl(var(--${lever.color}-800))] border-[hsl(var(--${lever.color}-400))] dark:border-[hsl(var(--${lever.color}-500))]`
          : `bg-background dark:bg-[hsl(var(--gray-900))] border-[hsl(var(--gray-200))] dark:border-[hsl(var(--gray-700))] hover:border-[hsl(var(--${lever.color}-300))]`
        }
      `}
      aria-pressed={isSelected}
      data-testid={`button-lever-${lever.id}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(var(--${lever.color}-100))] dark:bg-[hsl(var(--${lever.color}-800))]`}
          aria-hidden="true"
        >
          <Icon className={`w-5 h-5 text-[hsl(var(--${lever.color}-600))] dark:text-[hsl(var(--${lever.color}-300))]`} />
        </div>
        <div>
          <h3 className="font-semibold text-foreground" data-testid={`text-lever-name-${lever.id}`}>
            {lever.name}
          </h3>
          <p className="text-xs text-muted-foreground" data-testid={`text-lever-desc-${lever.id}`}>
            {lever.description}
          </p>
        </div>
      </div>
    </button>
  );
}

function SelectedLeverDetail({ lever }) {
  if (!lever) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="System Map — The Genuine Love Project" description="Visual overview of wellness connections." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">System Map</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );

  const Icon = lever.icon;

  return (
    <div
      className={`p-6 rounded-2xl border bg-[hsl(var(--${lever.color}-50))] dark:bg-[hsl(var(--${lever.color}-900))] border-[hsl(var(--${lever.color}-200))] dark:border-[hsl(var(--${lever.color}-700))]`}
      data-testid="section-lever-detail"
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-6 h-6 text-[hsl(var(--${lever.color}-600))] dark:text-[hsl(var(--${lever.color}-300))]`} />
        <h3 className="text-lg font-semibold text-foreground">
          {lever.name} Lever
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tiny action (30 seconds)
          </span>
          <p className="text-sm text-foreground mt-1" data-testid="text-lever-action">
            {lever.tinyAction}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Related tools
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {lever.tools.map((tool) => (
              <Link
                key={tool}
                href={tool}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1
                  bg-[hsl(var(--${lever.color}-100))] dark:bg-[hsl(var(--${lever.color}-800))]
                  text-[hsl(var(--${lever.color}-700))] dark:text-[hsl(var(--${lever.color}-200))]
                  hover:bg-[hsl(var(--${lever.color}-200))] dark:hover:bg-[hsl(var(--${lever.color}-700))]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--${lever.color}-500))] focus-visible:ring-offset-2
                `}
                data-testid={`link-tool-${tool.replace(/\//g, '-')}`}
              >
                {tool.replace(/^\//, '').replace(/-/g, ' ')}
                <ChevronRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 italic">
        Pause or stop anytime—only do what feels safe.
      </p>
    </div>
  );
}

export default function SystemMapPage() {
  const [selectedLeverId, setSelectedLeverId] = useState(null);
  const selectedLever = SYSTEM_LEVERS.find((l) => l.id === selectedLeverId);

  return (
    <WellnessPageShell
      title="System Map"
      subtitle="Understand how life areas work together"
      benefits={pickBenefits(["agency","clarity","clarity"], 3)}
      clarity={{
        what: "Interactive map of 6 life areas.",
        why: "To understand how body, mind, emotions, behavior, environment, and meaning work together.",
        who: "For adults exploring personal growth.",
        when: "When you want to shift something in your life.",
        where: "Right here.",
        how: "Select a lever to learn more and find small steps."
      }}
      examples={[]}
    >
    <SEO title="System Map — The Genuine Love Project" description="Understand how body, mind, emotions, behavior, environment, and meaning work together—and choose one lever to shift." />
    <PageTemplate
      title="The Genuine Love System Map"
      description="Understand how body, mind, emotions, behavior, environment, and meaning work together—and choose one lever to shift."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <BenefitsBlock
          benefits={[
            "See how 6 life areas work together",
            "Choose one small lever to shift today",
            "No pressure to change everything at once"
          ]}
          control="Pause or stop anytime—only do what feels safe."
          crisisLink="/crisis"
        />

        <ClarityCard
          what="A systems view showing how 6 life areas interact—so you can change one thing and see ripple effects."
          who="Anyone who feels stuck, overwhelmed, or unsure where to start."
          when="When you want to make a change but don't know which lever to pull."
          why="Small shifts in one area often create positive changes in others."
          howSteps={[
            "Review the 6 system levers below",
            "Choose one that feels accessible right now",
            "Do the tiny action (30 seconds or less)"
          ]}
          whereLinkText="You're already here"
          whereHref={null}
        />

        <section aria-labelledby="levers-heading" data-testid="section-levers">
          <h2
            id="levers-heading"
            className="text-xl font-semibold text-foreground mb-4"
          >
            The 6 System Levers
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Every outcome is influenced by these 6 interacting parts. Choose one to explore.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6" data-testid="grid-levers">
            {SYSTEM_LEVERS.map((lever) => (
              <LeverCard
                key={lever.id}
                lever={lever}
                isSelected={selectedLeverId === lever.id}
                onSelect={setSelectedLeverId}
              />
            ))}
          </div>

          {selectedLever && <SelectedLeverDetail lever={selectedLever} />}
        </section>

        <ExamplesAccordion
          title="See how this works in real situations"
          examples={EXAMPLES}
        />

        <div className="p-4 rounded-xl bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))] border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))]">
          <p className="text-sm text-foreground mb-3">
            <strong>Remember:</strong> You don't need to change everything. One small shift in one lever 
            can create positive ripples across your whole system.
          </p>
          <Link
            href="/alignment-path"
            className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sage-500))] focus-visible:ring-offset-2 rounded"
            data-testid="link-alignment-path"
          >
            Explore the 12-Phase Self-Alignment Path
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <CrisisNotice />
        <SafetyFooter className="mt-8" />
      </div>
    </PageTemplate>
  </WellnessPageShell>
  );
}
