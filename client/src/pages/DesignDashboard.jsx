import { useState } from "react";
import { Link } from "wouter";
import { Activity, BookOpen, Sparkles, Heart, TrendingUp, ArrowRight, Palette } from "lucide-react";
import SEO from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function DesignDashboard() {
  const [tab, setTab] = useState("dashboard");

  return (
  <WellnessPageShell
    title="DesignDashboard"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
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
        title="Design Dashboard - The Genuine Love Project"
        description="Your wellness design hub - mood tracking, journaling, healing tools, and progress visualization."
      />
      
      <div className="min-h-screen hero-gradient">
        <header className="sticky top-0 z-10 bg-[var(--glp-paper)]/85 backdrop-blur-md border-b border-[var(--sage-200)]">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <Link href="/dashboard" className="text-caption hover:text-[var(--teal-600)] transition">
                The Genuine Love Project
              </Link>
              <h1 className="text-heading-lg text-teal">Design Dashboard</h1>
            </div>
            <div className="flex gap-3 items-center">
              <button 
                onClick={() => setTab("dashboard")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  tab === "dashboard" 
                    ? "bg-white border border-[var(--sage-300)] text-[var(--teal-700)] shadow-sm" 
                    : "text-[var(--sage-600)] hover:text-[var(--teal-700)]"
                }`}
                data-testid="button-tab-dashboard"
              >
                Dashboard
              </button>
              <button 
                onClick={() => setTab("design")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  tab === "design" 
                    ? "bg-gradient-to-r from-[var(--sage-600)] to-[var(--teal-600)] text-white shadow-md" 
                    : "bg-white border border-[var(--sage-200)] text-[var(--sage-700)] hover:border-[var(--sage-300)]"
                }`}
                data-testid="button-tab-design"
              >
                <span className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Design Tools
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          <section className="card-bordered mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-caption">Today's intention</p>
              <h2 className="text-heading-md text-teal mt-1">
                Slow down. Feel safe. Return to genuine love.
              </h2>
              <p className="text-body-sm mt-2">
                Your tools are organized below — quick actions, progress, and calm focus.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Mood Check-in", "Breathing", "Grounding", "Affirmation"].map((action) => (
                <button
                  key={action}
                  className="px-4 py-2 rounded-full bg-white border border-[var(--sage-200)] text-sm font-medium text-[var(--sage-700)] hover:border-[var(--sage-400)] hover:shadow-sm transition"
                  data-testid={`button-quick-${action.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {action}
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard 
              title="Mood Tracker" 
              subtitle="Quick check-in + trend"
              icon={Activity}
              iconVariant="blush"
            >
              <div className="flex gap-3 flex-wrap">
                <Metric label="Current" value="Calm" />
                <Metric label="Energy" value="Medium" />
                <Metric label="Stress" value="Low" />
              </div>
              <div className="border-t border-[var(--sage-200)] mt-4 pt-4">
                <Link href="/mood" className="btn-secondary w-full text-center flex items-center justify-center gap-2" data-testid="link-mood-tracker">
                  Open Mood Tracker <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard 
              title="Journal" 
              subtitle="Write, reflect, and release"
              icon={BookOpen}
              iconVariant="gold"
            >
              <p className="text-body-sm">
                A safe place to express thoughts, gratitude, and growth.
              </p>
              <div className="border-t border-[var(--sage-200)] mt-4 pt-4">
                <Link href="/journal" className="btn-primary w-full text-center flex items-center justify-center gap-2" data-testid="link-journal">
                  Write Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard 
              title="Healing Tools" 
              subtitle="Small steps that work"
              icon={Heart}
              iconVariant="sage"
            >
              <ul className="text-body-sm space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-400)]"></span>
                  2-minute breath reset
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-400)]"></span>
                  5-4-3-2-1 grounding
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-400)]"></span>
                  Compassion reframe
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-400)]"></span>
                  Body scan calm-down
                </li>
              </ul>
              <div className="border-t border-[var(--sage-200)] mt-4 pt-4">
                <Link href="/tools" className="btn-secondary w-full text-center flex items-center justify-center gap-2" data-testid="link-tools">
                  Open Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard 
              title="Progress" 
              subtitle="Keep it gentle and consistent"
              icon={TrendingUp}
              iconVariant="teal"
            >
              <p className="text-body-sm mb-3">
                Streaks are optional — consistency without pressure.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Metric label="This week" value="4 sessions" />
                <Metric label="Streak" value="2 days" />
              </div>
            </DashboardCard>
          </section>
        </main>
      </div>
    </>
  );
}

function DashboardCard({ title, subtitle, icon: Icon, iconVariant = "sage", children }) {
  const iconClasses = {
    sage: "icon-gradient-sage",
    gold: "icon-gradient-gold", 
    blush: "icon-gradient-blush",
    teal: "icon-gradient-teal"
  };

  return (
    <article className="card-bordered">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-heading-sm text-teal">{title}</h3>
          <p className="text-caption mt-1">{subtitle}</p>
        </div>
        <div className={`icon-container icon-md ${iconClasses[iconVariant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {children}
    </article>
  );
}

function Metric({ label, value }) {
  return (
    <div className="flex-1 min-w-[80px] bg-[var(--sage-50)] border border-[var(--sage-100)] rounded-xl p-3">
      <p className="text-caption">{label}</p>
      <p className="text-heading-sm text-teal mt-1">{value}</p>
    </div>
  </WellnessPageShell>
  );
}
