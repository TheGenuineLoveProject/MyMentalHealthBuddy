/**
 * @file PresenceHubPage.jsx
 * Presence Hub Page
 * Topic hub for present moment awareness
 */

import { Link } from "wouter";
import { Sun, Eye, Wind, Anchor, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const PRESENCE_RESOURCES = [
  {
    title: "Mindfulness",
    description: "Present moment awareness",
    href: "/hubs/mindfulness",
    icon: Sun
  },
  {
    title: "Meditation Guide",
    description: "Cultivate presence",
    href: "/meditation-guide",
    icon: Eye
  },
  {
    title: "Breathing Exercises",
    description: "Anchor to now",
    href: "/breathing-exercises",
    icon: Wind
  },
  {
    title: "Grounding Techniques",
    description: "Return to the present",
    href: "/grounding-techniques",
    icon: Anchor
  }
];

export default function PresenceHubPage() {
  return (
    <>
    <SEO 
      title="Presence Hub | The Genuine Love Project"
      description="Cultivate present moment awareness. Mindfulness, meditation, and grounding practices for living in the now."
    />
    <WellnessPageShell
      title="Presence Hub"
      subtitle="Be here, now"
      benefits={pickBenefits(["calm", "clarity", "meaning", "agency"], 4)}
      clarity={{
        what: "Resources for cultivating present moment awareness.",
        why: "The present moment is the only moment that actually exists.",
        how: "Notice you're reading this. That's presence. You're already doing it."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {PRESENCE_RESOURCES.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg transition-all"
                data-testid={`link-hub-${resource.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors flex items-center gap-2">
                      {resource.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <InfinityHeartCard 
          quote="Be where you are, not where you think you should be."
          microTool="Feel your feet on the ground right now. That's presence."
          action="One grounded moment"
          category="Presence"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
