// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function MirrorPage() {
  const benefits = pickBenefits(["selfRespect", "connection", "agency", "calm"], 4);
  
  const clarity = {
    what: "The practice of looking at yourself in a mirror and speaking kindly, building self-acceptance.",
    why: "Many of us avoid truly seeing ourselves. Mirror work cultivates self-compassion and acceptance.",
    who: "Anyone working on self-image, self-criticism, or wanting to strengthen their relationship with themselves.",
    when: "Daily, even for just 30 seconds. Morning is common, but any time works.",
    where: "A mirror where you can see your face, in a private space.",
    how: "Look into your own eyes. Speak kindly. It may feel awkward at first—that's normal."
  };

  const examples = [
    { level: "Beginner", label: "Simple Greeting", description: "Look in the mirror and say 'Hello' or 'Good morning' to yourself. Notice how it feels." },
    { level: "Intermediate", label: "One Kind Thing", description: "Each day, tell your reflection one true, kind thing about yourself." },
    { level: "Advanced", label: "Eye Contact Meditation", description: "Spend 2-3 minutes looking into your own eyes without speaking. Just being present with yourself." }
  ];

  return (
    <>
      <SEO
        title="Mirror Work | The Genuine Love Project"
        description="Meeting yourself with compassion - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Mirror Work"
        subtitle="Meeting yourself with compassion"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Mirror work can feel vulnerable. Start gently. If it's too intense, you can practice with a photo instead.
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
