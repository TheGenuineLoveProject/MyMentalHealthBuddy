import { Link } from "wouter";
import { Heart, MessageCircle, BarChart3, Notebook, Shield, Clock, Sparkles, ArrowRight, Star } from "lucide-react";
import SEO from "../components/SEO.jsx";
import React from "react";
import TglpNavbar from "../components/TglpNavbar";

function FeatureCard({ title, body }) {
  return (
    <div className="card-glass p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-[#2F5D5D]">{title}</h3>
      <p className="mt-2 text-sm text-[#3A3A3A]/80">{body}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <TglpNavbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-[rgba(143,191,159,0.22)] bg-[rgba(250,249,247,0.55)] p-8 shadow-sm backdrop-blur">
          {/* glow orbs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40"
               style={{ background: "radial-gradient(circle, #8FBF9F 0%, transparent 60%)" }} />
          <div className="pointer-events-none absolute top-10 -right-24 h-72 w-72 rounded-full blur-3xl opacity-35"
               style={{ background: "radial-gradient(circle, #F4C7C3 0%, transparent 60%)" }} />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full blur-3xl opacity-30"
               style={{ background: "radial-gradient(circle, #2F5D5D 0%, transparent 60%)" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(47,93,93,0.25)] bg-white/60 px-3 py-1 text-xs font-semibold text-[#2F5D5D]">
              ✨ AI-Powered Mental Wellness Platform
            </div>

            <h1 className="mt-4 text-4xl font-semibold text-[#2F5D5D]">
              Your Safe Space for Mental Wellness
            </h1>

            <p className="mt-3 max-w-2xl text-base text-[#3A3A3A]/80">
              Track your mood, journal your thoughts, and connect with an AI companion that truly listens —
              available 24/7, completely private.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/get-started"
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm"
                style={{ background: "linear-gradient(90deg, #2F5D5D 0%, #8FBF9F 55%, #D4AF37 100%)" }}
              >
                Start Your Journey →
              </a>
              <a
                href="/sign-in"
                className="rounded-2xl border border-[rgba(47,93,93,0.25)] bg-white/70 px-5 py-3 text-sm font-semibold text-[#2F5D5D]"
              >
                Sign In
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-[#3A3A3A]/70">
              <span className="font-semibold text-[#2F5D5D]">Join 10,000+ users</span>
              <span>★ 4.9/5 rating</span>
              <span className="rounded-full bg-[rgba(212,175,55,0.18)] px-2 py-1 text-xs font-semibold text-[#2F5D5D]">
                Serenity Sage™ Experience
              </span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-[#2F5D5D]">
            Features designed for your wellbeing
          </h2>
          <p className="mt-2 text-sm text-[#3A3A3A]/75">
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
            <h3 className="text-xl font-semibold text-[#2F5D5D]">Why choose The Genuine Love Project?</h3>
            <p className="mt-2 text-sm text-[#3A3A3A]/80">
              Built to help people heal, grow, and align through everyday self-love and consciousness.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#3A3A3A]/80">
              <li>🔒 100% Private by design</li>
              <li>🌙 24/7 Available support</li>
              <li>🌿 Calm, evidence-informed tools</li>
              <li>✨ Beautiful, gentle experience</li>
            </ul>
          </div>

          <div className="card-glass p-6">
            <h3 className="text-xl font-semibold text-[#2F5D5D]">Your next step</h3>
            <p className="mt-2 text-sm text-[#3A3A3A]/80">
              Create your account and start your first journal + mood check-in in under 2 minutes.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="/get-started"
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm"
                style={{ background: "linear-gradient(90deg, #2F5D5D 0%, #8FBF9F 55%, #D4AF37 100%)" }}
              >
                Get Started
              </a>
              <a
                href="/learn"
                className="rounded-2xl border border-[rgba(47,93,93,0.25)] bg-white/70 px-5 py-3 text-sm font-semibold text-[#2F5D5D]"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-12 pb-10 text-center text-xs text-[#3A3A3A]/60">
          © {new Date().getFullYear()} The Genuine Love Project • Live in Genuine Love
        </footer>
      </main>
    </div>
  );
}
