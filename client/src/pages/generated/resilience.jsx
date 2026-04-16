// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ResiliencePage() {
  const benefits = pickBenefits(["agency", "calm", "clarity", "selfRespect"], 4);
  
  const clarity = {
    what: "Practices that build your capacity to navigate challenges, recover from setbacks, and grow through difficulty.",
    why: "Life includes hardship. Resilience isn't about avoiding difficulty, but building your capacity to move through it.",
    who: "Anyone wanting to increase their ability to handle stress, change, and adversity.",
    when: "During stable periods (to build reserves) and after challenges (to recover and learn).",
    where: "Wherever life presents challenges—which is everywhere.",
    how: "Build on strengths. Learn from setbacks. Cultivate support networks. Practice recovery."
  };

  const examples = [
    { level: "Beginner", label: "Strengths Inventory", description: "Name your existing strengths. How have they helped you through past challenges?" },
    { level: "Intermediate", label: "Stress Inoculation", description: "Deliberately face small challenges to build confidence in your ability to handle difficulty." },
    { level: "Advanced", label: "Post-Traumatic Growth", description: "Work with a challenge you've faced. What growth has emerged from that difficulty?" }
  ];

  return (
    <>
      <SEO
        title="Resilience Building | MyMentalHealthBuddy"
        description="Strengthening your ability to bounce back - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Resilience Building"
        subtitle="Strengthening your ability to bounce back"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Resilience isn't about being tough. It's about being flexible, supported, and willing to learn from experience.
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
