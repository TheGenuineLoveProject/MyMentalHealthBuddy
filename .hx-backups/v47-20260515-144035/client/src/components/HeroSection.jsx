import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section id="hero" className="text-center py-20 relative z-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-deepTeal leading-tight">
          A Private Space for <br />
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Honest Reflection</span>
        </h1>
        <p className="mt-6 text-lg text-charcoal font-sans">
          Mood tracking, journaling, and AI reflection tools — private by design, free to start.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a href="/login"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform inline-block"
            data-testid="btn-start-free"
          >
            Start Free Today →
          </a>
          <Link href="/pricing">
            <button 
              className="px-6 py-3 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-colors"
              data-testid="btn-view-pricing"
            >
              View Pricing
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
