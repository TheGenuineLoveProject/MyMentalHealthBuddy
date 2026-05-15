/**
 * ============================================================================
 * RESOURCE TILES COMPONENT
 * ============================================================================
 * 
 * Modular card component for content discovery
 * Brand Colors: #8fbf9f (sage), #f4c7c3 (rose), #2f5d5d (teal), #eac33b (gold)
 * 
 * Usage:
 *   <ResourceTiles resources={[...]} columns={3} />
 *   <ResourceTile resource={...} variant="compact" />
 * ============================================================================
 */

import { Link } from "wouter";
import { 
  BookOpen, Video, Headphones, FileText, Heart, Clock, 
  ArrowRight, Star, Bookmark, Play, ChevronRight
} from "lucide-react";

const typeIcons = {
  article: FileText,
  video: Video,
  audio: Headphones,
  practice: Heart,
  guide: BookOpen
};

const typeColors = {
  article: { bg: 'rgba(234, 195, 59, 0.15)', text: '#8B7023' },
  video: { bg: 'rgba(244, 199, 195, 0.3)', text: '#8b5a5a' },
  audio: { bg: 'rgba(47, 93, 93, 0.1)', text: '#2f5d5d' },
  practice: { bg: 'rgba(143, 191, 159, 0.2)', text: '#2f5d5d' },
  guide: { bg: 'rgba(47, 93, 93, 0.15)', text: '#2f5d5d' }
};

