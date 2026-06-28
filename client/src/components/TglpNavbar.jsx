import { Link, useLocation } from "wouter";
import {
  Sparkles, BookOpen, LayoutDashboard, Heart, Menu, X, Home, MessageCircle,
  Search, Crown, ChevronDown, LifeBuoy, Wrench, Compass, Info,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ModeToggle from "./ModeToggle.jsx";
import GlobalSearch from "./GlobalSearch.jsx";
import { useAuth } from "../context/AuthContext";
import LumiMascot from "./lumi/LumiMascot.jsx";
import { WELLNESS_HUB_TOOLS } from "../content/tools/toolsRegistry.js";
// PHASE115N_TGLP_NAVBAR_SHARED_BUTTON_POLISH_PATCH

// PHASE114V_FIX_TGLP_NAVBAR_BRAND_VISUAL_POLISH_PATCH

function ProBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: "linear-gradient(135deg, var(--glp-gold-400, #d4a843) 0%, var(--glp-gold-500, #c49a38) 100%)",
        color: "var(--glp-sage-deep, #1a3a2a)",
        boxShadow: "0 1px 3px rgba(196, 154, 56, 0.3)",
      }}
      data-testid="badge-pro"
      aria-label="Pro member"
    >
      <Crown className="w-3 h-3" aria-hidden="true" />
      Pro
    </span>
  );
}

// Phase 153: full nav surface — every link below is route-verified live in App.jsx.
const PRIMARY_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "AI Chat", icon: MessageCircle },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/crisis", label: "Crisis", icon: LifeBuoy },
];

const TOPIC_LINKS = [
  { href: "/healing", label: "Healing" },
  { href: "/wellbeing", label: "Wellbeing" },
  { href: "/mental-wellness", label: "Mental Wellness" },
  { href: "/self-love", label: "Self Love" },
  { href: "/growth", label: "Growth" },
  { href: "/depression", label: "Depression" },
  { href: "/anxiety", label: "Anxiety" },
  { href: "/resilience", label: "Resilience" },
  { href: "/mood", label: "Mood Tracker" },
];

const ABOUT_LINKS = [
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/privacy", label: "Privacy" },
  { href: "/trust", label: "Trust Center" },
];

// Tools dropdown sourced from the canonical registry so visibility tracks tools data.
const TOOL_LINKS = [
  { href: "/wellness-tools-hub", label: "Wellness Tools Hub" },
  { href: "/tools/all", label: "All Tools" },
  ...WELLNESS_HUB_TOOLS.map((t) => ({ href: t.href, label: t.title })),
];

