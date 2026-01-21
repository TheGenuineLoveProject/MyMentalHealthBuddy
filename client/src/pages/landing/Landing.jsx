import { Link, useLocation } from "wouter";
import { Heart, Sparkles, Shield, TrendingUp, Leaf, Sun, BookOpen } from "lucide-react";

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
      <div className="mt-2 text-heading-sm text-brand group-hover:text-[var(--glp-sage)] transition-colors">{title}</div>
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
      <div className="decorative-orb decorative-orb-sage w-[600px] h-[600px] -top-40 -left-40 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-blush w-[500px] h-[500px] top-20 -right-40 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-gold w-[300px] h-[300px] bottom-20 left-1/4 absolute" aria-hidden="true" />
      
      <header className="relative z-10 mx-auto max-w-6xl px-6 py-6" role="banner">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded-lg" aria-label="The Genuine Love Project home" data-testid="link-brand-home">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Heart className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-teal">The Genuine Love Project</div>
              <div className="text-xs text-sage-400">Live in Genuine Love</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-sage-600 font-medium md:flex absolute left-1/2 -translate-x-1/2" aria-label="Main navigation">
            <Link href="/today" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded" aria-current={isActive("/today") ? "page" : undefined} data-testid="link-today">Today</Link>
            <Link href="/state" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded" aria-current={isActive("/state") ? "page" : undefined} data-testid="link-state">State</Link>
            <Link href="/journal" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded" aria-current={isActive("/journal") ? "page" : undefined} data-testid="link-journal">Journal</Link>
            <Link href="/blog" className="nav-link-landing focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded flex items-center gap-1" aria-current={isActive("/blog") ? "page" : undefined} data-testid="link-blog">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-in-up">
            <div className="flex flex-wrap gap-2 mb-8">
              <Pill icon={Sparkles}>Evidence-informed</Pill>
              <Pill icon={Leaf}>Gentle, not clinical</Pill>
              <Pill icon={Shield}>Privacy-first</Pill>
              <Pill icon={TrendingUp}>Progress you can feel</Pill>
            </div>

            <h1 className="text-display-lg text-brand">
              A calm place to think clearly, feel supported, and grow—
              <span className="text-gradient-premium">one real step at a time.</span>
            </h1>

            <p className="mt-6 text-body-lg text-secondary max-w-xl">
              The Genuine Love Project helps you map your inner state, reflect with care, and build
              sustainable habits—without shame, comparison, or pressure to "perform wellness."
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a 
                data-testid="link-begin-dashboard"
                className="btn-premium text-base px-6 py-3.5 hover-glow-gold" 
                href="/register"
              >
                <Sun className="h-4 w-4 mr-2" />
                Begin your calm dashboard
              </a>
              <a 
                data-testid="link-see-insight"
                className="btn-secondary-premium text-base px-6 py-3.5" 
                href="/today"
              >
                See Today's Insight
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-sage-400">
              <Shield className="h-4 w-4 text-sage-500" />
              <span>Not a crisis service. If you feel unsafe, please use the Support page for immediate help.</span>
            </div>
          </div>

          <div className="glass-premium rounded-3xl p-8 animate-fade-in-scale" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-breathe" />
              <span className="text-sm font-medium text-sage-600">Your Daily Toolkit</span>
            </div>
            
            <div className="grid gap-4">
              <FeatureCard 
                icon={Sun}
                label="Today"
                title="A single kind focus"
                description="Choose one small compassionate action. Do it fully. Let that be your win."
                delay={300}
              />

              <FeatureCard 
                icon={TrendingUp}
                label="State"
                title="Energy • Clarity • Safety"
                description="Track your inner conditions so support matches what you actually need."
                delay={400}
              />

              <FeatureCard 
                icon={BookOpen}
                label="Journal"
                title="Prompts that feel human"
                description="Thoughtful questions that help you move forward without forcing conclusions."
                delay={500}
              />
            </div>
            
            <div className="mt-6 pt-6 border-t border-sage-200/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-sage-400">86+ wellness tools available</span>
                <span className="text-gold-600 font-semibold">Explore all →</span>
              </div>
            </div>
          </div>
        </div>
        
        <section className="mt-20" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Platform Statistics</h2>
          <p className="text-sm text-sage-400 mb-6 text-center">Trusted by people seeking genuine growth</p>
          <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 divide-x divide-sage-200">
              <StatsCard value="1000+" label="Intellectual Tools" />
              <StatsCard value="24/7" label="AI Support" />
              <StatsCard value="100%" label="Privacy First" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
