import { BrandLogo } from "./BrandLogo";
import { Link } from "react-router-dom";
import { BRAND } from "@shared/brand.mjs";

        export function Header() {
          return (
            <header style={{ background: BRAND.colors.background }}>
              <h1 style={{ color: BRAND.colors.primary }}>
                {BRAND.name}
              </h1>
              <p>{BRAND.tagline}</p>
            </header>
          );
        }
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/brand/logo.png"
          alt={BRAND.name}
          className="h-10 w-auto"
        />
        <span className="font-serif text-xl font-semibold">
          {BRAND.name}
        </span>
      </Link>

      <nav className="flex gap-6 items-center">
        <Link to="/about">About</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/healing">Healing</Link>
        <Link to="/signin" className="btn-primary">
          Get Started
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <small>
        © {new Date().getFullYear()} {BRAND.name}
      </small>
    </footer>
  );
}