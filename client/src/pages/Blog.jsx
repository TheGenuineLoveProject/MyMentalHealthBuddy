import { Link } from "wouter";
import { BookOpen, ArrowRight, Sparkles, Heart, PenTool } from "lucide-react";
import SEO from "@/components/SEO";

export default function Blog() {
  return (
    <>
      <SEO 
        title="Blog - The Genuine Love Project"
        description="Healing articles, wellness resources, and insights for your journey to genuine love and emotional well-being."
      />
      
      <div className="min-h-screen hero-gradient">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sage-100)] border border-[var(--sage-200)] text-[var(--teal-700)] text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Wellness Insights
            </div>
            <h1 className="text-display-lg text-teal mb-4">
              The <span className="text-gradient-brand">Genuine Love</span> Blog
            </h1>
            <p className="text-lead max-w-xl mx-auto">
              Thoughtful articles on healing, self-discovery, and nurturing your relationship with yourself.
            </p>
          </header>

          <div className="grid gap-6">
            <article className="card-bordered group hover:shadow-lg transition-all duration-300" data-testid="card-blog-first">
              <div className="flex items-start gap-4">
                <div className="icon-container icon-lg icon-gradient-sage group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-heading-md text-teal mb-2">Welcome to Our Journey</h2>
                  <p className="text-body-sm mb-4">
                    Discover the philosophy behind The Genuine Love Project and how we're creating a safe space for emotional healing and self-discovery.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-caption">Coming Soon</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-[var(--sage-100)] text-[var(--sage-700)]">
                      Featured
                    </span>
                  </div>
                </div>
              </div>
            </article>

            <article className="card-bordered group hover:shadow-lg transition-all duration-300" data-testid="card-blog-healing">
              <div className="flex items-start gap-4">
                <div className="icon-container icon-lg icon-gradient-blush group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-heading-md text-teal mb-2">The Art of Self-Compassion</h2>
                  <p className="text-body-sm mb-4">
                    Learn gentle practices to cultivate kindness toward yourself, even on difficult days.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-caption">Coming Soon</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-[var(--blush-100)] text-[var(--blush-700)]">
                      Self-Care
                    </span>
                  </div>
                </div>
              </div>
            </article>

            <article className="card-bordered group hover:shadow-lg transition-all duration-300" data-testid="card-blog-writing">
              <div className="flex items-start gap-4">
                <div className="icon-container icon-lg icon-gradient-gold group-hover:scale-110 transition-transform">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-heading-md text-teal mb-2">Journaling for Healing</h2>
                  <p className="text-body-sm mb-4">
                    Explore evidence-based journaling techniques that support emotional processing and growth.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-caption">Coming Soon</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-[var(--gold-100)] text-[var(--gold-700)]">
                      Tools
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-12 text-center">
            <div className="card-bordered inline-block">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-md icon-soft-teal">
                  <PenTool className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-heading-sm text-teal">Want to contribute?</p>
                  <p className="text-caption">Share your healing journey with our community.</p>
                </div>
                <Link href="/blog/editor" className="btn-primary flex items-center gap-2" data-testid="link-write">
                  Write <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
