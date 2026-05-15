/**
 * @file SelfDiscoveryHubPage.jsx
 * Self-Discovery Hub Page
 * Topic hub for personal exploration and identity
 */

import { Link } from "wouter";
import { Compass, Heart, Eye, Sparkles, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const DISCOVERY_RESOURCES = [
  {
    title: "Values Finder",
    description: "Discover what matters",
    href: "/values-finder",
    icon: Compass
  },
  {
    title: "Self-Worth Reflection",
    description: "Reconnect with your value",
    href: "/self-worth-reflection",
    icon: Heart
  },
  {
    title: "Self-Awareness",
    description: "Know yourself deeply",
    href: "/hubs/self-awareness",
    icon: Eye
  },
  {
    title: "12 Steps of Genuine Love",
    description: "The transformation path",
    href: "/twelve-steps",
    icon: Sparkles
  }
];

export default function SelfDiscoveryHubPage() {
  return (
    <>
    <SEO 
      title="Self-Discovery Hub | The Genuine Love Project"
      description="Explore who you are. Tools for discovering your values, identity, and authentic self."
    />
    <WellnessPageShell
      title="Self-Discovery Hub"
      subtitle="Explore who you truly are"
      benefits={pickBenefits(["agency", "meaning", "privacy", "clarity"], 4)}
      clarity={{
        what: "Resources for exploring your identity and authentic self.",
        why: "You can't be yourself if you don't know yourself.",
        how: "Approach yourself with curiosity, not judgment."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {DISCOVERY_RESOURCES.map((resource) => {
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
          quote="The greatest journey is the journey within."
          microTool="What is one thing about yourself you'd like to understand better?"
          action="One curiosity named"
          category="Self-Discovery"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
