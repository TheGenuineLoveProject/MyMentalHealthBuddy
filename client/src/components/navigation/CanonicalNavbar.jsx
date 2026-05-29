import React from "react";

const mainLinks = [
  ["Home", "/"],
  ["About", "/about"],
  ["Features", "/features"],
  ["Healing", "/healing"],
  ["Wellbeing", "/wellbeing"],
  ["Mental Wellness", "/mental-wellness"],
  ["Self Love", "/self-love"],
  ["Growth", "/growth"],
  ["Anxiety", "/anxiety"],
  ["Depression", "/depression"],
  ["Resilience", "/resilience"],
  ["Mindfulness", "/mindfulness"],
];

const toolLinks = [
  ["Wellness Tools Hub", "/wellness-tools-hub"],
  ["All Tools", "/tools/all"],
  ["Journal", "/journal"],
  ["AI Chat", "/chat"],
  ["GAD-7 Anxiety Check-in", "/tools/gad-7"],
  ["PHQ-9 Mood Check-in", "/tools/phq-9"],
  ["Cognitive Distortion Checker", "/tools/cognitive-distortion-checker"],
  ["Breath Pacer", "/tools/breath-pacer"],
  ["Boundary Builder", "/tools/boundary-builder"],
  ["Discernment Tutor", "/tools/discernment-tutor"],
  ["Manipulation Detector", "/tools/manipulation-detector"],
  ["Privacy", "/privacy"],
];

export default function CanonicalNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#A8D5BA]/40 bg-[#F7F4EE]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <a
          href="/"
          className="rounded-full bg-[#4A7E72] px-4 py-2 text-sm font-bold text-white shadow-sm"
        >
          MyMentalHealthBuddy
        </a>

        <nav className="hidden flex-wrap items-center gap-2 lg:flex">
          {mainLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-3 py-2 text-sm font-medium text-[#2F4F4A] hover:bg-[#A8D5BA]/30"
            >
              {label}
            </a>
          ))}

          <details className="relative">
            <summary className="cursor-pointer rounded-full bg-[#F4B942] px-3 py-2 text-sm font-bold text-[#2F4F4A]">
              Tools
            </summary>

            <div className="absolute right-0 mt-3 grid w-80 gap-1 rounded-3xl border border-[#A8D5BA]/40 bg-white p-3 shadow-xl">
              {toolLinks.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-2xl px-3 py-2 text-sm text-[#2F4F4A] hover:bg-[#F7F4EE]"
                >
                  {label}
                </a>
              ))}
            </div>
          </details>
        </nav>

        <details className="lg:hidden">
          <summary className="cursor-pointer rounded-full border border-[#A8D5BA] px-3 py-2 text-sm font-bold text-[#2F4F4A]">
            Menu
          </summary>

          <div className="absolute left-4 right-4 mt-3 grid gap-1 rounded-3xl border border-[#A8D5BA]/40 bg-white p-4 shadow-xl">
            {[...mainLinks, ...toolLinks].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-2xl px-3 py-2 text-sm text-[#2F4F4A] hover:bg-[#F7F4EE]"
              >
                {label}
              </a>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
