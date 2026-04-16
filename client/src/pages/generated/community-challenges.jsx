// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CommunityChallengesPage() {
  const benefits = pickBenefits(["connection", "agency", "selfRespect", "clarity"], 4);
  
  const clarity = {
    what: "Time-limited challenges where the community practices together.",
    why: "Shared challenges create accountability, connection, and collective energy.",
    who: "Anyone wanting to practice alongside others for motivation.",
    when: "Join challenges as they're offered throughout the year.",
    where: "Participate wherever you are, connected with the community.",
    how: "Join a challenge. Complete daily practices. Share your experience."
  };

  const examples = [
    { level: "Beginner", label: "7-Day Challenges", description: "Short, accessible challenges perfect for starting." },
    { level: "Intermediate", label: "21-Day Challenges", description: "Longer challenges for building habits." },
    { level: "Advanced", label: "90-Day Journeys", description: "Intensive transformation challenges." }
  ];

  return (
    <>
      <SEO
        title="Community Challenges | MyMentalHealthBuddy"
        description="Grow together through shared practice - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Community Challenges"
        subtitle="Grow together through shared practice"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Challenge yourself alongside others. Community makes the journey easier.
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
