import { Link, useLocation } from "wouter";
import { BRAND } from "@shared/brand.mjs";
import { Home, LayoutDashboard, Settings, Heart } from "lucide-react";
import BuddyAvatar from "./avatar/BuddyAvatar";

function NavLink({ href, children, className = "", active = false }) {
  return (
    <Link
      href={href}
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
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/wellness", label: "Wellness", icon: Heart },
    { href: "/settings", label: "Settings", icon: Settings },
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
            className="h-10 w-10 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)', boxShadow: '0 2px 10px var(--glp-sage-deep-12)' }}
          >
            <BuddyAvatar state="calm" size={40} className="w-full h-full" />
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
              data-testid={`nav-${label.toLowerCase()}`}
            >
              <Icon className="icon-sm" aria-hidden="true" />
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
