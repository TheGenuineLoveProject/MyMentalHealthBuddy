import { Link } from "wouter";
import { Heart, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@shared/brand";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
          <Heart 
            className="h-6 w-6 transition-transform group-hover:scale-110" 
            style={{ color: BRAND.colors.primary }}
            fill={BRAND.colors.primary}
          />
          <span className="font-serif text-xl font-semibold text-gray-900">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-dashboard">
            Dashboard
          </Link>
          <Link href="/wellness" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-wellness">
            Wellness Tools
          </Link>
          <Link href="/journal" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-journal">
            Journal
          </Link>
          <Link 
            href="/register" 
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: BRAND.colors.primary }}
            data-testid="link-get-started"
          >
            <Sparkles className="h-4 w-4" />
            Get Started
          </Link>
        </nav>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/dashboard" className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2" data-testid="link-mobile-dashboard">
            Dashboard
          </Link>
          <Link href="/wellness" className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2" data-testid="link-mobile-wellness">
            Wellness Tools
          </Link>
          <Link href="/journal" className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2" data-testid="link-mobile-journal">
            Journal
          </Link>
          <Link 
            href="/register" 
            className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: BRAND.colors.primary }}
            data-testid="link-mobile-get-started"
          >
            <Sparkles className="h-4 w-4" />
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
