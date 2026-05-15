import { Link } from "wouter";

type ResolvedLink = { 
  label: string; 
  routeKey: string; 
  href: string; 
};

export function RelatedLinksBlock({ 
  links = [],
  title = "Next best step",
  subtitle = "Choose one"
}: { 
  links?: ResolvedLink[]; 
  title?: string;
  subtitle?: string;
}) {
  if (!links?.length) return null;

  return (
    <section 
      className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4"
      data-testid="section-related-links"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <span className="text-xs opacity-70">{subtitle}</span>
      </div>

      <div className="mt-3 grid gap-2">
        {links.map((l, idx) => (
          <Link 
            key={l.routeKey} 
            href={l.href} 
            className="block"
            data-testid={`link-related-${idx}`}
          >
            <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 hover:bg-black/20 transition flex items-center justify-between gap-3">
              <div className="text-sm font-medium">{l.label}</div>
              <span className="text-xs opacity-60" aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}