/**
 * @file RelationshipsHubPage.jsx
 * Relationships Hub Page
 * Topic hub for healthy relationship tools and resources
 */

import { Link } from "wouter";
import { Users, Heart, MessageCircle, Shield, ArrowRight } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { InfinityHeartCard } from "@/components/share/InfinityHeartCard";
import SEO from "@/components/SEO";

const RELATIONSHIP_RESOURCES = [
  {
    title: "Boundaries Builder",
    description: "Learn to set limits with care and clarity",
    href: "/boundaries",
    icon: Shield
  },
  {
    title: "Communication Styles",
    description: "Understand different ways of connecting",
    href: "/communication",
    icon: MessageCircle
  },
  {
    title: "Attachment Patterns",
    description: "Explore how early bonds shape adult relationships",
    href: "/attachment",
    icon: Heart
  },
  {
    title: "Healthy Relating",
    description: "Build skills for authentic connection",
    href: "/relating",
    icon: Users
  }
];

export default function RelationshipsHubPage() {
  return (
    <>
    <SEO 
      title="Healthy Relationships Hub | The Genuine Love Project"
      description="Educational tools for building healthy relationships, setting boundaries, and developing authentic connection. Learn at your own pace."
    />
    <WellnessPageShell
      title="Healthy Relationships Hub"
      subtitle="Tools for building authentic connections"
      benefits={pickBenefits(["clarity", "agency", "selfRespect", "meaning"], 4)}
      clarity={{
        what: "Educational resources for understanding and improving your relationships.",
        why: "Healthy relationships start with understanding yourself and others.",
        how: "Explore these tools to learn about boundaries, communication, and connection."
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {RELATIONSHIP_RESOURCES.map((resource) => {
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
          quote="You deserve relationships that feel like home."
          microTool="Think of one person who makes you feel seen. Send them a kind thought."
          action="One kind thought"
          category="Relationships"
          className="mb-8"
        />

        <SafetyFooter />
      </div>
    </WellnessPageShell>
    </>
  );
}
