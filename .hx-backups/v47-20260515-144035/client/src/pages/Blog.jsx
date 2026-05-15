import { useMemo, useState } from "react";
import { Link } from "wouter";
import DOMPurify from "dompurify";
import { BookOpen, ArrowRight, Sparkles, Heart, PenTool, Clock, User, ChevronRight } from 'lucide-react';
import SEO from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import ValueProposition from "@/sections/ValueProposition.jsx";
import NextStepCTA from "@/sections/NextStepCTA.jsx";

// Defense-in-depth: BLOG_ARTICLES.content is currently dev-authored static
// HTML, but we sanitize at render time so any future CMS / API integration
// (or accidental editorial paste of script-bearing HTML) cannot become an
// XSS vector. ALLOWED_TAGS/ATTR list is intentionally narrow: the body of a
// trauma-informed wellness article never needs <script>, <iframe>, <object>,
// inline event handlers, or javascript: URLs.
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "em", "u", "s", "blockquote",
    "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "a", "code", "pre", "hr", "span", "div",
  ],
  ALLOWED_ATTR: ["href", "title", "target", "rel", "class"],
  ALLOW_DATA_ATTR: false,
};

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
  {
    id: "understanding-nervous-system",
    title: "Understanding Your Nervous System: A Guide to Regulation",
    excerpt: "Learn how your nervous system responds to stress and discover simple practices to help yourself feel safer and more grounded in daily life.",
    content: `
      <p>Have you ever wondered why your heart races before a difficult conversation? Or why you freeze when you feel overwhelmed? Your nervous system is constantly working to keep you safe—and understanding it can transform how you navigate life's challenges.</p>
      
      <h3>The Autonomic Nervous System</h3>
      <p>Your autonomic nervous system operates largely outside your conscious control, managing vital functions like heart rate, breathing, and digestion. It has three main states:</p>
      
      <p><strong>1. Ventral Vagal (Safe & Social)</strong></p>
      <p>When you feel safe, your system allows you to connect, think clearly, and engage with others. Your breathing is easy, your face is expressive, and you can access creativity and problem-solving.</p>
      
      <p><strong>2. Sympathetic (Fight or Flight)</strong></p>
      <p>When you perceive danger, your body mobilizes energy: heart racing, muscles tensing, breath quickening. This prepares you to fight or flee. While protective, chronic activation leads to anxiety and exhaustion.</p>
      
      <p><strong>3. Dorsal Vagal (Freeze or Shutdown)</strong></p>
      <p>When threat feels overwhelming, your system may immobilize you—creating feelings of numbness, disconnection, or collapse. This ancient response can feel confusing but was designed to protect you.</p>
      
      <h3>Signs of Dysregulation</h3>
      <ul>
        <li>Difficulty calming down after stress</li>
        <li>Feeling "on edge" even when safe</li>
        <li>Numbness or disconnection from your body</li>
        <li>Startling easily at sounds or movements</li>
        <li>Difficulty sleeping or constant fatigue</li>
      </ul>
      
      <h3>Simple Regulation Practices</h3>
      
      <p><strong>Physiological Sigh</strong></p>
      <p>Inhale through your nose, then take a second small inhale to fully fill your lungs. Exhale slowly through your mouth. This activates your calming system within seconds.</p>
      
      <p><strong>Cold Water on Wrists</strong></p>
      <p>Running cold water over your wrists or splashing your face activates the dive reflex, quickly calming your heart rate.</p>
      
      <p><strong>Grounding Through the Senses</strong></p>
      <p>Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This anchors you in the present moment.</p>
      
      <p>Your nervous system learned to protect you based on your experiences. With patience and practice, you can help it learn new patterns of safety.</p>
    `,
    author: "The Genuine Love Team",
    date: "January 23, 2026",
    readTime: "9 min read",
    category: "Education",
    categoryColor: "sage",
    icon: BookOpen,
  },
  {
    id: "boundaries-self-love",
    title: "Boundaries as an Act of Self-Love",
    excerpt: "Discover how setting healthy boundaries protects your energy, strengthens relationships, and honors your inherent worth.",
    content: `
      <p>Many of us grew up learning that putting others first makes us good people. But when we consistently ignore our own needs, we deplete ourselves—and often build resentment in the process.</p>
      
      <h3>What Are Boundaries, Really?</h3>
      <p>Boundaries are the limits we set to protect our physical, emotional, and mental well-being. They're not walls to keep people out—they're gates that let us choose what comes in and what stays out.</p>
      
      <p>Healthy boundaries include:</p>
      <ul>
        <li><strong>Physical:</strong> Personal space, touch preferences, rest needs</li>
        <li><strong>Emotional:</strong> What you share, take on from others, or engage with</li>
        <li><strong>Time:</strong> How you spend your hours and energy</li>
        <li><strong>Material:</strong> Your possessions, money, resources</li>
        <li><strong>Digital:</strong> Screen time, social media, communication availability</li>
      </ul>
      
      <h3>Why Boundaries Feel Hard</h3>
      <p>If you learned early that your needs didn't matter, or that love was conditional on compliance, boundaries may feel selfish or scary. You might fear:</p>
      <ul>
        <li>Being seen as mean or difficult</li>
        <li>Losing relationships</li>
        <li>Feeling guilty for prioritizing yourself</li>
        <li>Others' disappointment or anger</li>
      </ul>
      
      <p>These fears are understandable—but they're not facts. Healthy relationships can hold boundaries.</p>
      
      <h3>Setting Boundaries with Kindness</h3>
      
      <p><strong>Use "I" Statements</strong></p>
      <p>"I need some quiet time after work before I can engage" is clearer and gentler than "You're always so demanding."</p>
      
      <p><strong>Keep It Simple</strong></p>
      <p>You don't need to justify, argue, defend, or explain (J.A.D.E.). "I'm not available for that" is a complete sentence.</p>
      
      <p><strong>Expect Adjustment Time</strong></p>
      <p>People who benefited from your lack of boundaries may push back. This doesn't mean your boundary is wrong—it means it's new.</p>
      
      <h3>The Gift of Boundaries</h3>
      <p>When you honor your limits, you show up more fully in your relationships. You have more energy. You reduce resentment. And you teach others how to treat you.</p>
      
      <p>Setting boundaries isn't about being less loving—it's about loving yourself too.</p>
    `,
    author: "The Genuine Love Team",
    date: "January 24, 2026",
    readTime: "7 min read",
    category: "Self-Care",
    categoryColor: "blush",
    icon: Heart,
  },
  {
    id: "healing-from-perfectionism",
    title: "Healing from Perfectionism: Embracing 'Good Enough'",
    excerpt: "Explore the roots of perfectionism and learn gentler ways to pursue growth while accepting your beautifully imperfect self.",
    content: `
      <p>Do you set impossibly high standards for yourself? Feel like a failure unless everything is perfect? Perfectionism often masquerades as a virtue, but it's frequently rooted in fear—fear of judgment, rejection, or not being enough.</p>
      
      <h3>Understanding Perfectionism</h3>
      <p>Perfectionism isn't about being excellent or having high standards. It's an anxiety-driven belief that if we're perfect enough, we can avoid pain and criticism. Researcher Brené Brown calls it "the 20-ton shield" we carry to protect ourselves.</p>
      
      <p>Signs of perfectionism:</p>
      <ul>
        <li>All-or-nothing thinking ("If it's not perfect, it's a failure")</li>
        <li>Procrastination (fear of not doing it perfectly delays starting)</li>
        <li>Harsh self-criticism when you fall short</li>
        <li>Difficulty celebrating achievements</li>
        <li>Tying your worth to productivity or accomplishments</li>
        <li>Fear of making mistakes visible to others</li>
      </ul>
      
      <h3>Where Perfectionism Comes From</h3>
      <p>Often, perfectionism develops in childhood when love felt conditional—when being "good" or "successful" seemed necessary for acceptance. It can also arise from environments where mistakes were heavily criticized or where chaos made control feel essential for safety.</p>
      
      <h3>The Cost of Perfectionism</h3>
      <p>Perfectionism is associated with:</p>
      <ul>
        <li>Higher rates of anxiety and depression</li>
        <li>Burnout and exhaustion</li>
        <li>Strained relationships</li>
        <li>Reduced creativity and risk-taking</li>
        <li>Paradoxically, lower performance over time</li>
      </ul>
      
      <h3>Practices for Healing</h3>
      
      <p><strong>Notice the Inner Critic</strong></p>
      <p>Start observing your self-talk. Would you speak to a friend this way? Practice naming the critic ("There's that perfectionist voice again") without believing it.</p>
      
      <p><strong>Embrace "Good Enough"</strong></p>
      <p>Psychologist D.W. Winnicott coined the term "good enough" parent—the idea that perfection isn't necessary or even desirable. Apply this to yourself: good enough is actually... good enough.</p>
      
      <p><strong>Celebrate Progress, Not Perfection</strong></p>
      <p>Notice what you completed today, not what you didn't. Growth happens in small steps, not quantum leaps.</p>
      
      <p><strong>Practice Intentional Imperfection</strong></p>
      <p>Send an email without proofreading it three times. Leave the bed unmade. Notice that the world doesn't end.</p>
      
      <p>You are worthy of love and belonging right now—not when you've finally achieved enough, lost enough weight, or gotten it all together. Right now. As you are.</p>
    `,
    author: "The Genuine Love Team",
    date: "January 24, 2026",
    readTime: "8 min read",
    category: "Healing",
    categoryColor: "sage",
    icon: Sparkles,
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
  teal: {
    bg: "bg-[var(--teal-100)]",
    text: "text-[var(--teal-700)]",
  },
};

