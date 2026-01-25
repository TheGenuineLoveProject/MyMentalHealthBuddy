// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function GlossaryPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Definitions of terms, concepts, and practices used throughout the platform.",
    why: "Understanding the language helps you engage more fully with the material.",
    who: "Anyone encountering unfamiliar terms or wanting clearer understanding.",
    when: "When you encounter a term you don't know, or when reviewing concepts.",
    where: "Reference anytime for quick definitions.",
    how: "Search by term or browse alphabetically. Click through for deeper explanations."
  };

  const examples = [
    { level: "Beginner", label: "Quick Definitions", description: "One-sentence explanations of common terms." },
    { level: "Intermediate", label: "Concept Explanations", description: "More detailed explanations with examples." },
    { level: "Advanced", label: "Deep Dives", description: "Comprehensive explorations of complex concepts." }
  ];

  return (
    <>
      <SEO
        title="Wellness Glossary | The Genuine Love Project"
        description="Key terms defined - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wellness Glossary"
        subtitle="Key terms defined"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Language matters. Understanding these terms helps you navigate your journey.
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
