import React from "react";
import { Link } from "react-router-dom";

export default function CanvaLanding() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f7f3ea] via-[#eef4ef] to-[#d8e6dc] text-[#14342b]">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#a07820]">
          MyMentalHealthBuddy • The Genuine Love Project
        </p>

        <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Understand yourself. Calm your nervous system. Grow with genuine love.
        </h1>

        <p className="mt-6 max-w-3xl text-xl leading-8 text-[#2d4d43]">
          A provider-informed wellness and self-reflection platform helping people build emotional clarity,
          self-awareness, compassion, authenticity, and practical daily growth.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/7-day-reset" className="rounded-full bg-[#14342b] px-6 py-4 font-bold text-white">
            Start the 7-Day Reset
          </Link>
          <Link to="/pricing" className="rounded-full border border-[#14342b]/20 bg-white/70 px-6 py-4 font-bold">
            View Pricing
          </Link>
          <Link to="/tools" className="rounded-full border border-[#14342b]/20 bg-white/70 px-6 py-4 font-bold">
            Explore Tools
          </Link>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Emotional Clarity", "Understand what you feel and what your emotions may be signaling."],
            ["Self-Awareness", "Recognize patterns, values, needs, and identity growth opportunities."],
            ["Nervous-System Calm", "Use gentle grounding and reflection tools for steadier daily regulation."],
            ["Authentic Growth", "Build self-trust, compassion, purpose, and aligned next steps."]
          ].map(([title, body]) => (
            <article key={title} className="rounded-3xl border border-[#14342b]/10 bg-white/70 p-6 shadow-xl shadow-[#14342b]/5">
              <h2 className="text-xl font-extrabold">{title}</h2>
              <p className="mt-3 leading-7 text-[#3b5c52]">{body}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-[#14342b]/10 bg-white/75 p-8 shadow-xl shadow-[#14342b]/5">
          <h2 className="text-2xl font-extrabold">Safe, ethical, provider-informed wellness</h2>
          <p className="mt-3 leading-7 text-[#3b5c52]">
            This platform supports education, reflection, and personal growth. It does not diagnose,
            treat, prescribe, replace therapy, or provide emergency care.
          </p>
        </section>
      </section>
    </main>
  );
}
