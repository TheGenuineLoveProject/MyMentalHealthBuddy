import { Info, Users, Clock, Lightbulb, ListChecks, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function ClarityCard({
  what,
  who,
  when,
  why,
  howSteps = [],
  whereLinkText = "See where this fits",
  whereHref = "/system-map",
  className = "",
  variant = "full",
}) {
  if (variant === "compact") {
    return (
      <div
        className={`p-4 rounded-xl border bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))] border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] ${className}`}
        data-testid="clarity-card-compact"
        role="region"
        aria-label="Quick overview"
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))]"
            aria-hidden="true"
          >
            <Lightbulb className="w-4 h-4 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]" />
          </div>
          <div>
            <p className="text-sm text-foreground font-medium" data-testid="text-clarity-what">
              {what}
            </p>
            {whereHref && (
              <Link
                href={whereHref}
                className="text-xs underline text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))] hover:text-[hsl(var(--sage-700))] dark:hover:text-[hsl(var(--sage-200))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sage-500))] focus-visible:ring-offset-2 rounded mt-1 inline-block"
                data-testid="link-clarity-where"
              >
                {whereLinkText}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`p-6 rounded-2xl border bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))] border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] ${className}`}
      data-testid="clarity-card-full"
      aria-labelledby="clarity-card-title"
    >
      <h3
        id="clarity-card-title"
        className="sr-only"
      >
        How this works
      </h3>

      <ul className="space-y-4" data-testid="list-clarity-items">
        <li className="flex items-start gap-3" data-testid="item-clarity-what">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))]"
            aria-hidden="true"
          >
            <Info className="w-4 h-4 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              What this is
            </span>
            <p className="text-sm text-foreground mt-0.5" data-testid="text-clarity-what">
              {what}
            </p>
          </div>
        </li>

        <li className="flex items-start gap-3" data-testid="item-clarity-who">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[hsl(var(--rose-100))] dark:bg-[hsl(var(--rose-800))]"
            aria-hidden="true"
          >
            <Users className="w-4 h-4 text-[hsl(var(--rose-600))] dark:text-[hsl(var(--rose-300))]" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Who it helps
            </span>
            <p className="text-sm text-foreground mt-0.5" data-testid="text-clarity-who">
              {who}
            </p>
          </div>
        </li>

        <li className="flex items-start gap-3" data-testid="item-clarity-when">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[hsl(var(--amber-100))] dark:bg-[hsl(var(--amber-800))]"
            aria-hidden="true"
          >
            <Clock className="w-4 h-4 text-[hsl(var(--amber-600))] dark:text-[hsl(var(--amber-300))]" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              When to use
            </span>
            <p className="text-sm text-foreground mt-0.5" data-testid="text-clarity-when">
              {when}
            </p>
          </div>
        </li>

        <li className="flex items-start gap-3" data-testid="item-clarity-why">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[hsl(var(--teal-100))] dark:bg-[hsl(var(--teal-800))]"
            aria-hidden="true"
          >
            <Lightbulb className="w-4 h-4 text-[hsl(var(--teal-600))] dark:text-[hsl(var(--teal-300))]" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Why it works
            </span>
            <p className="text-sm text-foreground mt-0.5" data-testid="text-clarity-why">
              {why}
            </p>
          </div>
        </li>

        {howSteps.length > 0 && (
          <li className="flex items-start gap-3" data-testid="item-clarity-how">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[hsl(var(--purple-100))] dark:bg-[hsl(var(--purple-800))]"
              aria-hidden="true"
            >
              <ListChecks className="w-4 h-4 text-[hsl(var(--purple-600))] dark:text-[hsl(var(--purple-300))]" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                How to do it
              </span>
              <ol className="mt-1 space-y-1" data-testid="list-clarity-how-steps">
                {howSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-foreground flex items-start gap-2"
                    data-testid={`item-how-step-${idx}`}
                  >
                    <span className="font-medium text-[hsl(var(--purple-600))] dark:text-[hsl(var(--purple-300))] shrink-0">
                      {idx + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </li>
        )}

        {whereHref && (
          <li className="flex items-start gap-3" data-testid="item-clarity-where">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[hsl(var(--blue-100))] dark:bg-[hsl(var(--blue-800))]"
              aria-hidden="true"
            >
              <MapPin className="w-4 h-4 text-[hsl(var(--blue-600))] dark:text-[hsl(var(--blue-300))]" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Where it fits
              </span>
              <p className="mt-0.5">
                <Link
                  href={whereHref}
                  className="text-sm underline text-[hsl(var(--blue-600))] dark:text-[hsl(var(--blue-300))] hover:text-[hsl(var(--blue-700))] dark:hover:text-[hsl(var(--blue-200))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--blue-500))] focus-visible:ring-offset-2 rounded"
                  data-testid="link-clarity-where"
                >
                  {whereLinkText}
                </Link>
              </p>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
}
