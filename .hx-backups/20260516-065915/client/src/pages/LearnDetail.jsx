import { Link, useRoute } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  FileText,
  GraduationCap,
  Heart,
  LifeBuoy,
  Shield,
  Sparkles,
  User
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { findGuide, findArticle, GUIDES, ARTICLES } from "@/content/learn";

const ICON_MAP = {
  Heart,
  Shield,
  Sparkles,
  Brain,
  BookOpen,
  GraduationCap,
  FileText
};

function NotFound({ kind }) {
  const backHref = kind === "guide" ? "/learn/guides" : "/learn/articles";
  const backLabel = kind === "guide" ? "Back to Healing Guides" : "Back to Wellness Articles";
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <h1 className="text-3xl font-serif mb-4">We could not find that {kind}.</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for may have moved. Please return to the listing.
        </p>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 cursor-pointer no-underline"
          data-testid="link-back-to-listing"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}

function DetailPage({ kind, item }) {
  const isGuide = kind === "guide";
  const IconComponent = ICON_MAP[item.icon] || (isGuide ? GraduationCap : FileText);
  const backHref = isGuide ? "/learn/guides" : "/learn/articles";
  const backLabel = isGuide ? "Back to Healing Guides" : "Back to Wellness Articles";
  const eyebrowText = isGuide ? "Step by Step" : "Evidence-Based";
  const EyebrowIcon = isGuide ? GraduationCap : FileText;
  const blurb = item.description || item.excerpt;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <SEO
        title={`${item.title} — The Genuine Love Project`}
        description={blurb}
      />
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer mb-8 no-underline"
          data-testid="link-back-to-listing"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>

        <header className="mb-10">
          <p className="text-sm uppercase tracking-widest text-primary/70 mb-4 flex items-center gap-2">
            <EyebrowIcon className="w-4 h-4" />
            {eyebrowText}
          </p>
          <span className="inline-block text-xs uppercase tracking-wider text-primary/70 font-medium mb-3">
            {item.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4 leading-tight" data-testid="text-detail-title">
            {item.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {blurb}
          </p>
          {!isGuide && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {item.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.readTime}
              </span>
            </div>
          )}
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12" data-testid="content-detail-body">
          {item.body.map((paragraph, idx) => (
            <p key={idx} className="text-base md:text-lg leading-relaxed text-foreground/90 mb-5">
              {paragraph}
            </p>
          ))}
        </div>

        {item.relatedHub && (
          <div
            className="rounded-2xl p-6 md:p-8 bg-card border border-primary/20"
            data-testid="card-related-tool"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-primary/70 font-medium mb-1">
                  Try it now
                </p>
                <h2 className="text-xl font-semibold mb-2">
                  {item.relatedLabel || "Open the related tool"}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Reading helps. Practising helps more. Tap below to open the matching tool whenever you are ready.
                </p>
                <Link
                  href={item.relatedHub}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 cursor-pointer transition-opacity no-underline"
                  data-testid="link-related-hub"
                >
                  {item.relatedLabel || "Open the tool"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <aside
          className="mt-12 rounded-2xl p-5 border border-rose-300/40 bg-rose-50/40 dark:bg-rose-950/20"
          role="complementary"
          aria-label="If you need urgent support"
          data-testid="card-crisis-routing"
        >
          <div className="flex items-start gap-3">
            <LifeBuoy className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground/90 mb-2">
                If anything in this {isGuide ? "guide" : "article"} brings up something hard and you need support right now, you do not have to wait.
              </p>
              <Link
                href="/crisis"
                className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 dark:text-rose-300 hover:underline"
                data-testid="link-crisis-resources"
              >
                See crisis resources
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        <div className="mt-10 pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground mb-4">
            Continue exploring {isGuide ? "guides" : "articles"}:
          </p>
          <div className="flex flex-wrap gap-2">
            {(isGuide ? GUIDES : ARTICLES)
              .filter(other => other.slug !== item.slug)
              .slice(0, 4)
              .map(other => (
                <Link
                  key={other.slug}
                  href={isGuide ? `/learn/guides/${other.slug}` : `/learn/articles/${other.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-primary/10 hover:bg-primary/20 text-primary cursor-pointer transition-colors no-underline"
                  data-testid={`link-related-${other.slug}`}
                >
                  {other.title}
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
}

export function LearnGuideDetail() {
  const [, params] = useRoute("/learn/guides/:slug");
  const slug = params?.slug;
  const guide = slug ? findGuide(slug) : null;
  if (!guide) return <NotFound kind="guide" />;
  return <DetailPage kind="guide" item={guide} />;
}

export function LearnArticleDetail() {
  const [, params] = useRoute("/learn/articles/:slug");
  const slug = params?.slug;
  const article = slug ? findArticle(slug) : null;
  if (!article) return <NotFound kind="article" />;
  return <DetailPage kind="article" item={article} />;
}

export default LearnGuideDetail;
