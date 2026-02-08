import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  MessageCircle, ThumbsUp, Heart, Shield, Award, Star,
  Filter, Search, Send, CheckCircle, Clock, Users, Sparkles, ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TOPICS = [
  { id: "all", label: "All Topics", icon: Filter },
  { id: "healing", label: "Healing & Reflection", icon: Heart },
  { id: "anxiety", label: "Anxiety & Stress", icon: Shield },
  { id: "relationships", label: "Relationships", icon: Users },
  { id: "growth", label: "Personal Growth", icon: Sparkles }
];

const SAMPLE_POSTS = [
  {
    id: 1,
    question: "How do you handle overwhelming feelings when they come unexpectedly?",
    author: "HealingPath",
    topic: "healing",
    timestamp: "2 hours ago",
    votes: 24,
    answers: 5,
    isTrusted: true,
    bestAnswer: {
      text: "I use the 5-4-3-2-1 grounding technique. Name 5 things you can see, 4 things you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. It helps bring you back to the present moment.",
      author: "MindfulSoul",
      votes: 18,
      isTrusted: true
    }
  },
  {
    id: 2,
    question: "What affirmations help you the most when self-doubt creeps in?",
    author: "GrowthMindset",
    topic: "growth",
    timestamp: "5 hours ago",
    votes: 31,
    answers: 8,
    isTrusted: false,
    bestAnswer: {
      text: "'I am doing my best with what I have, and that is enough.' This one helps me remember that progress isn't always visible, but it's still happening.",
      author: "SelfLoveAdvocate",
      votes: 25,
      isTrusted: true
    }
  },
  {
    id: 3,
    question: "Tips for setting boundaries without feeling guilty?",
    author: "BoundaryBuilder",
    topic: "relationships",
    timestamp: "1 day ago",
    votes: 45,
    answers: 12,
    isTrusted: true,
    bestAnswer: null
  }
];

const REFLECTIONS = [
  {
    text: "I realized I don't need to solve everything today. Rest is also progress.",
    author: "Anonymous"
  },
  {
    text: "Naming what I feel softly helped me stop fighting myself.",
    author: "Anonymous"
  },
  {
    text: "I can be both unfinished and worthy at the same time.",
    author: "Anonymous"
  }
];

function TrustBadge({ size = "sm" }) {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-gold-100 text-amber-700 text-xs font-medium" title="Trusted Member">
      <Award className={sizeClass} />
      Trusted
    </span>
  );
}

