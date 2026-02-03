/**
 * ============================================================================
 * THE GENUINE LOVE PROJECT - WIREFRAME TEMPLATES
 * ============================================================================
 * 
 * Developer-ready wireframe system for TheGenuineLoveProject.com
 * 
 * BRAND PALETTE:
 * - Sage: #8fbf9f (Primary accents, success states)
 * - Rose: #f4c7c3 (Soft highlights, warmth)
 * - Deep Teal: #2f5d5d (Primary text, headers, CTAs)
 * - Cream: #faf9f7 (Backgrounds, cards)
 * - Charcoal: #3a3a3a (Body text)
 * - Gold: #eac33b (CTAs, highlights, premium)
 * 
 * UX FLOW: Landing → Onboarding → Homepage → CRM → Content → Q&A → Login
 * 
 * ACCESSIBILITY: WCAG 2.1 AA compliant
 * - All interactive elements have data-testid
 * - ARIA labels on icon buttons
 * - Semantic HTML structure
 * - Color contrast 4.5:1 minimum
 * - Keyboard navigation support
 * ============================================================================
 */

import { useState } from "react";
import { Link } from "wouter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import {
  Heart, ArrowRight, ArrowLeft, Home, User, LayoutDashboard, BookOpen,
  MessageCircle, LogIn, ChevronDown, ChevronRight, Sparkles, Menu, X, Bell,
  Settings, Search, Plus, Filter, Star, Calendar, TrendingUp, Users, FileText,
  Shield, Lock, Clock, Zap, Eye, Edit, Mail, Check, AlertCircle, Download,
  Copy, Code, Smartphone, Tablet, Monitor
} from "lucide-react";

