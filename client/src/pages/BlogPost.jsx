import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, Clock, User, ArrowLeft, MessageCircle, Send, Reply } from "lucide-react";
import TglpNavbar from "../components/TglpNavbar";
import SEO from "../components/SEO.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest, queryClient } from "../lib/queryClient.js";

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
      <div className="flex items-center gap-2 text-xs text-[#3A3A3A]/60 mb-2">
        <User className="w-3 h-3" />
        <span className="font-medium text-[#2F5D5D]">{comment.authorName}</span>
        <span>•</span>
        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-sm text-[#3A3A3A]/90" data-testid={`text-comment-${comment.id}`}>{comment.content}</p>
      
      {user && (
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="mt-2 flex items-center gap-1 text-xs text-[#2F5D5D] hover:text-[#8FBF9F] transition-colors"
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
            className="flex-1 px-3 py-2 rounded-lg border border-[rgba(47,93,93,0.25)] bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]/50"
            data-testid={`input-reply-${comment.id}`}
          />
          <button
            onClick={handleReply}
            disabled={replyMutation.isPending}
            className="px-3 py-2 rounded-lg bg-[#2F5D5D] text-white text-sm hover:bg-[#8FBF9F] transition-colors disabled:opacity-50"
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
      <h3 className="text-xl font-semibold text-[#2F5D5D] flex items-center gap-2 mb-6" data-testid="text-comments-title">
        <MessageCircle className="w-5 h-5" /> Comments ({comments?.length || 0})
      </h3>

      {user ? (
        <div className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[rgba(47,93,93,0.25)] bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]/50 resize-none"
            data-testid="textarea-new-comment"
          />
          <button
            onClick={handleSubmit}
            disabled={commentMutation.isPending || !newComment.trim()}
            className="mt-3 px-6 py-2 rounded-xl bg-[#2F5D5D] text-white text-sm font-medium hover:bg-[#8FBF9F] transition-colors disabled:opacity-50 flex items-center gap-2"
            data-testid="button-submit-comment"
          >
            <Send className="w-4 h-4" /> Post Comment
          </button>
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-[rgba(143,191,159,0.1)] text-center">
          <p className="text-sm text-[#3A3A3A]/70">
            <Link href="/login" className="text-[#2F5D5D] font-medium hover:underline" data-testid="link-login-to-comment">
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
            <MessageCircle className="w-12 h-12 mx-auto text-[#8FBF9F]/50 mb-3" />
            <p className="text-[#3A3A3A]/60">No comments yet. Be the first to share your thoughts!</p>
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
      <div className="min-h-screen bg-[#FAF9F7]">
        <TglpNavbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-[#8FBF9F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#3A3A3A]/70">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#FAF9F7]">
        <TglpNavbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold text-[#2F5D5D]">Article not found</h2>
          <p className="mt-2 text-[#3A3A3A]/70">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <button className="mt-6 px-6 py-3 rounded-xl bg-[#2F5D5D] text-white text-sm font-medium hover:bg-[#8FBF9F] transition-colors" data-testid="button-back-to-blog">
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
    <div className="min-h-screen bg-[#FAF9F7]">
      <SEO
        title={`${post.title} | The Genuine Love Project Blog`}
        description={post.excerpt || post.content?.substring(0, 160)}
      />
      <TglpNavbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/blog">
          <button className="flex items-center gap-2 text-sm text-[#2F5D5D] hover:text-[#8FBF9F] transition-colors mb-8" data-testid="button-back">
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
            <h1 className="text-3xl md:text-4xl font-bold text-[#2F5D5D] leading-tight" data-testid="text-post-title">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[#3A3A3A]/60">
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
                    className="px-3 py-1 text-xs rounded-full bg-[rgba(143,191,159,0.15)] text-[#2F5D5D]"
                    data-testid={`tag-${i}`}
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div
            className="prose prose-lg max-w-none text-[#3A3A3A]/90 leading-relaxed"
            style={{ whiteSpace: "pre-wrap" }}
            data-testid="text-post-content"
          >
            {post.content}
          </div>
        </article>

        <CommentSection comments={post.comments} postId={post.id} slug={slug} />
      </main>
    </div>
  );
}
