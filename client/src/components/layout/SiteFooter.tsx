import { Link } from "wouter";

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} The Genuine Love Project
            <div className="mt-1 text-xs">
              Not medical advice. Not a crisis service. If you're in danger, contact
              local emergency services. (U.S.: 988)
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm" aria-label="Footer navigation">
            <Link className="hover:underline" to="/blog" data-testid="link-footer-blog">Blog</Link>
            <Link className="hover:underline" to="/newsletter" data-testid="link-footer-newsletter">Newsletter</Link>
            <Link className="hover:underline" to="/disclaimer">Disclaimer</Link>
            <Link className="hover:underline" to="/privacy">Privacy</Link>
            <Link className="hover:underline" to="/terms">Terms</Link>
            <Link className="hover:underline" to="/crisis">Crisis Support</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