export default function WireframeTemplates() {
  const [activeTemplate, setActiveTemplate] = useState("landing");
  const [viewMode, setViewMode] = useState("preview");
  const [deviceView, setDeviceView] = useState("desktop");

  const templates = [
    { id: "landing", name: "1. Landing Page", icon: Home },
    { id: "onboarding", name: "2. Onboarding", icon: Sparkles },
    { id: "homepage", name: "3. Homepage", icon: LayoutDashboard },
    { id: "crm", name: "4. CRM Dashboard", icon: Users },
    { id: "content", name: "5. Content Hub", icon: BookOpen },
    { id: "qa", name: "6. Q&A Community", icon: MessageCircle },
    { id: "login", name: "7. Login/Auth", icon: LogIn }
  ];

  return (
  <WellnessPageShell
    title="WireframeTemplates"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <div className="min-h-screen" style={{ background: 'var(--glp-cream)', fontFamily: "'Lato', sans-serif" }}>
      {/* ================================================================
          HEADER - NavBar Component
          Tags: NavBar, Header, Navigation
          Export: header.html, navbar.css
          ================================================================ */}
      <header 
        id="main-header"
        className="sticky top-0 z-50 px-6 py-4"
        style={{ 
          background: 'rgba(250, 249, 247, 0.98)', 
          borderBottom: '1px solid rgba(143, 191, 159, 0.2)',
          backdropFilter: 'blur(20px)'
        }}
        role="banner"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6" style={{ color: '#8fbf9f' }} aria-hidden="true" />
            <span className="font-serif font-bold text-xl" style={{ color: '#2f5d5d' }}>
              Wireframe Templates
            </span>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(47, 93, 93, 0.2)' }}>
              {[
                { id: "preview", label: "Preview" },
                { id: "code", label: "Code" }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: viewMode === mode.id ? '#2f5d5d' : 'white',
                    color: viewMode === mode.id ? 'white' : '#3a3a3a'
                  }}
                  data-testid={`button-view-${mode.id}`}
                  aria-pressed={viewMode === mode.id}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            
            <Link href="/design-system">
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{ background: '#2f5d5d', color: 'white' }}
                data-testid="link-design-system"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Design System
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* ================================================================
            SIDEBAR - Template Navigation
            Tags: Sidebar, Navigation, Menu
            Export: sidebar.html, sidebar.css
            ================================================================ */}
        <aside 
          className="w-64 flex-shrink-0 hidden lg:block"
          role="navigation"
          aria-label="Template navigation"
        >
          <nav className="sticky top-24 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-4" style={{ color: '#3a3a3a', opacity: 0.5 }}>
              Page Templates
            </h2>
            {templates.map((template, index) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => setActiveTemplate(template.id)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3"
                  style={{
                    background: activeTemplate === template.id ? 'rgba(143, 191, 159, 0.15)' : 'transparent',
                    color: activeTemplate === template.id ? '#2f5d5d' : '#3a3a3a',
                    fontWeight: activeTemplate === template.id ? 600 : 400,
                    border: activeTemplate === template.id ? '1px solid rgba(143, 191, 159, 0.3)' : '1px solid transparent'
                  }}
                  data-testid={`button-template-${template.id}`}
                  aria-current={activeTemplate === template.id ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {template.name}
                </button>
              );
            })}

            {/* Device Preview Toggle */}
            <div className="pt-6 mt-6 border-t" style={{ borderColor: 'rgba(143, 191, 159, 0.2)' }}>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-4" style={{ color: '#3a3a3a', opacity: 0.5 }}>
                Device Preview
              </h2>
              <div className="flex gap-2 px-4">
                {[
                  { id: "mobile", icon: Smartphone, label: "Mobile" },
                  { id: "tablet", icon: Tablet, label: "Tablet" },
                  { id: "desktop", icon: Monitor, label: "Desktop" }
                ].map(device => {
                  const DeviceIcon = device.icon;
                  return (
                    <button
                      key={device.id}
                      onClick={() => setDeviceView(device.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{
                        background: deviceView === device.id ? '#2f5d5d' : 'rgba(47, 93, 93, 0.05)',
                        color: deviceView === device.id ? 'white' : '#3a3a3a'
                      }}
                      data-testid={`button-device-${device.id}`}
                      aria-label={`View ${device.label} layout`}
                      aria-pressed={deviceView === device.id}
                    >
                      <DeviceIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0" role="main">
          {viewMode === "preview" ? (
            <PreviewMode 
              activeTemplate={activeTemplate} 
              deviceView={deviceView}
            />
          ) : (
            <CodeMode activeTemplate={activeTemplate} />
          )}
        </main>
      </div>
    </div>
  </WellnessPageShell>
  );
}

/**
 * Preview Mode - Visual wireframe display
 */
function PreviewMode({ activeTemplate, deviceView }) {
  const deviceWidths = {
    mobile: "375px",
    tablet: "768px",
    desktop: "100%"
  };

  return (
    <div className="space-y-6">
      {/* Template Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#2f5d5d' }}>
            {activeTemplate === "landing" && "Landing Page Wireframe"}
            {activeTemplate === "onboarding" && "Onboarding Flow Wireframe"}
            {activeTemplate === "homepage" && "Homepage (Logged In) Wireframe"}
            {activeTemplate === "crm" && "CRM Dashboard Wireframe"}
            {activeTemplate === "content" && "Content Hub Wireframe"}
            {activeTemplate === "qa" && "Q&A Community Wireframe"}
            {activeTemplate === "login" && "Login/Auth Wireframe"}
          </h1>
          <p className="mt-2" style={{ color: '#3a3a3a', opacity: 0.7 }}>
            Developer-ready wireframe with accessibility and SEO best practices
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(47, 93, 93, 0.1)', color: '#2f5d5d' }}
            data-testid="button-copy-html"
            aria-label="Copy HTML code"
          >
            <Copy className="w-4 h-4" aria-hidden="true" /> Copy HTML
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{ background: '#eac33b', color: '#2f5d5d' }}
            data-testid="button-download"
            aria-label="Download wireframe"
          >
            <Download className="w-4 h-4" aria-hidden="true" /> Download
          </button>
        </div>
      </div>

      {/* Wireframe Preview Container */}
      <div 
        className="rounded-2xl overflow-hidden"
        style={{ 
          background: 'white',
          border: '1px solid rgba(143, 191, 159, 0.2)',
          boxShadow: '0 4px 24px rgba(47, 93, 93, 0.08)'
        }}
      >
        <div 
          className="mx-auto transition-all duration-300"
          style={{ 
            maxWidth: deviceWidths[deviceView],
            background: '#faf9f7'
          }}
        >
          {activeTemplate === "landing" && <LandingWireframe />}
          {activeTemplate === "onboarding" && <OnboardingWireframe />}
          {activeTemplate === "homepage" && <HomepageWireframe />}
          {activeTemplate === "crm" && <CRMWireframe />}
          {activeTemplate === "content" && <ContentWireframe />}
          {activeTemplate === "qa" && <QAWireframe />}
          {activeTemplate === "login" && <LoginWireframe />}
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * WIREFRAME 1: LANDING PAGE
 * ============================================================================
 * SEO: Homepage, primary conversion page
 * CRM: Lead capture, newsletter signup
 * Export Tags: hero-section, feature-grid, testimonial-carousel, cta-section
 */
function LandingWireframe() {
  return (
    <div className="wireframe-landing" data-page="landing" data-seo-priority="1">
      {/* COMPONENT: NavBar */}
      <nav 
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: 'rgba(143, 191, 159, 0.2)' }}
        role="navigation"
        aria-label="Main navigation"
        data-component="NavBar"
        data-export="navbar.html"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full" style={{ background: '#8fbf9f' }} data-slot="logo" />
          <span className="font-bold" style={{ color: '#2f5d5d' }} data-slot="brand-name">TGLP</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" data-slot="nav-links">
          <a href="#features" className="hover:opacity-70" style={{ color: '#3a3a3a' }} data-testid="link-features">Features</a>
          <a href="#about" className="hover:opacity-70" style={{ color: '#3a3a3a' }} data-testid="link-about">About</a>
          <a href="#testimonials" className="hover:opacity-70" style={{ color: '#3a3a3a' }} data-testid="link-testimonials">Stories</a>
        </div>
        <div className="flex items-center gap-3" data-slot="auth-buttons">
          <button className="text-sm" style={{ color: '#2f5d5d' }} data-testid="button-login">Log In</button>
          <button 
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: '#eac33b', color: '#2f5d5d' }}
            data-testid="button-signup-nav"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* COMPONENT: Hero Section */}
      <section 
        className="px-6 py-16 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(143, 191, 159, 0.1) 0%, transparent 100%)' }}
        aria-labelledby="hero-heading"
        data-component="HeroSection"
        data-export="hero.html"
        data-seo="h1-primary"
      >
        <div className="max-w-2xl mx-auto">
          <span 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(234, 195, 59, 0.2)', color: '#8B7023' }}
            data-slot="badge"
          >
            Trauma-Informed Wellness
          </span>
          <h1 
            id="hero-heading"
            className="text-4xl md:text-5xl font-serif font-bold mb-6"
            style={{ color: '#2f5d5d' }}
            data-slot="headline"
          >
            Begin Your Journey to Genuine Self-Love
          </h1>
          <p 
            className="text-lg mb-8"
            style={{ color: '#3a3a3a', opacity: 0.8 }}
            data-slot="subheadline"
          >
            AI-powered emotional guidance, journaling, and community support—all in one compassionate, private space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-slot="cta-buttons">
            <button 
              className="px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2"
              style={{ background: '#eac33b', color: '#2f5d5d' }}
              data-testid="button-hero-cta-primary"
            >
              Start Your Free Journey <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <button 
              className="px-8 py-4 rounded-full font-semibold text-lg"
              style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d' }}
              data-testid="button-hero-cta-secondary"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* COMPONENT: Social Proof Bar */}
      <section 
        className="px-6 py-8 text-center border-y"
        style={{ borderColor: 'rgba(143, 191, 159, 0.2)' }}
        aria-label="Social proof"
        data-component="SocialProofBar"
        data-export="social-proof.html"
      >
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div data-slot="stat">
            <span className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>10k+</span>
            <span className="text-sm ml-2" style={{ color: '#3a3a3a', opacity: 0.7 }}>Members</span>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(143, 191, 159, 0.3)' }} aria-hidden="true" />
          <div data-slot="stat">
            <span className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>4.9★</span>
            <span className="text-sm ml-2" style={{ color: '#3a3a3a', opacity: 0.7 }}>Rating</span>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(143, 191, 159, 0.3)' }} aria-hidden="true" />
          <div data-slot="stat">
            <span className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>50+</span>
            <span className="text-sm ml-2" style={{ color: '#3a3a3a', opacity: 0.7 }}>Healing Tools</span>
          </div>
        </div>
      </section>

      {/* COMPONENT: Features Grid */}
      <section 
        className="px-6 py-16"
        aria-labelledby="features-heading"
        data-component="FeaturesGrid"
        data-export="features.html"
      >
        <h2 
          id="features-heading"
          className="text-3xl font-serif font-bold text-center mb-12"
          style={{ color: '#2f5d5d' }}
          data-slot="section-title"
        >
          How We Support Your Healing
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: MessageCircle, title: "AI Companion", desc: "24/7 compassionate guidance" },
            { icon: BookOpen, title: "Guided Journals", desc: "Reflective prompts for growth" },
            { icon: Users, title: "Safe Community", desc: "Connect with understanding peers" }
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl text-center"
              style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
              data-component="FeatureCard"
              data-testid={`card-feature-${i}`}
            >
              <div 
                className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }}
                data-slot="icon"
              >
                <feature.icon className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#2f5d5d' }} data-slot="title">{feature.title}</h3>
              <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot="description">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPONENT: Newsletter/CRM Section */}
      <section 
        className="px-6 py-16"
        style={{ background: 'linear-gradient(135deg, rgba(47, 93, 93, 0.05), rgba(143, 191, 159, 0.1))' }}
        aria-labelledby="newsletter-heading"
        data-component="NewsletterForm"
        data-export="newsletter.html"
        data-crm="lead-capture"
      >
        <div className="max-w-xl mx-auto text-center">
          <h2 
            id="newsletter-heading"
            className="text-2xl font-serif font-bold mb-4"
            style={{ color: '#2f5d5d' }}
          >
            Get Weekly Healing Insights
          </h2>
          <p className="mb-6" style={{ color: '#3a3a3a', opacity: 0.7 }}>
            Join 10,000+ on their self-love journey. No spam, just support.
          </p>
          <form 
            className="flex flex-col sm:flex-row gap-3"
            data-form="newsletter-signup"
            aria-label="Newsletter signup form"
          >
            <input 
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-full border"
              style={{ borderColor: 'rgba(47, 93, 93, 0.2)' }}
              required
              aria-label="Email address"
              data-testid="input-email-newsletter"
            />
            <button 
              type="submit"
              className="px-6 py-3 rounded-full font-medium"
              style={{ background: '#eac33b', color: '#2f5d5d' }}
              data-testid="button-subscribe"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs mt-4" style={{ color: '#3a3a3a', opacity: 0.5 }}>
            <Lock className="w-3 h-3 inline mr-1" aria-hidden="true" />
            GDPR compliant. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* COMPONENT: Footer */}
      <footer 
        className="px-6 py-8 border-t"
        style={{ borderColor: 'rgba(143, 191, 159, 0.2)' }}
        role="contentinfo"
        data-component="Footer"
        data-export="footer.html"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" />
            <span style={{ color: '#2f5d5d' }}>© 2026 The Genuine Love Project</span>
          </div>
          <nav className="flex gap-6 text-sm" aria-label="Footer navigation">
            <a href="#privacy" style={{ color: '#3a3a3a' }} data-testid="link-privacy">Privacy</a>
            <a href="#terms" style={{ color: '#3a3a3a' }} data-testid="link-terms">Terms</a>
            <a href="#contact" style={{ color: '#3a3a3a' }} data-testid="link-contact">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/**
 * ============================================================================
 * WIREFRAME 2: ONBOARDING FLOW
 * ============================================================================
 * SEO: Onboarding, user setup
 * CRM: User preferences, personalization
 * Export Tags: progress-steps, preference-cards, welcome-screen
 */
