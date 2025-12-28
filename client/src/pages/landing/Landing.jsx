function Pill({ children }) {
  return (
    <span className="rounded-full border bg-white/70 px-3 py-1 text-xs text-neutral-700">
      {children}
    </span>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-neutral-900" />
          <div className="leading-tight">
            <div className="font-semibold text-neutral-900">The Genuine Love Project</div>
            <div className="text-xs text-neutral-500">Care + clarity, without pressure.</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-neutral-700 md:flex">
          <a className="hover:text-neutral-900" href="/today">Today</a>
          <a className="hover:text-neutral-900" href="/state">State</a>
          <a className="hover:text-neutral-900" href="/journal">Journal</a>
          <a className="hover:text-neutral-900" href="/crisis">Support</a>
        </nav>

        <div className="flex items-center gap-2">
          <a 
            data-testid="link-sign-in"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-white" 
            href="/login"
          >
            Sign in
          </a>
          <a 
            data-testid="link-start-free"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:opacity-90" 
            href="/register"
          >
            Start free
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill>Evidence-informed</Pill>
              <Pill>Gentle, not clinical</Pill>
              <Pill>Privacy-first</Pill>
              <Pill>Progress you can feel</Pill>
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              A calm place to think clearly, feel supported, and grow—one real step at a time.
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-neutral-700">
              The Genuine Love Project helps you map your inner state, reflect with care, and build
              sustainable habits—without shame, comparison, or pressure to "perform wellness."
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a 
                data-testid="link-begin-dashboard"
                className="rounded-xl bg-neutral-900 px-5 py-3 text-sm text-white hover:opacity-90" 
                href="/register"
              >
                Begin your calm dashboard
              </a>
              <a 
                data-testid="link-see-insight"
                className="rounded-xl border px-5 py-3 text-sm hover:bg-white" 
                href="/today"
              >
                See Today's Insight
              </a>
            </div>

            <div className="mt-6 text-xs text-neutral-500">
              Not a crisis service. If you feel unsafe, please use the Support page for immediate help.
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              <div className="rounded-2xl border bg-neutral-50 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-500">Today</div>
                <div className="mt-2 font-medium text-neutral-900">A single kind focus</div>
                <div className="mt-1 text-sm text-neutral-700">
                  Choose one small compassionate action. Do it fully. Let that be your win.
                </div>
              </div>

              <div className="rounded-2xl border bg-neutral-50 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-500">State</div>
                <div className="mt-2 font-medium text-neutral-900">Energy • Clarity • Safety</div>
                <div className="mt-1 text-sm text-neutral-700">
                  Track your inner conditions so support matches what you actually need.
                </div>
              </div>

              <div className="rounded-2xl border bg-neutral-50 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-500">Journal</div>
                <div className="mt-2 font-medium text-neutral-900">Prompts that feel human</div>
                <div className="mt-1 text-sm text-neutral-700">
                  Thoughtful questions that help you move forward without forcing conclusions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
