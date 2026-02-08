import { useState } from "react";
import { Link, useRoute } from "wouter";
import { 
  ArrowLeft, MessageCircle, ThumbsUp, Heart, Shield, Award, 
  Clock, Users, Send, CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

const SAMPLE_POSTS = [
  {
    id: 1,
    question: "How do you handle overwhelming feelings when they come unexpectedly?",
    author: "HealingPath",
    topic: "healing",
    timestamp: "2 hours ago",
    votes: 24,
    isTrusted: true,
    answers: [
      {
        id: 101,
        text: "I use the 5-4-3-2-1 grounding technique. Name 5 things you can see, 4 things you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. It helps bring you back to the present moment.",
        author: "MindfulSoul",
        votes: 18,
        isTrusted: true,
        isBest: true,
        timestamp: "1 hour ago"
      },
      {
        id: 102,
        text: "I find that stepping outside for fresh air, even for just 2 minutes, can help reset my nervous system. The change of environment signals to my brain that the situation has shifted.",
        author: "NatureLover",
        votes: 12,
        isTrusted: false,
        isBest: false,
        timestamp: "45 minutes ago"
      },
      {
        id: 103,
        text: "Box breathing works wonders for me: breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat until you feel calmer.",
        author: "CalmSeeker",
        votes: 8,
        isTrusted: true,
        isBest: false,
        timestamp: "30 minutes ago"
      }
    ]
  },
  {
    id: 2,
    question: "What affirmations help you the most when self-doubt creeps in?",
    author: "GrowthMindset",
    topic: "growth",
    timestamp: "5 hours ago",
    votes: 31,
    isTrusted: false,
    answers: [
      {
        id: 201,
        text: "'I am doing my best with what I have, and that is enough.' This one helps me remember that progress isn't always visible, but it's still happening.",
        author: "SelfLoveAdvocate",
        votes: 25,
        isTrusted: true,
        isBest: true,
        timestamp: "4 hours ago"
      },
      {
        id: 202,
        text: "'I am worthy of love and belonging, exactly as I am.' Brené Brown's research on vulnerability really helped me understand this.",
        author: "VulnerabilityWarrior",
        votes: 15,
        isTrusted: false,
        isBest: false,
        timestamp: "3 hours ago"
      }
    ]
  },
  {
    id: 3,
    question: "Tips for setting boundaries without feeling guilty?",
    author: "BoundaryBuilder",
    topic: "relationships",
    timestamp: "1 day ago",
    votes: 45,
    isTrusted: true,
    answers: [
      {
        id: 301,
        text: "Remember: 'No' is a complete sentence. You don't owe anyone an explanation for protecting your peace.",
        author: "PeaceKeeper",
        votes: 20,
        isTrusted: true,
        isBest: false,
        timestamp: "20 hours ago"
      }
    ]
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

export default function DiscussionPage() {
  const [, params] = useRoute("/community/discussion/:id");
  const postId = params?.id ? parseInt(params.id, 10) : null;
  const post = SAMPLE_POSTS.find(p => p.id === postId);
  
  const [newAnswer, setNewAnswer] = useState("");
  const [votedAnswers, setVotedAnswers] = useState([]);
  const { toast } = useToast();

  const handleVote = (answerId) => {
    if (votedAnswers.includes(answerId)) {
      setVotedAnswers(votedAnswers.filter(id => id !== answerId));
    } else {
      setVotedAnswers([...votedAnswers, answerId]);
    }
  };

  const handleSubmitAnswer = () => {
    if (newAnswer.trim().length >= 10) {
      toast({ 
        title: "Answer submitted", 
        description: "Your answer is being reviewed by moderators." 
      });
      setNewAnswer("");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen hero-gradient">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link 
            href="/community" 
            className="inline-flex items-center gap-2 text-sm text-[var(--sage-600)] hover:text-[var(--teal-700)] transition mb-6"
            data-testid="link-back-community"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </Link>
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-600 mb-2">Discussion not found</h1>
            <p className="text-gray-500">This discussion may have been removed or doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${post.question} - Community Discussion`}
        description={`Join the discussion: ${post.question}`}
      />
      <div className="min-h-screen hero-gradient">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link 
            href="/community" 
            className="inline-flex items-center gap-2 min-h-[44px] text-sm text-[var(--sage-600)] hover:text-[var(--teal-700)] transition mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-400)] focus-visible:ring-offset-2 rounded-lg px-2 -ml-2"
            data-testid="link-back-community"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </Link>

          {/* Question Card */}
          <article className="mb-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm" data-testid="card-question">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-sage-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {post.author.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 dark:text-white">{post.author}</span>
                  {post.isTrusted && <TrustBadge />}
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" aria-hidden="true" /> {post.timestamp}
                </span>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4 leading-relaxed" data-testid="text-question">
              {post.question}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4" /> {post.votes} helpful
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" /> {post.answers.length} answers
              </span>
            </div>
          </article>

          {/* Answers Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--sage-500)]" />
              Answers ({post.answers.length})
            </h2>

            <div className="space-y-4">
              {post.answers.map(answer => (
                <div
                  key={answer.id}
                  className={`p-5 rounded-2xl border transition-shadow ${
                    answer.isBest 
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" 
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                  data-testid={`card-answer-${answer.id}`}
                >
                  {answer.isBest && (
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Best Answer</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-300 to-teal-400 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {answer.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800 dark:text-white text-sm">{answer.author}</span>
                        {answer.isTrusted && <TrustBadge size="sm" />}
                      </div>
                      <span className="text-xs text-gray-500">{answer.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {answer.text}
                  </p>

                  <button 
                    onClick={() => handleVote(answer.id)}
                    className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-400)] focus-visible:ring-offset-2 ${
                      votedAnswers.includes(answer.id) 
                        ? "bg-teal-100 text-teal-700 border border-teal-200" 
                        : "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200 hover:border-teal-200"
                    }`}
                    data-testid={`button-vote-answer-${answer.id}`}
                    aria-label={`Vote helpful, ${answer.votes + (votedAnswers.includes(answer.id) ? 1 : 0)} votes`}
                    aria-pressed={votedAnswers.includes(answer.id)}
                  >
                    <ThumbsUp className="w-4 h-4" aria-hidden="true" />
                    <span>{answer.votes + (votedAnswers.includes(answer.id) ? 1 : 0)}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Add Answer Section */}
          <section className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm" data-testid="section-add-answer">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[var(--rose-400)]" />
              Share Your Answer
            </h3>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Share your experience or wisdom to help others on their journey..."
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--teal-400)] focus:border-transparent resize-none min-h-[120px]"
              rows={4}
              data-testid="textarea-answer"
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                {newAnswer.length}/500 characters • Min 10 characters
              </p>
              <button
                onClick={handleSubmitAnswer}
                disabled={newAnswer.trim().length < 10}
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--teal-500)] hover:bg-[var(--teal-600)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-400)] focus-visible:ring-offset-2"
                data-testid="button-submit-answer"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                Submit Answer
              </button>
            </div>
          </section>

          {/* Community Guidelines */}
          <footer className="mt-8 p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/50 text-center">
            <Shield className="w-6 h-6 text-teal-500 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Be kind and supportive. Everyone is here at their own pace.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
