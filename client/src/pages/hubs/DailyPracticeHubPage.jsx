/**
 * @file DailyPracticeHubPage.jsx
 * Daily Practice Hub Page
 * Topic hub for daily wellness routines and practices
 */

import { Link } from "wouter";
import { Sun, Calendar, Sparkles, Heart, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const DAILY_RESOURCES = [
  {
    title: "Daily Routines",
    description: "Build sustainable habits",
    href: "/daily-routines",
    icon: Sun
  },
  {
    title: "Daily Wisdom",
    description: "Inspiration for each day",
    href: "/daily-wisdom",
    icon: Sparkles
  },
  {
    title: "Mood Check-in",
    description: "Track how you're feeling",
    href: "/mood",
    icon: Heart
  },
  {
    title: "Progress Tracking",
    description: "See your growth over time",
    href: "/progress",
    icon: Calendar
  }
];

export default function DailyPracticeHubPage() {
  return (
    <>
    <SEO 
      title="Daily Practice Hub | The Genuine Love Project"
      description="Build sustainable daily wellness practices. Routines, mood tracking, and daily inspiration for consistent self-care."
    />
    <WellnessPageShell
      title="Daily Practice Hub"
      subtitle="Small steps, lasting change"
      benefits={pickBenefits(["agency", "meaning", "clarity", "agency"], 4)}
      clarity={{
        what: "Tools for building and maintaining daily wellness practices.",
        why: "Consistency matters more than intensity. Small steps add up.",
        how: "Choose one small practice. Do it for just one day at a time."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {DAILY_RESOURCES.map((resource) => {
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
          quote="Every day is a new beginning. Start where you are."
          microTool="What is one small thing you can do for yourself today?"
          action="One daily intention"
          category="Daily Practice"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
