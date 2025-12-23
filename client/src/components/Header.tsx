import { Link } from "wouter";
import { brand } from "../brand/tokens";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-gray-900">
      <Link href="/" className="flex items-center gap-3">
        <img
          src={brand.assets.logo}
          alt={brand.name}
          className="h-12 w-auto"
          data-testid="header-logo"
        />
        <span className="font-serif text-xl font-semibold text-gray-900 dark:text-white">
          Genuine Love
        </span>
      </Link>

      <nav className="flex gap-6 items-center">
        <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          About
        </Link>
        <Link href="/journal" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          Journal
        </Link>
        <Link href="/wellness" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          Wellness
        </Link>
        <Link href="/login" className="btn-primary px-4 py-2 rounded-lg bg-[var(--glp-sage)] text-white hover:opacity-90" data-testid="header-get-started">
          Get Started
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="py-6 px-4 text-center border-t bg-gray-50 dark:bg-gray-900">
      <small className="text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} {brand.name}. {brand.tagline}
      </small>
    </footer>
  );
}
