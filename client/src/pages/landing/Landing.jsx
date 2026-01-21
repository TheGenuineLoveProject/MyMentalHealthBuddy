import { Link, useLocation } from "wouter";
import {
  Heart,
  Sparkles,
  Shield,
  TrendingUp,
  Leaf,
  Sun,
  BookOpen,
} from "lucide-react";

function Pill({ children, icon: Icon }) {
  return (
    <span className="badge badge-sage badge-lg">
      {Icon && <Icon className="icon-xs" aria-hidden="true" />}
      {children}
    </span>
  );
}

function FeatureCard({ title, label, description, icon: Icon, delay = 0 }) {
  return (
    <div
      className="surface-card-elevated hover-lift group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="icon-badge icon-badge-teal icon-circle-sm">
            <Icon className="icon-xs" aria-hidden="true" />
          </div>
        )}
        <div className="text-caption text-accent">{label}</div>
      </div>

      <div className="mt-2 text-heading-sm text-brand group-hover:text-[var(--glp-sage)] transition-colors">
        {title}
      </div>

      <div className="mt-1.5 text-body-sm text-secondary max-w-prose">
        {description}
      </div>
    </div>
  );
}

function StatsCard({ value, label }) {
  return (
    <div className="text-center px-4">
      <div className="text-2xl font-bold text-sage-600">{value}</div>
      <div className="text-sm text-sage-400">{label}</div>
    </div>
  );
}

export default function Landing() {
  const [location] = useLocation();
  const isActive = (path) => location === path;

  return (
    <div className="min-h-screen hero-gradient overflow-hidden relative">
      <div
        className="decorative-orb decorative-orb-sage w-[600px] h-[600px] -top-40 -left-40 absolute"
        aria-hidden="true"
      />
      <div
        className="decorative-orb decorative-orb-blush w-[500px] h-[500px] top-20 -right-40 absolute"
        aria-hidden="true"
      />
      <div
        className="decorative-orb decorative-orb-gold w-[300px] h-[300px] bottom-20 left-1/4 absolute"
        aria-hidden="true"
      />

      {/* HEADER */}
      <header
        className="relative z-10 mx-auto max-w-6xl py-6 pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1rem+env(safe-area-inset-right))]"
        role="banner"
      >
        <div className="grid grid-cols-3 items-center gap-3">
          {/* Left column: (optional) desktop nav */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm text-sage-600 font-medium"
            aria-label="Main navigation"
          >
            <Link href="/today" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded">
              Today
            </Link>
            <Link href="/state" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded">
              State
            </Link>
            <Link href="/journal" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded">
              Journal
            </Link>
            <Link href="/blog" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded flex items-center gap-1">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Blog
            </Link>
          </nav>

          {/* Center column: brand (centered) */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded-lg"
              aria-label="The Genuine Love Project home"
              data-testid="link-brand-home"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Heart className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="leading-tight text-left">
                <div className="font-semibold text-teal">The Genuine Love Project</div>
                <div className="text-xs text-sage-400">Live in Genuine Love</div>
              </div>
            </Link>
          </div>

          {/* Right column: auth buttons (never clipped now) */}
          <div className="flex justify-end items-center gap-3">
            <Link
              href="/login"
              data-testid="link-sign-in"
              className="btn-secondary-premium text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              data-testid="link-start-free"
              className="btn-premium text-sm"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Start free
            </Link>
          </div>
        </div>

        {/* Mobile nav row (optional, keeps everything accessible on small screens) */}
        <nav className="mt-4 flex md:hidden items-center justify-center gap-4 text-sm" aria-label="Main navigation (mobile)">
          <Link href="/today" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded">
            Today
          </Link>
          <Link href="/state" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded">
            State
          </Link>
          <Link href="/journal" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded">
            Journal
          </Link>
          <Link href="/blog" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded">
            Blog
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Left */}
          <div className="space-y-6">
            <Pill icon={Leaf}>Trauma-informed wellness</Pill>
            
            <h1 className="text-display-lg text-brand leading-tight">
              A private space to process what you carry
            </h1>
            
            <p className="text-body-lg text-secondary max-w-lg">
              Without performance, diagnosis, or someone else's timeline. For people who think deeply and want tools that respect that.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/register" className="btn-premium" data-testid="link-cta-register">
                <Sparkles className="icon-sm" aria-hidden="true" />
                Start Your Journey
              </Link>
              <Link href="/login" className="btn-secondary-premium" data-testid="link-cta-login">
                Sign in
              </Link>
            </div>
            
            <div className="flex items-center gap-2 text-body-sm text-tertiary pt-2">
              <Shield className="icon-xs" aria-hidden="true" />
              <span>Not therapy. Not a crisis service. Private by design.</span>
            </div>
          </div>

          {/* Hero Right - Feature Cards */}
          <div className="space-y-4">
            <FeatureCard 
              icon={Sun}
              label="Today"
              title="A single kind focus"
              description="Choose one small compassionate action. Do it fully. Let that be your win."
              delay={100}
            />

            <FeatureCard 
              icon={TrendingUp}
              label="State"
              title="Energy • Clarity • Safety"
              description="Track your inner conditions so support matches what you actually need."
              delay={200}
            />

            <FeatureCard 
              icon={BookOpen}
              label="Journal"
              title="Prompts that feel human"
              description="Thoughtful questions that help you move forward without forcing conclusions."
              delay={300}
            />
          </div>
        </div>

        {/* Stats Section */}
        <section className="mt-20" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Platform Statistics</h2>
          <p className="text-body-sm text-tertiary mb-6 text-center">Trusted by people seeking genuine growth</p>
          <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 divide-x divide-sage-200">
              <StatsCard value="1000+" label="Wellness Tools" />
              <StatsCard value="24/7" label="AI Support" />
              <StatsCard value="100%" label="Privacy First" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}