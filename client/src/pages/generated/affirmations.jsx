// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AffirmationsPage() {
  const benefits = pickBenefits(["selfRespect", "agency", "connection", "calm"], 4);
  
  const clarity = {
    what: "Short, positive statements that help rewire thought patterns and build self-compassion over time.",
    why: "Our inner dialogue shapes how we feel. Affirmations offer a gentle alternative to self-criticism.",
    who: "Anyone working on self-esteem, healing from harsh self-talk, or wanting daily encouragement.",
    when: "Morning routines, before challenges, after setbacks, or whenever you need a reminder of your worth.",
    where: "Anywhere you can speak or think quietly—mirror, journal, or in your mind during commutes.",
    how: "Choose 1-3 affirmations that feel true-ish. Repeat them daily. It's okay if they feel awkward at first."
  };

  const examples = [
    { level: "Beginner", label: "I Am Enough", description: "A simple reminder: 'I am enough, exactly as I am right now.'" },
    { level: "Intermediate", label: "Growth Statements", description: "'I am learning and growing every day. My progress matters more than perfection.'" },
    { level: "Advanced", label: "Personalized Mantras", description: "Create affirmations specific to your challenges: 'I can handle difficult emotions. They are visitors, not residents.'" }
  ];

  return (
    <>
      <SEO
        title="Affirmation Practice | The Genuine Love Project"
        description="Kind words to strengthen your inner voice - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Affirmation Practice"
        subtitle="Kind words to strengthen your inner voice"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Affirmations work best when they feel believable. Start with statements that resonate, even if they're simple.
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
