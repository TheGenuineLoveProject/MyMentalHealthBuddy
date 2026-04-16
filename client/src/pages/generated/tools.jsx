// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ToolsPage() {
  const benefits = pickBenefits(["agency", "clarity", "calm", "selfRespect"], 4);
  
  const clarity = {
    what: "A curated collection of evidence-based tools for emotional regulation, self-care, and personal growth.",
    why: "Having the right tools available when you need them makes self-care more accessible and effective.",
    who: "Anyone building a personal wellness practice or seeking new resources.",
    when: "Browse when calm to learn new tools. Use specific tools when facing challenges.",
    where: "Available on any device, whenever you need support.",
    how: "Explore different categories. Try tools that resonate. Add favorites to your daily practice."
  };

  const examples = [
    { level: "Beginner", label: "Quick Calm Tools", description: "5-minute exercises for immediate stress relief and nervous system regulation." },
    { level: "Intermediate", label: "Reflection Practices", description: "Journaling prompts, thought work exercises, and self-inquiry tools." },
    { level: "Advanced", label: "Deep Work Sessions", description: "Extended practices for processing emotions, examining patterns, and catalyzing growth." }
  ];

  return (
    <>
      <SEO
        title="Wellness Tools | MyMentalHealthBuddy"
        description="Your complete toolkit for emotional wellbeing - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wellness Tools"
        subtitle="Your complete toolkit for emotional wellbeing"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            This toolkit grows with you. Start with what feels accessible. Return to discover new tools as you're ready.
          </p>
          <p className="text-sm opacity-70 mt-6">
            Adults 18+ only. Educational wellness tools, not medical care or mental health treatment.
            You may pause or stop at any time.
          </p>
        </div>
      </WellnessPageShell>
    </>
  );
}
