import React from "react";

export default function TrustPageLayout({
  title,
  subtitle,
  children,
  callout = null,
}) {
  return (
    <main
      className="min-h-screen bg-[#F7F4EE] text-[#1E293B]"
      data-testid="layout-trust"
    >
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-12 md:mb-16 text-center">
          <h1
            className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1E293B] mb-4"
            data-testid="text-trust-title"
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              className="text-lg md:text-xl text-[#475569] leading-relaxed max-w-2xl mx-auto"
              data-testid="text-trust-subtitle"
            >
              {subtitle}
            </p>
          ) : null}
        </header>

        {callout ? (
          <aside
            className="mb-12 rounded-2xl border border-[#E8913A]/30 bg-[#FFD93D]/10 px-6 py-5 text-[#1E293B]"
            data-testid="callout-trust"
            role="note"
          >
            {callout}
          </aside>
        ) : null}

        <div className="space-y-10 md:space-y-12">{children}</div>

        <footer className="mt-16 pt-8 border-t border-[#A8C9A0]/40 text-center text-sm text-[#475569]">
          <p>
            In crisis?{" "}
            <a
              href="/crisis"
              className="underline underline-offset-2 text-[#E8913A] hover:text-[#1E293B]"
              data-testid="link-crisis"
            >
              Get immediate support
            </a>
            {" "}— or call 988, text 741741, or 911.
          </p>
        </footer>
      </div>
    </main>
  );
}
