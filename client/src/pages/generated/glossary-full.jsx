// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function GlossaryFullPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "The full, searchable glossary of all terms and concepts used on the platform.",
    why: "Complete reference ensures you can always find what you need.",
    who: "Anyone wanting comprehensive access to all term definitions.",
    when: "For thorough study or when the quick glossary isn't enough.",
    where: "Reference anytime during learning or practice.",
    how: "Search, browse, or use alphabetical navigation."
  };

  const examples = [
    { level: "Beginner", label: "Alphabetical Browse", description: "Browse all terms organized A-Z." },
    { level: "Intermediate", label: "Category View", description: "Terms organized by topic area." },
    { level: "Advanced", label: "Connected Concepts", description: "See how terms relate to each other." }
  ];

  return (
    <>
      <SEO
        title="Complete Glossary | The Genuine Love Project"
        description="Comprehensive term reference - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Complete Glossary"
        subtitle="Comprehensive term reference"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Every term we use, defined and explained. Your complete reference.
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
