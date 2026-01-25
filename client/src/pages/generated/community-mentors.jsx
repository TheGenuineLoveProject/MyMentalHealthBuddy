// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CommunityMentorsPage() {
  const benefits = pickBenefits(["connection", "clarity", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Connect with experienced community members who offer guidance and support.",
    why: "Learning from those further along can accelerate growth and prevent missteps.",
    who: "Anyone wanting guidance from more experienced practitioners.",
    when: "When you're ready for mentorship or have questions for experienced members.",
    where: "Mentor connections happen in the community.",
    how: "Browse mentor profiles. Request a connection. Learn from their experience."
  };

  const examples = [
    { level: "Beginner", label: "Find a Mentor", description: "Connect with someone who can guide your early journey." },
    { level: "Intermediate", label: "Mentorship Sessions", description: "Scheduled conversations with your mentor." },
    { level: "Advanced", label: "Become a Mentor", description: "Share your experience to help others." }
  ];

  return (
    <>
      <SEO
        title="Community Mentors | The Genuine Love Project"
        description="Learn from those ahead on the path - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Community Mentors"
        subtitle="Learn from those ahead on the path"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Mentorship accelerates growth. Connect with those who've walked the path before you.
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
