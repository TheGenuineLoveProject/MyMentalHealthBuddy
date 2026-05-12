import { Link, useLocation } from "wouter";
import { BRAND } from "@shared/brand.mjs";
import { Home, Sparkles, ClipboardCheck, MessageCircle, BookOpen } from "lucide-react";
import LumiMascot from "./lumi/LumiMascot.jsx";

function NavLink({ href, children, className = "", active = false, ...props }) {
  return (
    <Link
      href={href}
      {...props}
      className={[
        "inline-flex items-center gap-2 rounded-lg px-3 py-2",
        "text-sm font-medium transition-all",
        active
          ? "text-brand bg-[var(--primary-soft)]"
          : "text-secondary hover:text-brand hover:bg-[var(--surface-hover)]",
        "focus-ring",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/tools", label: "Tools", icon: Sparkles },
    { href: "/checkin", label: "Check-In", icon: ClipboardCheck },
    { href: "/companion", label: "Companion", icon: MessageCircle },
    { href: "/journal", label: "Journal", icon: BookOpen },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--bg)]/70"
      data-testid="header"
    >
      <div className="container-lg flex h-16 items-center px-responsive">
        <div className="flex flex-1 items-center">
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-3 rounded-lg px-3 py-2 focus-ring transition hover:bg-[var(--surface-hover)]"
          aria-label={`${BRAND?.name ?? "Home"} home`}
          data-testid="link-brand"
        >
          <span
            aria-hidden="true"
            className="h-11 w-11 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 50% 55%, var(--glp-sage-10) 0%, transparent 72%)',
              overflow: 'visible',
            }}
            data-testid="img-header-logo"
          >
            <LumiMascot emotion="neutral" size={40} interactive={false} />
          </span>
          <span className="hidden sm:inline text-heading-sm text-brand tracking-tight">
            {BRAND?.name}
          </span>
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-1" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <NavLink 
              key={href} 
              href={href} 
              active={location === href}
              data-testid={`nav-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            >
              <Icon className="icon-sm" aria-hidden="true" />
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
          <Link
            href="/login"
            className="ml-2 inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:text-brand hover:bg-[var(--surface-hover)] focus-ring transition-all"
            data-testid="nav-login"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="ml-1 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white focus-ring transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 2px 8px rgba(var(--glp-sage-deep-rgb), 0.2)' }}
            data-testid="nav-get-started"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
