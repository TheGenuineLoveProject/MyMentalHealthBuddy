import { Heart, Sparkles, Shield, TrendingUp, Leaf, Sun } from "lucide-react";

function Pill({ children, icon: Icon }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(143,191,159,0.25)] bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-[#4a7a5e] shadow-sm">
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}

function FeatureCard({ title, label, description, delay = 0 }) {
  return (
    <div 
      className="card-elevated group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">{label}</div>
      <div className="mt-2 font-semibold text-[#2D3748] group-hover:text-[#4a7a5e] transition-colors">{title}</div>
      <div className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
        {description}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen hero-gradient overflow-hidden relative">
      <div className="decorative-orb decorative-orb-sage w-[600px] h-[600px] -top-40 -left-40 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-blush w-[500px] h-[500px] top-20 -right-40 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-gold w-[300px] h-[300px] bottom-20 left-1/4 absolute" aria-hidden="true" />
      
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5A8A6E] to-[#4a7a5e] flex items-center justify-center shadow-md">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-[#2D3748]">The Genuine Love Project</div>
            <div className="text-xs text-[#6B7280]">Care + clarity, without pressure.</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-[#4a7a5e] font-medium md:flex">
          <a className="hover:text-[#2D3748] transition-colors" href="/today">Today</a>
          <a className="hover:text-[#2D3748] transition-colors" href="/state">State</a>
          <a className="hover:text-[#2D3748] transition-colors" href="/journal">Journal</a>
          <a className="hover:text-[#2D3748] transition-colors" href="/crisis">Support</a>
        </nav>

        <div className="flex items-center gap-3">
          <a 
            data-testid="link-sign-in"
            className="btn-secondary-premium text-sm" 
            href="/login"
          >
            Sign in
          </a>
          <a 
            data-testid="link-start-free"
            className="btn-premium text-sm animate-pulse-gold" 
            href="/register"
          >
            Start free
          </a>
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

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] text-[#2D3748]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              A calm place to think clearly, feel supported, and grow—
              <span className="text-gradient-brand">one real step at a time.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[#4A5568] max-w-xl">
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

            <div className="mt-8 flex items-center gap-3 text-sm text-[#6B7280]">
              <Shield className="h-4 w-4 text-[#7FAF9B]" />
              <span>Not a crisis service. If you feel unsafe, please use the Support page for immediate help.</span>
            </div>
          </div>

          <div className="glass-premium rounded-3xl p-8 animate-fade-in-scale" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-2 w-2 rounded-full bg-[#22C55E] animate-breathe" />
              <span className="text-sm font-medium text-[#4a7a5e]">Your Daily Toolkit</span>
            </div>
            
            <div className="grid gap-4">
              <FeatureCard 
                label="Today"
                title="A single kind focus"
                description="Choose one small compassionate action. Do it fully. Let that be your win."
                delay={300}
              />

              <FeatureCard 
                label="State"
                title="Energy • Clarity • Safety"
                description="Track your inner conditions so support matches what you actually need."
                delay={400}
              />

              <FeatureCard 
                label="Journal"
                title="Prompts that feel human"
                description="Thoughtful questions that help you move forward without forcing conclusions."
                delay={500}
              />
            </div>
            
            <div className="mt-6 pt-6 border-t border-[rgba(143,191,159,0.2)]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280]">86+ wellness tools available</span>
                <span className="text-[#D4AF37] font-semibold">Explore all →</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-sm text-[#6B7280] mb-4">Trusted by people seeking genuine growth</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-[#4a7a5e]">1000+</div>
            <div className="text-sm text-[#6B7280] flex items-center">Intellectual Tools</div>
            <div className="text-2xl font-bold text-[#4a7a5e]">24/7</div>
            <div className="text-sm text-[#6B7280] flex items-center">AI Support</div>
            <div className="text-2xl font-bold text-[#4a7a5e]">100%</div>
            <div className="text-sm text-[#6B7280] flex items-center">Privacy First</div>
          </div>
        </div>
      </main>
    </div>
  );
}
