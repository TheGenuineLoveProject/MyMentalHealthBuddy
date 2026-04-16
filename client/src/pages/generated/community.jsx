// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CommunityPage() {
  const benefits = pickBenefits(["connection", "selfRespect", "agency", "clarity"], 4);
  
  const clarity = {
    what: "Our community space for connection, support, and shared growth.",
    why: "Healing and growth are often more powerful in community than isolation.",
    who: "Anyone wanting to connect with others on similar journeys.",
    when: "When you want support, connection, or to offer support to others.",
    where: "Our dedicated community spaces.",
    how: "Join conversations. Share when ready. Offer support where you can."
  };

  const examples = [
    { level: "Beginner", label: "Read & Listen", description: "Start by reading others' shares. No pressure to participate." },
    { level: "Intermediate", label: "Share & Connect", description: "Contribute your thoughts and connect with like-minded people." },
    { level: "Advanced", label: "Mentorship", description: "Offer guidance to those earlier in their journey." }
  ];

  return (
    <>
      <SEO
        title="Community Hub | MyMentalHealthBuddy"
        description="Growing together with others - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Community Hub"
        subtitle="Growing together with others"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            You're not alone. This community is here to support your journey.
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