function Dropdown({ id, label, icon: Icon, items, openId, setOpenId, isActive }) {
  const open = openId === id;
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpenId(null);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpenId(null); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpenId]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpenId(open ? null : id)}
        className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-[var(--glp-deep-teal)] hover:bg-[var(--glp-sage)]/15 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2"
        aria-haspopup="menu"
        aria-expanded={open}
        data-testid={`button-nav-${id}`}
      >
        {Icon && <Icon className="w-4 h-4 text-[var(--glp-sage)]" />}
        <span>{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 max-h-[70vh] overflow-y-auto rounded-xl border border-[var(--glp-sage-15)] bg-[var(--glp-paper)] shadow-lg py-2 z-50"
          data-testid={`menu-nav-${id}`}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpenId(null)}
              className={`block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--glp-sage)]/10 ${
                isActive(item.href)
                  ? "text-[var(--glp-sage-deep)] bg-[var(--glp-sage)]/10 font-semibold"
                  : "text-[var(--glp-ink)]"
              }`}
              aria-current={isActive(item.href) ? "page" : undefined}
              data-testid={`link-${id}-${item.href.replace(/\W+/g, "-")}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TglpNavbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openId, setOpenId] = useState(null);
  const { user, isPro } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location === path;

  return (
    <header
      className={`tglp-nav-root sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[var(--glp-paper)]/95 backdrop-blur-lg shadow-sm border-b border-[var(--glp-sage-10)]"
          : "bg-transparent"
      }`}
      style={{ paddingTop: "var(--glp-safe-top)" }}
      role="banner"
      data-testid="navbar-main"
    >
      <div className="mx-auto flex h-24 md:h-28 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12 gap-6">

        {/* Left: Mode Toggle */}
        <div className="hidden md:flex items-center shrink-0">
          <ModeToggle />
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          className="flex items-center gap-4 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 rounded-2xl py-2 px-3 transition-all hover:bg-[var(--glp-sage)]/10"
          aria-label="MyMentalHealthBuddy home"
          data-testid="link-brand-home"
        >
          <div
            className="relative size-12 md:size-14 flex items-center justify-center overflow-hidden rounded-full border border-[var(--glp-sage-15)] bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.92),rgba(143,191,159,0.24)_44%,rgba(47,93,93,0.12))] shadow-[0_10px_30px_rgba(47,93,93,0.16)] transition-transform group-hover:scale-105"
          >
            <LumiMascot emotion="neutral" size={40} className="size-full drop-shadow-sm" data-testid="img-brand-logo" />
            <Heart className="hidden size-7 md:size-8 text-[var(--glp-sage)] drop-shadow-sm" fill="currentColor" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-xl md:text-2xl font-semibold tracking-tight font-sacred text-[var(--glp-sage-deep)]" data-testid="text-brand-name">
              MyMentalHealthBuddy
            </span>
            <span className="text-sm md:text-base font-medium tracking-wide text-[var(--glp-sage-deep)]">
              by The Genuine Love Project
            </span>
          </div>
        </Link>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-2 md:gap-3 shrink-0" aria-label="Main navigation">
          <div className="hidden">
            <GlobalSearch />
          </div>

          {/* Desktop primary links */}
          {PRIMARY_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`hidden md:flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-[var(--glp-sage)]/15 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 ${
                isActive(href)
                  ? "bg-[var(--glp-sage)]/15 text-[var(--glp-sage-deep)]"
                  : "text-[var(--glp-ink)]"
              }`}
              aria-current={isActive(href) ? "page" : undefined}
              data-testid={`link-${label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Icon className="w-4 h-4 text-[var(--glp-sage)]" />
              <span>{label}</span>
            </Link>
          ))}

          {/* Dropdowns */}
          <Dropdown id="topics" label="Topics" icon={Compass} items={TOPIC_LINKS} openId={openId} setOpenId={setOpenId} isActive={isActive} />
          <Dropdown id="tools" label="Tools" icon={Wrench} items={TOOL_LINKS} openId={openId} setOpenId={setOpenId} isActive={isActive} />
          <Dropdown id="about" label="About" icon={Info} items={ABOUT_LINKS} openId={openId} setOpenId={setOpenId} isActive={isActive} />

          {user ? (
            <>
              {isPro ? (
                <div className="hidden md:block"><ProBadge /></div>
              ) : user && (
                <Link
                  href="/account/billing"
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-90"
                  style={{
                    border: "1px solid var(--glp-gold, #d4a843)",
                    color: "var(--glp-sage-deep)",
                  }}
                  data-testid="link-navbar-upgrade"
                >
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  Upgrade
                </Link>
              )}
              <Link
                href="/dashboard"
                className="btn-header-cta flex items-center gap-2.5 rounded-full px-5 md:px-6 py-3 md:py-3.5 text-sm font-bold text-[var(--glp-deep-teal)] hover:opacity-95 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 shadow-[0_12px_30px_rgba(212,175,55,0.28)]"
                style={{ background: "var(--glp-gold-gradient)", boxShadow: "var(--glp-gold-shadow)" }}
                data-testid="link-dashboard-cta"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span className="cta-label-full">Dashboard</span>
                <span className="cta-label-short">Go</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-header-secondary hidden md:flex items-center px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--glp-sage)]/15 hover:-translate-y-0.5 text-[var(--glp-deep-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2"
                data-testid="link-login"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="btn-header-cta flex items-center gap-2.5 rounded-full px-5 md:px-6 py-3 md:py-3.5 text-sm font-bold text-[var(--glp-deep-teal)] hover:opacity-95 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 shadow-[0_12px_30px_rgba(212,175,55,0.28)]"
                style={{ background: "var(--glp-gold-gradient)", boxShadow: "var(--glp-gold-shadow)" }}
                data-testid="link-register"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span className="cta-label-full">Get Started</span>
                <span className="cta-label-short">Start</span>
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl transition-colors hover:bg-[var(--glp-sage)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[var(--glp-sage-deep)]" />
            ) : (
              <Menu className="w-6 h-6 text-[var(--glp-sage-deep)]" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu — renders only when open; overlays page (absolute, does not push layout) */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute left-0 right-0 top-full z-50 px-4 py-4 space-y-1 bg-[var(--glp-paper)] border-t border-[var(--glp-sage-10)] max-h-[80vh] overflow-y-auto shadow-2xl"
          data-testid="menu-mobile"
        >
          {/* Mobile Search */}
          <div className="px-4 py-2 md:hidden">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--glp-sage)]/[0.08] border border-[var(--glp-sage-15)]">
              <Search className="w-4 h-4 text-[var(--glp-sage)]" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm outline-none text-[var(--glp-ink)]"
                aria-label="Search"
              />
            </div>
          </div>

          {/* Primary */}
          {PRIMARY_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-[var(--glp-sage)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 ${
                isActive(href)
                  ? "bg-[var(--glp-sage)]/15 text-[var(--glp-sage-deep)]"
                  : "text-[var(--glp-ink)]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
              data-testid={`link-mobile-${label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Icon className="w-5 h-5 text-[var(--glp-sage)]" />
              <span>{label}</span>
            </Link>
          ))}

          {/* Topics group */}
          <div className="pt-3 mt-2 border-t border-[var(--glp-sage-10)]">
            <div className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-[var(--glp-sage)]/80">Topics</div>
            {TOPIC_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--glp-deep-teal)] hover:bg-[var(--glp-sage)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2"
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`link-mobile-topic-${href.replace(/\W+/g, "-")}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Tools group */}
          <div className="pt-3 mt-2 border-t border-[var(--glp-sage-10)]">
            <div className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-[var(--glp-sage)]/80">Tools</div>
            {TOOL_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--glp-deep-teal)] hover:bg-[var(--glp-sage)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2"
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`link-mobile-tool-${href.replace(/\W+/g, "-")}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* About group */}
          <div className="pt-3 mt-2 border-t border-[var(--glp-sage-10)]">
            <div className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-[var(--glp-sage)]/80">About</div>
            {ABOUT_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--glp-deep-teal)] hover:bg-[var(--glp-sage)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2"
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`link-mobile-about-${href.replace(/\W+/g, "-")}`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="pt-3 mt-3 border-t border-[var(--glp-sage-10)]">
            <div className="px-4 mb-2">
              <ModeToggle />
            </div>
          </div>

          <div className="pt-4 px-4 space-y-2">
            {user ? (
              <>
                {isPro ? (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <ProBadge />
                    <span className="text-xs text-[var(--glp-ink-60)]">Premium member</span>
                  </div>
                ) : (
                  <Link
                    href="/account/billing"
                    className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                    style={{
                      border: "1px solid var(--glp-gold, #d4a843)",
                      color: "var(--glp-gold-dark, #a07d2e)",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-upgrade"
                  >
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    Explore Pro
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="btn-header-cta flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[var(--glp-deep-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 shadow-[0_12px_30px_rgba(212,175,55,0.24)]"
                  style={{ background: "var(--glp-gold-gradient)" }}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="link-mobile-dashboard"
                >
                  <Sparkles className="w-4 h-4" />
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-center px-4 py-3 rounded-xl text-sm font-medium transition-all text-[var(--glp-sage-deep)] border border-[var(--glp-sage-deep-20)]"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="link-mobile-signin"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="btn-header-cta flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[var(--glp-deep-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 shadow-[0_12px_30px_rgba(212,175,55,0.24)]"
                  style={{ background: "var(--glp-gold-gradient)" }}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="link-mobile-get-started"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
