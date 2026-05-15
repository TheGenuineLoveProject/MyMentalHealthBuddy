import { useState } from "react";
import { Link } from "wouter";
import { Heart, ArrowRight, ArrowLeft, Home, User, LayoutDashboard, BookOpen, MessageCircle, LogIn, ChevronRight, Smartphone, Tablet, Monitor, Check, Sparkles, Menu, Bell, Search, Filter, Star, TrendingUp, Users, FileText, PenLine, BarChart3, Shield, Eye, Edit, Trash, ExternalLink } from 'lucide-react';
import "../styles/canva-landing.css";
import FlowDiagram from "../components/FlowDiagram.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function DesignSystem() {
  const [activeSection, setActiveSection] = useState("overview");

  const brandColors = [
    { name: "Sage Green", hex: "#8fbf9f", usage: "Primary accents, success states, nature elements" },
    { name: "Rose/Blush", hex: "#f4c7c3", usage: "Soft highlights, feminine touches, warmth" },
    { name: "Deep Teal", hex: "#2f5d5d", usage: "Primary text, headers, buttons, trust" },
    { name: "Cream/Ivory", hex: "#faf9f7", usage: "Backgrounds, cards, clean spaces" },
    { name: "Charcoal", hex: "#3a3a3a", usage: "Body text, secondary content" },
    { name: "Warm Gold", hex: "#eac33b", usage: "CTAs, highlights, premium features" }
  ];

  const breakpoints = [
    { name: "Mobile", size: "< 640px", columns: 1, padding: "16px" },
    { name: "Tablet", size: "640px - 1024px", columns: 2, padding: "24px" },
    { name: "Desktop", size: "> 1024px", columns: "3-4", padding: "32px" }
  ];

  const pages = [
    { id: "landing", name: "Landing Page", icon: Home, status: "complete" },
    { id: "onboarding", name: "Onboarding Flow", icon: Sparkles, status: "spec" },
    { id: "homepage", name: "Homepage (Logged In)", icon: LayoutDashboard, status: "spec" },
    { id: "crm", name: "CRM Dashboard", icon: Users, status: "spec" },
    { id: "content", name: "Content Hub", icon: BookOpen, status: "spec" },
    { id: "community", name: "Q&A Community", icon: MessageCircle, status: "spec" },
    { id: "auth", name: "Login / Auth", icon: LogIn, status: "complete" }
  ];

  const sections = [
    { id: "overview", name: "Overview" },
    { id: "colors", name: "Brand Palette" },
    { id: "typography", name: "Typography" },
    { id: "components", name: "UI Components" },
    { id: "wellness", name: "Wellness Components" },
    { id: "iconography", name: "Gold Iconography" },
    { id: "pages", name: "Page Specifications" },
    { id: "flow", name: "Screen Flow" },
    { id: "responsive", name: "Responsive Grid" },
    { id: "accessibility", name: "Accessibility" },
    { id: "devspecs", name: "Dev Handoff Specs" },
    { id: "checklist", name: "Developer Checklist" }
  ];

  return (
  <WellnessPageShell
    title="DesignSystem"
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

    <div className="min-h-screen" style={{ background: 'var(--soft-ivory)', fontFamily: "'Lato', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4" style={{ 
        background: 'rgba(250, 249, 247, 0.98)', 
        borderBottom: '1px solid rgba(143, 191, 159, 0.2)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6" style={{ color: 'var(--sage-green)' }} />
            <span className="font-serif font-bold text-xl" style={{ color: 'var(--deep-teal)' }}>
              TGLP Design System
            </span>
          </div>
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ 
              background: 'var(--deep-teal)', 
              color: 'white' 
            }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <nav className="sticky top-24 space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3"
                style={{
                  background: activeSection === section.id ? 'rgba(143, 191, 159, 0.15)' : 'transparent',
                  color: activeSection === section.id ? 'var(--deep-teal)' : 'var(--charcoal)',
                  fontWeight: activeSection === section.id ? 600 : 400
                }}
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === section.id ? 'rotate-90' : ''}`} />
                {section.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Overview Section */}
          {activeSection === "overview" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  TheGenuineLoveProject.com
                </h1>
                <p className="text-xl mb-2" style={{ color: 'var(--charcoal)' }}>
                  UI/UX Design System & Flow Specification
                </p>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  A comprehensive guide for building emotionally calm, brand-aligned, and fully responsive interfaces.
                </p>
              </div>

              {/* Design Principles */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Heart, title: "Emotionally Calm", desc: "Soft gradients, gentle animations, breathing room" },
                  { icon: Sparkles, title: "Elegant & Intuitive", desc: "Clear hierarchy, predictable patterns, delightful details" },
                  { icon: Shield, title: "Trustworthy", desc: "Consistent styling, accessible design, secure interactions" }
                ].map((principle, i) => (
                  <div key={i} className="p-6 rounded-2xl" style={{ 
                    background: 'white', 
                    border: '1px solid rgba(143, 191, 159, 0.2)' 
                  }}>
                    <principle.icon className="w-10 h-10 mb-4" style={{ color: 'var(--sage-green)' }} />
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--deep-teal)' }}>{principle.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>{principle.desc}</p>
                  </div>
                ))}
              </div>

              {/* Page Overview */}
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--deep-teal)' }}>
                  Page Structure
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pages.map(page => (
                    <div key={page.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ 
                      background: 'white', 
                      border: '1px solid rgba(143, 191, 159, 0.2)' 
                    }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                        background: 'linear-gradient(135deg, var(--sage-green), var(--blush-pink))' 
                      }}>
                        <page.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--deep-teal)' }}>{page.name}</p>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ 
                          background: page.status === 'complete' ? 'rgba(143, 191, 159, 0.2)' : 'rgba(234, 195, 59, 0.2)',
                          color: page.status === 'complete' ? 'var(--deep-teal)' : 'var(--charcoal)'
                        }}>
                          {page.status === 'complete' ? 'Built' : 'Specification'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Colors Section */}
          {activeSection === "colors" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  Brand Palette
                </h1>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  A calm, nature-inspired palette that evokes trust, healing, and growth.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandColors.map(color => (
                  <div key={color.hex} className="rounded-2xl overflow-hidden" style={{ 
                    background: 'white', 
                    border: '1px solid rgba(143, 191, 159, 0.2)' 
                  }}>
                    <div className="h-32" style={{ background: color.hex }} />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold" style={{ color: 'var(--deep-teal)' }}>{color.name}</span>
                        <code className="text-sm px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.05)' }}>
                          {color.hex}
                        </code>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>{color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gradient Examples */}
              <div>
                <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  Gradients
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="h-24 rounded-xl flex items-center justify-center text-white font-semibold" 
                    style={{ background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)' }}>
                    Teal → Sage
                  </div>
                  <div className="h-24 rounded-xl flex items-center justify-center font-semibold" 
                    style={{ background: 'linear-gradient(135deg, #8fbf9f, #f4c7c3)', color: 'var(--deep-teal)' }}>
                    Sage → Rose
                  </div>
                  <div className="h-24 rounded-xl flex items-center justify-center font-semibold" 
                    style={{ background: 'linear-gradient(135deg, #eac33b, #f4c7c3)', color: 'var(--deep-teal)' }}>
                    Gold → Rose
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Typography Section */}
          {activeSection === "typography" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  Typography
                </h1>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Elegant serif headers paired with clean sans-serif body text.
                </p>
              </div>

              {/* Font Families */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                  <span className="text-sm font-semibold mb-2 block" style={{ color: 'var(--sage-green)' }}>HEADINGS</span>
                  <p className="text-4xl font-serif mb-2" style={{ color: 'var(--deep-teal)' }}>Cormorant Garamond</p>
                  <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                    Elegant serif for headers, titles, and emphasis. Weights: 400, 500, 600, 700
                  </p>
                </div>
                <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                  <span className="text-sm font-semibold mb-2 block" style={{ color: 'var(--sage-green)' }}>BODY</span>
                  <p className="text-4xl mb-2" style={{ color: 'var(--deep-teal)', fontFamily: "'Lato', sans-serif" }}>Lato</p>
                  <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                    Clean sans-serif for body text and UI elements. Weights: 300, 400, 600, 700
                  </p>
                </div>
              </div>

              {/* Type Scale */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Type Scale</h3>
                <div className="space-y-4">
                  {[
                    { size: "6xl", px: "60px", label: "Hero Title" },
                    { size: "4xl", px: "36px", label: "Section Header" },
                    { size: "2xl", px: "24px", label: "Card Title" },
                    { size: "xl", px: "20px", label: "Subheading" },
                    { size: "base", px: "16px", label: "Body Text" },
                    { size: "sm", px: "14px", label: "Caption" },
                    { size: "xs", px: "12px", label: "Label" }
                  ].map(item => (
                    <div key={item.size} className="flex items-baseline gap-4 pb-4" style={{ borderBottom: '1px solid rgba(143, 191, 159, 0.1)' }}>
                      <code className="w-20 text-sm" style={{ color: 'var(--sage-green)' }}>{item.px}</code>
                      <span className={`font-serif text-${item.size}`} style={{ color: 'var(--deep-teal)' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Components Section */}
          {activeSection === "components" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  UI Components
                </h1>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Reusable components with states, variants, and Figma-ready specifications.
                </p>
              </div>

              {/* Buttons */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Buttons</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <span className="text-xs font-semibold block mb-3" style={{ color: 'var(--sage-green)' }}>PRIMARY</span>
                    <div className="space-y-3">
                      <button className="btn-primary">Default State</button>
                      <button className="btn-primary opacity-70">Hover State</button>
                      <button className="btn-primary opacity-50" disabled>Disabled</button>
                    </div>
                    <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <strong>Dev Notes:</strong><br/>
                      • Gradient: linear-gradient(135deg, #2f5d5d, #8fbf9f)<br/>
                      • Border-radius: 50px (pill shape)<br/>
                      • Padding: 16px 40px<br/>
                      • Hover: translateY(-3px), increased shadow
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold block mb-3" style={{ color: 'var(--sage-green)' }}>SECONDARY</span>
                    <div className="space-y-3">
                      <button className="btn-secondary">Default State</button>
                      <button className="btn-secondary" style={{ background: 'var(--deep-teal)', color: 'white' }}>Hover State</button>
                      <button className="btn-secondary opacity-50" disabled>Disabled</button>
                    </div>
                    <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <strong>Dev Notes:</strong><br/>
                      • Background: transparent<br/>
                      • Border: 2px solid #2f5d5d<br/>
                      • Hover: fill with #2f5d5d, text white
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Form Fields</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--deep-teal)' }}>
                        Text Input
                      </label>
                      <input 
                        type="text" 
                        placeholder="Enter your email..."
                        className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none"
                        style={{ 
                          borderColor: 'rgba(143, 191, 159, 0.3)',
                          background: 'var(--soft-ivory)'
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--deep-teal)' }}>
                        Error State
                      </label>
                      <input 
                        type="text" 
                        value="invalid@"
                        className="w-full px-4 py-3 rounded-xl border-2"
                        style={{ 
                          borderColor: '#e57373',
                          background: 'rgba(229, 115, 115, 0.05)'
                        }}
                        readOnly
                      />
                      <p className="text-sm mt-1" style={{ color: '#e57373' }}>Please enter a valid email</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg text-xs" style={{ background: 'rgba(0,0,0,0.03)' }}>
                    <strong>Dev Notes:</strong><br/><br/>
                    <strong>Default:</strong><br/>
                    • Border: 2px solid rgba(143, 191, 159, 0.3)<br/>
                    • Border-radius: 12px<br/>
                    • Padding: 12px 16px<br/><br/>
                    <strong>Focus:</strong><br/>
                    • Border-color: #8fbf9f<br/>
                    • Box-shadow: 0 0 0 3px rgba(143, 191, 159, 0.2)<br/><br/>
                    <strong>Error:</strong><br/>
                    • Border-color: #e57373<br/>
                    • Background: rgba(229, 115, 115, 0.05)
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Cards</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="glass-card rounded-2xl p-6">
                    <div className="icon-circle w-12 h-12 mb-4">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-serif font-semibold mb-2" style={{ color: 'var(--deep-teal)' }}>Glass Card</h4>
                    <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                      Glassmorphism with blur and subtle border
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--sage-green), var(--blush-pink))' }}>
                    <h4 className="font-serif font-semibold mb-2 text-white">Gradient Card</h4>
                    <p className="text-sm text-white opacity-90">
                      For featured or premium content
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl" style={{ background: 'var(--soft-ivory)', border: '2px solid var(--sage-green)' }}>
                    <h4 className="font-serif font-semibold mb-2" style={{ color: 'var(--deep-teal)' }}>Outlined Card</h4>
                    <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                      For secondary or selected states
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Navigation Components</h3>
                
                {/* NavBar Example */}
                <div className="mb-6">
                  <span className="text-xs font-semibold block mb-3" style={{ color: 'var(--sage-green)' }}>NAVBAR</span>
                  <div className="p-4 rounded-xl flex items-center justify-between" style={{ 
                    background: 'rgba(250, 249, 247, 0.98)', 
                    border: '1px solid rgba(143, 191, 159, 0.2)' 
                  }}>
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6" style={{ color: 'var(--sage-green)' }} />
                      <span className="font-serif font-bold" style={{ color: 'var(--deep-teal)' }}>TGLP</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                      <span className="nav-link" style={{ color: 'var(--deep-teal)' }}>Home</span>
                      <span className="nav-link" style={{ color: 'var(--charcoal)' }}>Features</span>
                      <span className="nav-link" style={{ color: 'var(--charcoal)' }}>About</span>
                    </div>
                    <button className="btn-primary text-sm py-2 px-6">Get Started</button>
                  </div>
                </div>

                {/* Sidebar Example */}
                <div>
                  <span className="text-xs font-semibold block mb-3" style={{ color: 'var(--sage-green)' }}>SIDEBAR (Logged In)</span>
                  <div className="w-64 p-4 rounded-xl space-y-2" style={{ 
                    background: 'white', 
                    border: '1px solid rgba(143, 191, 159, 0.2)' 
                  }}>
                    {[
                      { icon: Home, label: "Dashboard", active: true },
                      { icon: MessageCircle, label: "AI Chat", active: false },
                      { icon: PenLine, label: "Journal", active: false },
                      { icon: BarChart3, label: "Mood Tracker", active: false },
                      { icon: BookOpen, label: "Resources", active: false }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer" style={{
                        background: item.active ? 'rgba(143, 191, 159, 0.15)' : 'transparent',
                        color: item.active ? 'var(--deep-teal)' : 'var(--charcoal)'
                      }}>
                        <item.icon className="w-5 h-5" />
                        <span className={item.active ? 'font-semibold' : ''}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Pages Section */}
          {activeSection === "pages" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  Page Specifications
                </h1>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Detailed wireframes and component breakdown for each page.
                </p>
              </div>

              {/* Landing Page */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--sage-green)' }}>
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl" style={{ color: 'var(--deep-teal)' }}>Landing Page</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(143, 191, 159, 0.2)', color: 'var(--deep-teal)' }}>
                      ✓ Built
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold" style={{ color: 'var(--deep-teal)' }}>Sections</h4>
                    <ul className="space-y-2 text-sm">
                      {["NavBar (sticky)", "Hero Section", "About / Values Grid", "How It Works (3 steps)", "Features Grid", "Testimonials", "Trust Badges", "FAQ Accordion", "Final CTA", "Footer"].map((section, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4" style={{ color: 'var(--sage-green)' }} />
                          <span>{section}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg text-xs" style={{ background: 'rgba(0,0,0,0.03)' }}>
                    <strong>Dev Notes:</strong><br/><br/>
                    <strong>Breakpoints:</strong><br/>
                    • Mobile: Single column, stacked CTAs<br/>
                    • Tablet: 2-column grids<br/>
                    • Desktop: 3-column grids, side-by-side CTAs<br/><br/>
                    <strong>Animations:</strong><br/>
                    • Scroll-triggered fade-in-up<br/>
                    • Floating decorative elements<br/>
                    • Hover lift on cards (8px translateY)<br/><br/>
                    <strong>Accessibility:</strong><br/>
                    • Skip-to-content link<br/>
                    • Reduced-motion preference support<br/>
                    • ARIA labels on interactive elements
                  </div>
                </div>
              </div>

              {/* Onboarding */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--warm-gold)' }}>
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl" style={{ color: 'var(--deep-teal)' }}>Onboarding Flow</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(234, 195, 59, 0.2)', color: 'var(--charcoal)' }}>
                      Specification
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                    4-step guided onboarding with progress indicator and personalization.
                  </p>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { step: 1, title: "Welcome", desc: "Name, goals" },
                      { step: 2, title: "Preferences", desc: "Topics, themes" },
                      { step: 3, title: "Assessment", desc: "Mood baseline" },
                      { step: 4, title: "Ready", desc: "Dashboard intro" }
                    ].map(item => (
                      <div key={item.step} className="text-center p-4 rounded-xl" style={{ background: 'rgba(143, 191, 159, 0.1)' }}>
                        <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-white" 
                          style={{ background: 'var(--sage-green)' }}>
                          {item.step}
                        </div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--deep-teal)' }}>{item.title}</p>
                        <p className="text-xs" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-lg text-xs" style={{ background: 'rgba(0,0,0,0.03)' }}>
                    <strong>Components:</strong><br/>
                    • ProgressBar (top)<br/>
                    • StepIndicator (dots/numbers)<br/>
                    • FormCard (centered, max-width 600px)<br/>
                    • NavigationButtons (Back/Next)<br/>
                    • SkipLink (subtle, bottom right)
                  </div>
                </div>
              </div>

              {/* Homepage Logged In */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--deep-teal)' }}>
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl" style={{ color: 'var(--deep-teal)' }}>Homepage (Logged In)</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(234, 195, 59, 0.2)', color: 'var(--charcoal)' }}>
                      Specification
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="col-span-2 p-4 rounded-xl" style={{ background: 'rgba(143, 191, 159, 0.1)' }}>
                      <h4 className="font-semibold mb-3" style={{ color: 'var(--deep-teal)' }}>Main Content Area</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Welcome Message (personalized)</li>
                        <li>• Daily Prompt / Check-in Card</li>
                        <li>• Quick Actions Grid (Chat, Journal, Mood)</li>
                        <li>• Recent Activity Feed</li>
                        <li>• Recommended Resources</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(244, 199, 195, 0.2)' }}>
                      <h4 className="font-semibold mb-3" style={{ color: 'var(--deep-teal)' }}>Sidebar</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Navigation Menu</li>
                        <li>• Streak Counter</li>
                        <li>• XP Progress Bar</li>
                        <li>• Quick Stats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* CRM Dashboard */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--blush-pink)' }}>
                    <Users className="w-5 h-5" style={{ color: 'var(--deep-teal)' }} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl" style={{ color: 'var(--deep-teal)' }}>CRM Dashboard</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(234, 195, 59, 0.2)', color: 'var(--charcoal)' }}>
                      Specification
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold" style={{ color: 'var(--deep-teal)' }}>Components</h4>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Stats Overview Cards (4-grid)",
                        "User Table with Search/Filter",
                        "Activity Timeline",
                        "Engagement Charts",
                        "Export/Actions Toolbar"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--sage-green)' }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg text-xs" style={{ background: 'rgba(0,0,0,0.03)' }}>
                    <strong>Table States:</strong><br/>
                    • Default row<br/>
                    • Hover: subtle sage background<br/>
                    • Selected: sage border left<br/>
                    • Loading: skeleton shimmer<br/><br/>
                    <strong>Actions:</strong><br/>
                    • View (Eye icon)<br/>
                    • Edit (Pencil icon)<br/>
                    • Delete (Trash icon, requires confirm)
                  </div>
                </div>
              </div>

              {/* Content Hub */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--sage-green)' }}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl" style={{ color: 'var(--deep-teal)' }}>Content Hub</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(234, 195, 59, 0.2)', color: 'var(--charcoal)' }}>
                      Specification
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["All", "Articles", "Meditations", "Exercises", "Videos"].map((tab, i) => (
                      <span key={i} className="px-4 py-2 rounded-full text-sm cursor-pointer" style={{
                        background: i === 0 ? 'var(--deep-teal)' : 'transparent',
                        color: i === 0 ? 'white' : 'var(--charcoal)',
                        border: i === 0 ? 'none' : '1px solid rgba(143, 191, 159, 0.3)'
                      }}>
                        {tab}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                    Grid layout with category tabs, search bar, and content cards with thumbnails.
                  </p>
                </div>
              </div>

              {/* Q&A Community */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--warm-gold)' }}>
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl" style={{ color: 'var(--deep-teal)' }}>Q&A Community</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(234, 195, 59, 0.2)', color: 'var(--charcoal)' }}>
                      Specification
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-2 text-sm">
                    {[
                      "Question List with votes/answers count",
                      "New Question Modal",
                      "Answer Thread View",
                      "User Reputation Badges",
                      "Topic Tags",
                      "Sort/Filter Controls"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--warm-gold)' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 rounded-lg text-xs" style={{ background: 'rgba(0,0,0,0.03)' }}>
                    <strong>Moderation:</strong><br/>
                    • Report button on all posts<br/>
                    • Admin-only delete/edit<br/>
                    • Anonymous posting option<br/><br/>
                    <strong>Engagement:</strong><br/>
                    • Upvote/Downvote (sage/rose)<br/>
                    • Mark as Helpful<br/>
                    • Share question link
                  </div>
                </div>
              </div>

              {/* Auth Screens */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--deep-teal)' }}>
                    <LogIn className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl" style={{ color: 'var(--deep-teal)' }}>Login / Auth Screens</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(143, 191, 159, 0.2)', color: 'var(--deep-teal)' }}>
                      ✓ Built
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {["Login", "Register", "Forgot Password"].map((screen, i) => (
                    <div key={i} className="p-4 rounded-xl text-center" style={{ background: 'rgba(143, 191, 159, 0.1)' }}>
                      <LogIn className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--sage-green)' }} />
                      <p className="font-semibold text-sm" style={{ color: 'var(--deep-teal)' }}>{screen}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-lg text-xs" style={{ background: 'rgba(0,0,0,0.03)' }}>
                  <strong>Layout:</strong> Centered card (max-width 420px), split-screen on desktop (form + illustration)<br/>
                  <strong>OAuth:</strong> Google, GitHub buttons with brand colors<br/>
                  <strong>Security:</strong> Rate limiting feedback, password strength meter
                </div>
              </div>
            </section>
          )}

          {/* User Flow Section */}
          {activeSection === "flow" && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                    Screen Flow
                  </h1>
                  <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                    Linear, user-centered journey through the platform.
                  </p>
                </div>
                <Link href="/wireframes">
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                    style={{ background: '#eac33b', color: '#2f5d5d' }}
                    data-testid="link-wireframes"
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    View Wireframes
                  </button>
                </Link>
              </div>

              {/* SVG Flow Diagram */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Interactive Flow Diagram</h3>
                <FlowDiagram />
              </div>

              {/* Compact Flow */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Compact Flow View</h3>
                <FlowDiagram compact />
              </div>

              {/* Detailed Flows */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                  <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>New User Flow</h3>
                  <ol className="space-y-3 text-sm">
                    {[
                      "Visit Landing Page",
                      "Click 'Get Started'",
                      "Complete Registration",
                      "4-Step Onboarding",
                      "Arrive at Dashboard",
                      "First AI Chat Session",
                      "Daily Check-in Prompt"
                    ].map((step, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" 
                          style={{ background: 'var(--sage-green)' }}>
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                  <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Returning User Flow</h3>
                  <ol className="space-y-3 text-sm">
                    {[
                      "Visit Landing or Login",
                      "Sign In (or auto-login)",
                      "Dashboard Welcome Back",
                      "View Streak & XP",
                      "Continue Session or Explore",
                      "Access Tools & Resources"
                    ].map((step, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" 
                          style={{ background: 'var(--deep-teal)' }}>
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
          )}

          {/* Responsive Section */}
          {activeSection === "responsive" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  Responsive Grid
                </h1>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Breakpoints and layout behavior across devices.
                </p>
              </div>

              {/* Breakpoints */}
              <div className="grid md:grid-cols-3 gap-6">
                {breakpoints.map(bp => (
                  <div key={bp.name} className="p-6 rounded-2xl text-center" style={{ 
                    background: 'white', 
                    border: '1px solid rgba(143, 191, 159, 0.2)' 
                  }}>
                    <div className="mb-4">
                      {bp.name === "Mobile" && <Smartphone className="w-12 h-12 mx-auto" style={{ color: 'var(--sage-green)' }} />}
                      {bp.name === "Tablet" && <Tablet className="w-12 h-12 mx-auto" style={{ color: 'var(--sage-green)' }} />}
                      {bp.name === "Desktop" && <Monitor className="w-12 h-12 mx-auto" style={{ color: 'var(--sage-green)' }} />}
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--deep-teal)' }}>{bp.name}</h3>
                    <code className="text-sm block mb-2" style={{ color: 'var(--charcoal)' }}>{bp.size}</code>
                    <div className="text-xs space-y-1" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                      <p>Columns: {bp.columns}</p>
                      <p>Padding: {bp.padding}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Layout Behavior */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Layout Behavior</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(143, 191, 159, 0.2)' }}>
                        <th className="text-left py-3 px-4" style={{ color: 'var(--deep-teal)' }}>Component</th>
                        <th className="text-left py-3 px-4" style={{ color: 'var(--deep-teal)' }}>Mobile</th>
                        <th className="text-left py-3 px-4" style={{ color: 'var(--deep-teal)' }}>Tablet</th>
                        <th className="text-left py-3 px-4" style={{ color: 'var(--deep-teal)' }}>Desktop</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { comp: "Navigation", mobile: "Hamburger menu", tablet: "Collapsed sidebar", desktop: "Full horizontal nav" },
                        { comp: "Hero Section", mobile: "Stacked, full-width", tablet: "2-col layout", desktop: "Split hero with illustration" },
                        { comp: "Feature Cards", mobile: "1 column", tablet: "2 columns", desktop: "3 columns" },
                        { comp: "Sidebar", mobile: "Hidden (drawer)", tablet: "Collapsed icons", desktop: "Full with labels" },
                        { comp: "Forms", mobile: "Full width", tablet: "Max 480px centered", desktop: "Max 560px centered" },
                        { comp: "Modals", mobile: "Full screen", tablet: "Centered, 80% width", desktop: "Centered, max 640px" }
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(143, 191, 159, 0.1)' }}>
                          <td className="py-3 px-4 font-semibold" style={{ color: 'var(--deep-teal)' }}>{row.comp}</td>
                          <td className="py-3 px-4" style={{ color: 'var(--charcoal)' }}>{row.mobile}</td>
                          <td className="py-3 px-4" style={{ color: 'var(--charcoal)' }}>{row.tablet}</td>
                          <td className="py-3 px-4" style={{ color: 'var(--charcoal)' }}>{row.desktop}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Accessibility Section */}
          {activeSection === "accessibility" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  Accessibility
                </h1>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  WCAG 2.1 AA compliance guidelines and implementation notes.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Color Contrast",
                    items: [
                      "Text on background: minimum 4.5:1 ratio",
                      "Large text: minimum 3:1 ratio",
                      "Interactive elements: visible focus states",
                      "Don't rely on color alone for meaning"
                    ]
                  },
                  {
                    title: "Keyboard Navigation",
                    items: [
                      "All interactive elements focusable",
                      "Visible focus indicator (gold outline)",
                      "Logical tab order",
                      "Skip-to-content link on all pages"
                    ]
                  },
                  {
                    title: "Screen Readers",
                    items: [
                      "Semantic HTML (header, main, nav, footer)",
                      "ARIA labels on icons and buttons",
                      "Alt text on all images",
                      "Live regions for dynamic content"
                    ]
                  },
                  {
                    title: "Motion & Animations",
                    items: [
                      "Respect prefers-reduced-motion",
                      "No auto-playing videos",
                      "Pause button on carousels",
                      "Subtle, non-distracting animations"
                    ]
                  }
                ].map((section, i) => (
                  <div key={i} className="p-6 rounded-2xl" style={{ 
                    background: 'white', 
                    border: '1px solid rgba(143, 191, 159, 0.2)' 
                  }}>
                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--deep-teal)' }}>
                      <Check className="w-5 h-5" style={{ color: 'var(--sage-green)' }} />
                      {section.title}
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ background: 'var(--sage-green)' }} />
                          <span style={{ color: 'var(--charcoal)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Focus State Example */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Focus State Implementation</h3>
                <div className="p-4 rounded-lg font-mono text-sm" style={{ background: 'rgba(0,0,0,0.03)' }}>
                  <pre style={{ color: 'var(--charcoal)' }}>{`/* Focus visible state */
button:focus-visible,
a:focus-visible {
  outline: 3px solid var(--warm-gold);
  outline-offset: 3px;
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}`}</pre>
                </div>
              </div>
            </section>
          )}

          {/* Wellness Components Section */}
          {activeSection === "wellness" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  Wellness Components
                </h1>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Specialized components designed for trauma-informed mental wellness experiences.
                </p>
              </div>

              {/* Daily Healing Focus Card */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Daily Healing Focus Card</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Dashboard component that displays an inspirational focus message with gradient styling.
                </p>
                <div 
                  className="p-6 rounded-2xl relative overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(47, 93, 93, 0.05), rgba(143, 191, 159, 0.1))',
                    border: '2px solid rgba(143, 191, 159, 0.2)'
                  }}
                >
                  <div 
                    className="absolute top-0 left-1/4 right-1/4 h-1 rounded-b-full"
                    style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }}
                  />
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }}
                    >
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold" style={{ color: 'var(--deep-teal)' }}>Today's Healing Focus</h4>
                      <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                        <em>"Embrace the present moment—it holds everything you need."</em>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(47, 93, 93, 0.05)' }}>
                  <strong>Usage:</strong> Dashboard.jsx - Appears at top of logged-in homepage
                </div>
              </div>

              {/* Quick Nav Grid */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Quick Navigation Grid</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Three-column navigation for quick access to Community, Crisis Support, and Tools.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Q&A Community", color: "#eac33b", bg: "rgba(234, 195, 59, 0.15)" },
                    { label: "Crisis Support", color: "#f4c7c3", bg: "rgba(244, 199, 195, 0.3)" },
                    { label: "Tools Library", color: "#2f5d5d", bg: "rgba(47, 93, 93, 0.1)" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border text-center" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: item.bg }}>
                        <Heart className="w-6 h-6" style={{ color: item.color }} />
                      </div>
                      <span className="font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Trust Badges & Markers</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Visual indicators for verified community members and safe spaces.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium" style={{ background: 'linear-gradient(135deg, rgba(234, 195, 59, 0.2), rgba(234, 195, 59, 0.1))', color: '#b8941e' }}>
                    <Star className="w-4 h-4" /> Trusted Member
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium" style={{ background: 'rgba(143, 191, 159, 0.2)', color: '#2f5d5d' }}>
                    <Shield className="w-4 h-4" /> Verified
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium" style={{ background: 'rgba(244, 199, 195, 0.3)', color: '#8b5a5a' }}>
                    <Check className="w-4 h-4" /> Safe Space
                  </span>
                </div>
              </div>

              {/* Vote Button */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Vote & Engagement Buttons</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Community voting and engagement interaction elements.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    <TrendingUp className="w-4 h-4" /> 24 Helpful
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(47, 93, 93, 0.1)', color: 'var(--deep-teal)', border: '1px solid rgba(47, 93, 93, 0.2)' }}>
                    <TrendingUp className="w-4 h-4" /> 24 Voted
                  </button>
                </div>
              </div>

              {/* Media Type Badges */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Media Type Badges</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Content type indicators for articles, videos, and audio content.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    <FileText className="w-3 h-3" /> Article
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                    <Eye className="w-3 h-3" /> Video
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(47, 93, 93, 0.1)', color: 'var(--deep-teal)' }}>
                    <Bell className="w-3 h-3" /> Audio
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Gold Iconography Section - Canva AI Design System */}
          {activeSection === "iconography" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  Gold Wellness Iconography
                </h1>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Platform-specific icons in gold and brand palette per Canva AI Design System.
                </p>
              </div>

              {/* Icon Gallery */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Icon Styles</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: "Gold Highlight", class: "icon-wellness icon-wellness-lg icon-wellness-gold", desc: "Primary CTAs" },
                    { name: "Healing Heart", class: "icon-wellness icon-wellness-lg icon-healing-heart", desc: "Wellness focus" },
                    { name: "Lotus/Growth", class: "icon-wellness icon-wellness-lg icon-lotus", desc: "Progress" },
                    { name: "Wisdom", class: "icon-wellness icon-wellness-lg icon-wisdom", desc: "Quotes" },
                    { name: "Gold Soft", class: "icon-wellness icon-wellness-lg icon-wellness-gold-soft", desc: "Subtle accent" },
                    { name: "Gold Outline", class: "icon-wellness icon-wellness-lg icon-wellness-gold-outline", desc: "Secondary" },
                    { name: "CRM", class: "icon-wellness icon-wellness-lg icon-crm", desc: "Dashboard" },
                    { name: "Community", class: "icon-wellness icon-wellness-lg icon-community", desc: "Q&A" }
                  ].map((icon, i) => (
                    <div key={i} className="text-center">
                      <div className={icon.class + " mx-auto mb-3"}>
                        <Heart className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--deep-teal)' }}>{icon.name}</p>
                      <p className="text-xs" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>{icon.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Icon Sizes */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Icon Sizes</h3>
                <div className="flex items-end gap-8 justify-center">
                  {[
                    { size: "sm", dim: "2rem" },
                    { size: "md", dim: "3rem" },
                    { size: "lg", dim: "4rem" },
                    { size: "xl", dim: "5rem" }
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className={`icon-wellness icon-wellness-${s.size} icon-wellness-gold mx-auto mb-2`}>
                        <Sparkles className="w-full h-full" />
                      </div>
                      <code className="text-xs" style={{ color: 'var(--charcoal)' }}>{s.size} ({s.dim})</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Code */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>CSS Classes</h3>
                <div className="p-4 rounded-lg font-mono text-sm overflow-x-auto" style={{ background: 'rgba(0,0,0,0.03)' }}>
                  <pre style={{ color: 'var(--charcoal)' }}>{`/* Gold wellness icon example */
<div className="icon-wellness icon-wellness-lg icon-wellness-gold">
  <Heart className="w-6 h-6" aria-hidden="true" />
</div>

/* Available classes */
.icon-wellness          // Base container
.icon-wellness-sm/md/lg/xl  // Sizes
.icon-wellness-gold     // Gold gradient
.icon-wellness-gold-soft    // Subtle gold
.icon-wellness-gold-outline // Gold border
.icon-healing-heart     // Blush gradient
.icon-lotus             // Sage gradient
.icon-wisdom            // Teal with gold icon
.icon-crm              // Gold-rose gradient
.icon-community        // Sage-rose gradient
.icon-wellness-animated // Breathing animation`}</pre>
                </div>
              </div>
            </section>
          )}

          {/* Dev Handoff Specs Section - Canva AI Design System */}
          {activeSection === "devspecs" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  Dev Handoff Specs
                </h1>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Developer specifications for Canva AI Design System implementation.
                </p>
              </div>

              {/* UI Component Labels */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>UI Component Labels</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Standard naming conventions for code export and developer handoff.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Navbar", "CTA", "Modal", "Input Field", 
                    "Testimonial Block", "Newsletter Form", "Card", "Badge",
                    "Hero Section", "Footer", "Sidebar", "Accordion"
                  ].map((label, i) => (
                    <span key={i} className="ui-component-label">{label}</span>
                  ))}
                </div>
              </div>

              {/* Breakpoint Specs */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Breakpoint Specifications</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "Mobile", badge: "breakpoint-mobile", size: "< 640px", desc: "1 column, 16px padding" },
                    { name: "Tablet", badge: "breakpoint-tablet", size: "640px - 1024px", desc: "2 columns, 24px padding" },
                    { name: "Desktop", badge: "breakpoint-desktop", size: "> 1024px", desc: "3-4 columns, 32px padding" }
                  ].map((bp, i) => (
                    <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(47, 93, 93, 0.03)' }}>
                      <span className={`breakpoint-badge ${bp.badge} mb-3`}>{bp.name}</span>
                      <p className="font-mono text-sm mt-2" style={{ color: 'var(--deep-teal)' }}>{bp.size}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>{bp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* HTML ID/Class Suggestions */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Suggested HTML IDs & Classes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(143, 191, 159, 0.2)' }}>
                        <th className="text-left py-3 px-4" style={{ color: 'var(--deep-teal)' }}>Element</th>
                        <th className="text-left py-3 px-4" style={{ color: 'var(--deep-teal)' }}>ID</th>
                        <th className="text-left py-3 px-4" style={{ color: 'var(--deep-teal)' }}>Class</th>
                        <th className="text-left py-3 px-4" style={{ color: 'var(--deep-teal)' }}>data-testid</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-xs">
                      {[
                        { el: "Header Nav", id: "#main-nav", cls: ".canva-header", test: "nav-main" },
                        { el: "Hero CTA", id: "#hero-cta", cls: ".btn-primary", test: "button-hero-cta" },
                        { el: "Daily Focus", id: "#daily-focus", cls: ".daily-focus-card", test: "card-daily-focus" },
                        { el: "Content Card", id: "#content-{id}", cls: ".card-bordered", test: "link-content-{id}" },
                        { el: "Q&A Post", id: "#post-{id}", cls: ".glass-card", test: "card-post-{id}" },
                        { el: "Vote Button", id: "#vote-{id}", cls: ".btn-ghost", test: "button-vote-{id}" }
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(143, 191, 159, 0.1)' }}>
                          <td className="py-3 px-4" style={{ color: 'var(--deep-teal)' }}>{row.el}</td>
                          <td className="py-3 px-4" style={{ color: 'var(--charcoal)' }}>{row.id}</td>
                          <td className="py-3 px-4" style={{ color: 'var(--charcoal)' }}>{row.cls}</td>
                          <td className="py-3 px-4" style={{ color: 'var(--sage-green)' }}>{row.test}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Accessibility Tags */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Accessibility Tags</h3>
                <div className="space-y-3">
                  {[
                    { tag: "aria-label", example: 'aria-label="Save for later"', usage: "Icon-only buttons" },
                    { tag: "aria-hidden", example: 'aria-hidden="true"', usage: "Decorative icons" },
                    { tag: "role", example: 'role="tab"', usage: "Tab navigation" },
                    { tag: "aria-selected", example: 'aria-selected="true"', usage: "Active tab state" },
                    { tag: "data-testid", example: 'data-testid="button-submit"', usage: "All interactive elements" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: 'rgba(47, 93, 93, 0.03)' }}>
                      <span className="a11y-tag">{item.tag}</span>
                      <code className="text-xs" style={{ color: 'var(--charcoal)' }}>{item.example}</code>
                      <span className="text-xs ml-auto" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>{item.usage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screen Flow */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-6" style={{ color: 'var(--deep-teal)' }}>Screen Flow Navigation</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  User journey flow between the 7 core screens.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                  {[
                    { name: "Landing", icon: Home },
                    { name: "Onboarding", icon: Sparkles },
                    { name: "Homepage", icon: LayoutDashboard },
                    { name: "CRM", icon: Users },
                    { name: "Content", icon: BookOpen },
                    { name: "Q&A", icon: MessageCircle },
                    { name: "Auth", icon: LogIn }
                  ].map((screen, i, arr) => {
                    const Icon = screen.icon;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(47, 93, 93, 0.08)' }}>
                          <Icon className="w-4 h-4" style={{ color: 'var(--deep-teal)' }} />
                          <span style={{ color: 'var(--deep-teal)' }}>{screen.name}</span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className="flow-arrow-icon">
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Developer Checklist Section */}
          {activeSection === "checklist" && (
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--deep-teal)' }}>
                  Developer Checklist
                </h1>
                <p style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Implementation checklist for building trauma-informed, accessible wellness features.
                </p>
              </div>

              {/* Implementation Checklist */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "UI/UX Requirements",
                    items: [
                      "Use calming color palette (sage, teal, rose)",
                      "Implement breathing pulse animations",
                      "Add subtle hover transitions (0.2s ease)",
                      "Include rounded corners (xl to 3xl)",
                      "Use gradient backgrounds for focus areas",
                      "Add soft shadows (shadow-sm to shadow-lg)"
                    ]
                  },
                  {
                    title: "Accessibility",
                    items: [
                      "Add data-testid to all interactive elements",
                      "Include aria-labels on icon buttons",
                      "Ensure 4.5:1 color contrast ratio",
                      "Support keyboard navigation",
                      "Respect prefers-reduced-motion",
                      "Use semantic HTML (nav, main, section)"
                    ]
                  },
                  {
                    title: "Trauma-Informed Design",
                    items: [
                      "Use supportive, non-clinical language",
                      "Provide clear exit/escape options",
                      "Avoid sudden content changes",
                      "Include content warnings where appropriate",
                      "Offer low-stim mode options",
                      "Never auto-play audio or video"
                    ]
                  },
                  {
                    title: "Component Standards",
                    items: [
                      "Follow existing component patterns",
                      "Use Tailwind CSS utilities",
                      "Import icons from lucide-react",
                      "Add loading/skeleton states",
                      "Handle error states gracefully",
                      "Test on mobile (touch targets 44px+)"
                    ]
                  }
                ].map((section, i) => (
                  <div key={i} className="p-6 rounded-2xl" style={{ 
                    background: 'white', 
                    border: '1px solid rgba(143, 191, 159, 0.2)' 
                  }}>
                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--deep-teal)' }}>
                      <Check className="w-5 h-5" style={{ color: 'var(--sage-green)' }} />
                      {section.title}
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <input type="checkbox" className="mt-0.5 w-4 h-4 rounded accent-teal-500" />
                          <span style={{ color: 'var(--charcoal)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Code Standards */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Code Standards</h3>
                <div className="p-4 rounded-lg font-mono text-sm overflow-x-auto" style={{ background: 'rgba(0,0,0,0.03)' }}>
                  <pre style={{ color: 'var(--charcoal)' }}>{`/* Wellness Component Pattern */
const WellnessCard = ({ title, description, icon: Icon }) => {
  return (
    <div 
      className="p-6 rounded-2xl transition-all hover:-translate-y-1"
      style={{ 
        background: 'linear-gradient(135deg, rgba(47, 93, 93, 0.05), rgba(143, 191, 159, 0.1))',
        border: '2px solid rgba(143, 191, 159, 0.2)'
      }}
      data-testid="card-wellness"
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }}
        >
          <Icon className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--deep-teal)' }}>{title}</h3>
          <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>{description}</p>
        </div>
      </div>
    </div>
  );
};`}</pre>
                </div>
              </div>

              {/* File Structure */}
              <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--deep-teal)' }}>Key File Locations</h3>
                <div className="space-y-2 text-sm font-mono">
                  {[
                    { file: "client/src/pages/Dashboard.jsx", desc: "Logged-in homepage with wellness widgets" },
                    { file: "client/src/pages/CanvaLanding.jsx", desc: "Public landing page with brand styling" },
                    { file: "client/src/pages/ContentIndexPage.jsx", desc: "Content Hub with search and filters" },
                    { file: "client/src/features/community/SharedReflectionsPage.jsx", desc: "Q&A Community page" },
                    { file: "client/src/pages/Admin.jsx", desc: "CRM Dashboard with user metrics" },
                    { file: "client/src/styles/canva-landing.css", desc: "Brand CSS variables and utilities" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <code style={{ color: 'var(--deep-teal)' }}>{item.file}</code>
                      <span style={{ color: 'var(--charcoal)', opacity: 0.7 }}>— {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  </WellnessPageShell>
  );
}
