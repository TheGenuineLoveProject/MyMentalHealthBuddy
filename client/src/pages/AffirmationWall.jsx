import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Heart, Send, Sparkles, MessageCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "../lib/queryClient";
import PageLayout from "@/components/layout/PageLayout.jsx";

const AFFIRMATION_MAX_LENGTH = 280;

const SAMPLE_AFFIRMATIONS = [
  { id: "sample-1", content: "You are worthy of love exactly as you are.", heartCount: 42, createdAt: new Date() },
  { id: "sample-2", content: "Every small step forward is still progress.", heartCount: 38, createdAt: new Date() },
  { id: "sample-3", content: "Your feelings are valid. Honor them.", heartCount: 35, createdAt: new Date() },
  { id: "sample-4", content: "Healing is not linear, and that's okay.", heartCount: 29, createdAt: new Date() },
  { id: "sample-5", content: "You are stronger than you know.", heartCount: 27, createdAt: new Date() },
];

export default function AffirmationWall() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPostModal, setShowPostModal] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("glp-liked-affirmations");
    if (stored) {
      setLikedIds(new Set(JSON.parse(stored)));
    }
  }, []);

  const { data: affirmations = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/community/affirmations"],
    staleTime: 30000,
  });

  const postMutation = useMutation({
    mutationFn: async (content) => {
      return apiRequest("POST", "/api/community/affirmations", {
        content,
        isAnonymous: true
      });
    },
    onSuccess: () => {
      toast({ title: "Light shared", description: "Your affirmation has been added to the wall." });
      setNewAffirmation("");
      setShowPostModal(false);
      queryClient.invalidateQueries({ queryKey: ["/api/community/affirmations"] });
    },
    onError: () => {
      toast({ title: "Could not post", description: "Please try again later.", variant: "destructive" });
    }
  });

  const likeMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest("POST", `/api/community/affirmations/${id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/affirmations"] });
    }
  });

  const handleLike = (id) => {
    if (likedIds.has(id)) return;
    
    const newLiked = new Set([...likedIds, id]);
    setLikedIds(newLiked);
    try { localStorage.setItem("glp-liked-affirmations", JSON.stringify([...newLiked])); } catch (err) { console.warn("[storage-safe-write]", err); }
    likeMutation.mutate(id);
  };

  const handlePost = () => {
    if (!newAffirmation.trim()) return;
    postMutation.mutate(newAffirmation.trim());
  };

  const displayAffirmations = affirmations;

  return (
    <PageLayout
      maxWidth="max-w-4xl"
      style={{ background: 'linear-gradient(to bottom, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}
    >
      <div>
        <header className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" 
               style={{ background: 'linear-gradient(135deg, var(--glp-gold-30), var(--glp-gold-50))' }}>
            <Sparkles className="w-10 h-10" style={{ color: 'var(--glp-gold)' }} />
          </div>
          <h1 className="text-4xl font-serif mb-3" style={{ color: 'var(--glp-ink)' }} data-testid="heading-affirmation-wall">
            Community Affirmation Wall
          </h1>
          <p className="text-lg" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
            Share light. Receive light. We heal together.
          </p>
        </header>

        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setShowPostModal(true)}
            className="px-6 py-3 rounded-full font-semibold text-white flex items-center gap-2 transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
            data-testid="button-post-affirmation"
          >
            <MessageCircle className="w-5 h-5" />
            Share Your Light
          </button>
          <button
            onClick={() => refetch()}
            className="px-4 py-3 rounded-full transition-colors flex items-center gap-2"
            style={{ background: 'var(--glp-sage-10)', color: 'var(--glp-sage)' }}
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: 'var(--glp-sage-10)' }} />
            ))}
          </div>
        ) : displayAffirmations.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl border" style={{ background: 'var(--glp-sage-10)', borderColor: 'var(--glp-sage-20)' }} data-testid="empty-affirmation-wall">
            <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--glp-rose)', opacity: 0.5 }} />
            <h3 className="text-xl font-serif mb-2" style={{ color: 'var(--glp-ink)' }}>The wall is waiting for your light</h3>
            <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: 'var(--glp-ink)', opacity: 0.6 }}>
              Be the first to share an affirmation. Your words may be exactly what someone needs today.
            </p>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-6 py-3 rounded-full font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
              data-testid="button-post-first-affirmation"
            >
              Share the First Light
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayAffirmations.map((affirmation, index) => (
              <article
                key={affirmation.id}
                className="p-6 rounded-2xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{ 
                  background: 'var(--glp-paper)', 
                  border: '1px solid var(--glp-sage-15)',
                  animationDelay: `${index * 100}ms`
                }}
                data-testid={`card-affirmation-${affirmation.id}`}
              >
                <p className="text-lg leading-relaxed mb-4 font-serif" style={{ color: 'var(--glp-ink)' }}>
                  "{affirmation.content}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>
                    {affirmation.displayName || "Anonymous Soul"}
                  </span>
                  <button
                    onClick={() => handleLike(affirmation.id)}
                    disabled={likedIds.has(affirmation.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      likedIds.has(affirmation.id) 
                        ? 'bg-[var(--glp-rose-20)] cursor-default' 
                        : 'hover:bg-[var(--glp-rose-10)] hover:scale-105'
                    }`}
                    data-testid={`button-like-${affirmation.id}`}
                  >
                    <Heart 
                      className={`w-5 h-5 transition-all ${likedIds.has(affirmation.id) ? 'fill-[var(--glp-rose)] text-[var(--glp-rose)]' : ''}`}
                      style={{ color: likedIds.has(affirmation.id) ? 'var(--glp-rose)' : 'var(--glp-sage)' }}
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--glp-ink)' }}>
                      {affirmation.heartCount || 0}
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 text-center p-8 rounded-3xl" style={{ background: 'var(--glp-gold-20)' }}>
          <p className="text-lg font-serif italic" style={{ color: 'var(--glp-gold-dark)' }}>
            "In sharing our light, we discover we were never alone in the darkness."
          </p>
        </div>
      </div>

      {showPostModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowPostModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95"
            style={{ background: 'var(--glp-paper)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}>
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold" style={{ color: 'var(--glp-ink)' }}>
                  Share Your Light
                </h3>
                <p className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>
                  Your words may be exactly what someone needs today
                </p>
              </div>
            </div>

            <textarea
              value={newAffirmation}
              onChange={(e) => setNewAffirmation(e.target.value.slice(0, AFFIRMATION_MAX_LENGTH))}
              placeholder="Write an affirmation to share with the community..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 resize-none focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--glp-sage-20)', background: 'var(--glp-paper)' }}
              data-testid="input-new-affirmation"
            />
            <p className="text-xs text-right mt-1" style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>
              {newAffirmation.length}/{AFFIRMATION_MAX_LENGTH}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPostModal(false)}
                className="flex-1 py-3 rounded-xl font-medium transition-colors"
                style={{ background: 'var(--glp-sage-10)', color: 'var(--glp-ink)' }}
                data-testid="button-cancel-post"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!newAffirmation.trim() || postMutation.isPending}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
                data-testid="button-submit-affirmation"
              >
                {postMutation.isPending ? "Sharing..." : "Share Light"}
              </button>
            </div>

            <p className="text-xs text-center mt-4" style={{ color: 'var(--glp-ink)', opacity: 0.5 }}>
              All affirmations are shared anonymously
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
