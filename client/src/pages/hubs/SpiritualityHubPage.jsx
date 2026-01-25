/**
 * @file SpiritualityHubPage.jsx
 * Spirituality Hub Page
 * Topic hub for spiritual exploration (secular/non-religious)
 */

import { Link } from "wouter";
import { Sparkles, Heart, Sun, Feather, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const SPIRITUALITY_RESOURCES = [
  {
    title: "Wisdom Practices",
    description: "Timeless contemplation",
    href: "/wisdom-practices",
    icon: Sparkles
  },
  {
    title: "Gratitude",
    description: "Sacred appreciation",
    href: "/hubs/gratitude",
    icon: Heart
  },
  {
    title: "Daily Wisdom",
    description: "Daily reflections",
    href: "/daily-wisdom",
    icon: Sun
  },
  {
    title: "Journaling",
    description: "Soul exploration",
    href: "/hubs/journaling",
    icon: Feather
  }
];

export default function SpiritualityHubPage() {
  return (
    <>
    <SEO 
      title="Spirituality Hub | The Genuine Love Project"
      description="Explore spirituality in a secular, non-religious way. Wisdom practices, gratitude, and contemplation for inner connection."
    />
    <WellnessPageShell
      title="Spirituality Hub"
      subtitle="Connect with something greater"
      benefits={pickBenefits(["Your pace", "Agency", "No judgment", "Safe space"], 4)}
      clarity={{
        what: "Resources for spiritual exploration without religious attachment.",
        why: "Spirituality is about connection—to self, others, and meaning.",
        how: "Start with curiosity. No beliefs required."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 mb-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p className="text-sm text-purple-800 dark:text-purple-200">
            <strong>Note:</strong> This section is secular and non-religious. It's about exploring meaning, 
            connection, and inner wisdom in whatever way resonates with you.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {SPIRITUALITY_RESOURCES.map((resource) => {
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
          quote="Spirituality is not about beliefs. It's about connection and meaning."
          microTool="Pause. Breathe. Feel connected to this moment."
          action="One moment of connection"
          category="Spirituality"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
