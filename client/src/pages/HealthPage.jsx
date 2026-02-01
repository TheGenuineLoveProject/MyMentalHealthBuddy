import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, XCircle, Loader2, Activity } from "lucide-react";
import SEO from "../components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { MIPromptCard } from "@/components/mi/MIPromptCard";

export default function HealthPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/health"],
  });

  return (
  <WellnessPageShell
    title="HealthPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <>
      <SEO 
        title="Health Check - The Genuine Love Project"
        description="System health status and diagnostics."
      />
      <div className="min-h-screen hero-gradient p-6">
        <div className="max-w-lg mx-auto">
          <header className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition mb-6" 
              data-testid="link-back"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <div className="icon-container icon-lg icon-gradient-sage">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-heading-xl text-teal" data-testid="text-title">Health Check</h1>
                <p className="text-body-sm">System status and diagnostics</p>
              </div>
            </div>
          </header>

          <div className="card-bordered" data-testid="section-health">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="icon-container icon-lg icon-soft-teal mb-4">
                  <Loader2 className="w-6 h-6 animate-spin motion-reduce:animate-none" />
                </div>
                <p className="text-body-sm">Checking system health...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="icon-container icon-lg icon-soft-blush mb-4">
                  <XCircle className="w-6 h-6" />
                </div>
                <p className="text-heading-sm text-[var(--blush-600)]">Health check failed</p>
                <p className="text-body-sm mt-2">{error.message || "Unable to connect to server"}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)]">
                  <div className="icon-container icon-md icon-soft-sage">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-heading-sm text-teal">System Status</p>
                    <p className="text-body-sm text-[var(--sage-600)]">{data?.status || "Unknown"}</p>
                  </div>
                </div>
                <div className="p-4 bg-[var(--sage-50)] rounded-xl border border-[var(--sage-200)]">
                  <p className="text-eyebrow text-[var(--sage-500)] mb-2">Raw Response</p>
                  <pre className="text-caption font-mono overflow-x-auto" data-testid="text-health-data">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <MIPromptCard context="general" className="mt-8" />
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
