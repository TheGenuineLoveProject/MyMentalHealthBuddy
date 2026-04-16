// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function HealthPage() {
  const benefits = pickBenefits(["clarity", "calm", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Real-time monitoring of platform health and performance.",
    why: "Monitoring ensures reliable service and quick issue resolution.",
    who: "System administrators and support staff.",
    when: "For ongoing monitoring and troubleshooting.",
    where: "Health monitoring dashboard.",
    how: "Review metrics. Respond to alerts. Maintain system health."
  };

  const examples = [
    { level: "Beginner", label: "Status Overview", description: "Quick view of overall system health." },
    { level: "Intermediate", label: "Performance Metrics", description: "Detailed performance data and trends." },
    { level: "Advanced", label: "Diagnostics", description: "Deep diagnostic tools for troubleshooting." }
  ];

  return (
    <>
      <SEO
        title="System Health | MyMentalHealthBuddy"
        description="Platform status and monitoring - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="System Health"
        subtitle="Platform status and monitoring"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            System health monitoring for operational excellence.
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
