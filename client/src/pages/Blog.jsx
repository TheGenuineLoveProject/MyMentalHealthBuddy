import { useState } from "react";
import { Link } from "wouter";
import { BookOpen, ArrowRight, Sparkles, Heart, PenTool, Clock, User, ChevronRight, Tag } from "lucide-react";
import SEO from "@/components/SEO";

const BLOG_ARTICLES = [
  {
    id: "welcome-to-genuine-love",
    title: "Welcome to Your Healing Journey",
    excerpt: "Discover the philosophy behind The Genuine Love Project and how we're creating a safe space for emotional healing and self-discovery. Your path to genuine self-love starts here.",
    content: `
      <p>Welcome to The Genuine Love Project. If you've found your way here, something in you is ready for change—and that takes courage.</p>
      
      <h3>What We Believe</h3>
      <p>At the heart of our approach is one simple truth: <strong>you are worthy of compassion, exactly as you are</strong>. Not the future version of yourself who has it all figured out. Not the version that meets everyone's expectations. You, right now, in this moment.</p>
      
      <p>We understand that healing isn't linear. Some days will feel like breakthroughs; others might feel like setbacks. Both are valid parts of the journey. Our role is to walk alongside you with tools, resources, and a gentle presence—never to judge, never to rush.</p>
      
      <h3>A Trauma-Informed Approach</h3>
      <p>Everything we offer is grounded in trauma-informed principles. This means:</p>
      <ul>
        <li><strong>Safety first:</strong> You set the pace. You decide what feels right.</li>
        <li><strong>Choice and control:</strong> No prescriptions here—only invitations.</li>
        <li><strong>Transparency:</strong> We explain the "why" behind our methods.</li>
        <li><strong>Collaboration:</strong> You are the expert on your own life.</li>
      </ul>
      
      <h3>Your Nervous System Knows</h3>
      <p>Before your thinking brain can process, your body already knows when something feels safe or threatening. We honor this wisdom by creating experiences that help regulate your nervous system—not just challenge your thoughts.</p>
      
      <p>This isn't about "fixing" you. It's about remembering who you've always been beneath the protective layers you've built.</p>
      
      <h3>An Invitation</h3>
      <p>Consider this your gentle invitation. Explore at your own pace. Take what resonates; leave what doesn't. There's no timeline, no test, no way to do this wrong.</p>
      
      <p>You've already taken the hardest step: beginning.</p>
    `,
    author: "The Genuine Love Team",
    date: "January 15, 2026",
    readTime: "5 min read",
    category: "Featured",
    categoryColor: "sage",
    icon: Sparkles,
  },
  {
    id: "art-of-self-compassion",
    title: "The Art of Self-Compassion: A Gentle Practice",
    excerpt: "Learn gentle practices to cultivate kindness toward yourself, even on difficult days. Self-compassion isn't about letting yourself off the hook—it's about treating yourself with the same care you'd offer a dear friend.",
    content: `
      <p>What would you say to a close friend who was struggling? Would you criticize them? Tell them they should have known better? Probably not. Yet this is often exactly how we speak to ourselves.</p>
      
      <h3>The Three Components of Self-Compassion</h3>
      <p>Dr. Kristin Neff's research identifies three core elements:</p>
      
      <p><strong>1. Self-Kindness vs. Self-Judgment</strong></p>
      <p>When we fail or feel inadequate, self-compassion means being warm toward ourselves rather than ignoring our pain or criticizing ourselves. It means saying "This is hard right now" instead of "I should be handling this better."</p>
      
      <p><strong>2. Common Humanity vs. Isolation</strong></p>
      <p>Suffering and personal inadequacy are part of the shared human experience. When you're struggling, you're not alone—billions of humans have felt this way. This connection can soften the edges of pain.</p>
      
      <p><strong>3. Mindfulness vs. Over-Identification</strong></p>
      <p>Mindfulness helps us observe our negative thoughts and emotions without suppressing or exaggerating them. We can acknowledge "I notice I'm feeling anxious" rather than being consumed by anxiety.</p>
      
      <h3>A Simple Self-Compassion Practice</h3>
      <p>When you notice you're being hard on yourself, try this:</p>
      <ol>
        <li>Place a hand on your heart (this activates your care system)</li>
        <li>Acknowledge the difficulty: "This is a moment of suffering."</li>
        <li>Connect to common humanity: "Suffering is part of being human."</li>
        <li>Offer kindness: "May I be kind to myself in this moment."</li>
      </ol>
      
      <h3>Self-Compassion Is Not...</h3>
      <ul>
        <li><strong>Self-pity:</strong> Self-pity says "poor me"; self-compassion says "this is hard, and I'm not alone."</li>
        <li><strong>Self-indulgence:</strong> Self-compassion actually leads to healthier behaviors because it reduces shame.</li>
        <li><strong>Weakness:</strong> Research shows self-compassionate people are more resilient and motivated.</li>
      </ul>
      
      <p>You deserve the same kindness you so readily give to others. Start small. One moment of self-compassion at a time.</p>
    `,
    author: "The Genuine Love Team",
    date: "January 18, 2026",
    readTime: "7 min read",
    category: "Self-Care",
    categoryColor: "blush",
    icon: Heart,
  },
  {
    id: "journaling-for-healing",
    title: "Journaling for Healing: Evidence-Based Techniques",
    excerpt: "Explore evidence-based journaling techniques that support emotional processing and growth. Writing can be a powerful tool for understanding yourself and releasing what no longer serves you.",
    content: `
      <p>For decades, research has shown that expressive writing can significantly improve both mental and physical health. But not all journaling is created equal. Here's what the science tells us about writing for healing.</p>
      
      <h3>The Science Behind Expressive Writing</h3>
      <p>Dr. James Pennebaker's pioneering research found that writing about emotional experiences for just 15-20 minutes over 3-4 days can:</p>
      <ul>
        <li>Reduce anxiety and depression symptoms</li>
        <li>Improve immune function</li>
        <li>Lower blood pressure</li>
        <li>Enhance working memory</li>
        <li>Improve sleep quality</li>
      </ul>
      
      <h3>Effective Journaling Techniques</h3>
      
      <p><strong>1. The Pennebaker Method</strong></p>
      <p>Write continuously for 15-20 minutes about your deepest thoughts and feelings regarding an emotional issue. Don't worry about grammar or spelling—just keep your pen moving. Write on 3-4 consecutive days.</p>
      
      <p><strong>2. Gratitude Journaling</strong></p>
      <p>Research shows that writing 3 things you're grateful for each day can increase happiness levels by 25%. The key is specificity—not just "I'm grateful for my family" but "I'm grateful my sister called to check on me today."</p>
      
      <p><strong>3. Morning Pages (Julia Cameron)</strong></p>
      <p>Write three pages of stream-of-consciousness first thing in the morning. This clears mental clutter and often reveals insights hiding beneath the surface.</p>
      
      <p><strong>4. Unsent Letters</strong></p>
      <p>Write a letter to someone (or yourself) that you'll never send. This can help process complex emotions around relationships without the pressure of actual communication.</p>
      
      <h3>Trauma-Sensitive Journaling Tips</h3>
      <ul>
        <li><strong>Go slowly:</strong> You don't have to write about the hardest things first. Start where you feel safe.</li>
        <li><strong>Use distance:</strong> If writing in first person feels too intense, try third person.</li>
        <li><strong>Ground yourself:</strong> Before and after writing, take a few deep breaths. Notice your surroundings.</li>
        <li><strong>You're in control:</strong> You can stop anytime. Close the journal. The words will wait.</li>
      </ul>
      
      <h3>Getting Started</h3>
      <p>If a blank page feels intimidating, try starting with: "Right now, I'm noticing..." or "Something on my mind today is..."</p>
      
      <p>There's no wrong way to journal. The most important thing is that you show up for yourself, pen in hand, ready to listen.</p>
    `,
    author: "The Genuine Love Team",
    date: "January 22, 2026",
    readTime: "8 min read",
    category: "Tools",
    categoryColor: "gold",
    icon: PenTool,
  },
];

