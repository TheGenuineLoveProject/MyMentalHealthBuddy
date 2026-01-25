/**
 * ContentStudio.jsx - Social Media Content Developer Tool
 * 
 * Features:
 * - Content types: short post, carousel outline, thread outline, newsletter snippet
 * - Tone: warm, grounded, gentle, evidence-informed
 * - Audience levels: beginner/intermediate/advanced
 * - Topic selector with wellness themes
 * - Structured output: hook, body, CTA, disclaimer, hashtags, alt-text
 * - Copy buttons, accessibility, calm UI
 */

import { useState, useCallback } from 'react';
import { 
  Copy, Check, FileText, Layers, MessageSquare, Mail,
  Heart, Leaf, BookOpen, Sparkles, Sun, Brain, Shield,
  AlertCircle, RefreshCw
} from 'lucide-react';
import styles from './ContentStudio.module.css';
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const CONTENT_TYPES = [
  { id: 'short-post', label: 'Short Post', icon: FileText, desc: 'Single platform post (Instagram, LinkedIn, etc.)' },
  { id: 'carousel', label: 'Carousel Outline', icon: Layers, desc: 'Multi-slide visual content structure' },
  { id: 'thread', label: 'Thread Outline', icon: MessageSquare, desc: 'Connected posts for Twitter/X' },
  { id: 'newsletter', label: 'Newsletter Snippet', icon: Mail, desc: 'Email-ready content block' }
];

const TOPICS = [
  { id: 'anxiety', label: 'Managing Anxiety', icon: Shield },
  { id: 'grounding', label: 'Grounding Techniques', icon: Leaf },
  { id: 'journaling', label: 'Journaling Prompts', icon: BookOpen },
  { id: 'self-compassion', label: 'Self-Compassion', icon: Heart },
  { id: 'routines', label: 'Wellness Routines', icon: Sun },
  { id: 'emotional-awareness', label: 'Emotional Awareness', icon: Brain },
  { id: 'resilience', label: 'Building Resilience', icon: Sparkles }
];

const AUDIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'New to wellness concepts' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Some familiarity with practices' },
  { id: 'advanced', label: 'Advanced', desc: 'Experienced practitioners' }
];

