// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function DailyWisdomPage() {
  const benefits = pickBenefits(["clarity", "calm", "connection", "selfRespect"], 4);
  
  const clarity = {
    what: "A curated daily offering of wisdom, quotes, and reflections to inspire your day.",
    why: "Starting the day with wisdom sets a thoughtful tone and provides perspective.",
    who: "Anyone wanting daily inspiration and food for thought.",
    when: "Morning practice, or whenever you need a shift in perspective.",
    where: "Anywhere you can pause and reflect for a moment.",
    how: "Read the daily wisdom. Sit with it briefly. Let it inform your day."
  };

  const examples = [
    { level: "Beginner", label: "Daily Quote", description: "Read one piece of wisdom each morning. Let it simmer." },
    { level: "Intermediate", label: "Journal Response", description: "Write briefly about how today's wisdom applies to your life." },
    { level: "Advanced", label: "Wisdom Integration", description: "Look for opportunities to apply the day's wisdom in specific situations." }
  ];

  return (
    <>
      <SEO
        title="Daily Wisdom | The Genuine Love Project"
        description="A daily dose of insight - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Daily Wisdom"
        subtitle="A daily dose of insight"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Wisdom doesn't need to be complicated. Sometimes one sentence is enough.
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