function VoteButton({ count, voted, onVote, postId }) {
  return (
    <button 
      onClick={onVote}
      className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-400)] focus-visible:ring-offset-2 ${
        voted 
          ? "bg-teal-100 text-teal-700 border border-teal-200" 
          : "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200 hover:border-teal-200"
      }`}
      data-testid={`button-vote-${postId}`}
      aria-label={`Vote helpful, ${count} votes`}
      aria-pressed={voted}
    >
      <ThumbsUp className="w-4 h-4" aria-hidden="true" />
      <span>{count}</span>
    </button>
  );
}

export default function SharedReflectionsPage() {
  const [activeTopic, setActiveTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [votedPosts, setVotedPosts] = useState([]);
  const [showAskForm, setShowAskForm] = useState(false);
  const { toast } = useToast();

  const filteredPosts = SAMPLE_POSTS.filter(post => {
    const matchesTopic = activeTopic === "all" || post.topic === activeTopic;
    const matchesSearch = post.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleVote = (postId) => {
    if (votedPosts.includes(postId)) {
      setVotedPosts(votedPosts.filter(id => id !== postId));
    } else {
      setVotedPosts([...votedPosts, postId]);
    }
  };

  const handleAskQuestion = () => {
    if (newQuestion.trim()) {
      toast({ 
        title: "Question submitted", 
        description: "Your question is being reviewed by moderators." 
      });
      setNewQuestion("");
      setShowAskForm(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center mb-5">
            <div className="section-header-icon w-16 h-16 rounded-2xl">
              <MessageCircle className="w-8 h-8" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-display-lg text-teal mb-3" data-testid="text-community-title">
            Q&A Community
          </h1>
          <p className="text-lead max-w-2xl mx-auto content-breathe">
            A safe space to ask questions, share wisdom, and support each other.
            No judgment, only compassion.
          </p>
        </header>
        
        {/* Community Stats */}
        <div className="community-stats" data-testid="community-stats">
          <div className="community-stat">
            <span className="community-stat-value">127</span>
            <span className="community-stat-label">Questions</span>
          </div>
          <div className="community-stat">
            <span className="community-stat-value">892</span>
            <span className="community-stat-label">Answers</span>
          </div>
          <div className="community-stat">
            <span className="community-stat-value">2.4k</span>
            <span className="community-stat-label">Helpful Votes</span>
          </div>
          <div className="community-stat">
            <span className="community-stat-value">156</span>
            <span className="community-stat-label">Members</span>
          </div>
        </div>

        {/* Search + Ask */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--teal-400)] focus:border-transparent shadow-sm"
              data-testid="input-search-questions"
            />
          </div>
          <button
            onClick={() => setShowAskForm(!showAskForm)}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ 
              background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)',
              boxShadow: '0 8px 24px rgba(47, 93, 93, 0.3)'
            }}
            data-testid="button-ask-question"
          >
            Ask a Question
          </button>
        </div>

        {/* Ask Form */}
        {showAskForm && (
          <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg" data-testid="form-ask-question">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Ask the Community</h3>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="What would you like to ask? Remember to be kind and specific..."
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--teal-400)] focus:border-transparent resize-none"
              rows={4}
              data-testid="textarea-question"
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">All questions are reviewed before posting.</p>
              <button
                onClick={handleAskQuestion}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium transition-colors"
                data-testid="button-submit-question"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Section Header: Q&A Spotlight */}
        <div className="section-header mt-8">
          <div className="section-header-icon">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2>Q&A Spotlight</h2>
        </div>

        {/* Topic Navigation */}
        <div className="topic-nav" data-testid="topic-navigation">
          {TOPICS.map(topic => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-400)] focus-visible:ring-offset-2 ${
                  activeTopic === topic.id
                    ? "bg-[var(--glp-sage-deep)] text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[var(--teal-300)] hover:bg-[var(--glp-sage-50)]"
                }`}
                data-testid={`topic-${topic.id}`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {topic.label}
              </button>
            );
          })}
        </div>

        {/* Questions List */}
        <div className="stack-lg mb-12 mt-6">
          {filteredPosts.map(post => (
            <article 
              key={post.id} 
              className="qa-block"
              data-testid={`post-${post.id}`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-sage-500 flex items-center justify-center text-white font-medium">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{post.author}</span>
                      {post.isTrusted && <TrustBadge />}
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" /> {post.timestamp}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {TOPICS.find(t => t.id === post.topic)?.label}
                </span>
              </div>

              {/* Question */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {post.question}
              </h3>

              {/* Best Answer */}
              {post.bestAnswer && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Best Answer</span>
                    {post.bestAnswer.isTrusted && <TrustBadge size="sm" />}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {post.bestAnswer.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">— {post.bestAnswer.author}</p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <VoteButton 
                    count={post.votes + (votedPosts.includes(post.id) ? 1 : 0)} 
                    voted={votedPosts.includes(post.id)}
                    onVote={() => handleVote(post.id)}
                    postId={post.id}
                  />
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    {post.answers} answers
                  </span>
                </div>
                <Link 
                  href={`/community/discussion/${post.id}`}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium text-[var(--teal-600)] hover:text-white hover:bg-[var(--teal-500)] border border-[var(--teal-200)] hover:border-[var(--teal-500)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-400)] focus-visible:ring-offset-2"
                  data-testid={`link-view-discussion-${post.id}`}
                >
                  View Discussion
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Visual Divider */}
        <div className="section-divider" aria-hidden="true"></div>

        {/* Shared Reflections Section */}
        <section>
          <div className="section-header">
            <div className="section-header-icon" style={{ background: 'linear-gradient(135deg, var(--glp-blush), var(--glp-blush-400))' }}>
              <Heart className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2>Shared Reflections</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Anonymous thoughts to remind you that you are not alone.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REFLECTIONS.map((r, i) => (
              <div
                key={i}
                className="shared-reflection"
                data-testid={`card-reflection-${i}`}
              >
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  "{r.text}"
                </p>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 not-italic">
                  <Star className="w-3 h-3" aria-hidden="true" /> {r.author}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Visual Divider */}
        <div className="section-divider" aria-hidden="true"></div>

        {/* Community Guidelines */}
        <footer className="resource-section text-center">
          <Shield className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--glp-sage-deep)' }} aria-hidden="true" />
          <h3 className="font-semibold text-lg mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--glp-sage-deep)' }}>
            Community Guidelines
          </h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-xl mx-auto content-breathe">
            This is a safe, moderated space. Be kind, be supportive, and remember that everyone is working through things at their own pace. 
            No medical advice—seek professional help for clinical concerns.
          </p>
          <div className="mt-4">
            <a href="/safety" className="inline-flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--glp-sage-deep)' }}>
              View Safety Resources →
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