const TEMPLATES = {
  'short-post': {
    anxiety: {
      beginner: {
        hook: "Feeling anxious? You're not alone, and there's something simple you can try right now.",
        body: "Anxiety can feel overwhelming, but your body has a built-in calming system. Try this: breathe in slowly for 4 counts, then out for 6 counts. Do this 3 times.\n\nThis activates your rest-and-digest response. No special skills needed—just your breath.",
        cta: "Save this for when you need it. What helps you feel calmer?",
        disclaimer: "This is supportive information, not medical advice. If anxiety is significantly impacting your life, please reach out to a mental health professional.",
        hashtags: "#mentalhealth #anxiety #breathwork #selfcare #wellness",
        altText: "Calming image with soft colors, perhaps showing a person breathing peacefully or a serene nature scene"
      },
      intermediate: {
        hook: "The science behind why your anxiety spikes—and what to do about it.",
        body: "When we're anxious, our nervous system shifts into fight-or-flight mode. The key to calming it isn't just thinking differently—it's using your body to send safety signals to your brain.\n\nTechniques like extended exhales, grounding exercises, and progressive muscle relaxation work because they activate the vagus nerve, which tells your brain: 'We're safe.'\n\nConsistency matters more than perfection. 5 minutes daily builds your nervous system's resilience over time.",
        cta: "Which calming technique has made the biggest difference for you? Share below.",
        disclaimer: "These practices complement, but don't replace, professional mental health support when needed.",
        hashtags: "#nervousystem #anxietyrelief #vagusnerve #mentalwellness #mindfulness",
        altText: "Infographic showing the nervous system response with calming techniques highlighted, using soft earth tones"
      },
      advanced: {
        hook: "Polyvagal theory explains why 'just relax' doesn't work for chronic anxiety.",
        body: "Chronic anxiety often involves a dysregulated nervous system stuck in sympathetic activation or dorsal vagal shutdown. Stephen Porges' polyvagal theory offers a roadmap.\n\nThe goal isn't suppressing anxiety but building ventral vagal capacity—the state where we feel safe, connected, and able to engage. This happens through:\n\n• Co-regulation (safe connections with others)\n• Interoceptive practices (noticing body sensations without judgment)\n• Rhythmic, predictable activities (walking, breathing, singing)\n\nHealing isn't linear, but neuroplasticity means change is possible.",
        cta: "What has helped you build nervous system resilience? I'd love to hear your experience.",
        disclaimer: "This information is educational. For trauma-related anxiety, working with a trauma-informed therapist is recommended.",
        hashtags: "#polyvagaltheory #traumainformed #nervousystemhealing #mentalhealth #healing",
        altText: "Diagram of the polyvagal ladder showing ventral, sympathetic, and dorsal states with examples of each"
      }
    },
    grounding: {
      beginner: {
        hook: "Feeling scattered or overwhelmed? Here's a 30-second reset.",
        body: "Grounding brings you back to the present moment. Try the 5-4-3-2-1 technique:\n\n5 things you can see\n4 things you can touch\n3 things you can hear\n2 things you can smell\n1 thing you can taste\n\nThis simple exercise interrupts anxious thoughts by focusing your attention on what's real and around you right now.",
        cta: "Save this for when you need a quick reset. What helps you feel grounded?",
        disclaimer: "This is a supportive tool. If you're experiencing ongoing distress, please reach out to a mental health professional.",
        hashtags: "#grounding #mindfulness #anxiety #mentalhealth #selfcare",
        altText: "Peaceful nature scene or hands touching grass, earth, or water—representing connection to the present moment"
      },
      intermediate: {
        hook: "Why grounding techniques work when your mind won't stop racing.",
        body: "When we're anxious or dissociating, we're often stuck in our heads—replaying the past or worrying about the future. Grounding works by activating sensory input, which pulls attention into the present.\n\nDifferent grounding works for different people:\n\n• Physical: cold water on face, barefoot on grass\n• Mental: naming objects, counting backwards\n• Soothing: holding something comforting, listening to calm sounds\n\nExperiment to find what resonates with your nervous system.",
        cta: "What's your go-to grounding technique? Let's share what works.",
        disclaimer: "These practices support, but don't replace, professional care if you're struggling significantly.",
        hashtags: "#grounding #mindfulness #anxietyrelief #nervousystem #wellness",
        altText: "Split image showing different grounding techniques: hands in water, feet on earth, person holding a warm mug"
      },
      advanced: {
        hook: "Grounding as a window of tolerance practice: the somatic perspective.",
        body: "From a somatic and trauma-informed lens, grounding isn't just calming—it's building capacity to stay present with activation.\n\nDan Siegel's 'window of tolerance' describes the zone where we can experience emotions without becoming overwhelmed (hyperaroused) or shut down (hypoaroused).\n\nGrounding expands this window by:\n• Building interoceptive awareness\n• Creating felt sense of safety in the body\n• Developing dual awareness (noticing body sensations while staying connected to the room)\n\nOver time, we can tolerate more without leaving our window.",
        cta: "How has grounding practice evolved for you over time?",
        disclaimer: "For trauma-related dissociation, please work with a trauma-informed therapist who can guide these practices safely.",
        hashtags: "#windowoftolerance #somatichealing #traumainformed #grounding #nervousystem",
        altText: "Diagram showing the window of tolerance with hyperarousal and hypoarousal zones, and arrows indicating grounding bringing someone back to center"
      }
    },
    journaling: {
      beginner: {
        hook: "Not sure what to write? Start here.",
        body: "Journaling doesn't have to be complicated. You don't need to write pages or have perfect grammar. Just honest words.\n\nTry this simple prompt:\n\n\"Right now, I'm feeling _______ because _______.\"\n\nThat's it. One sentence can be enough. The goal isn't to write a lot—it's to notice what's happening inside you.",
        cta: "Try this prompt today. Even one sentence counts.",
        disclaimer: "Journaling is a supportive practice. If you're processing difficult experiences, a therapist can offer additional support.",
        hashtags: "#journaling #selfawareness #mentalhealth #selfcare #wellness",
        altText: "Simple, calm image of an open journal with a pen, soft lighting, inviting and non-intimidating"
      },
      intermediate: {
        hook: "The journaling prompts that actually help you process emotions.",
        body: "Random prompts can feel scattered. Targeted prompts help you work through what's actually going on.\n\nFor processing emotions:\n• \"What am I avoiding feeling right now?\"\n• \"What would I say to a friend feeling this way?\"\n\nFor clarity:\n• \"What's draining my energy? What's giving me energy?\"\n• \"What do I need right now that I'm not getting?\"\n\nFor growth:\n• \"What pattern am I noticing in my life?\"\n• \"What would change if I truly believed I was enough?\"",
        cta: "Which prompt calls to you today? Try it and see what comes up.",
        disclaimer: "Journaling can bring up strong emotions. Go at your own pace, and seek support if needed.",
        hashtags: "#journaling #emotionalprocessing #selfawareness #mentalwellness #healing",
        altText: "Journal pages with handwritten text (blurred for privacy), warm lighting suggesting reflection and introspection"
      },
      advanced: {
        hook: "Journaling as a tool for parts work and internal dialogue.",
        body: "From an Internal Family Systems perspective, journaling can become a way to dialogue with different parts of yourself.\n\nInstead of writing 'I feel anxious,' try:\n\n'There's a part of me that feels anxious. What does this part need me to know?'\n\nThis externalizes the emotion, reducing fusion and creating space for curiosity. You might discover that the anxious part is protecting you, or carrying a burden from the past.\n\nOther approaches:\n• Letter writing to younger self\n• Dialogue between conflicting parts\n• Gratitude to protective parts",
        cta: "Have you experimented with parts-informed journaling? I'd love to hear your experience.",
        disclaimer: "Parts work can surface intense material. Consider working with an IFS-informed therapist for deeper processing.",
        hashtags: "#IFS #internalfamilysystems #partswork #journaling #traumahealing",
        altText: "Abstract illustration of inner dialogue, perhaps silhouettes or thought bubbles representing different aspects of self"
      }
    },
    'self-compassion': {
      beginner: {
        hook: "What if you talked to yourself like you'd talk to a good friend?",
        body: "We're often much harder on ourselves than we'd ever be on someone we care about.\n\nSelf-compassion isn't about letting yourself off the hook. It's about recognizing that everyone struggles, and you deserve kindness too.\n\nTry this: Next time you make a mistake, pause and ask, 'What would I say to a friend right now?' Then say that to yourself.",
        cta: "You deserve the same kindness you give others. Start small today.",
        disclaimer: "Self-compassion is a practice, not a quick fix. If self-criticism is overwhelming, a therapist can help.",
        hashtags: "#selfcompassion #selflove #mentalhealth #kindness #wellness",
        altText: "Warm image of someone placing hand on heart, or a gentle self-embrace, conveying self-kindness"
      },
      intermediate: {
        hook: "Kristin Neff's 3 components of self-compassion—and how to practice them.",
        body: "Dr. Kristin Neff's research identifies three elements of self-compassion:\n\n1. Self-kindness (vs. self-judgment): Treating yourself gently when you struggle\n\n2. Common humanity (vs. isolation): Recognizing that suffering is part of being human—you're not alone\n\n3. Mindfulness (vs. over-identification): Noticing difficult feelings without drowning in them\n\nWhen you're struggling, try asking:\n• 'Can I be kind to myself right now?'\n• 'Am I alone in this, or is this a human experience?'\n• 'Can I hold this feeling without being consumed by it?'",
        cta: "Which component feels most challenging for you? That might be where growth is waiting.",
        disclaimer: "Self-compassion practices complement professional support, especially for deep-seated self-criticism.",
        hashtags: "#selfcompassion #kristinneff #mindfulness #mentalwellness #healing",
        altText: "Three-part infographic showing self-kindness, common humanity, and mindfulness with gentle icons for each"
      },
      advanced: {
        hook: "The neuroscience of self-compassion: rewiring your inner critic.",
        body: "Harsh self-criticism activates the amygdala and releases cortisol—the same stress response as external threats. Your brain literally attacks itself.\n\nSelf-compassion activates the care system: oxytocin release, reduced cortisol, and activation of the prefrontal cortex for clearer thinking.\n\nFor those with strong inner critics (often rooted in childhood experiences), this rewiring takes time. The critic developed as protection.\n\nApproaches that help:\n• Compassionate touch (hand on heart)\n• Self-compassion breaks (Kristin Neff's 3-step practice)\n• Letter writing from a compassionate observer\n• Therapy modalities like CFT (Compassion-Focused Therapy)",
        cta: "What has helped you soften your inner critic?",
        disclaimer: "For severe self-criticism or trauma-related patterns, Compassion-Focused Therapy with a trained therapist is recommended.",
        hashtags: "#selfcompassion #neuroscience #innercritic #traumahealing #CFT",
        altText: "Brain diagram showing the difference between self-criticism response (amygdala activation) and self-compassion response (prefrontal and care systems)"
      }
    },
    routines: {
      beginner: {
        hook: "A simple morning routine that takes just 5 minutes.",
        body: "You don't need an elaborate routine. Start with something you can actually do.\n\n5-minute morning reset:\n1. Take 3 deep breaths before getting out of bed\n2. Drink a glass of water\n3. Spend 1 minute stretching\n4. Set one small intention for the day\n\nThat's it. Small actions, done consistently, create real change.",
        cta: "What's one small thing you could add to your morning? Keep it simple.",
        disclaimer: "Routines support wellness but aren't a replacement for addressing underlying concerns with a professional if needed.",
        hashtags: "#morningroutine #wellness #selfcare #simpleliving #mentalhealth",
        altText: "Calm morning scene: sunlight, glass of water, perhaps someone stretching—nothing elaborate, inviting simplicity"
      },
      intermediate: {
        hook: "Why your routines aren't sticking—and what to do about it.",
        body: "Most routines fail because they're too ambitious or disconnected from your actual life.\n\nWhat works:\n\n• Habit stacking: Link new habits to existing ones ('After I brush my teeth, I'll take 3 breaths')\n• Start ridiculously small: 1 minute of meditation beats 0 minutes of a planned 20\n• Design for your worst days: If you can do it when exhausted, it'll stick\n• Track without judgment: Notice patterns, don't punish yourself\n\nThe goal isn't perfection. It's sustainability.",
        cta: "What habit have you successfully built? What made it stick?",
        disclaimer: "Routines are tools, not rules. Flexibility is healthy. Seek support if rigid routines are causing distress.",
        hashtags: "#habitbuilding #routines #wellness #consistency #mentalhealth",
        altText: "Calendar or tracker showing gentle progress (some days filled, some not), conveying progress without perfectionism"
      },
      advanced: {
        hook: "Designing routines for nervous system regulation, not productivity.",
        body: "Most routine advice optimizes for productivity. But for those managing anxiety, trauma, or chronic stress, the goal is nervous system regulation.\n\nPrinciples for regulation-focused routines:\n\n• Bookend your day: Morning and evening anchors create predictability (safety signal for your nervous system)\n• Include somatic elements: Movement, breath, touch—not just mental activities\n• Build in transitions: 5-minute buffers between activities reduce activation\n• Allow for titration: Some days you need more rest. Build in flexibility.\n• Notice your window: When are you most regulated? Schedule challenging tasks there.\n\nThe goal is a sustainable rhythm that supports your baseline, not an optimization system that depletes you.",
        cta: "How do you design routines for regulation rather than just productivity?",
        disclaimer: "For those with trauma histories, routine changes can sometimes be activating. Go slowly and consider support.",
        hashtags: "#nervousystemregulation #routines #traumainformed #somatichealing #wellness",
        altText: "Timeline showing a day with regulated transitions, somatic practices marked, and rest periods included"
      }
    },
    'emotional-awareness': {
      beginner: {
        hook: "Not sure what you're feeling? That's more common than you think.",
        body: "Many of us weren't taught to name our emotions. We might know 'good' or 'bad,' but the nuances? That takes practice.\n\nStart here: Throughout the day, pause and ask, 'What am I feeling right now?'\n\nIf you're not sure, try this list:\n• Tired, restless, calm, anxious\n• Sad, frustrated, hopeful, overwhelmed\n• Grateful, annoyed, curious, numb\n\nThere's no wrong answer. Just noticing is the practice.",
        cta: "What are you feeling right now? Try naming it, even if it's 'I'm not sure.'",
        disclaimer: "Building emotional awareness takes time. If strong emotions feel overwhelming, please reach out for support.",
        hashtags: "#emotionalawareness #feelings #mentalhealth #selfawareness #wellness",
        altText: "Simple emotion wheel or list of feelings words with gentle, approachable design"
      },
      intermediate: {
        hook: "Emotions are data—here's how to read them.",
        body: "Every emotion carries information. Instead of pushing feelings away, we can get curious.\n\nQuestions to decode your emotions:\n\n• What triggered this feeling? (Situation, thought, memory)\n• What need might be underneath? (Safety, connection, rest, recognition)\n• What is this emotion trying to protect me from or move me toward?\n\nCommon pairings:\n• Anger often protects hurt or vulnerability\n• Anxiety often signals a perceived threat (real or imagined)\n• Numbness often protects from overwhelm\n\nThe goal isn't to 'fix' feelings, but to understand them.",
        cta: "Next time a strong emotion arises, try asking: 'What is this trying to tell me?'",
        disclaimer: "Processing emotions can be intense. A therapist can help navigate particularly complex or overwhelming feelings.",
        hashtags: "#emotionalintelligence #feelings #selfawareness #mentalwellness #healing",
        altText: "Infographic showing emotions as messengers with sample questions for understanding each one"
      },
      advanced: {
        hook: "Interoception: the body-based foundation of emotional awareness.",
        body: "Emotional awareness isn't just cognitive—it's rooted in interoception, our ability to sense internal body states.\n\nResearch shows that interoceptive accuracy correlates with emotional regulation and resilience. Many people, especially those with trauma or alexithymia, have reduced interoceptive awareness.\n\nBuilding interoceptive capacity:\n\n• Body scans: Systematically noticing sensations without changing them\n• Pendulation: Moving attention between areas of tension and ease\n• Sensation vocabulary: Describing felt sense (tight, buzzy, heavy, warm)\n• Gentle movement: Yoga, walking, or any movement done with attention\n\nThis is foundational to somatic therapies and polyvagal-informed approaches.",
        cta: "What practices have helped you develop interoceptive awareness?",
        disclaimer: "For those with trauma or dissociative experiences, interoceptive work is best done with professional guidance.",
        hashtags: "#interoception #somaticawareness #emotionalintelligence #polyvagal #healing",
        altText: "Abstract body outline with sensation words mapped to different areas, showing the mind-body connection"
      }
    },
    resilience: {
      beginner: {
        hook: "Resilience isn't about being tough. It's about being flexible.",
        body: "We often think resilience means powering through. But real resilience is about bouncing back—and sometimes, just bending without breaking.\n\nThree small ways to build resilience:\n\n1. Acknowledge hard things without minimizing them\n2. Ask for help when you need it\n3. Celebrate small wins, even on hard days\n\nResilience grows one choice at a time.",
        cta: "What's one small act of resilience you've shown recently? Give yourself credit.",
        disclaimer: "Building resilience takes time. If you're struggling, seeking support is itself an act of resilience.",
        hashtags: "#resilience #mentalhealth #selfcare #growth #wellness",
        altText: "Flexible tree bending in wind but not breaking, or a person getting back up—conveying adaptability, not rigidity"
      },
      intermediate: {
        hook: "The 4 pillars of psychological resilience.",
        body: "Research identifies key factors that support resilience:\n\n1. Connection: Supportive relationships buffer stress. We're wired for co-regulation.\n\n2. Meaning: Finding purpose, even in difficulty, helps us persevere.\n\n3. Cognitive flexibility: The ability to reframe challenges without denial.\n\n4. Self-care: Meeting basic needs (sleep, nutrition, movement) supports nervous system capacity.\n\nResilience isn't fixed—it's built through intentional practice and, importantly, through healing what depletes it.",
        cta: "Which pillar feels strongest for you right now? Which could use attention?",
        disclaimer: "Resilience-building is not about ignoring struggles. Professional support can strengthen your foundation.",
        hashtags: "#resilience #psychology #mentalwellness #growth #healing",
        altText: "Four-pillar graphic showing connection, meaning, flexibility, and self-care as foundations of resilience"
      },
      advanced: {
        hook: "Post-traumatic growth: resilience beyond bouncing back.",
        body: "While trauma causes real harm, research on post-traumatic growth (PTG) shows that some people experience positive changes after adversity—not despite trauma, but through processing it.\n\nDomains of PTG (Tedeschi & Calhoun):\n• New possibilities\n• Relating to others\n• Personal strength\n• Appreciation of life\n• Spiritual/existential change\n\nImportant: PTG doesn't minimize suffering. It's not 'everything happens for a reason.' It's that meaning can be constructed through integration.\n\nThis requires adequate support, time, and often therapy—not toxic positivity or premature 'silver lining' narratives.",
        cta: "Have you experienced growth alongside healing? What made it possible?",
        disclaimer: "Post-traumatic growth is not an expectation or requirement. Trauma recovery is valid regardless of 'growth.' Work with trauma-informed professionals.",
        hashtags: "#posttraumaticgrowth #resilience #traumahealing #PTG #recovery",
        altText: "Abstract image of something broken being reassembled into a new form—conveying transformation, not just repair"
      }
    }
  },
  carousel: {
    anxiety: {
      beginner: {
        slides: [
          { title: "Feeling Anxious?", body: "You're not alone. Anxiety is one of the most common experiences—and there are simple things that can help." },
          { title: "What Is Anxiety?", body: "Anxiety is your body's alarm system. It's not dangerous, even when it feels overwhelming. Your nervous system is trying to protect you." },
          { title: "Try This: Slow Exhale", body: "Breathe in for 4 counts. Breathe out for 6 counts. Repeat 3 times. Long exhales tell your body you're safe." },
          { title: "Try This: Grounding", body: "Name 5 things you can see. 4 you can touch. 3 you can hear. This brings you back to the present moment." },
          { title: "You've Got This", body: "Anxiety is uncomfortable, but it passes. You've survived every anxious moment so far. One breath at a time." }
        ],
        cta: "Save this for when you need it. You've got this.",
        disclaimer: "This is supportive information, not medical advice. If anxiety is significantly impacting your life, please reach out to a mental health professional.",
        altText: "Carousel slides with calming colors, simple illustrations, and large readable text"
      },
      intermediate: {
        slides: [
          { title: "Understanding Your Anxiety", body: "Anxiety isn't just in your head—it's a full-body nervous system response. Let's break down what's happening and what helps." },
          { title: "The Nervous System Response", body: "When threatened (real or perceived), your sympathetic nervous system activates: faster heart rate, shallow breathing, muscle tension. This is fight-or-flight." },
          { title: "Why Logic Doesn't Always Work", body: "Telling yourself 'just calm down' rarely works because the alarm is coming from your brainstem, not your thinking brain. Body-based approaches work better." },
          { title: "What Actually Helps", body: "Slow breathing, grounding, cold water on face, movement—these activate your parasympathetic system and send safety signals to your brain." },
          { title: "Building Resilience Over Time", body: "With consistent practice, you're training your nervous system to return to calm more easily. Small daily practices compound into real change." }
        ],
        cta: "Which technique will you try first? Start small and build from there.",
        disclaimer: "These practices complement professional support. If anxiety is persistent, please reach out to a mental health provider.",
        altText: "Educational carousel with nervous system diagram, technique illustrations, and progress visualization"
      },
      advanced: {
        slides: [
          { title: "Anxiety Through a Polyvagal Lens", body: "Stephen Porges' polyvagal theory offers a roadmap for understanding anxiety as a nervous system state, not a character flaw." },
          { title: "The Three States", body: "Ventral vagal (safe, connected), sympathetic (fight/flight), dorsal vagal (shutdown). Anxiety involves sympathetic activation—your system perceives threat." },
          { title: "Neuroception", body: "Your nervous system scans for danger below conscious awareness. Past experiences shape what feels 'safe.' Trauma can skew neuroception toward threat." },
          { title: "The Path Forward", body: "Healing involves building ventral vagal capacity through co-regulation, titrated exposure, and somatic practices that signal safety." },
          { title: "Resources for Deeper Work", body: "Books: 'The Polyvagal Theory' (Porges), 'Anchored' (Deb Dana). Consider somatic or polyvagal-informed therapy for personalized support." }
        ],
        cta: "For those interested in deeper work, what modality has been most helpful for you?",
        disclaimer: "This information is educational. For trauma-related anxiety, working with a trauma-informed, polyvagal-aware therapist is strongly recommended.",
        altText: "Advanced carousel with polyvagal ladder diagram, neuroception explanation, and resource list"
      }
    }
  },
  thread: {
    anxiety: {
      beginner: {
        posts: [
          "Feeling anxious? You're not alone. Here are some simple things that might help—no expertise required. (Thread)",
          "1/ First, know this: Anxiety is uncomfortable, but it's not dangerous. Your body's alarm system is trying to protect you. It's just a bit overactive sometimes.",
          "2/ When anxiety hits, try this: Breathe in for 4 counts, out for 6. The long exhale tells your nervous system you're safe. Do it 3 times.",
          "3/ Another option: The 5-4-3-2-1 grounding technique. Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. It brings you back to now.",
          "4/ Remember: You've survived 100% of your anxious moments so far. This one will pass too. One breath at a time."
        ],
        cta: "Bookmark this thread for when you need it. And be gentle with yourself today.",
        disclaimer: "This is supportive info, not medical advice. If anxiety is impacting your daily life, please reach out to a professional.",
        altText: "Thread with numbered posts, each containing one simple concept or technique"
      },
      intermediate: {
        posts: [
          "Why does anxiety feel so physical? A thread on what's actually happening in your nervous system—and what to do about it.",
          "1/ Anxiety isn't just thoughts. It's a full-body experience. Racing heart, tight chest, shallow breathing—that's your sympathetic nervous system activating.",
          "2/ This is your fight-or-flight response. Evolutionarily, it kept us alive. But in modern life, it can activate when there's no real threat.",
          "3/ Here's why 'just calm down' doesn't work: The alarm is coming from your brainstem, not your thinking brain. Logic can't override it directly.",
          "4/ What works: Body-based approaches. Slow breathing, grounding, cold water on face, movement. These send safety signals to your brain.",
          "5/ Consistency matters. With practice, you're training your nervous system to return to calm more easily. 5 minutes daily beats 1 hour occasionally."
        ],
        cta: "What body-based technique has worked for you? Reply below—we learn from each other.",
        disclaimer: "These practices complement professional support. If anxiety is persistent, please reach out to a mental health provider.",
        altText: "Educational thread with nervous system concepts, body-based techniques, and practice recommendations"
      },
      advanced: {
        posts: [
          "Polyvagal theory changed how I understand my anxiety. Here's a thread on what it taught me. (Heads up: this gets nerdy)",
          "1/ Stephen Porges' polyvagal theory describes three nervous system states: ventral vagal (safe/social), sympathetic (fight/flight), dorsal vagal (shutdown).",
          "2/ Anxiety = sympathetic activation. Your system perceives threat and mobilizes energy to respond. The problem: sometimes there's no actual threat.",
          "3/ This perception happens below conscious awareness—Porges calls it 'neuroception.' Past experiences (especially trauma) shape what feels 'safe.'",
          "4/ Healing isn't about controlling anxiety. It's about building ventral vagal capacity—your ability to feel safe and connected.",
          "5/ How? Co-regulation (safe relationships), somatic practices, and gradually expanding your window of tolerance. This takes time and often support.",
          "6/ Resources: 'Anchored' by Deb Dana, 'The Polyvagal Theory in Therapy' by Deb Dana. For trauma: consider somatic experiencing or polyvagal-informed therapy."
        ],
        cta: "For those exploring this work: what's been your experience with polyvagal-informed approaches?",
        disclaimer: "Educational thread. For trauma-related anxiety, please work with a trauma-informed professional.",
        altText: "Advanced thread with polyvagal concepts, healing framework, and resource recommendations"
      }
    }
  },
  newsletter: {
    anxiety: {
      beginner: {
        subject: "One simple thing for anxious moments",
        preview: "Your breath is always with you—here's how to use it.",
        body: "Hi friend,\n\nIf you've ever felt anxious and didn't know what to do, here's something simple that might help.\n\nWhen anxiety shows up, your breathing often becomes shallow and fast. This signals your brain that something is wrong—even if it isn't.\n\nThe fix? Slow, intentional exhales.\n\nTry this: Breathe in for 4 counts. Breathe out for 6 counts. Repeat 3 times.\n\nThat's it. Long exhales activate your body's calming system. You can do this anywhere—no one even needs to know.\n\nAnxiety is uncomfortable, but it's not dangerous. And you have more tools than you think.\n\nWith warmth,\n[Your name]",
        cta: "P.S. What helps you when anxiety shows up? I'd love to hear—just reply to this email.",
        disclaimer: "This is supportive information, not medical advice. If anxiety is significantly impacting your life, please reach out to a mental health professional. You deserve support.",
        altText: "Newsletter with warm, conversational tone, simple technique, and invitation to connect"
      },
      intermediate: {
        subject: "The science behind why you can't 'just calm down'",
        preview: "Understanding your nervous system changes everything.",
        body: "Hi friend,\n\nHave you ever told yourself to 'just calm down' and found it didn't work? There's a reason for that.\n\nWhen anxiety activates, the alarm is coming from your brainstem—the part of your brain that handles survival. Your thinking brain (prefrontal cortex) can't just override it with logic.\n\nThis is why body-based approaches work better:\n\n• Slow breathing (especially long exhales)\n• Grounding techniques (5-4-3-2-1)\n• Cold water on your face (activates the dive reflex)\n• Movement (discharges the mobilized energy)\n\nThese send direct signals to your nervous system: 'We're safe.'\n\nThe more you practice when you're calm, the more accessible these tools become when you're not.\n\nConsistency over intensity. Five minutes daily beats one hour occasionally.\n\nWith care,\n[Your name]",
        cta: "P.S. What body-based technique has worked for you? I'd genuinely love to hear.",
        disclaimer: "These practices complement, but don't replace, professional mental health support when needed. If anxiety is persistent, please reach out.",
        altText: "Newsletter with educational content on nervous system, practical techniques, and encouragement for consistent practice"
      },
      advanced: {
        subject: "Polyvagal theory and the path through anxiety",
        preview: "A nervous system roadmap for those who want to go deeper.",
        body: "Hi friend,\n\nIf you've been exploring anxiety and nervous system work, you've probably encountered polyvagal theory. Here's why it matters.\n\nStephen Porges' framework describes three states:\n\n1. Ventral vagal: Safe, connected, able to engage socially\n2. Sympathetic: Fight or flight—mobilized for action\n3. Dorsal vagal: Shutdown, collapse, disconnection\n\nAnxiety lives in the sympathetic state. But here's the key insight: your nervous system isn't making a mistake. It's responding to perceived threat based on your history.\n\nThis perception—'neuroception'—happens below conscious awareness. Past experiences, especially early ones, shape what feels safe.\n\nHealing isn't about eliminating anxiety. It's about building ventral vagal capacity—your ability to feel safe even when life is uncertain.\n\nThis happens through:\n• Co-regulation (safe connections with others)\n• Somatic practices that signal safety\n• Gradually expanding your window of tolerance\n\nIt takes time. It often requires support. And it's possible.\n\nWith care,\n[Your name]",
        cta: "P.S. If you're interested in deeper work, I recommend 'Anchored' by Deb Dana as an accessible entry point.",
        disclaimer: "This is educational content. For trauma-related anxiety, please work with a trauma-informed therapist. Polyvagal-informed modalities include Somatic Experiencing, EMDR, and IFS.",
        altText: "Newsletter with polyvagal framework explanation, healing pathway, and resource recommendations"
      }
    }
  }
};