export function ResourceTile({ 
  resource, 
  variant = "default",
  showBookmark = true,
  onBookmark
}) {
  const { 
    id, 
    title, 
    description, 
    type = "article", 
    duration, 
    tag, 
    image,
    featured = false,
    href = "#"
  } = resource;

  const Icon = typeIcons[type] || FileText;
  const colors = typeColors[type] || typeColors.article;

  if (variant === "compact") {
    return (
      <Link href={href}>
        <article 
          className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white hover:shadow-md cursor-pointer group"
          style={{ background: 'rgba(250, 249, 247, 0.5)' }}
          data-component="ResourceTile"
          data-variant="compact"
          data-testid={`tile-resource-compact-${id}`}
        >
          <div 
            className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
            style={{ background: colors.bg }}
          >
            <Icon className="w-6 h-6" style={{ color: colors.text }} aria-hidden="true" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 
              className="font-semibold text-sm truncate group-hover:text-teal-700 transition-colors"
              style={{ color: '#2f5d5d' }}
            >
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: colors.bg, color: colors.text }}
              >
                {type}
              </span>
              {duration && (
                <span className="text-xs flex items-center gap-1" style={{ color: '#3a3a3a', opacity: 0.6 }}>
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {duration}
                </span>
              )}
            </div>
          </div>

          <ChevronRight 
            className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
            style={{ color: '#8fbf9f' }}
            aria-hidden="true"
          />
        </article>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href}>
        <article 
          className="relative rounded-3xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
          style={{ 
            background: 'linear-gradient(135deg, #2f5d5d, #1f3f3f)',
            minHeight: '300px'
          }}
          data-component="ResourceTile"
          data-variant="featured"
          data-testid={`tile-resource-featured-${id}`}
        >
          {image && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{ 
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              aria-hidden="true"
            />
          )}
          
          <div className="relative p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-auto">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ background: '#eac33b', color: '#2f5d5d' }}
              >
                Featured
              </span>
              {showBookmark && (
                <button 
                  onClick={(e) => { e.preventDefault(); onBookmark?.(id); }}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label={`Save ${title} to your bookmarks`}
                  data-testid={`button-bookmark-${id}`}
                >
                  <Bookmark className="w-5 h-5 text-white" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="mt-auto">
              <span 
                className="inline-flex items-center gap-1 text-xs font-medium text-white/70 mb-3"
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {type} • {duration}
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                {title}
              </h3>
              <p className="text-white/80 text-sm line-clamp-2 mb-4">
                {description}
              </p>
              <div 
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: '#eac33b' }}
              >
                <Play className="w-4 h-4" aria-hidden="true" />
                Start Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={href}>
      <article 
        className="relative rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer group"
        style={{ 
          background: 'white',
          border: '1px solid rgba(143, 191, 159, 0.2)'
        }}
        data-component="ResourceTile"
        data-variant="default"
        data-testid={`tile-resource-${id}`}
      >
        <div 
          className="h-36 flex items-center justify-center relative"
          style={{ 
            background: image 
              ? `url(${image}) center/cover` 
              : 'linear-gradient(135deg, rgba(143, 191, 159, 0.2), rgba(244, 199, 195, 0.2))'
          }}
        >
          {!image && (
            <Icon 
              className="w-12 h-12" 
              style={{ color: '#2f5d5d', opacity: 0.3 }} 
              aria-hidden="true" 
            />
          )}
          
          {featured && (
            <div className="absolute top-3 left-3">
              <Star className="w-5 h-5" style={{ color: '#eac33b', fill: '#eac33b' }} aria-hidden="true" />
            </div>
          )}

          {showBookmark && (
            <button 
              onClick={(e) => { e.preventDefault(); onBookmark?.(id); }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label={`Save ${title} to your bookmarks`}
              data-testid={`button-bookmark-${id}`}
            >
              <Bookmark className="w-4 h-4" style={{ color: '#2f5d5d' }} aria-hidden="true" />
            </button>
          )}

          {type === "video" && (
            <div 
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <Play className="w-6 h-6 ml-1" style={{ color: '#2f5d5d' }} aria-hidden="true" />
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span 
              className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
              style={{ background: colors.bg, color: colors.text }}
            >
              {type}
            </span>
            {duration && (
              <span className="text-xs flex items-center gap-1" style={{ color: '#3a3a3a', opacity: 0.5 }}>
                <Clock className="w-3 h-3" aria-hidden="true" />
                {duration}
              </span>
            )}
          </div>

          <h3 
            className="font-semibold mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors"
            style={{ color: '#2f5d5d' }}
          >
            {title}
          </h3>

          {description && (
            <p 
              className="text-sm line-clamp-2 mb-3"
              style={{ color: '#3a3a3a', opacity: 0.7 }}
            >
              {description}
            </p>
          )}

          {tag && (
            <span className="text-xs font-medium" style={{ color: '#8fbf9f' }}>
              #{tag}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function ResourceTiles({ 
  resources = [], 
  columns = 3,
  variant = "default",
  showBookmark = true,
  onBookmark,
  emptyMessage = "No resources found"
}) {
  if (resources.length === 0) {
    return (
      <div 
        className="text-center py-12 px-6 rounded-2xl"
        style={{ background: 'rgba(143, 191, 159, 0.05)' }}
        data-testid="empty-resources"
      >
        <BookOpen 
          className="w-12 h-12 mx-auto mb-4" 
          style={{ color: '#8fbf9f', opacity: 0.5 }} 
          aria-hidden="true" 
        />
        <p style={{ color: '#3a3a3a', opacity: 0.6 }}>{emptyMessage}</p>
      </div>
    );
  }

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div 
      className={`grid ${gridCols[columns] || gridCols[3]} gap-6`}
      data-component="ResourceTiles"
      data-testid="resource-tiles-grid"
    >
      {resources.map((resource) => (
        <ResourceTile 
          key={resource.id}
          resource={resource}
          variant={variant}
          showBookmark={showBookmark}
          onBookmark={onBookmark}
        />
      ))}
    </div>
  );
}

export const sampleResources = [
  {
    id: "1",
    title: "Understanding Self-Compassion: A Beginner's Guide",
    description: "Learn the foundations of treating yourself with kindness and understanding.",
    type: "article",
    duration: "5 min read",
    tag: "Self-Love",
    href: "/content/self-compassion"
  },
  {
    id: "2",
    title: "Morning Grounding Exercise",
    description: "Start your day centered and calm with this guided practice.",
    type: "practice",
    duration: "10 min",
    tag: "Mindfulness",
    href: "/content/morning-grounding"
  },
  {
    id: "3",
    title: "Healing Your Inner Child",
    description: "A gentle exploration of reconnecting with your younger self.",
    type: "video",
    duration: "12 min",
    tag: "Trauma Healing",
    featured: true,
    href: "/content/inner-child"
  },
  {
    id: "4",
    title: "Sleep Meditation for Anxiety",
    description: "Drift into peaceful sleep with this calming audio guide.",
    type: "audio",
    duration: "20 min",
    tag: "Sleep",
    href: "/content/sleep-meditation"
  },
  {
    id: "5",
    title: "Building Healthy Boundaries",
    description: "Learn to protect your energy while maintaining meaningful connections.",
    type: "guide",
    duration: "15 min read",
    tag: "Relationships",
    href: "/content/boundaries"
  }
];
