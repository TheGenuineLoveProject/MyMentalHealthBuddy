import { DISCLAIMERS_COPY } from "../copy/disclaimers";
import { BRAND } from "@shared/brand.mjs";
import { Link } from "wouter";
import { Heart, Shield, FileText, AlertCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]" data-testid="footer">
      <div className="container-lg px-responsive py-8">
        <div className="flex-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="/brand/logo-mark.png" 
              alt={BRAND.name}
              className="w-10 h-10 object-contain"
              draggable="false"
            />
            <div className="stack-xs">
              <span className="text-heading-sm text-brand">{BRAND.name}</span>
              <span className="text-body-sm text-secondary">{BRAND.tagline}</span>
            </div>
          </div>

          <nav className="flex items-center gap-6 flex-wrap" aria-label="Footer navigation">
            <Link 
              to="/privacy" 
              className="text-body-sm text-secondary hover:text-brand transition flex items-center gap-1.5 focus-ring rounded-md px-1"
              data-testid="link-privacy"
            >
              <Shield className="icon-xs" aria-hidden="true" />
              Privacy
            </Link>
            <Link 
              to="/terms" 
              className="text-body-sm text-secondary hover:text-brand transition flex items-center gap-1.5 focus-ring rounded-md px-1"
              data-testid="link-terms"
            >
              <FileText className="icon-xs" aria-hidden="true" />
              Terms
            </Link>
            <Link 
              to="/disclaimer" 
              className="text-body-sm text-secondary hover:text-brand transition flex items-center gap-1.5 focus-ring rounded-md px-1"
              data-testid="link-disclaimer"
            >
              <AlertCircle className="icon-xs" aria-hidden="true" />
              Disclaimer
            </Link>
            <Link 
              to="/crisis" 
              className="text-body-sm text-accent hover:text-[var(--accent-rose)] transition flex items-center gap-1.5 focus-ring rounded-md px-1 font-medium"
              data-testid="link-crisis"
            >
              <Heart className="icon-xs" aria-hidden="true" />
              Crisis Help
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <p className="text-caption text-center text-secondary">
            &copy; {currentYear} {BRAND.name}. All rights reserved. Live in Genuine Love.
          </p>
        </div>
      </div>
    </footer>
  );
}
