// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WisdomSynthesisPage() {
  const benefits = pickBenefits(["clarity", "connection", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "The practice of finding common threads and complementary insights across different wisdom traditions.",
    why: "No single tradition has all the answers. Synthesis reveals deeper patterns and broader understanding.",
    who: "Those interested in comparative wisdom, interfaith understanding, or integrative approaches.",
    when: "During study, when facing complex questions, or when seeking a broader perspective.",
    where: "In study, discussion, or contemplative reflection.",
    how: "Learn multiple perspectives. Look for commonalities. Honor differences. Integrate what serves your growth."
  };

  const examples = [
    { level: "Beginner", label: "Theme Comparison", description: "Choose one theme (compassion, suffering, purpose). See how 2-3 traditions address it." },
    { level: "Intermediate", label: "Practice Integration", description: "Combine practices from different sources that complement each other in your daily routine." },
    { level: "Advanced", label: "Personal Philosophy", description: "Articulate your own integrated worldview, drawing from multiple sources with intellectual honesty." }
  ];

  return (
    <>
      <SEO
        title="Wisdom Synthesis | The Genuine Love Project"
        description="Integrating insights across traditions - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wisdom Synthesis"
        subtitle="Integrating insights across traditions"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Synthesis isn't about blending everything together—it's about learning from many while staying grounded in truth.
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
