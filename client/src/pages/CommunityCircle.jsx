import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Heart, Users, Filter, Sparkles, MessageCircle, 
  Loader2, Flower2, Share2, RefreshCw 
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ShareReflection from "@/components/ShareReflection.jsx";

const EMOTION_FILTERS = [
  { id: "all", label: "All", emoji: "🌈" },
  { id: "joy", label: "Joy", emoji: "✨" },
  { id: "calm", label: "Calm", emoji: "🌊" },
  { id: "grateful", label: "Grateful", emoji: "💝" },
  { id: "hopeful", label: "Hopeful", emoji: "🌱" },
  { id: "healing", label: "Healing", emoji: "💚" },
];

export default function CommunityCircle() {
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [showShareModal, setShowShareModal] = useState(false);
  const [justShared, setJustShared] = useState(false);

  const { data: reflections, isLoading, refetch } = useQuery({
    queryKey: ["/api/community/reflections", emotionFilter],
    queryFn: async () => {
      const params = emotionFilter !== "all" ? `?emotion=${emotionFilter}` : "";
      const response = await fetch(`/api/community/reflections${params}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 2
  });

  const heartMutation = useMutation({
    mutationFn: async (reflectionId) => {
      return apiRequest("POST", `/api/community/reflections/${reflectionId}/heart`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/reflections"] });
    }
  });

  const handleShareSuccess = () => {
    setShowShareModal(false);
    setJustShared(true);
    setTimeout(() => setJustShared(false), 3000);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {justShared && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-pulse">
            <Flower2 className="w-32 h-32 text-pink-400 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200/30 via-purple-200/30 to-violet-200/30 animate-pulse" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">
            Community Circle
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            A sacred space where hearts meet. Share your reflections and receive the wisdom of fellow travelers.
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {EMOTION_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setEmotionFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  emotionFilter === filter.id
                    ? "bg-white dark:bg-gray-800 shadow-md text-violet-600 dark:text-violet-400"
                    : "bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800"
                }`}
                data-testid={`filter-${filter.id}`}
              >
                <span>{filter.emoji}</span>
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 transition"
              title="Refresh"
              data-testid="button-refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              data-testid="button-share-reflection"
            >
              <Share2 className="w-4 h-4" />
              Share Your Light
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
        ) : !reflections?.length ? (
          <div className="text-center py-16">
            <Flower2 className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              The circle awaits your voice
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Be the first to share a reflection and inspire others.
            </p>
            <button
              onClick={() => setShowShareModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium"
              data-testid="button-first-share"
            >
              Share First Reflection
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reflections.map((reflection) => (
              <ReflectionCard
                key={reflection.id}
                reflection={reflection}
                onHeart={() => heartMutation.mutate(reflection.id)}
                isHearting={heartMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {showShareModal && (
        <ShareReflection
          onClose={() => setShowShareModal(false)}
          onSuccess={handleShareSuccess}
        />
      )}
    </div>
  );
}

function ReflectionCard({ reflection, onHeart, isHearting }) {
  const emotionColors = {
    joy: "from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800",
    calm: "from-sky-100 to-blue-100 dark:from-sky-900/20 dark:to-blue-900/20 border-sky-200 dark:border-sky-800",
    grateful: "from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200 dark:border-rose-800",
    hopeful: "from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800",
    healing: "from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-800",
    default: "from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-800"
  };

  const colorClass = emotionColors[reflection.emotion] || emotionColors.default;
  const displayName = reflection.isAnonymous 
    ? "Anonymous Soul" 
    : (reflection.displayName || "Fellow Traveler");

  return (
    <div 
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${colorClass} border backdrop-blur-sm transition-all hover:shadow-lg`}
      data-testid={`reflection-card-${reflection.id}`}
    >
      {reflection.isBlessed && (
        <div className="absolute -top-2 -right-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center">
          <span className="text-sm">🙏</span>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {displayName}
        </span>
      </div>

      <p className="text-gray-700 dark:text-gray-200 font-serif italic leading-relaxed mb-4 line-clamp-4">
        "{reflection.content}"
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(reflection.createdAt).toLocaleDateString()}
        </span>
        
        <button
          onClick={onHeart}
          disabled={isHearting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-black/20 hover:bg-white dark:hover:bg-black/30 transition group"
          data-testid={`button-heart-${reflection.id}`}
        >
          <Heart 
            className={`w-4 h-4 transition-all group-hover:scale-110 ${
              reflection.heartCount > 0 
                ? "fill-rose-400 text-rose-400" 
                : "text-gray-400 group-hover:text-rose-400"
            }`} 
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {reflection.heartCount}
          </span>
        </button>
      </div>
    </div>
  );
}