function getDefaultTemplate(contentType, topic, level) {
  return TEMPLATES[contentType]?.[topic]?.[level] || TEMPLATES['short-post']?.['self-compassion']?.[level] || {
    hook: "Your hook goes here—the attention-grabbing first line.",
    body: "Your main content goes here. Remember to keep it warm, grounded, and evidence-informed. Avoid making medical claims. Focus on supportive, practical guidance.",
    cta: "Your call to action—invite engagement without pressure.",
    disclaimer: "This is supportive information, not medical advice. If you're struggling, please reach out to a mental health professional.",
    hashtags: "#mentalhealth #wellness #selfcare #healing",
    altText: "Describe the image you'd pair with this content for accessibility"
  };
}

function formatCarouselOutput(template) {
  if (!template.slides) return template;
  
  let output = template.slides.map((slide, i) => 
    `SLIDE ${i + 1}:\nTitle: ${slide.title}\nBody: ${slide.body}`
  ).join('\n\n');
  
  output += `\n\n---\nCTA: ${template.cta}\nDISCLAIMER: ${template.disclaimer}\nALT-TEXT GUIDANCE: ${template.altText}`;
  
  return output;
}

function formatThreadOutput(template) {
  if (!template.posts) return template;
  
  let output = template.posts.join('\n\n');
  output += `\n\n---\nCTA: ${template.cta}\nDISCLAIMER: ${template.disclaimer}\nALT-TEXT GUIDANCE: ${template.altText}`;
  
  return output;
}

