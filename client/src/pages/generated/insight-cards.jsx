// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function InsightCardsPage() {
  const benefits = pickBenefits(["clarity", "calm", "connection", "selfRespect"], 4);
  
  const clarity = {
    what: "Short, shareable cards with insights, affirmations, and wisdom snippets.",
    why: "Sometimes you need just one thought to shift your perspective.",
    who: "Anyone wanting quick inspiration or something to share.",
    when: "Daily inspiration, quick pick-me-ups, or when you want to share with others.",
    where: "View on any device, save favorites, share if desired.",
    how: "Browse, save your favorites, share what resonates."
  };

  const examples = [
    { level: "Beginner", label: "Daily Card", description: "One insight card each day for simple inspiration." },
    { level: "Intermediate", label: "Theme Collections", description: "Browse cards by theme: courage, compassion, boundaries, etc." },
    { level: "Advanced", label: "Create Your Own", description: "Design personal insight cards from your own wisdom." }
  ];

  return (
    <>
      <SEO
        title="Insight Cards | The Genuine Love Project"
        description="Wisdom in bite-sized form - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Insight Cards"
        subtitle="Wisdom in bite-sized form"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Big wisdom in small packages. Take what you need, share what helps.
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
