import React from "react";

export default function TrustSection({
  title,
  body,
  icon = null,
  emphasis = null,
  testId,
}) {
  return (
    <section
      className="rounded-2xl bg-white/60 border border-[#A8C9A0]/40 p-6 md:p-8"
      data-testid={testId || "section-trust"}
    >
      <div className="flex items-start gap-4 mb-3">
        {icon ? (
          <span
            className="shrink-0 text-2xl text-[#E8913A]"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
        <h2 className="text-xl md:text-2xl font-semibold text-[#1E293B] leading-snug">
          {title}
        </h2>
      </div>
      <p className="text-base md:text-lg text-[#334155] leading-relaxed">
        {body}
      </p>
      {emphasis ? (
        <div
          className="mt-4 rounded-xl border-l-4 border-[#E8913A] bg-[#FFD93D]/10 px-4 py-3 text-[#1E293B]"
          role="note"
        >
          {emphasis}
        </div>
      ) : null}
    </section>
  );
}
