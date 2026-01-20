import { Link } from "wouter";

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} The Genuine Love Project
          <div className="mt-1 text-xs">
            Not medical advice. Not a crisis service. If you're in danger, contact
            local emergency services. (U.S.: 988)
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link className="hover:underline" to="/disclaimer">Disclaimer</Link>
          <Link className="hover:underline" to="/privacy">Privacy</Link>
          <Link className="hover:underline" to="/terms">Terms</Link>
          <Link className="hover:underline" to="/crisis">Crisis Support</Link>
        </nav>
      </div>
    </footer>
  );
}