function formatNewsletterOutput(template) {
  if (!template.subject) return template;
  
  return `SUBJECT: ${template.subject}\nPREVIEW: ${template.preview}\n\n---\n\n${template.body}\n\n${template.cta}\n\n---\nDISCLAIMER: ${template.disclaimer}\nALT-TEXT GUIDANCE: ${template.altText}`;
}

export default function ContentStudio() {
  const [contentType, setContentType] = useState('short-post');
  const [topic, setTopic] = useState('anxiety');
  const [level, setLevel] = useState('beginner');
  const [copiedField, setCopiedField] = useState(null);

  const template = getDefaultTemplate(contentType, topic, level);

  const copyToClipboard = useCallback(async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, []);

  const copyAll = useCallback(() => {
    let fullText = '';
    
    if (contentType === 'carousel' && template.slides) {
      fullText = formatCarouselOutput(template);
    } else if (contentType === 'thread' && template.posts) {
      fullText = formatThreadOutput(template);
    } else if (contentType === 'newsletter' && template.subject) {
      fullText = formatNewsletterOutput(template);
    } else {
      fullText = `HOOK:\n${template.hook}\n\nBODY:\n${template.body}\n\nCTA:\n${template.cta}\n\nDISCLAIMER:\n${template.disclaimer}\n\nHASHTAGS:\n${template.hashtags || ''}\n\nALT-TEXT GUIDANCE:\n${template.altText || ''}`;
    }
    
    copyToClipboard(fullText, 'all');
  }, [contentType, template, copyToClipboard]);

  const renderPreview = () => {
    if (contentType === 'carousel' && template.slides) {
      return (
        <div className={styles.carouselPreview}>
          <div className={styles.slidesContainer}>
            {template.slides.map((slide, i) => (
              <div key={i} className={styles.slide}>
                <span className={styles.slideNumber}>Slide {i + 1}</span>
                <h4 className={styles.slideTitle}>{slide.title}</h4>
                <p className={styles.slideBody}>{slide.body}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (contentType === 'thread' && template.posts) {
      return (
        <div className={styles.threadPreview}>
          {template.posts.map((post, i) => (
            <div key={i} className={styles.threadPost}>
              <span className={styles.threadNumber}>{i + 1}</span>
              <p className={styles.threadText}>{post}</p>
            </div>
          ))}
        </div>
      );
    }

    if (contentType === 'newsletter' && template.subject) {
      return (
        <div className={styles.newsletterPreview}>
          <div className={styles.emailHeader}>
            <p className={styles.emailSubject}><strong>Subject:</strong> {template.subject}</p>
            <p className={styles.emailPreviewText}><strong>Preview:</strong> {template.preview}</p>
          </div>
          <div className={styles.emailBody}>
            {template.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      );
    }

    return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Content Studio — The Genuine Love Project" description="Create and transform wellness content." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Content Studio</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );
  };

  return (
    <div className={styles.studio}>
      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label className={styles.label} id="content-type-label">
            Content Type
          </label>
          <p className={styles.hint} id="content-type-hint">
            Choose the format for your content
          </p>
          <div 
            className={styles.buttonGroup} 
            role="radiogroup" 
            aria-labelledby="content-type-label"
            aria-describedby="content-type-hint"
          >
            {CONTENT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  className={`${styles.typeButton} ${contentType === type.id ? styles.active : ''}`}
                  onClick={() => setContentType(type.id)}
                  role="radio"
                  aria-checked={contentType === type.id}
                  data-testid={`btn-type-${type.id}`}
                >
                  <Icon className={styles.typeIcon} aria-hidden="true" />
                  <span className={styles.typeLabel}>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} id="topic-label">
            Topic
          </label>
          <p className={styles.hint} id="topic-hint">
            Select a wellness theme
          </p>
          <div 
            className={styles.topicGrid}
            role="radiogroup"
            aria-labelledby="topic-label"
            aria-describedby="topic-hint"
          >
            {TOPICS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.topicButton} ${topic === t.id ? styles.active : ''}`}
                  onClick={() => setTopic(t.id)}
                  role="radio"
                  aria-checked={topic === t.id}
                  data-testid={`btn-topic-${t.id}`}
                >
                  <Icon className={styles.topicIcon} aria-hidden="true" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} id="level-label">
            Audience Level
          </label>
          <p className={styles.hint} id="level-hint">
            Match content complexity to your audience
          </p>
          <div 
            className={styles.levelGroup}
            role="radiogroup"
            aria-labelledby="level-label"
            aria-describedby="level-hint"
          >
            {AUDIENCE_LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`${styles.levelButton} ${level === l.id ? styles.active : ''}`}
                onClick={() => setLevel(l.id)}
                role="radio"
                aria-checked={level === l.id}
                data-testid={`btn-level-${l.id}`}
              >
                <span className={styles.levelLabel}>{l.label}</span>
                <span className={styles.levelDesc}>{l.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.previewSection}>
        <div className={styles.previewHeader}>
          <h3 className={styles.previewTitle}>Generated Content</h3>
          <button
            type="button"
            className={styles.copyAllButton}
            onClick={copyAll}
            data-testid="btn-copy-all"
          >
            {copiedField === 'all' ? (
              <>
                <Check aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy aria-hidden="true" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>

        {(contentType === 'carousel' || contentType === 'thread' || contentType === 'newsletter') && (
          renderPreview()
        )}

        {contentType === 'short-post' && (
          <>
            <OutputField
              label="Hook"
              value={template.hook}
              onCopy={() => copyToClipboard(template.hook, 'hook')}
              copied={copiedField === 'hook'}
            />
            <OutputField
              label="Body"
              value={template.body}
              onCopy={() => copyToClipboard(template.body, 'body')}
              copied={copiedField === 'body'}
              multiline
            />
            <OutputField
              label="Call to Action"
              value={template.cta}
              onCopy={() => copyToClipboard(template.cta, 'cta')}
              copied={copiedField === 'cta'}
            />
          </>
        )}

        <div className={styles.metaSection}>
          <div className={styles.safetyNotice}>
            <AlertCircle className={styles.safetyIcon} aria-hidden="true" />
            <div>
              <h4 className={styles.safetyTitle}>Safety Disclaimer (include in post)</h4>
              <p className={styles.safetyText}>{template.disclaimer}</p>
              <button
                type="button"
                className={styles.copyButton}
                onClick={() => copyToClipboard(template.disclaimer, 'disclaimer')}
                aria-label="Copy disclaimer"
                data-testid="btn-copy-disclaimer"
              >
                {copiedField === 'disclaimer' ? <Check /> : <Copy />}
              </button>
            </div>
          </div>

          {template.hashtags && (
            <OutputField
              label="Hashtags (optional)"
              value={template.hashtags}
              onCopy={() => copyToClipboard(template.hashtags, 'hashtags')}
              copied={copiedField === 'hashtags'}
            />
          )}

          {template.altText && (
            <OutputField
              label="Alt-Text Guidance"
              value={template.altText}
              onCopy={() => copyToClipboard(template.altText, 'altText')}
              copied={copiedField === 'altText'}
            />
          )}
        </div>

        <div className={styles.crisisBanner}>
          <strong>Crisis Resources:</strong> If you or someone you know is in crisis, please contact the 988 Suicide & Crisis Lifeline (call or text 988) or visit <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">findahelpline.com</a>
        </div>
      </div>
    </div>
  );
}

function OutputField({ label, value, onCopy, copied, multiline = false }) {
  return (
    <div className={styles.outputField}>
      <div className={styles.outputHeader}>
        <label className={styles.outputLabel}>{label}</label>
        <button
          type="button"
          className={styles.copyButton}
          onClick={onCopy}
          aria-label={`Copy ${label.toLowerCase()}`}
          data-testid={`btn-copy-${label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {copied ? <Check /> : <Copy />}
        </button>
      </div>
      {multiline ? (
        <div className={styles.outputTextarea}>{value}</div>
      ) : (
        <p className={styles.outputText}>{value}</p>
      )}
    </div>
  );
}
