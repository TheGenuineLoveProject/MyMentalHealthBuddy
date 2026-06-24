/**
 * PHASE116Z42_PLATFORM_EVOLUTION_COMMAND_CENTER_COMPONENT
 *
 * Purpose:
 * - Central visual execution component for platform completion, polish, deployment, monetization,
 *   avatar consistency, palette cohesion, typography safety, and continuous optimization.
 * - Non-destructive. No API dependency. No refactor. Safe to embed into any page later.
 */

import React from "react";

const pillars = [
  {
    title: "Visual Cohesion",
    status: "Active",
    items: [
      "Sage / teal / ivory / blossom / gold palette alignment",
      "Remove red, orange, rose, gray, and random white panel drift",
      "Consistent rounded healing cards and elevated button states",
    ],
  },
  {
    title: "Mobile Typography",
    status: "Active",
    items: [
      "Clamp oversized headings",
      "Protect button labels from overflow",
      "Improve readable hierarchy on iPhone and small screens",
    ],
  },
  {
    title: "Avatar System",
    status: "Active",
    items: [
      "Verify seven official Lumi avatars",
      "Remove visible square/red backgrounds",
      "Unify size, carousel rhythm, 3D presence, and transparent shell behavior",
    ],
  },
  {
    title: "Button + Route Integrity",
    status: "Active",
    items: [
      "Confirm every button points to its intended content or component",
      "Prioritize visible labels, accessible names, and CTA clarity",
      "Remove plain/unstyled buttons from primary flows",
    ],
  },
  {
    title: "Content + Monetization",
    status: "Active",
    items: [
      "Align tools, wellness content, premium flows, and value ladder",
      "Confirm pricing, premium, dashboard, and admin pathways",
      "Prepare user success, client success, and content success loops",
    ],
  },
  {
    title: "Deployment Reliability",
    status: "Active",
    items: [
      "Track stale bundle pickup",
      "Verify local assets match live assets",
      "Protect Replit entrypoint, build command, health route, and rollback path",
    ],
  },
];

function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--glp-sage-20)] bg-[color-mix(in_srgb,var(--glp-sage)_14%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--glp-deep-teal)]">
      {status}
    </span>
  );
}

export default function PlatformEvolutionCommandCenter() {
  return (
    <section
      className="mx-auto my-8 w-full max-w-6xl rounded-[2rem] border border-[var(--glp-sage-20)] bg-[color-mix(in_srgb,var(--glp-ivory)_88%,transparent)] p-5 shadow-[0_24px_70px_rgba(47,93,93,0.14)] sm:p-7"
      data-testid="platform-evolution-command-center"
      aria-labelledby="platform-evolution-command-center-title"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--glp-deep-teal)]">
            Platform Completion Engine
          </p>
          <h2
            id="platform-evolution-command-center-title"
            className="text-balance font-serif text-[clamp(1.6rem,4.8vw,2.65rem)] font-bold leading-[1.08] text-[var(--glp-charcoal)]"
          >
            Continuous Evolution Command Center
          </h2>
          <p className="mt-3 max-w-3xl text-[clamp(0.95rem,2.6vw,1.08rem)] leading-7 text-[color-mix(in_srgb,var(--glp-charcoal)_78%,transparent)]">
            A governed execution layer for visual polish, avatar completion, content alignment,
            monetization readiness, deployment reliability, and continuous platform optimization.
          </p>
        </div>

        <StatusBadge status="Execution Active" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-[1.45rem] border border-[var(--glp-sage-15)] bg-[var(--glp-ivory)] p-4 shadow-[0_12px_32px_rgba(47,93,93,0.10)]"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-[var(--glp-deep-teal)]">
                {pillar.title}
              </h3>
              <StatusBadge status={pillar.status} />
            </div>

            <ul className="space-y-2">
              {pillar.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-[color-mix(in_srgb,var(--glp-charcoal)_82%,transparent)]"
                >
                  <span className="mt-[0.45rem] h-2 w-2 shrink-0 rounded-full bg-[var(--glp-gold)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-[var(--glp-blossom-30)] bg-[color-mix(in_srgb,var(--glp-blossom)_18%,var(--glp-ivory))] p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--glp-deep-teal)]">
          Next Execution Rule
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--glp-charcoal)]">
          Continue one verified blocker at a time: diagnose, patch, build, push, deploy latest source,
          verify live asset pickup, then advance to the next highest-impact visual or platform gap.
        </p>
      </div>
    </section>
  );
}
