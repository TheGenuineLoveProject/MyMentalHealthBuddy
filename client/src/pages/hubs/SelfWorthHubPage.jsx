/**
 * Self-Worth Hub Page
 * Topic hub for self-worth and self-compassion resources
 */

import { Link } from "wouter";
import { Heart, Sparkles, Sun, Star, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";

const SELF_WORTH_RESOURCES = [
  {
    title: "Self-Worth Reflection",
    description: "Reclaim your sense of inherent value",
    href: "/self-worth-reflection",
    icon: Heart
  },
  {
    title: "Inner Child Work",
    description: "Nurture and heal your younger self",
    href: "/inner-child",
    icon: Sparkles
  },
  {
    title: "Daily Affirmations",
    description: "Gentle reminders of your worth",
    href: "/affirmations",
    icon: Sun
  },
  {
    title: "Identity Mirror",
    description: "Reflect on who you truly are",
    href: "/reflection",
    icon: Star
  }
];

export default function SelfWorthHubPage() {
  return (
    <WellnessPageShell
      title="Self-Worth Hub"
      subtitle="Gentle tools for building self-compassion and inherent value"
      benefits={pickBenefits(["Self-respect", "Dignity", "Clarity", "Safe space"], 4)}
      clarity={{
        what: "A collection of self-worth focused wellness tools",
        why: "To support healthy self-image through gentle practices",
        who: "For adults (18+) seeking educational self-compassion resources"
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {SELF_WORTH_RESOURCES.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="group p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-900/30 dark:to-amber-900/30 border border-rose-200/60 dark:border-rose-800/40 hover:shadow-lg transition-all"
                data-testid={`link-self-worth-${resource.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-800 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-2">
                      {resource.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <InfinityHeartCard
          quote="You are worthy not because of what you do, but because of who you are."
          microTool="Place your hand on your heart and say 'I am enough, just as I am.'"
          action="Write down one thing you appreciate about yourself today."
          category="Self-Worth"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
  );
}
