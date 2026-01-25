/**
 * @file WisdomHubPage.jsx
 * Wisdom Hub Page
 * Topic hub for timeless wisdom and insight
 */

import { Link } from "wouter";
import { BookOpen, Sparkles, Sun, Brain, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const WISDOM_RESOURCES = [
  {
    title: "Wisdom Practices",
    description: "Deep contemplation",
    href: "/wisdom-practices",
    icon: BookOpen
  },
  {
    title: "Daily Wisdom",
    description: "Daily reflections",
    href: "/daily-wisdom",
    icon: Sun
  },
  {
    title: "Wisdom Synthesis",
    description: "Integrate insights",
    href: "/wisdom-synthesis",
    icon: Sparkles
  },
  {
    title: "Study Vault",
    description: "Research and evidence",
    href: "/study-vault",
    icon: Brain
  }
];

export default function WisdomHubPage() {
  return (
    <>
    <SEO 
      title="Wisdom Hub | The Genuine Love Project"
      description="Access timeless wisdom and insights. Practices, daily reflections, and research for deeper understanding."
    />
    <WellnessPageShell
      title="Wisdom Hub"
      subtitle="Timeless insights for modern living"
      benefits={pickBenefits(["Clarity", "Your pace", "Agency", "No pressure"], 4)}
      clarity={{
        what: "Resources for accessing and integrating wisdom.",
        why: "Wisdom is knowledge applied with compassion.",
        how: "Read slowly. Reflect deeply. Apply gently."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {WISDOM_RESOURCES.map((resource) => {
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
          quote="Wisdom begins in wonder."
          microTool="What is one thing you've learned recently that shifted your perspective?"
          action="One wisdom recognized"
          category="Wisdom"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
