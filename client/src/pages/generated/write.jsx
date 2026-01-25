// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WritePage() {
  const benefits = pickBenefits(["agency", "connection", "clarity", "selfRespect"], 4);
  
  const clarity = {
    what: "A space to write, journal, and optionally share your thoughts with the community.",
    why: "Writing clarifies thought. Sharing creates connection. Both support healing.",
    who: "Anyone wanting to process through writing or share their experience with others.",
    when: "When thoughts need organizing, when you want to be heard, or as regular practice.",
    where: "A quiet space for writing. Sharing is always optional.",
    how: "Write freely. Edit if desired. Choose whether to keep private or share."
  };

  const examples = [
    { level: "Beginner", label: "Private Journal", description: "Write for yourself only. No audience, no pressure." },
    { level: "Intermediate", label: "Community Sharing", description: "Share reflections with the supportive community." },
    { level: "Advanced", label: "Story Contribution", description: "Contribute your healing story to inspire others on similar paths." }
  ];

  return (
    <>
      <SEO
        title="Write & Express | The Genuine Love Project"
        description="Share your thoughts and experiences - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Write & Express"
        subtitle="Share your thoughts and experiences"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your words have power. Write for yourself first, share only if it feels right.
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
