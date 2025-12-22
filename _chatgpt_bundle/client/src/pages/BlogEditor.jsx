import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Save, Eye, Send, ArrowLeft, Image, Tag } from "lucide-react";
import TglpNavbar from "../components/TglpNavbar";
import SEO from "../components/SEO.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import { Link } from "wouter";

export default function BlogEditor() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      if (data.data?.slug) {
        setLocation(`/blog/${data.data.slug}`);
      } else {
        setLocation("/blog");
      }
    },
  });

  const handleSaveDraft = () => {
    if (!title.trim() || !content.trim()) return;
    createMutation.mutate({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + "...",
      tags,
      featuredImage,
      status: "draft",
    });
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return;
    createMutation.mutate({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + "...",
      tags,
      featuredImage,
      status: "published",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF9F7]">
        <TglpNavbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold text-[#2F5D5D]">Sign in to write</h2>
          <p className="mt-2 text-[#3A3A3A]/70">You need to be signed in to create blog posts.</p>
          <Link href="/login">
            <button className="mt-6 px-6 py-3 rounded-xl bg-[#2F5D5D] text-white text-sm font-medium hover:bg-[#8FBF9F] transition-colors" data-testid="button-login">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <SEO title="Write a Post | The Genuine Love Project Blog" />
      <TglpNavbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/blog">
            <button className="flex items-center gap-2 text-sm text-[#2F5D5D] hover:text-[#8FBF9F] transition-colors" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </button>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(47,93,93,0.25)] bg-white/70 text-sm text-[#2F5D5D] hover:bg-[rgba(143,191,159,0.1)] transition-colors"
              data-testid="button-preview"
            >
              <Eye className="w-4 h-4" /> {showPreview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={createMutation.isPending || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(47,93,93,0.25)] bg-white/70 text-sm text-[#2F5D5D] hover:bg-[rgba(143,191,159,0.1)] transition-colors disabled:opacity-50"
              data-testid="button-save-draft"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={createMutation.isPending || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F5D5D] text-white text-sm font-medium hover:bg-[#8FBF9F] transition-colors disabled:opacity-50"
              data-testid="button-publish"
            >
              <Send className="w-4 h-4" /> Publish
            </button>
          </div>
        </div>

        {showPreview ? (
          <article className="card-glass p-8">
            {featuredImage && (
              <img
                src={featuredImage}
                alt="Featured"
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}
            <h1 className="text-3xl font-bold text-[#2F5D5D] mb-4">
              {title || "Untitled Post"}
            </h1>
            {tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-[rgba(143,191,159,0.15)] text-[#2F5D5D]"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            <div
              className="prose prose-lg max-w-none text-[#3A3A3A]/90"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {content || "Start writing..."}
            </div>
          </article>
        ) : (
          <div className="space-y-6">
            <div className="card-glass p-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title..."
                className="w-full text-3xl font-bold text-[#2F5D5D] bg-transparent border-none focus:outline-none placeholder:text-[#3A3A3A]/30"
                data-testid="input-title"
              />
            </div>

            <div className="card-glass p-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story..."
                rows={20}
                className="w-full text-base text-[#3A3A3A]/90 bg-transparent border-none focus:outline-none placeholder:text-[#3A3A3A]/30 resize-none leading-relaxed"
                data-testid="textarea-content"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-glass p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-[#2F5D5D] mb-3">
                  <Image className="w-4 h-4" /> Featured Image URL
                </label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 rounded-xl border border-[rgba(47,93,93,0.25)] bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]/50"
                  data-testid="input-featured-image"
                />
              </div>

              <div className="card-glass p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-[#2F5D5D] mb-3">
                  <Tag className="w-4 h-4" /> Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="wellness, self-care, mindfulness"
                  className="w-full px-4 py-2 rounded-xl border border-[rgba(47,93,93,0.25)] bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]/50"
                  data-testid="input-tags"
                />
              </div>
            </div>

            <div className="card-glass p-6">
              <label className="text-sm font-medium text-[#2F5D5D] mb-3 block">
                Excerpt (optional)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of your post (auto-generated if left empty)..."
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-[rgba(47,93,93,0.25)] bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]/50 resize-none"
                data-testid="textarea-excerpt"
              />
            </div>
          </div>
        )}

        {createMutation.error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
            Failed to save post. Please try again.
          </div>
        )}
      </main>
    </div>
  );
}