export default function Blog() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const article = BLOG_ARTICLES.find((a) => a.id === selectedArticle);
  const safeArticleHtml = useMemo(
    () => (article ? DOMPurify.sanitize(article.content, SANITIZE_CONFIG) : ""),
    [article],
  );

  if (article) {
    return (
  <WellnessPageShell
    title="Blog"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

      <>
        <SEO 
          title={`${article.title} - The Genuine Love Project Blog`}
          description={article.excerpt}
        />
        
        <div className="min-h-screen overflow-hidden relative" style={{ background: 'var(--glp-paper)' }}>
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
                dangerouslySetInnerHTML={{ __html: safeArticleHtml }}
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
    </WellnessPageShell>
    );
  }

  return (
    <WellnessPageShell
      title="Blog"
      subtitle="Educational reflection tools. Choose what feels safe and supportive."
      benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
      clarity={{
        what: "A self-paced reflection tool you control.",
        why: "To support clarity, values alignment, and gentle next steps.",
        who: "For adults (18+) who want educational wellness tools (not medical care).",
        when: "Anytime you want a small reset or a thoughtful pause.",
        where: "Anywhere you can breathe and write for 1–5 minutes.",
        how: "Pick one prompt, answer briefly, stop whenever you want."
      }}
      examples={[
        { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
        { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
        { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
      ]}
    >
    <>
      <SEO 
        title="Blog - The Genuine Love Project"
        description="Healing articles, wellness resources, and insights for your journey to genuine love and emotional well-being."
      />
      
      <div className="min-h-screen overflow-hidden relative" style={{ background: 'var(--glp-paper)' }}>
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

          <ValueProposition variant="compact" className="mt-10" />
          <NextStepCTA context="blog" />
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