const CATEGORY_STYLES = {
  sage: {
    bg: "bg-[var(--sage-100)]",
    text: "text-[var(--sage-700)]",
  },
  blush: {
    bg: "bg-[var(--blush-100)]",
    text: "text-[var(--blush-700)]",
  },
  gold: {
    bg: "bg-[var(--gold-100)]",
    text: "text-[var(--gold-700)]",
  },
};

export default function Blog() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const article = BLOG_ARTICLES.find((a) => a.id === selectedArticle);

  if (article) {
    return (
      <>
        <SEO 
          title={`${article.title} - The Genuine Love Project Blog`}
          description={article.excerpt}
        />
        
        <div className="min-h-screen hero-gradient overflow-hidden relative">
          <div className="decorative-orb decorative-orb-sage w-[500px] h-[500px] -top-40 -right-40 absolute" aria-hidden="true" />
          <div className="decorative-orb decorative-orb-blush w-[300px] h-[300px] bottom-20 -left-20 absolute" aria-hidden="true" />
          
          <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-[var(--teal-600)] hover:text-[var(--teal-700)] mb-8 transition-colors"
              data-testid="button-back-blog"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Blog
            </button>

            <article className="prose prose-lg max-w-none">
              <header className="mb-8 not-prose">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${CATEGORY_STYLES[article.categoryColor]?.bg || "bg-gray-100"} ${CATEGORY_STYLES[article.categoryColor]?.text || "text-gray-700"}`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>
                
                <h1 className="text-display-md text-teal mb-4" data-testid="text-article-title">
                  {article.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {article.author}
                  </span>
                  <span>{article.date}</span>
                </div>
              </header>

              <div 
                className="article-content text-[var(--ink)] leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: article.content }}
                data-testid="content-article-body"
              />

              <footer className="mt-12 pt-8 border-t border-[var(--sage-200)] not-prose">
                <div className="bg-[var(--sage-50)] rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Disclaimer:</strong> This content is for educational purposes only and is not a substitute for professional mental health care. If you're in crisis, please contact the 988 Suicide & Crisis Lifeline or text HOME to 741741.
                  </p>
                  <Link 
                    href="/crisis" 
                    className="text-[var(--teal-600)] hover:underline text-sm font-medium"
                    data-testid="link-crisis"
                  >
                    Access Crisis Resources →
                  </Link>
                </div>
              </footer>
            </article>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Blog - The Genuine Love Project"
        description="Healing articles, wellness resources, and insights for your journey to genuine love and emotional well-being."
      />
      
      <div className="min-h-screen hero-gradient overflow-hidden relative">
        <div className="decorative-orb decorative-orb-sage w-[500px] h-[500px] -top-40 -right-40 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[300px] h-[300px] bottom-20 -left-20 absolute" aria-hidden="true" />
        
        <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
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
            {BLOG_ARTICLES.map((blogArticle) => {
              const Icon = blogArticle.icon;
              const catStyle = CATEGORY_STYLES[blogArticle.categoryColor] || CATEGORY_STYLES.sage;
              
              return (
                <article 
                  key={blogArticle.id}
                  className="card-bordered group hover:shadow-lg transition-all duration-300 cursor-pointer" 
                  data-testid={`card-blog-${blogArticle.id}`}
                  onClick={() => setSelectedArticle(blogArticle.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedArticle(blogArticle.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`icon-container icon-lg icon-gradient-${blogArticle.categoryColor} group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-heading-md text-teal mb-2 group-hover:text-[var(--teal-600)] transition-colors">
                        {blogArticle.title}
                      </h2>
                      <p className="text-body-sm mb-4 line-clamp-2">
                        {blogArticle.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-caption text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {blogArticle.readTime}
                        </span>
                        <span className="text-caption text-gray-400">•</span>
                        <span className="text-caption text-gray-500">{blogArticle.date}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${catStyle.bg} ${catStyle.text}`}>
                          {blogArticle.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--teal-600)] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </article>
              );
            })}
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
                <Link href="/write" className="btn-primary flex items-center gap-2" data-testid="link-write">
                  Write <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[var(--blush-50)] rounded-xl border border-[var(--blush-200)] text-center">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> This content is for educational purposes only. 
              If you're experiencing a crisis, please reach out to{" "}
              <Link href="/crisis" className="text-[var(--teal-600)] hover:underline font-medium" data-testid="link-crisis-footer">
                crisis resources
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
