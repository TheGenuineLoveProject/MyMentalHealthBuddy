/**
 * @file TwelvePracticesPage.jsx
 * 12 Practices for Mind–Body–Soul Transformation
 * Non-substance, non-religious educational framework
 */

import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Heart, Brain, Sun, Zap, ChevronRight, Sparkles, BookOpen } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import SEO from "@/components/SEO";
import { TWELVE_PRACTICES, PRACTICE_DOMAINS, getDailyPractice } from "@/content/paths/twelvePractices";

const DOMAIN_ICONS = {
  mind: Brain,
  body: Sun,
  soul: Heart,
  action: Zap,
};

function PracticeCard({ practice, isExpanded, onToggle }) {
  const Icon = DOMAIN_ICONS[practice.domain];

  return (
    <div 
      className={`rounded-xl border transition-all ${
        isExpanded 
          ? "border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-900/20" 
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 text-left"
        data-testid={`button-practice-${practice.number}`}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-800 text-rose-600 dark:text-rose-400">
          <span className="text-lg font-semibold">{practice.number}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {practice.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Icon className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {PRACTICE_DOMAINS[practice.domain].label}
            </span>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-800/70">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Why This Helps</h4>
            <p className="text-gray-800 dark:text-gray-200">{practice.whyItHelps}</p>
          </div>

          <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-800/70">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Reflection Prompt
            </h4>
            <p className="text-gray-800 dark:text-gray-200 italic">"{practice.reflectionPrompt}"</p>
          </div>

          <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-800/70">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Micro-Action
            </h4>
            <p className="text-gray-800 dark:text-gray-200">{practice.microAction}</p>
          </div>

          <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-800/70">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Journaling Template
            </h4>
            <p className="text-gray-800 dark:text-gray-200 font-mono text-sm">{practice.journalingTemplate}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TwelvePracticesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const dailyPractice = getDailyPractice();

  return (
    <>
      <SEO 
        title="12 Practices for Transformation | The Genuine Love Project"
        description="A non-religious framework for mind, body, and soul transformation. 12 practices for self-reflection, growth, and genuine change."
      />
      <WellnessPageShell
        title="12 Practices for Transformation"
        subtitle="A gentle path for mind, body, and soul growth"
        benefits={pickBenefits(["agency", "clarity", "meaning", "growth"], 4)}
        clarity={{
          what: "12 educational practices for personal reflection and growth.",
          who: "Anyone seeking sustainable transformation at their own pace.",
          when: "Whenever you're ready. Start with today's practice or explore all 12.",
          why: "Each practice builds on the last, creating sustainable transformation.",
          howSteps: ["Start anywhere", "Go at your own pace", "Complete the daily practice", "Journal your reflections"],
          whereLinkText: "Explore wellness tools",
          whereHref: "/tools"
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link 
            href="/tools" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tools
          </Link>

          <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-900/20 dark:to-amber-900/20 border border-rose-200/50 dark:border-rose-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-800">
                <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">Today's Practice</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Practice #{dailyPractice.number}: {dailyPractice.shortName}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{dailyPractice.whyItHelps}</p>
            <button
              onClick={() => setExpandedPractice(dailyPractice.number)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors"
              data-testid="button-explore-daily"
            >
              Explore This Practice
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">All 12 Practices</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click any practice to explore its reflection prompt, micro-action, and journaling template.
            </p>
          </div>

          <div className="grid gap-3">
            {TWELVE_PRACTICES.map((practice) => (
              <PracticeCard
                key={practice.number}
                practice={practice}
                isExpanded={expandedPractice === practice.number}
                onToggle={() => setExpandedPractice(
                  expandedPractice === practice.number ? null : practice.number
                )}
              />
            ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <strong>Note:</strong> These practices are educational tools for self-reflection.
              They are not therapy and not a substitute for professional support.
              Go gently. There's no rush.
            </p>
          </div>

          <SafetyFooter className="mt-8" />
        </div>
      </WellnessPageShell>
    </>
  );
}
