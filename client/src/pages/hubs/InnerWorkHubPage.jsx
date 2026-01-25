/**
 * @file InnerWorkHubPage.jsx
 * Inner Work Hub Page
 * Topic hub for deep inner work and self-discovery resources
 */

import { Link } from "wouter";
import { Heart, Eye, Feather, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const INNER_WORK_RESOURCES = [
  {
    title: "Inner Child Work",
    description: "Reconnect with your younger self",
    href: "/inner-child",
    icon: Heart
  },
  {
    title: "Self-Reflection",
    description: "Deep inquiry into your patterns",
    href: "/reflection",
    icon: Eye
  },
  {
    title: "Guided Journaling",
    description: "Write your way to clarity",
    href: "/guided-journaling",
    icon: Feather
  },
  {
    title: "Values Discovery",
    description: "Understand what truly matters",
    href: "/values-finder",
    icon: Sparkles
  }
];

export default function InnerWorkHubPage() {
  return (
    <>
    <SEO 
      title="Inner Work Hub | The Genuine Love Project"
      description="Resources for deep inner work and self-discovery. Explore inner child healing, self-reflection, journaling, and values discovery."
    />
    <WellnessPageShell
      title="Inner Work Hub"
      subtitle="Tools for deep self-discovery"
      benefits={pickBenefits(["clarity", "calm", "meaning", "selfRespect"], 4)}
      clarity={{
        what: "Resources for deep inner work and self-discovery.",
        why: "Understanding yourself is the foundation of genuine change.",
        how: "Go gently. Inner work takes time and patience."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {INNER_WORK_RESOURCES.map((resource) => {
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
          quote="The answers you seek are already within you."
          microTool="Ask yourself: What am I ready to understand about myself today?"
          action="One question inward"
          category="Inner Work"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
