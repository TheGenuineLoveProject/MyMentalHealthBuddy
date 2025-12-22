import { Link } from "wouter";
import { Heart, MessageCircle, BarChart3, Notebook, Shield, Clock, Sparkles, ArrowRight, Star } from "lucide-react";
import SEO from "../components/SEO.jsx";
import React from "react";
import TglpNavbar from "../components/TglpNavbar";

function FeatureCard({ title, body }) {
  return (
    <div className="card-glass p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--glp-sage-deep)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--glp-ink)]/80">{body}</p>
    </div>
  );
}
const logo = "/logo/primary.png";
export default function Home() {
  return (
    <div className="min-h-screen">
      <TglpNavbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* HERO */}
          <div className="min-h-screen" style={{
            background:
              "radial-gradient(900px 600px at 20% 10%, rgba(var(--glp-sage-rgb), 0.22), transparent 60%)," +
              "radial-gradient(900px 600px at 80% 15%, rgba(var(--glp-blush-rgb), 0.18), transparent 60%)," +
              "radial-gradient(900px 600px at 50% 90%, rgba(47,93,93,0.14), transparent 60%)," +
              "linear-gradient(180deg, var(--ivory), var(--ivory))"
          }}>
          {/* glow orbs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40"
               style={{ background: "radial-gradient(circle, var(--glp-sage) 0%, transparent 60%)" }} />
          <div className="pointer-events-none absolute top-10 -right-24 h-72 w-72 rounded-full blur-3xl opacity-35"
               style={{ background: "radial-gradient(circle, var(--glp-blush) 0%, transparent 60%)" }} />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full blur-3xl opacity-30"
               style={{ background: "radial-gradient(circle, var(--glp-sage-deep) 0%, transparent 60%)" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--glp-sage-deep-rgb), 0.25)] bg-white/60 px-3 py-1 text-xs font-semibold text-[var(--glp-sage-deep)]">
              ✨ AI-Powered Mental Wellness Platform
            </div>
            <header className="w-full flex items-center justify-between py-6">
              <div className="flex items-center gap-3">
                <img src={logo} alt="The Genuine Love Project" className="h-10 w-10 rounded-xl border" style={{ borderColor: "var(--border)" }} />
                <div className="leading-tight">
                  <div className="font-semibold" style={{ color: "var(--text)" }}>The Genuine Love Project</div>
                  <div className="text-sm" style={{ color: "var(--muted)" }}>Live in Genuine Love</div>
                </div>
              </div>

              <nav className="flex items-center gap-3">
                <a className="text-sm" href="/login">Sign In</a>
                <a className="text-sm badge-gold px-3 py-2" href="/register">Get Started</a>
              </nav>
            </header>

            <h1 className="mt-4 text-4xl font-semibold text-[var(--glp-sage-deep)]">
              Your Safe Space for Mental Wellness
            </h1>

            <p className="mt-3 max-w-2xl text-base text-[var(--glp-ink)]/80">
              Track your mood, journal your thoughts, and connect with an AI companion that truly listens —
              available 24/7, completely private.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/get-started"
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm"
                style={{ background: "linear-gradient(90deg, var(--glp-sage-deep) 0%, var(--glp-sage) 55%, var(--glp-gold) 100%)" }}
              >
                Start Your Journey →
              </a>
              <a
                href="/sign-in"
                className="rounded-2xl border border-[rgba(var(--glp-sage-deep-rgb), 0.25)] bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--glp-sage-deep)]"
              >
                Sign In
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-[var(--glp-ink)]/70">
              <span className="font-semibold text-[var(--glp-sage-deep)]">Join 10,000+ users</span>
              <span>★ 4.9/5 rating</span>
              <span className="rounded-full bg-[rgba(212,175,55,0.18)] px-2 py-1 text-xs font-semibold text-[var(--glp-sage-deep)]">
                Serenity Sage™ Experience
              </span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-[var(--glp-sage-deep)]">
            Features designed for your wellbeing
          </h2>
          <p className="mt-2 text-sm text-[var(--glp-ink)]/75">
            Everything you need to understand, track, and improve your mental health in one beautiful app.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Mood Tracking"
              body="Understand emotional patterns with simple check-ins and gentle insights."
            />
            <FeatureCard
              title="Personal Journal"
              body="A private space to write, reflect, and grow — designed for calm, clarity, and healing."
            />
            <FeatureCard
              title="AI Companion"
              body="Supportive conversations that encourage self-compassion and mindful next steps."
            />
          </div>
        </section>

        {/* TRUST */}
        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="card-glass p-6">
            <h3 className="text-xl font-semibold text-[var(--glp-sage-deep)]">Why choose The Genuine Love Project?</h3>
            <p className="mt-2 text-sm text-[var(--glp-ink)]/80">
              Built to help people heal, grow, and align through everyday self-love and consciousness.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--glp-ink)]/80">
              <li>🔒 100% Private by design</li>
              <li>🌙 24/7 Available support</li>
              <li>🌿 Calm, evidence-informed tools</li>
              <li>✨ Beautiful, gentle experience</li>
            </ul>
          </div>

          <div className="card-glass p-6">
            <h3 className="text-xl font-semibold text-[var(--glp-sage-deep)]">Your next step</h3>
            <p className="mt-2 text-sm text-[var(--glp-ink)]/80">
              Create your account and start your first journal + mood check-in in under 2 minutes.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="/get-started"
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm"
                style={{ background: "linear-gradient(90deg, var(--glp-sage-deep) 0%, var(--glp-sage) 55%, var(--glp-gold) 100%)" }}
              >
                Get Started
              </a>
              <a
                href="/learn"
                className="rounded-2xl border border-[rgba(var(--glp-sage-deep-rgb), 0.25)] bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--glp-sage-deep)]"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-12 pb-10 text-center text-xs text-[var(--glp-ink)]/60">
          © {new Date().getFullYear()} The Genuine Love Project • Live in Genuine Love
        </footer>
      </main>
    </div>
  );
}
