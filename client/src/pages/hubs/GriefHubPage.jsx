/**
 * @file GriefHubPage.jsx
 * Grief Hub Page
 * Topic hub for grief support and healing resources
 */

import { Link } from "wouter";
import { Heart, Feather, Moon, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const GRIEF_RESOURCES = [
  {
    title: "Healing Landing",
    description: "A gentle starting point for your healing journey",
    href: "/healing",
    icon: Heart
  },
  {
    title: "Gentle Journaling",
    description: "Process feelings at your own pace",
    href: "/guided-journaling",
    icon: Feather
  },
  {
    title: "Rest & Restoration",
    description: "Permission to pause and be gentle with yourself",
    href: "/rest",
    icon: Moon
  },
  {
    title: "Daily Wisdom",
    description: "Small comforts and gentle reminders",
    href: "/daily-wisdom",
    icon: Sparkles
  }
];

export default function GriefHubPage() {
  return (
    <>
    <SEO 
      title="Grief Support Hub | The Genuine Love Project"
      description="Gentle educational resources for navigating grief and loss. Find comfort, understanding, and tools for healing at your own pace."
    />
    <WellnessPageShell
      title="Grief Support Hub"
      subtitle="Gentle tools for navigating loss"
      benefits={pickBenefits(["calm", "meaning", "privacy", "connection"], 4)}
      clarity={{
        what: "A collection of gentle resources for those experiencing grief or loss.",
        why: "Grief is a natural response to loss. There is no wrong way to grieve.",
        how: "These tools are here when you need them. Take what helps, leave what doesn't."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {GRIEF_RESOURCES.map((resource) => {
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
          quote="Grief is love with nowhere to go. Let it flow gently."
          microTool="Place a hand on your heart. Breathe. You are allowed to feel."
          action="One breath of acknowledgment"
          category="Grief Support"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
