/**
 * @file SelfCareHubPage.jsx
 * Self-Care Hub Page
 * Topic hub for self-care practices and resources
 */

import { Link } from "wouter";
import { Heart, Moon, Sparkles, Sun, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const SELF_CARE_RESOURCES = [
  {
    title: "Daily Routines",
    description: "Build sustainable self-care habits",
    href: "/daily-routines",
    icon: Sun
  },
  {
    title: "Rest & Recovery",
    description: "Permission to pause and restore",
    href: "/hubs/sleep",
    icon: Moon
  },
  {
    title: "Body Wellness",
    description: "Physical self-care practices",
    href: "/body-wellness",
    icon: Heart
  },
  {
    title: "Daily Wisdom",
    description: "Gentle reminders for self-care",
    href: "/daily-wisdom",
    icon: Sparkles
  }
];

export default function SelfCareHubPage() {
  return (
    <>
    <SEO 
      title="Self-Care Hub | The Genuine Love Project"
      description="Educational tools for building sustainable self-care practices. Learn to prioritize your wellbeing through daily routines and gentle habits."
    />
    <WellnessPageShell
      title="Self-Care Hub"
      subtitle="Tools for prioritizing your wellbeing"
      benefits={pickBenefits(["Self-respect", "Your pace", "No pressure", "Agency"], 4)}
      clarity={{
        what: "Resources for building sustainable self-care practices.",
        why: "Self-care is not selfish. It's the foundation for everything else.",
        how: "Start with one small practice. Build from there."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {SELF_CARE_RESOURCES.map((resource) => {
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
          quote="Caring for yourself is not a luxury. It's a necessity."
          microTool="What is one small thing you can do for yourself today?"
          action="One act of self-care"
          category="Self-Care"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