function OnboardingWireframe() {
  return (
    <div className="wireframe-onboarding min-h-screen flex flex-col" data-page="onboarding" data-seo-priority="3">
      {/* Progress Indicator */}
      <div 
        className="p-4 border-b"
        style={{ borderColor: 'rgba(143, 191, 159, 0.2)' }}
        role="progressbar"
        aria-valuenow={2}
        aria-valuemin={1}
        aria-valuemax={4}
        aria-label="Onboarding progress"
        data-component="ProgressSteps"
        data-export="progress-steps.html"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[1, 2, 3, 4].map((step, i) => (
            <div key={step} className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ 
                  background: step <= 2 ? '#8fbf9f' : 'rgba(143, 191, 159, 0.2)',
                  color: step <= 2 ? 'white' : '#3a3a3a'
                }}
                data-slot={`step-${step}`}
              >
                {step < 2 ? <Check className="w-4 h-4" aria-hidden="true" /> : step}
              </div>
              {i < 3 && (
                <div 
                  className="w-12 h-1 mx-2"
                  style={{ background: step < 2 ? '#8fbf9f' : 'rgba(143, 191, 159, 0.2)' }}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding Content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="max-w-lg w-full text-center">
          {/* COMPONENT: Onboarding Question */}
          <div 
            data-component="OnboardingQuestion"
            data-export="onboarding-question.html"
          >
            <span 
              className="text-sm font-medium"
              style={{ color: '#8fbf9f' }}
              data-slot="step-label"
            >
              Step 2 of 4
            </span>
            <h1 
              className="text-3xl font-serif font-bold mt-4 mb-6"
              style={{ color: '#2f5d5d' }}
              data-slot="question"
            >
              What brings you here today?
            </h1>
            <p className="mb-8" style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot="helper-text">
              This helps us personalize your healing journey. Select all that apply.
            </p>
          </div>

          {/* COMPONENT: Preference Cards */}
          <div 
            className="grid grid-cols-2 gap-4 mb-8"
            role="group"
            aria-label="Healing goals selection"
            data-component="PreferenceCards"
            data-export="preference-cards.html"
          >
            {[
              { icon: Heart, label: "Self-Love", selected: true },
              { icon: Shield, label: "Healing Trauma", selected: false },
              { icon: Users, label: "Relationships", selected: true },
              { icon: Sparkles, label: "Personal Growth", selected: false }
            ].map((option, i) => (
              <button
                key={i}
                className="p-4 rounded-2xl text-left transition-all"
                style={{ 
                  background: option.selected ? 'rgba(143, 191, 159, 0.15)' : 'white',
                  border: option.selected ? '2px solid #8fbf9f' : '2px solid rgba(143, 191, 159, 0.2)'
                }}
                data-testid={`button-preference-${i}`}
                aria-pressed={option.selected}
              >
                <option.icon 
                  className="w-6 h-6 mb-2" 
                  style={{ color: option.selected ? '#2f5d5d' : '#3a3a3a' }}
                  aria-hidden="true"
                />
                <span 
                  className="font-medium"
                  style={{ color: option.selected ? '#2f5d5d' : '#3a3a3a' }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4" data-slot="navigation-buttons">
            <button 
              className="flex-1 px-6 py-3 rounded-full font-medium"
              style={{ background: 'transparent', color: '#3a3a3a', border: '1px solid rgba(47, 93, 93, 0.2)' }}
              data-testid="button-onboarding-back"
            >
              Back
            </button>
            <button 
              className="flex-1 px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2"
              style={{ background: '#eac33b', color: '#2f5d5d' }}
              data-testid="button-onboarding-next"
            >
              Continue <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>

      {/* Skip Option */}
      <div className="p-4 text-center">
        <button 
          className="text-sm underline"
          style={{ color: '#3a3a3a', opacity: 0.6 }}
          data-testid="button-skip-onboarding"
        >
          Skip personalization for now
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * WIREFRAME 3: HOMEPAGE (LOGGED IN)
 * ============================================================================
 * SEO: Dashboard, user home
 * CRM: User engagement, daily activity
 * Export Tags: daily-focus, quick-nav, activity-feed, sidebar
 */
function HomepageWireframe() {
  return (
    <div className="wireframe-homepage flex" data-page="homepage" data-seo-priority="2">
      {/* COMPONENT: Sidebar Navigation */}
      <aside 
        className="w-16 md:w-56 border-r p-4 flex flex-col"
        style={{ borderColor: 'rgba(143, 191, 159, 0.2)', background: 'white' }}
        role="navigation"
        aria-label="Main navigation"
        data-component="Sidebar"
        data-export="sidebar.html"
      >
        <div className="mb-8 hidden md:block">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6" style={{ color: '#8fbf9f' }} aria-hidden="true" />
            <span className="font-bold" style={{ color: '#2f5d5d' }}>TGLP</span>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { icon: Home, label: "Home", active: true, href: "/dashboard" },
            { icon: MessageCircle, label: "AI Chat", active: false, href: "/chat" },
            { icon: BookOpen, label: "Journal", active: false, href: "/journal" },
            { icon: Users, label: "Community", active: false, href: "/community" },
            { icon: Settings, label: "Settings", active: false, href: "/settings" }
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-xl transition-colors"
              style={{ 
                background: item.active ? 'rgba(143, 191, 159, 0.15)' : 'transparent',
                color: item.active ? '#2f5d5d' : '#3a3a3a'
              }}
              data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}
              aria-current={item.active ? 'page' : undefined}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              <span className="hidden md:inline">{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6" role="main">
        {/* COMPONENT: Daily Focus Card */}
        <section 
          className="p-6 rounded-2xl mb-6 relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, rgba(47, 93, 93, 0.05), rgba(143, 191, 159, 0.1))',
            border: '2px solid rgba(143, 191, 159, 0.2)'
          }}
          aria-labelledby="daily-focus-heading"
          data-component="DailyFocusCard"
          data-export="daily-focus.html"
        >
          <div 
            className="absolute top-0 left-1/4 right-1/4 h-1 rounded-b-full"
            style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }}
            aria-hidden="true"
          />
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }}
              data-slot="icon"
            >
              <Sparkles className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 id="daily-focus-heading" className="text-xl font-bold" style={{ color: '#2f5d5d' }} data-slot="title">
                Today's Healing Focus
              </h2>
              <p style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot="message">
                <em>"Embrace the present moment—it holds everything you need."</em>
              </p>
            </div>
          </div>
        </section>

        {/* COMPONENT: Quick Navigation Grid */}
        <section 
          className="mb-6"
          aria-label="Quick actions"
          data-component="QuickNavGrid"
          data-export="quick-nav.html"
        >
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: MessageCircle, label: "Q&A Community", color: "#eac33b", bg: "rgba(234, 195, 59, 0.15)" },
              { icon: AlertCircle, label: "Crisis Support", color: "#f4c7c3", bg: "rgba(244, 199, 195, 0.3)" },
              { icon: Zap, label: "Tools Library", color: "#2f5d5d", bg: "rgba(47, 93, 93, 0.1)" }
            ].map((item, i) => (
              <button
                key={i}
                className="p-4 rounded-2xl text-center transition-transform hover:-translate-y-1"
                style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
                data-testid={`button-quick-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <div 
                  className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                  style={{ background: item.bg }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} aria-hidden="true" />
                </div>
                <span className="font-medium text-sm" style={{ color: '#3a3a3a' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* COMPONENT: Activity Feed */}
        <section 
          aria-labelledby="activity-heading"
          data-component="ActivityFeed"
          data-export="activity-feed.html"
        >
          <h3 id="activity-heading" className="font-semibold mb-4" style={{ color: '#2f5d5d' }}>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { type: "Journal", time: "2h ago", desc: "Completed morning reflection" },
              { type: "Chat", time: "Yesterday", desc: "AI session on self-compassion" },
              { type: "Community", time: "2 days ago", desc: "Shared your story" }
            ].map((activity, i) => (
              <div 
                key={i}
                className="p-4 rounded-xl flex items-center gap-4"
                style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.15)' }}
                data-testid={`card-activity-${i}`}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(143, 191, 159, 0.1)' }}
                >
                  <Clock className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: '#2f5d5d' }}>{activity.desc}</p>
                  <p className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{activity.type} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/**
 * ============================================================================
 * WIREFRAME 4: CRM DASHBOARD
 * ============================================================================
 * SEO: Admin dashboard
 * CRM: User management, analytics, engagement metrics
 * Export Tags: stats-cards, user-table, charts, filters
 */
function CRMWireframe() {
  return (
    <div className="wireframe-crm p-6" data-page="crm" data-seo-priority="4">
      {/* Header */}
      <header className="flex items-center justify-between mb-8" data-component="PageHeader">
        <div>
          <h1 className="text-2xl font-serif font-bold" style={{ color: '#2f5d5d' }}>CRM Dashboard</h1>
          <p style={{ color: '#3a3a3a', opacity: 0.7 }}>User management and engagement analytics</p>
        </div>
        <button 
          className="px-4 py-2 rounded-lg flex items-center gap-2"
          style={{ background: '#eac33b', color: '#2f5d5d' }}
          data-testid="button-export-data"
        >
          <Download className="w-4 h-4" aria-hidden="true" /> Export
        </button>
      </header>

      {/* COMPONENT: Stats Cards */}
      <section 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        aria-label="Key metrics"
        data-component="StatsCards"
        data-export="stats-cards.html"
      >
        {[
          { label: "Total Users", value: "12,847", change: "+12%", up: true },
          { label: "Active Today", value: "2,341", change: "+8%", up: true },
          { label: "Sessions", value: "45,892", change: "+23%", up: true },
          { label: "Churn Rate", value: "2.4%", change: "-0.3%", up: false }
        ].map((stat, i) => (
          <div 
            key={i}
            className="p-4 rounded-xl"
            style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
            data-testid={`card-stat-${i}`}
          >
            <p className="text-sm mb-1" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p>
            <span 
              className="text-xs font-medium"
              style={{ color: stat.up ? '#059669' : '#dc2626' }}
            >
              {stat.change}
            </span>
          </div>
        ))}
      </section>

      {/* COMPONENT: User Table */}
      <section 
        className="rounded-xl overflow-hidden"
        style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
        aria-labelledby="users-heading"
        data-component="UserTable"
        data-export="user-table.html"
      >
        <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(143, 191, 159, 0.2)' }}>
          <h3 id="users-heading" className="font-semibold" style={{ color: '#2f5d5d' }}>Recent Users</h3>
          <div className="flex gap-2">
            <button 
              className="p-2 rounded-lg"
              style={{ background: 'rgba(47, 93, 93, 0.05)' }}
              data-testid="button-filter-users"
              aria-label="Filter users"
            >
              <Filter className="w-4 h-4" style={{ color: '#3a3a3a' }} aria-hidden="true" />
            </button>
            <button 
              className="p-2 rounded-lg"
              style={{ background: 'rgba(47, 93, 93, 0.05)' }}
              data-testid="button-search-users"
              aria-label="Search users"
            >
              <Search className="w-4 h-4" style={{ color: '#3a3a3a' }} aria-hidden="true" />
            </button>
          </div>
        </div>
        <table className="w-full text-sm" role="table">
          <thead>
            <tr style={{ background: 'rgba(143, 191, 159, 0.05)' }}>
              <th className="text-left p-4" style={{ color: '#2f5d5d' }}>User</th>
              <th className="text-left p-4" style={{ color: '#2f5d5d' }}>Status</th>
              <th className="text-left p-4" style={{ color: '#2f5d5d' }}>Last Active</th>
              <th className="text-left p-4" style={{ color: '#2f5d5d' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Sarah M.", email: "sarah@email.com", status: "Active", time: "2m ago" },
              { name: "James K.", email: "james@email.com", status: "Premium", time: "1h ago" },
              { name: "Emma L.", email: "emma@email.com", status: "Trial", time: "3h ago" }
            ].map((user, i) => (
              <tr key={i} style={{ borderTop: '1px solid rgba(143, 191, 159, 0.1)' }} data-testid={`row-user-${i}`}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full" style={{ background: '#8fbf9f' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#2f5d5d' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      background: user.status === 'Premium' ? 'rgba(234, 195, 59, 0.2)' : 'rgba(143, 191, 159, 0.2)',
                      color: user.status === 'Premium' ? '#8B7023' : '#2f5d5d'
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4" style={{ color: '#3a3a3a' }}>{user.time}</td>
                <td className="p-4">
                  <button 
                    className="p-1"
                    data-testid={`button-user-action-${i}`}
                    aria-label={`Actions for ${user.name}`}
                  >
                    <Eye className="w-4 h-4" style={{ color: '#3a3a3a' }} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/**
 * ============================================================================
 * WIREFRAME 5: CONTENT HUB
 * ============================================================================
 * SEO: Articles, resources, blog
 * CRM: Content engagement, reading time
 * Export Tags: search-bar, content-grid, filter-tabs, content-card
 */
function ContentWireframe() {
  return (
    <div className="wireframe-content p-6" data-page="content" data-seo-priority="2">
      {/* Header with Search */}
      <header className="mb-8" data-component="ContentHeader">
        <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2f5d5d' }}>Content Library</h1>
        <p className="mb-6" style={{ color: '#3a3a3a', opacity: 0.7 }}>Explore healing resources, articles, and guided practices</p>
        
        {/* COMPONENT: Search Bar */}
        <div 
          className="relative"
          data-component="SearchBar"
          data-export="search-bar.html"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#3a3a3a', opacity: 0.4 }} aria-hidden="true" />
          <input 
            type="search"
            placeholder="Search articles, topics, or practices..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border"
            style={{ borderColor: 'rgba(143, 191, 159, 0.2)' }}
            aria-label="Search content"
            data-testid="input-content-search"
          />
        </div>
      </header>

      {/* COMPONENT: Filter Tabs */}
      <nav 
        className="flex gap-2 mb-6 overflow-x-auto pb-2"
        role="tablist"
        aria-label="Content categories"
        data-component="FilterTabs"
        data-export="filter-tabs.html"
      >
        {["All", "Articles", "Practices", "Videos", "Audio"].map((tab, i) => (
          <button
            key={tab}
            role="tab"
            aria-selected={i === 0}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            style={{ 
              background: i === 0 ? '#2f5d5d' : 'rgba(47, 93, 93, 0.05)',
              color: i === 0 ? 'white' : '#3a3a3a'
            }}
            data-testid={`tab-filter-${tab.toLowerCase()}`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* COMPONENT: Content Grid */}
      <section 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-label="Content items"
        data-component="ContentGrid"
        data-export="content-grid.html"
      >
        {[
          { type: "Article", title: "Understanding Self-Compassion", time: "5 min read", tag: "Self-Love" },
          { type: "Practice", title: "Morning Grounding Exercise", time: "10 min", tag: "Mindfulness" },
          { type: "Video", title: "Healing Your Inner Child", time: "12 min", tag: "Trauma" }
        ].map((content, i) => (
          <article 
            key={i}
            className="rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
            style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
            data-component="ContentCard"
            data-testid={`card-content-${i}`}
          >
            <div 
              className="h-32 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.2), rgba(244, 199, 195, 0.2))' }}
              data-slot="thumbnail"
            >
              <FileText className="w-10 h-10" style={{ color: '#2f5d5d', opacity: 0.3 }} aria-hidden="true" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(234, 195, 59, 0.2)', color: '#8B7023' }}
                  data-slot="type-badge"
                >
                  {content.type}
                </span>
                <span className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{content.time}</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#2f5d5d' }} data-slot="title">{content.title}</h3>
              <span 
                className="text-xs"
                style={{ color: '#8fbf9f' }}
                data-slot="tag"
              >
                #{content.tag}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

/**
 * ============================================================================
 * WIREFRAME 6: Q&A COMMUNITY
 * ============================================================================
 * SEO: Community, forum, discussions
 * CRM: User engagement, community health
 * Export Tags: post-card, vote-button, answer-thread, new-question-form
 */
function QAWireframe() {
  return (
    <div className="wireframe-qa p-6" data-page="qa" data-seo-priority="2">
      {/* Header */}
      <header className="flex items-center justify-between mb-8" data-component="CommunityHeader">
        <div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#2f5d5d' }}>Q&A Community</h1>
          <p style={{ color: '#3a3a3a', opacity: 0.7 }}>Ask questions, share experiences, support each other</p>
        </div>
        <button 
          className="px-4 py-2 rounded-full flex items-center gap-2 font-medium"
          style={{ background: '#eac33b', color: '#2f5d5d' }}
          data-testid="button-new-question"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Ask Question
        </button>
      </header>

      {/* COMPONENT: Post Cards */}
      <section 
        className="space-y-4"
        aria-label="Community posts"
        data-component="PostList"
        data-export="post-list.html"
      >
        {[
          { 
            author: "Anonymous", 
            verified: true,
            title: "How do you practice self-compassion during setbacks?",
            preview: "I've been struggling with being kind to myself when things don't go as planned...",
            votes: 24,
            answers: 8,
            time: "2h ago"
          },
          { 
            author: "HealingJourney",
            verified: false, 
            title: "Tips for starting a morning gratitude practice?",
            preview: "Looking for ideas to build a sustainable morning routine...",
            votes: 18,
            answers: 12,
            time: "5h ago"
          }
        ].map((post, i) => (
          <article 
            key={i}
            className="p-5 rounded-2xl"
            style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
            data-component="PostCard"
            data-testid={`card-post-${i}`}
          >
            <div className="flex gap-4">
              {/* COMPONENT: Vote Button */}
              <div 
                className="flex flex-col items-center gap-1"
                data-component="VoteButton"
                data-export="vote-button.html"
              >
                <button 
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                  data-testid={`button-upvote-${i}`}
                  aria-label={`Upvote post, current votes: ${post.votes}`}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" />
                </button>
                <span className="font-bold text-sm" style={{ color: '#2f5d5d' }}>{post.votes}</span>
              </div>

              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full" style={{ background: '#f4c7c3' }} />
                  <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{post.author}</span>
                  {post.verified && (
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                      style={{ background: 'rgba(143, 191, 159, 0.2)', color: '#2f5d5d' }}
                    >
                      <Shield className="w-3 h-3" aria-hidden="true" /> Verified
                    </span>
                  )}
                  <span className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{post.time}</span>
                </div>
                <h3 className="font-semibold mb-1" style={{ color: '#2f5d5d' }} data-slot="post-title">{post.title}</h3>
                <p className="text-sm mb-3" style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot="post-preview">{post.preview}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span style={{ color: '#3a3a3a', opacity: 0.6 }}>
                    <MessageCircle className="w-4 h-4 inline mr-1" aria-hidden="true" />
                    {post.answers} answers
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

/**
 * ============================================================================
 * WIREFRAME 7: LOGIN/AUTH
 * ============================================================================
 * SEO: Login, authentication
 * CRM: User acquisition, conversion tracking
 * Export Tags: auth-form, social-login, password-input, remember-me
 */
function LoginWireframe() {
  return (
    <div 
      className="wireframe-login min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.1), rgba(244, 199, 195, 0.1))' }}
      data-page="login" 
      data-seo-priority="3"
    >
      <div 
        className="w-full max-w-md p-8 rounded-3xl"
        style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)', boxShadow: '0 8px 32px rgba(47, 93, 93, 0.1)' }}
        data-component="AuthCard"
        data-export="auth-card.html"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }}>
            <Heart className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-serif font-bold" style={{ color: '#2f5d5d' }}>Welcome Back</h1>
          <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.7 }}>Sign in to continue your healing journey</p>
        </div>

        {/* COMPONENT: Auth Form */}
        <form 
          className="space-y-4"
          data-component="AuthForm"
          data-export="auth-form.html"
          aria-label="Login form"
        >
          <div data-component="FormInput">
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#2f5d5d' }}>
              Email
            </label>
            <input 
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border"
              style={{ borderColor: 'rgba(143, 191, 159, 0.3)' }}
              required
              data-testid="input-email-login"
            />
          </div>

          <div data-component="PasswordInput">
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#2f5d5d' }}>
              Password
            </label>
            <div className="relative">
              <input 
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border"
                style={{ borderColor: 'rgba(143, 191, 159, 0.3)' }}
                required
                data-testid="input-password-login"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Show password"
                data-testid="button-toggle-password"
              >
                <Eye className="w-5 h-5" style={{ color: '#3a3a3a', opacity: 0.4 }} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between" data-component="RememberMe">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox"
                className="w-4 h-4 rounded"
                data-testid="checkbox-remember"
              />
              <span style={{ color: '#3a3a3a' }}>Remember me</span>
            </label>
            <a href="#forgot" className="text-sm" style={{ color: '#8fbf9f' }} data-testid="link-forgot-password">
              Forgot password?
            </a>
          </div>

          <button 
            type="submit"
            className="w-full py-3 rounded-xl font-semibold transition-colors"
            style={{ background: '#eac33b', color: '#2f5d5d' }}
            data-testid="button-login-submit"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(143, 191, 159, 0.2)' }} />
          <span className="text-sm" style={{ color: '#3a3a3a', opacity: 0.5 }}>or continue with</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(143, 191, 159, 0.2)' }} />
        </div>

        {/* COMPONENT: Social Login */}
        <div 
          className="flex gap-3"
          data-component="SocialLogin"
          data-export="social-login.html"
        >
          <button 
            className="flex-1 py-3 rounded-xl border flex items-center justify-center gap-2"
            style={{ borderColor: 'rgba(143, 191, 159, 0.3)' }}
            data-testid="button-login-google"
          >
            <span className="w-5 h-5 rounded-full" style={{ background: '#DB4437' }} aria-hidden="true" />
            <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>Google</span>
          </button>
          <button 
            className="flex-1 py-3 rounded-xl border flex items-center justify-center gap-2"
            style={{ borderColor: 'rgba(143, 191, 159, 0.3)' }}
            data-testid="button-login-github"
          >
            <span className="w-5 h-5 rounded-full" style={{ background: '#333' }} aria-hidden="true" />
            <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>GitHub</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-sm" style={{ color: '#3a3a3a' }}>
          Don't have an account?{" "}
          <a href="#signup" className="font-medium" style={{ color: '#2f5d5d' }} data-testid="link-signup">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * Code Mode - Display developer code
 */
function CodeMode({ activeTemplate }) {
  const codeDescriptions = {
    landing: "Landing Page - Hero section, features grid, CTA buttons, newsletter signup",
    onboarding: "Onboarding Flow - Welcome screens, preference selection, account setup",
    homepage: "User Dashboard - Stats cards, activity feed, quick actions",
    crm: "CRM Dashboard - Contact list, pipeline view, analytics charts",
    content: "Content Hub - Article cards, categories, search functionality",
    qa: "Q&A Community - Question list, voting, answer threads",
    login: "Authentication - Login form, social login, password recovery"
  };

  const templateCode = `
/* ============================================================
   ${(activeTemplate || 'landing').toUpperCase()} WIREFRAME
   ${codeDescriptions[activeTemplate] || codeDescriptions.landing}
   ============================================================ */

/* Component Structure:
   - Header/Navigation
   - Main Content Area
   - Interactive Elements
   - Footer/Actions
   
   For full HTML/CSS export, use the Download button above.
*/

// React Component Pattern:
export default function ${activeTemplate ? activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1) : 'Landing'}Page() {
  return (
    <div className="page-container">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}
`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold" style={{ color: '#2f5d5d' }}>
          Developer Code
        </h2>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: '#2f5d5d', color: 'white' }}
          data-testid="button-copy-code"
          onClick={() => navigator.clipboard.writeText(templateCode)}
        >
          <Copy className="w-4 h-4" aria-hidden="true" /> Copy All
        </button>
      </div>
      
      <pre 
        className="p-6 rounded-2xl overflow-x-auto text-sm"
        style={{ 
          background: '#1a1a2e', 
          color: '#a0aec0',
          border: '1px solid rgba(143, 191, 159, 0.2)'
        }}
      >
        <code>{templateCode}</code>
      </pre>
    </div>
  );
}


