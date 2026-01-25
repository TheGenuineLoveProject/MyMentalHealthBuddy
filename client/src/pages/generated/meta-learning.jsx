// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function MetaLearningPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Techniques for improving how you learn, remember, and apply new information.",
    why: "The ability to learn effectively is a meta-skill that improves everything else you learn.",
    who: "Anyone wanting to learn faster, retain more, and apply knowledge more effectively.",
    when: "When starting new learning, or when current learning strategies aren't working.",
    where: "Any learning environment—reading, courses, or experiential learning.",
    how: "Learn about learning. Experiment with techniques. Track what works for you."
  };

  const examples = [
    { level: "Beginner", label: "Active Recall", description: "After learning, close the material and try to recall key points. Fill gaps, repeat." },
    { level: "Intermediate", label: "Spaced Repetition", description: "Review material at increasing intervals for long-term retention." },
    { level: "Advanced", label: "Teaching Others", description: "Explain what you've learned to others. Teaching reveals gaps and deepens understanding." }
  ];

  return (
    <>
      <SEO
        title="Meta-Learning | The Genuine Love Project"
        description="Learning how to learn better - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Meta-Learning"
        subtitle="Learning how to learn better"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Learning is a skill you can improve. Better learning strategies pay dividends for life.
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
