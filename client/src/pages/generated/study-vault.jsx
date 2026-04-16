// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function StudyVaultPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Summaries of research and evidence supporting our practices and recommendations.",
    why: "Understanding the 'why' behind practices increases trust and engagement.",
    who: "Anyone interested in the science and research behind wellness practices.",
    when: "When curious about evidence, or when skepticism arises.",
    where: "Read at your own pace during study time.",
    how: "Browse by practice area. Read summaries. Access original sources if desired."
  };

  const examples = [
    { level: "Beginner", label: "Quick Evidence Cards", description: "One-paragraph summaries of key research findings." },
    { level: "Intermediate", label: "Research Summaries", description: "More detailed breakdowns of studies and their implications." },
    { level: "Advanced", label: "Source Library", description: "Links to original research papers and academic sources." }
  ];

  return (
    <>
      <SEO
        title="Study Vault | MyMentalHealthBuddy"
        description="Research and evidence behind our approach - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Study Vault"
        subtitle="Research and evidence behind our approach"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            We believe in evidence-based practice. Here's the research supporting our approach.
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
