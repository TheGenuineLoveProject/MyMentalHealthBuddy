import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, Clock, User, ArrowRight, BookOpen } from "lucide-react";
import TglpNavbar from "../components/TglpNavbar";
import SEO from "../components/SEO";

function BlogCard({ post }) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="card-glass p-6 hover:shadow-lg transition-shadow" data-testid={`card-post-${post.id}`}>
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-48 object-cover rounded-xl mb-4"
          data-testid={`img-post-${post.id}`}
        />
      )}
      <div className="flex items-center gap-4 text-xs text-[var(--glp-ink)]/60 mb-3">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {post.authorName}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {post.readingTimeMinutes} min read
        </span>
      </div>
      <Link href={`/blog/${post.slug}`}>
        <h2 className="text-xl font-semibold text-[var(--glp-sage-deep)] hover:text-[var(--glp-sage)] transition-colors cursor-pointer" data-testid={`link-post-title-${post.id}`}>
          {post.title}
        </h2>
      </Link>
      <p className="mt-2 text-sm text-[var(--glp-ink)]/80 line-clamp-3" data-testid={`text-excerpt-${post.id}`}>
        {post.excerpt}
      </p>
      {post.tags && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.split(",").map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded-full bg-[rgba(var(--glp-sage-rgb), 0.15)] text-[var(--glp-sage-deep)]"
              data-testid={`tag-${post.id}-${i}`}
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
      <Link href={`/blog/${post.slug}`}>
        <button className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--glp-sage-deep)] hover:text-[var(--glp-sage)] transition-colors" data-testid={`button-read-more-${post.id}`}>
          Read more <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </article>
  );
}

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/blog"],
  });

  const posts = data?.data || [];

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.tags?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[var(--glp-paper)]">
      <SEO
        title="Blog | The Genuine Love Project"
        description="Explore articles on mental wellness, self-love, and personal growth from The Genuine Love Project community."
      />
      <TglpNavbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="relative overflow-hidden rounded-3xl border border-[rgba(var(--glp-sage-rgb), 0.22)] bg-[rgba(250,249,247,0.55)] p-8 shadow-sm backdrop-blur mb-10">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40"
               style={{ background: "radial-gradient(circle, var(--glp-sage) 0%, transparent 60%)" }} />
          <div className="pointer-events-none absolute top-10 -right-24 h-72 w-72 rounded-full blur-3xl opacity-35"
               style={{ background: "radial-gradient(circle, var(--glp-blush) 0%, transparent 60%)" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--glp-sage-deep-rgb), 0.25)] bg-white/60 px-3 py-1 text-xs font-semibold text-[var(--glp-sage-deep)]">
              <BookOpen className="w-3 h-3" /> Wellness Blog
            </div>

            <h1 className="mt-4 text-4xl font-semibold text-[var(--glp-sage-deep)]" data-testid="text-blog-title">
              Stories of Growth & Healing
            </h1>

            <p className="mt-3 max-w-2xl text-base text-[var(--glp-ink)]/80" data-testid="text-blog-description">
              Discover articles on mental wellness, self-love practices, and personal growth journeys
              shared by our community.
            </p>

            <div className="mt-6 relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--glp-ink)]/50" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[rgba(var(--glp-sage-deep-rgb), 0.25)] bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--glp-sage)]/50"
                data-testid="input-search"
              />
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[var(--glp-sage)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--glp-ink)]/70">Loading articles...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load articles. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-[var(--glp-sage)]/50 mb-4" />
            <h3 className="text-xl font-semibold text-[var(--glp-sage-deep)]">No articles yet</h3>
            <p className="mt-2 text-[var(--glp-ink)]/70">
              {searchQuery ? "No articles match your search." : "Check back soon for new content!"}
            </p>
          </div>
        )}

        {!isLoading && !error && filteredPosts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
