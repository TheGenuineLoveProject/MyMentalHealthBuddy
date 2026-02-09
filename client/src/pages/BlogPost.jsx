import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, Clock, User, ArrowLeft, MessageCircle, Send, Reply } from "lucide-react";
import TglpNavbar from "../components/TglpNavbar";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import NewsletterSignup from "../components/NewsletterSignup";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

function CommentItem({ comment, postId, slug }) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const replyMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", `/api/blog/${postId}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog", slug] });
      setReplyContent("");
      setShowReplyForm(false);
    },
  });

  const handleReply = () => {
    if (!replyContent.trim()) return;
    replyMutation.mutate({ content: replyContent, parentId: comment.id });
  };

  return (
    <div className="border-l-2 border-[rgba(143,191,159,0.3)] pl-4 py-3" data-testid={`comment-${comment.id}`}>
      <div className="flex items-center gap-2 text-xs text-[var(--glp-ink)]/60 mb-2">
        <User className="w-3 h-3" />
        <span className="font-medium text-[var(--glp-sage-deep)]">{comment.authorName}</span>
        <span>•</span>
        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-sm text-[var(--glp-ink)]/90" data-testid={`text-comment-${comment.id}`}>{comment.content}</p>
      
      {user && (
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="mt-2 flex items-center gap-1 text-xs text-[var(--glp-sage-deep)] hover:text-[var(--glp-sage)] transition-colors"
          data-testid={`button-reply-${comment.id}`}
        >
          <Reply className="w-3 h-3" /> Reply
        </button>
      )}

      {showReplyForm && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 px-3 py-2 rounded-lg border border-[rgba(var(--glp-sage-deep-rgb), 0.25)] bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--glp-sage)]/50"
            data-testid={`input-reply-${comment.id}`}
          />
          <button
            onClick={handleReply}
            disabled={replyMutation.isPending}
            className="px-3 py-2 rounded-lg bg-[var(--glp-sage-deep)] text-white text-sm hover:bg-[var(--glp-sage)] transition-colors disabled:opacity-50"
            data-testid={`button-submit-reply-${comment.id}`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function CommentSection({ comments, postId, slug }) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");

  const commentMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", `/api/blog/${postId}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog", slug] });
      setNewComment("");
    },
  });

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate({ content: newComment });
  };

  const topLevelComments = comments?.filter((c) => !c.parentId) || [];
  const replies = comments?.filter((c) => c.parentId) || [];

  const getCommentReplies = (commentId) => replies.filter((r) => r.parentId === commentId);

  return (
    <section className="mt-10 pt-8 border-t border-[rgba(143,191,159,0.25)]">
      <h3 className="text-xl font-semibold text-[var(--glp-sage-deep)] flex items-center gap-2 mb-6" data-testid="text-comments-title">
        <MessageCircle className="w-5 h-5" /> Comments ({comments?.length || 0})
      </h3>

      {user ? (
        <div className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[rgba(var(--glp-sage-deep-rgb), 0.25)] bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--glp-sage)]/50 resize-none"
            data-testid="textarea-new-comment"
          />
          <button
            onClick={handleSubmit}
            disabled={commentMutation.isPending || !newComment.trim()}
            className="mt-3 px-6 py-2 rounded-xl bg-[var(--glp-sage-deep)] text-white text-sm font-medium hover:bg-[var(--glp-sage)] transition-colors disabled:opacity-50 flex items-center gap-2"
            data-testid="button-submit-comment"
          >
            <Send className="w-4 h-4" /> Post Comment
          </button>
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-[rgba(143,191,159,0.1)] text-center">
          <p className="text-sm text-[var(--glp-ink)]/70">
            <Link href="/login" className="text-[var(--glp-sage-deep)] font-medium hover:underline" data-testid="link-login-to-comment">
              Sign in
            </Link>{" "}
            to join the conversation.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {topLevelComments.map((comment) => (
          <div key={comment.id}>
            <CommentItem comment={comment} postId={postId} slug={slug} />
            {getCommentReplies(comment.id).map((reply) => (
              <div key={reply.id} className="ml-6">
                <CommentItem comment={reply} postId={postId} slug={slug} />
              </div>
            ))}
          </div>
        ))}

        {topLevelComments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto text-[var(--glp-sage)]/50 mb-3" />
            <p className="text-[var(--glp-ink)]/60">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    },
    enabled: !!slug,
  });

  const post = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--glp-paper)]">
        <TglpNavbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-[var(--glp-sage)] border-t-transparent rounded-full animate-spin motion-reduce:animate-none mx-auto mb-4" />
          <p className="text-[var(--glp-ink)]/70">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[var(--glp-paper)]">
        <TglpNavbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold text-[var(--glp-sage-deep)]">Article not found</h2>
          <p className="mt-2 text-[var(--glp-ink)]/70">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <button className="mt-6 px-6 py-3 rounded-xl bg-[var(--glp-sage-deep)] text-white text-sm font-medium hover:bg-[var(--glp-sage)] transition-colors" data-testid="button-back-to-blog">
              Back to Blog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <WellnessPageShell
      title="Blog Post"
      subtitle="Insights and reflections from the community"
      benefits={pickBenefits(["agency","calm","clarity","connection","growth"], 5)}
      clarity={{
        what: "A blog post from our community.",
        why: "To share insights and perspectives.",
        who: "For readers seeking wisdom and connection.",
        when: "Whenever you want inspiration.",
        where: "Right here.",
        how: "Read, reflect, and comment if you wish."
      }}
      examples={[]}
    >
    <div className="min-h-screen bg-[var(--glp-paper)]">
      <SEO
        title={`${post.title} | The Genuine Love Project Blog`}
        description={post.excerpt || post.content?.substring(0, 160)}
      />
      <TglpNavbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/blog">
          <button className="flex items-center gap-2 text-sm text-[var(--glp-sage-deep)] hover:text-[var(--glp-sage)] transition-colors mb-8" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </button>
        </Link>

        <article>
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 object-cover rounded-2xl mb-8"
              data-testid="img-featured"
            />
          )}

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--glp-sage-deep)] leading-tight" data-testid="text-post-title">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[var(--glp-ink)]/60">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTimeMinutes} min read
              </span>
            </div>

            {post.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-[rgba(var(--glp-sage-rgb), 0.15)] text-[var(--glp-sage-deep)]"
                    data-testid={`tag-${i}`}
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div
            className="prose prose-lg max-w-none text-[var(--glp-ink)]/90 leading-relaxed"
            data-testid="text-post-content"
          >
            {post.content.split(/\n\n+/).map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("## ")) {
                return <h2 key={i} className="text-2xl font-semibold text-[var(--glp-sage-deep)] mt-8 mb-4">{trimmed.replace(/^## /, "")}</h2>;
              }
              if (trimmed.startsWith("### ")) {
                return <h3 key={i} className="text-xl font-semibold text-[var(--glp-sage-deep)] mt-6 mb-3">{trimmed.replace(/^### /, "")}</h3>;
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
                const items = trimmed.split(/\n/).filter(Boolean);
                return (
                  <ul key={i} className="list-disc list-inside space-y-2 my-4">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^[-•]\s*/, "")}</li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+[.)]\s/.test(trimmed)) {
                const items = trimmed.split(/\n/).filter(Boolean);
                return (
                  <ol key={i} className="list-decimal list-inside space-y-2 my-4">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^\d+[.)]\s*/, "")}</li>
                    ))}
                  </ol>
                );
              }
              return <p key={i} className="mb-4">{trimmed}</p>;
            })}
          </div>
        </article>

        <section className="mt-10 pt-8 border-t border-[rgba(143,191,159,0.25)]" data-testid="section-post-newsletter">
          <div className="card-glass p-6 text-center">
            <h3 className="text-lg font-semibold text-[var(--glp-sage-deep)] mb-2">
              Enjoyed this article?
            </h3>
            <p className="text-sm text-[var(--glp-ink)]/70 mb-4">
              If you'd like more gentle reflections on wellness and growth, our newsletter shares new articles
              and practices — no pressure, no spam.
            </p>
            <NewsletterSignup variant="inline" source="blog-post" />
          </div>
        </section>

        <CommentSection comments={post.comments} postId={post.id} slug={slug} />
      </main>
    </div>
  </WellnessPageShell>
  );
}
