/**
 * BenefitsBlock.jsx
 * Explicit benefits component for every page
 * 
 * Answers:
 * 1. What this gives me
 * 2. How long it takes
 * 3. What I can stop
 * 4. What I'm not being promised
 */

import { Clock, Pause, Heart, Info } from 'lucide-react';
import { Link } from 'wouter';
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const variants = {
  minimal: {
    className: "text-sm text-[var(--neutral-600)] bg-[var(--cream-50)] rounded-lg p-4",
    showIcons: false
  },
  standard: {
    className: "bg-white border border-[var(--sage-200)] rounded-xl p-6 shadow-sm",
    showIcons: true
  },
  card: {
    className: "bg-gradient-to-br from-[var(--sage-50)] to-[var(--cream-50)] rounded-2xl p-6 shadow-md",
    showIcons: true
  }
};

export default function BenefitsBlock({
  benefit,
  benefits,
  duration = "30–90 seconds",
  control = "Pause or stop anytime",
  disclaimer = "Educational wellness support only",
  crisisLink,
  variant = "standard",
  className = ""
}) {
  const style = variants[variant] || variants.standard;
  
  const benefitContent = benefits && benefits.length > 0 
    ? benefits.join(" • ") 
    : (benefit || "Clarity, calm, and one next step");

  if (variant === 'minimal') {
    return (
      <div 
        className={`${style.className} ${className}`}
        data-testid="benefits-block-minimal"
        role="complementary"
        aria-label="What to expect"
      >
        <p>
          <strong>What you'll get:</strong> {benefitContent} · <strong>Time:</strong> {duration} · <strong>Control:</strong> {control}
        </p>
        <p className="text-xs text-[var(--neutral-500)] mt-1">
          Note: {disclaimer}{crisisLink && (
            <> <Link href={crisisLink} className="text-[var(--teal-600)] hover:underline font-medium">/crisis</Link>.</>
          )}
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`${style.className} ${className}`}
      data-testid="benefits-block"
      role="complementary"
      aria-label="What to expect from this practice"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          {style.showIcons && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--sage-100)] flex items-center justify-center">
              <Heart className="w-4 h-4 text-[var(--sage-600)]" aria-hidden="true" />
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wide">
              What you'll get
            </p>
            <p className="text-sm text-[var(--neutral-700)] font-medium">
              {benefitContent}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          {style.showIcons && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--teal-100)] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[var(--teal-600)]" aria-hidden="true" />
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wide">
              Time
            </p>
            <p className="text-sm text-[var(--neutral-700)] font-medium">
              {duration}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          {style.showIcons && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--amber-100)] flex items-center justify-center">
              <Pause className="w-4 h-4 text-[var(--amber-600)]" aria-hidden="true" />
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wide">
              Control
            </p>
            <p className="text-sm text-[var(--neutral-700)] font-medium">
              {control}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          {style.showIcons && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--neutral-100)] flex items-center justify-center">
              <Info className="w-4 h-4 text-[var(--neutral-500)]" aria-hidden="true" />
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wide">
              Note
            </p>
            <p className="text-sm text-[var(--neutral-600)]">
              {disclaimer}{crisisLink && (
                <> <Link href={crisisLink} className="text-[var(--teal-600)] hover:underline font-medium">/crisis</Link>.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickBenefits({ items = [], className = "" }) {
  if (!items.length) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Benefits Block — The Genuine Love Project" description="Explore benefits block tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Benefits Block</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );

  return (
    <ul 
      className={`flex flex-wrap gap-2 ${className}`}
      data-testid="quick-benefits"
      aria-label="Quick benefits"
    >
      {items.map((item, index) => (
        <li 
          key={index}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--sage-50)] text-[var(--sage-700)] text-sm rounded-full"
        >
          <span className="w-1 h-1 rounded-full bg-[var(--sage-500)]" aria-hidden="true"></span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export const benefitsPresets = {
  reflection: {
    benefit: "Clarity about your thoughts and feelings",
    duration: "2–5 minutes",
    control: "Write as much or as little as you'd like",
    disclaimer: "Self-reflection tool, not therapy"
  },
  grounding: {
    benefit: "Calm, presence, nervous system regulation",
    duration: "30 seconds – 3 minutes",
    control: "Stop or pause anytime",
    disclaimer: "Educational support only"
  },
  journaling: {
    benefit: "Insight, processing, emotional release",
    duration: "5–15 minutes",
    control: "Your pace, your depth",
    disclaimer: "Not a substitute for professional support"
  },
  breathwork: {
    benefit: "Calm, focus, nervous system reset",
    duration: "1–5 minutes",
    control: "Adjust pace to your comfort",
    disclaimer: "Stop if you feel dizzy or unwell"
  },
  meditation: {
    benefit: "Peace, presence, mental clarity",
    duration: "3–10 minutes",
    control: "End early if needed",
    disclaimer: "Educational mindfulness practice"
  },
  challenge: {
    benefit: "Growth, skill-building, small wins",
    duration: "5–10 minutes daily",
    control: "Skip any day without judgment",
    disclaimer: "Progress looks different for everyone"
  }
};
