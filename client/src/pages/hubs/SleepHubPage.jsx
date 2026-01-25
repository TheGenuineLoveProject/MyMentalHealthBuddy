/**
 * Sleep Hub Page
 * Topic hub for sleep-related wellness tools and resources
 */

import { Link } from "wouter";
import { Moon, Wind, Heart, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const SLEEP_RESOURCES = [
  {
    title: "Calming Scenes",
    description: "Gentle visualizations for peaceful rest",
    href: "/calming-scenes",
    icon: Moon
  },
  {
    title: "Evening Wind-Down",
    description: "Transition rituals for restful nights",
    href: "/rituals",
    icon: Wind
  },
  {
    title: "Nervous System Calming",
    description: "Body-based techniques for settling",
    href: "/nervous-system-flooding",
    icon: Heart
  },
  {
    title: "Meditation Guide",
    description: "Guided practices for relaxation",
    href: "/meditation-guide",
    icon: Sparkles
  }
];

export default function SleepHubPage() {
  return (
    <>
    <SEO 
      title="Sleep & Rest Hub | The Genuine Love Project"
      description="Gentle wellness tools for peaceful nights and restful sleep. Educational resources for building healthy sleep habits through calming practices."
    />
    <WellnessPageShell
      title="Sleep & Rest Hub"
      subtitle="Gentle tools for peaceful nights and restful sleep"
      benefits={pickBenefits(["Calm", "Safe space", "Your pace", "Clarity"], 4)}
      clarity={{
        what: "A collection of sleep-focused wellness tools",
        why: "To support healthy sleep habits through gentle practices",
        who: "For adults (18+) seeking educational sleep wellness resources"
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {SLEEP_RESOURCES.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/60 dark:border-indigo-800/40 hover:shadow-lg transition-all"
                data-testid={`link-sleep-${resource.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-800 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
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
          quote="Rest is not laziness. It's the foundation of everything you're building."
          microTool="Tonight, set a gentle alarm 30 minutes before your ideal bedtime."
          action="Put your phone in another room during your wind-down time."
          category="Sleep & Rest"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
