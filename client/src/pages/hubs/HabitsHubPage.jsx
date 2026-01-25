/**
 * @file HabitsHubPage.jsx
 * Habits Hub Page
 * Topic hub for building healthy habits and behavior change
 */

import { Link } from "wouter";
import { RefreshCw, Calendar, Target, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const HABITS_RESOURCES = [
  {
    title: "Behavior Change",
    description: "Science of building habits",
    href: "/behavior-change",
    icon: RefreshCw
  },
  {
    title: "Daily Routines",
    description: "Structure for success",
    href: "/daily-routines",
    icon: Calendar
  },
  {
    title: "Goals & Intentions",
    description: "Set meaningful targets",
    href: "/goals",
    icon: Target
  },
  {
    title: "Progress Tracking",
    description: "See your growth",
    href: "/progress",
    icon: Sparkles
  }
];

export default function HabitsHubPage() {
  return (
    <>
    <SEO 
      title="Healthy Habits Hub | The Genuine Love Project"
      description="Build sustainable healthy habits. Learn the science of behavior change, create daily routines, and track your progress."
    />
    <WellnessPageShell
      title="Healthy Habits Hub"
      subtitle="Build sustainable practices"
      benefits={pickBenefits(["Agency", "Your pace", "Clarity", "No pressure"], 4)}
      clarity={{
        what: "Resources for building and maintaining healthy habits.",
        why: "Small consistent actions create lasting change.",
        how: "Start with one tiny habit. Make it so easy you can't say no."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {HABITS_RESOURCES.map((resource) => {
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
          quote="You don't rise to your goals. You fall to the level of your habits."
          microTool="What is one 2-minute habit you could start today?"
          action="One tiny habit chosen"
          category="Habits"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
