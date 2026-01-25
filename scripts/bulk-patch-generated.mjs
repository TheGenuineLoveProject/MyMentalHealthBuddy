#!/usr/bin/env node
/**
 * Bulk Patch Script for Generated Pages
 * Converts ConfigRoute pages to proper WellnessPageShell pages
 * 
 * Usage: node scripts/bulk-patch-generated.mjs
 */

import fs from 'fs';
import path from 'path';

const GENERATED_DIR = 'client/src/pages/generated';

// Page metadata with original content for each route
const PAGE_METADATA = {
  // Wellness Tool Pages
  breathing: {
    title: "Breathing Exercises",
    subtitle: "Gentle breath practices to calm your nervous system",
    benefits: ["calm", "clarity", "agency", "selfRespect"],
    clarity: {
      what: "Simple breathing techniques that help regulate your nervous system and bring you back to a calmer state.",
      why: "When we're stressed, our breath becomes shallow. Intentional breathing signals safety to your body and mind.",
      who: "Anyone feeling anxious, overwhelmed, or wanting a quick reset. No experience needed.",
      when: "Anytime you notice tension, before difficult conversations, or as a daily practice.",
      where: "Anywhere quiet enough to focus for a few minutes—home, office, or outdoors.",
      how: "Follow the guided pace. Breathe in through your nose, out through your mouth. Start with 2-3 minutes."
    },
    examples: [
      { level: "Beginner", label: "4-4 Box Breath", description: "Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 3 times." },
      { level: "Intermediate", label: "Extended Exhale", description: "Inhale for 4 counts, exhale for 6-8 counts. The longer exhale activates your calming response." },
      { level: "Advanced", label: "Coherent Breathing", description: "5 breaths per minute for 10 minutes. This rhythm synchronizes heart and brain for deep calm." }
    ],
    content: "Choose a breathing exercise below, or simply close your eyes and take three slow, deep breaths. There's no wrong way to start."
  },

  grounding: {
    title: "Grounding Techniques",
    subtitle: "Return to the present moment through your senses",
    benefits: ["calm", "clarity", "agency", "connection"],
    clarity: {
      what: "Sensory-based practices that bring your attention to the here and now, reducing anxiety and overwhelm.",
      why: "When we're stressed, our mind races to the past or future. Grounding anchors you in the present where you're safe.",
      who: "Anyone experiencing anxiety, dissociation, or feeling disconnected from their body.",
      when: "During panic, after triggering events, or whenever you feel 'spaced out' or unreal.",
      where: "Anywhere you can engage your senses—feel textures, notice sounds, or focus on your surroundings.",
      how: "Use the 5-4-3-2-1 technique or any sensory focus. Name what you notice without judgment."
    },
    examples: [
      { level: "Beginner", label: "5-4-3-2-1 Senses", description: "Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste." },
      { level: "Intermediate", label: "Body Scan", description: "Starting at your feet, slowly notice sensations moving up through your body to your head." },
      { level: "Advanced", label: "Anchor Points", description: "Press your feet firmly into the floor, notice your seat, feel your hands. Return here whenever needed." }
    ],
    content: "Grounding helps you feel more present and less overwhelmed. Try one technique now, or explore the options below."
  },

  affirmations: {
    title: "Affirmation Practice",
    subtitle: "Kind words to strengthen your inner voice",
    benefits: ["selfRespect", "agency", "connection", "calm"],
    clarity: {
      what: "Short, positive statements that help rewire thought patterns and build self-compassion over time.",
      why: "Our inner dialogue shapes how we feel. Affirmations offer a gentle alternative to self-criticism.",
      who: "Anyone working on self-esteem, healing from harsh self-talk, or wanting daily encouragement.",
      when: "Morning routines, before challenges, after setbacks, or whenever you need a reminder of your worth.",
      where: "Anywhere you can speak or think quietly—mirror, journal, or in your mind during commutes.",
      how: "Choose 1-3 affirmations that feel true-ish. Repeat them daily. It's okay if they feel awkward at first."
    },
    examples: [
      { level: "Beginner", label: "I Am Enough", description: "A simple reminder: 'I am enough, exactly as I am right now.'" },
      { level: "Intermediate", label: "Growth Statements", description: "'I am learning and growing every day. My progress matters more than perfection.'" },
      { level: "Advanced", label: "Personalized Mantras", description: "Create affirmations specific to your challenges: 'I can handle difficult emotions. They are visitors, not residents.'" }
    ],
    content: "Affirmations work best when they feel believable. Start with statements that resonate, even if they're simple."
  },

  meditation: {
    title: "Meditation Guides",
    subtitle: "Quiet moments for clarity and inner peace",
    benefits: ["calm", "clarity", "connection", "agency"],
    clarity: {
      what: "Guided and unguided practices to quiet the mind, increase awareness, and cultivate inner stillness.",
      why: "Regular meditation builds resilience, improves focus, and creates space between stimulus and response.",
      who: "Anyone seeking calm, clarity, or a break from mental chatter. Beginners welcome.",
      when: "Morning to set your day, midday for a reset, or evening for relaxation. Even 5 minutes helps.",
      where: "A quiet spot where you won't be interrupted. Sitting or lying down, eyes open or closed.",
      how: "Start with short sessions. Focus on breath, body sensations, or a guide's voice. Let thoughts pass like clouds."
    },
    examples: [
      { level: "Beginner", label: "3-Minute Breath Focus", description: "Simply notice your breath for 3 minutes. When your mind wanders, gently return to the breath." },
      { level: "Intermediate", label: "Body-Based Awareness", description: "Spend 10 minutes moving attention through different body parts, noticing sensations without changing them." },
      { level: "Advanced", label: "Open Awareness", description: "Sit for 15-20 minutes with no specific focus. Let thoughts, sounds, and sensations arise and pass." }
    ],
    content: "There's no perfect way to meditate. The goal is presence, not perfection. Choose a practice that feels manageable today."
  },

  "self-care": {
    title: "Self-Care Practices",
    subtitle: "Nurturing routines that honor your needs",
    benefits: ["selfRespect", "calm", "agency", "connection"],
    clarity: {
      what: "Intentional practices that replenish your energy and honor your physical, emotional, and mental needs.",
      why: "Self-care isn't selfish—it's essential. You can't pour from an empty cup, and rest is productive.",
      who: "Anyone feeling depleted, burned out, or struggling to prioritize their own wellbeing.",
      when: "Daily for small practices, weekly for deeper restoration. Before burnout, not just after.",
      where: "Home, nature, or any space that feels safe and restorative to you.",
      how: "Start with one small act of care today. Build gradually. Notice what actually refills you."
    },
    examples: [
      { level: "Beginner", label: "5-Minute Pause", description: "Set a timer and do absolutely nothing productive. Rest your eyes, stretch, or just breathe." },
      { level: "Intermediate", label: "Weekly Restoration", description: "Schedule one hour weekly for something purely enjoyable—reading, nature, creative play, or rest." },
      { level: "Advanced", label: "Boundaries Practice", description: "Identify one thing draining your energy. Set a small boundary to protect your wellbeing." }
    ],
    content: "Self-care looks different for everyone. The best practice is the one you'll actually do. Start small."
  },

  "emotional-intelligence": {
    title: "Emotional Intelligence",
    subtitle: "Understanding and working with your feelings",
    benefits: ["clarity", "connection", "agency", "selfRespect"],
    clarity: {
      what: "Skills for recognizing, understanding, and healthily expressing emotions in yourself and others.",
      why: "Emotions carry important information. When we understand them, we make better decisions and form deeper connections.",
      who: "Anyone wanting to improve self-awareness, relationships, or emotional regulation.",
      when: "Daily reflection, during emotional moments, or when relationships feel challenging.",
      where: "In quiet reflection, journaling, or in conversation with trusted people.",
      how: "Start by naming emotions without judgment. Ask 'what is this feeling telling me?' and 'what do I need right now?'"
    },
    examples: [
      { level: "Beginner", label: "Emotion Naming", description: "Throughout the day, pause and name what you're feeling. Just naming it can reduce its intensity." },
      { level: "Intermediate", label: "Trigger Mapping", description: "Notice patterns: what situations trigger strong emotions? What needs aren't being met?" },
      { level: "Advanced", label: "Empathy Practice", description: "In difficult conversations, pause to consider: 'What might the other person be feeling and needing?'" }
    ],
    content: "All emotions are valid—they're data, not commands. Learning to work with them takes practice and self-compassion."
  },

  "sleep-guide": {
    title: "Sleep Wellness Guide",
    subtitle: "Restful nights for restored days",
    benefits: ["calm", "clarity", "selfRespect", "agency"],
    clarity: {
      what: "Evidence-based practices and gentle routines to improve sleep quality and duration.",
      why: "Quality sleep is foundational to mental health, emotional regulation, and physical wellbeing.",
      who: "Anyone struggling with falling asleep, staying asleep, or waking unrefreshed.",
      when: "Begin your wind-down 1-2 hours before bed. Consistency matters more than perfection.",
      where: "Your bedroom, ideally cool, dark, and quiet. Create a sanctuary for rest.",
      how: "Start with one change—consistent bedtime, screen limits, or a wind-down ritual. Build gradually."
    },
    examples: [
      { level: "Beginner", label: "Screen Sunset", description: "Dim screens 1 hour before bed. Use night mode or blue light filters." },
      { level: "Intermediate", label: "Wind-Down Ritual", description: "Create a 15-minute pre-sleep routine: gentle stretching, reading, or breathing exercises." },
      { level: "Advanced", label: "Sleep Environment Optimization", description: "Cool room (65-68°F), blackout conditions, white noise if needed. Bed is for sleep only." }
    ],
    content: "Better sleep often comes from small, consistent changes rather than dramatic overhauls. Start with what feels doable."
  },

  "stress-response": {
    title: "Stress Response Tools",
    subtitle: "Understanding and regulating your stress system",
    benefits: ["calm", "clarity", "agency", "selfRespect"],
    clarity: {
      what: "Practices to recognize stress signals, regulate your nervous system, and build resilience over time.",
      why: "Chronic stress affects health, mood, and relationships. Learning to regulate stress is a life skill.",
      who: "Anyone experiencing chronic stress, anxiety, or wanting to build stress resilience.",
      when: "Daily practice for prevention, and in-the-moment tools when stress spikes.",
      where: "Wherever you are—work, home, or in between. Many techniques are invisible to others.",
      how: "First, notice stress signals in your body. Then choose a regulation technique that works for you."
    },
    examples: [
      { level: "Beginner", label: "Stress Signal Scan", description: "Notice where stress shows up in your body: shoulders, jaw, stomach? Awareness is the first step." },
      { level: "Intermediate", label: "Physiological Sigh", description: "Double inhale through the nose, long exhale through the mouth. Quickly activates the calming system." },
      { level: "Advanced", label: "Stress Inoculation", description: "Deliberately expose yourself to mild stressors while practicing calm. Build tolerance gradually." }
    ],
    content: "Stress isn't bad—it's information. The goal isn't zero stress, but better recovery and regulation."
  },

  "inner-child": {
    title: "Inner Child Healing",
    subtitle: "Gentle reconnection with your younger self",
    benefits: ["connection", "selfRespect", "calm", "clarity"],
    clarity: {
      what: "Compassionate practices to acknowledge, comfort, and integrate experiences from childhood.",
      why: "Early experiences shape how we relate to ourselves and others. Healing the past frees the present.",
      who: "Anyone curious about patterns from childhood, or wanting to cultivate more self-compassion.",
      when: "When you notice old patterns, during journaling, or in dedicated reflection time.",
      where: "A safe, private space where you can be emotional without interruption.",
      how: "Approach gently. Visualize your younger self. Offer the comfort and understanding you needed then."
    },
    examples: [
      { level: "Beginner", label: "Photo Connection", description: "Find a childhood photo. Look at yourself with compassion. What did that child need to hear?" },
      { level: "Intermediate", label: "Letter Writing", description: "Write a letter from your adult self to your child self. Offer reassurance and understanding." },
      { level: "Advanced", label: "Reparenting Practice", description: "When triggered, pause and ask: 'What age do I feel right now? What does this part of me need?'" }
    ],
    content: "Inner child work can bring up emotions. Go at your own pace. It's okay to start small and take breaks."
  },

  "body-wellness": {
    title: "Body Wellness",
    subtitle: "Listening to and caring for your physical self",
    benefits: ["calm", "selfRespect", "agency", "clarity"],
    clarity: {
      what: "Practices to reconnect with your body, understand its signals, and support physical wellbeing.",
      why: "Mind and body are connected. Physical wellness supports emotional resilience and mental clarity.",
      who: "Anyone wanting to improve their relationship with their body or address physical tension.",
      when: "Daily for small practices. After periods of stress or sedentary time. Before and after exercise.",
      where: "Anywhere you can move, stretch, or tune into bodily sensations.",
      how: "Start by noticing—not judging—what your body feels. Move gently. Rest when needed."
    },
    examples: [
      { level: "Beginner", label: "Morning Stretch", description: "Spend 2 minutes stretching gently when you wake. Notice what feels tight or tender." },
      { level: "Intermediate", label: "Movement Snacks", description: "Every hour, stand and move for 1-2 minutes. Shake, stretch, or walk in place." },
      { level: "Advanced", label: "Interoception Practice", description: "Sit quietly and notice internal sensations: heartbeat, breath, temperature, hunger. Build body awareness." }
    ],
    content: "Your body holds wisdom. These practices help you listen, understand, and respond to what it's telling you."
  },

  "soul-wellness": {
    title: "Soul Wellness",
    subtitle: "Nurturing meaning, purpose, and inner peace",
    benefits: ["connection", "clarity", "selfRespect", "calm"],
    clarity: {
      what: "Practices that nurture your sense of meaning, purpose, and connection to something larger than yourself.",
      why: "Spiritual or soulful wellness provides resilience, perspective, and a sense of belonging in the world.",
      who: "Anyone seeking deeper meaning, experiencing existential questions, or wanting more inner peace.",
      when: "During transitions, after losses, or when life feels disconnected from meaning.",
      where: "In nature, quiet reflection, creative expression, or community.",
      how: "Explore what gives you a sense of awe, purpose, or connection. There's no single right path."
    },
    examples: [
      { level: "Beginner", label: "Gratitude Moment", description: "Name three things you're grateful for today. Small things count." },
      { level: "Intermediate", label: "Values Reflection", description: "What matters most to you? Are you living in alignment with those values?" },
      { level: "Advanced", label: "Purpose Inquiry", description: "Ask: 'What am I here to contribute? What would I regret not doing?'" }
    ],
    content: "Soul wellness is personal. Whether through nature, creativity, service, or stillness—honor what resonates with you."
  },

  "healing-journeys": {
    title: "Healing Journeys",
    subtitle: "Guided paths toward wholeness",
    benefits: ["clarity", "connection", "agency", "selfRespect"],
    clarity: {
      what: "Structured programs that guide you through specific healing themes over days or weeks.",
      why: "Sustained focus on one area creates deeper change than scattered efforts.",
      who: "Anyone ready for focused healing work on specific themes like grief, self-worth, or relationships.",
      when: "When you're ready for deeper work and can commit to a daily practice.",
      where: "A consistent space where you can journal, reflect, and practice regularly.",
      how: "Choose a journey. Commit to the daily practice. Allow the process to unfold over time."
    },
    examples: [
      { level: "Beginner", label: "7-Day Self-Compassion", description: "One week of daily practices to cultivate kindness toward yourself." },
      { level: "Intermediate", label: "21-Day Emotional Release", description: "Three weeks of guided journaling and exercises to process stuck emotions." },
      { level: "Advanced", label: "90-Day Transformation", description: "A comprehensive program integrating multiple healing modalities over three months." }
    ],
    content: "Healing takes time. These structured journeys provide guidance while honoring your unique pace and path."
  },

  "behavior-change": {
    title: "Behavior Change",
    subtitle: "Building habits that align with your values",
    benefits: ["agency", "clarity", "selfRespect", "connection"],
    clarity: {
      what: "Evidence-based strategies for changing habits and creating lasting behavioral shifts.",
      why: "Lasting change comes from understanding how habits work and designing for success.",
      who: "Anyone wanting to build new habits, break old patterns, or align actions with intentions.",
      when: "When you're ready to make a specific change. Start with one habit at a time.",
      where: "In your daily environment. Design your space to support the change you want.",
      how: "Start impossibly small. Stack new habits onto existing routines. Celebrate tiny wins."
    },
    examples: [
      { level: "Beginner", label: "Tiny Habit", description: "After [existing habit], I will [new tiny action]. Example: After I brush my teeth, I will do one stretch." },
      { level: "Intermediate", label: "Environment Design", description: "Make the desired behavior easy and visible. Remove friction from good habits, add friction to unwanted ones." },
      { level: "Advanced", label: "Identity Shift", description: "Instead of 'I want to exercise,' try 'I am someone who moves their body.' Align identity with action." }
    ],
    content: "Change is hard. That's normal. Focus on systems, not willpower. Small, consistent steps lead to lasting transformation."
  },

  "daily-routines": {
    title: "Daily Routines",
    subtitle: "Rhythms that support your wellbeing",
    benefits: ["calm", "agency", "clarity", "selfRespect"],
    clarity: {
      what: "Template routines for morning, evening, and throughout the day that support mental wellness.",
      why: "Predictable routines reduce decision fatigue and create containers for wellbeing practices.",
      who: "Anyone feeling scattered, overwhelmed, or wanting more structure in their day.",
      when: "Start with one routine (morning is often easiest). Add others gradually.",
      where: "In your home environment. Adapt to your space and schedule.",
      how: "Keep routines short (5-15 minutes). Include what matters most. Flexibility is okay."
    },
    examples: [
      { level: "Beginner", label: "3-Minute Morning", description: "Wake, stretch, set one intention for the day. That's it." },
      { level: "Intermediate", label: "Transition Rituals", description: "Create a 5-minute routine between work and personal time to help you shift modes." },
      { level: "Advanced", label: "Full Day Rhythm", description: "Morning activation, midday reset, evening wind-down. Design your day for energy and rest cycles." }
    ],
    content: "The best routine is one you'll actually do. Start simpler than you think. Build from there."
  },

  "cognitive-tools": {
    title: "Cognitive Tools",
    subtitle: "Working with thoughts more skillfully",
    benefits: ["clarity", "agency", "calm", "selfRespect"],
    clarity: {
      what: "Techniques for examining, reframing, and working more skillfully with thought patterns.",
      why: "Our thoughts shape our emotions and actions. Learning to work with them creates more freedom.",
      who: "Anyone struggling with negative thought patterns, rumination, or overthinking.",
      when: "When you notice unhelpful thinking patterns, during journaling, or in therapy.",
      where: "Anywhere you can pause and reflect—journaling helps but isn't required.",
      how: "Notice the thought. Question it gently. Consider alternatives. Choose what serves you."
    },
    examples: [
      { level: "Beginner", label: "Thought Labeling", description: "When a thought appears, label it: 'That's a worry thought' or 'That's self-criticism.' Distance yourself from it." },
      { level: "Intermediate", label: "Evidence Check", description: "Ask: 'What's the evidence for this thought? Against it? What would I tell a friend?'" },
      { level: "Advanced", label: "Values-Based Pivot", description: "Instead of fighting the thought, ask: 'What action would align with my values right now?'" }
    ],
    content: "You are not your thoughts. These tools help you observe thinking without being controlled by it."
  },

  mirror: {
    title: "Mirror Work",
    subtitle: "Meeting yourself with compassion",
    benefits: ["selfRespect", "connection", "agency", "calm"],
    clarity: {
      what: "The practice of looking at yourself in a mirror and speaking kindly, building self-acceptance.",
      why: "Many of us avoid truly seeing ourselves. Mirror work cultivates self-compassion and acceptance.",
      who: "Anyone working on self-image, self-criticism, or wanting to strengthen their relationship with themselves.",
      when: "Daily, even for just 30 seconds. Morning is common, but any time works.",
      where: "A mirror where you can see your face, in a private space.",
      how: "Look into your own eyes. Speak kindly. It may feel awkward at first—that's normal."
    },
    examples: [
      { level: "Beginner", label: "Simple Greeting", description: "Look in the mirror and say 'Hello' or 'Good morning' to yourself. Notice how it feels." },
      { level: "Intermediate", label: "One Kind Thing", description: "Each day, tell your reflection one true, kind thing about yourself." },
      { level: "Advanced", label: "Eye Contact Meditation", description: "Spend 2-3 minutes looking into your own eyes without speaking. Just being present with yourself." }
    ],
    content: "Mirror work can feel vulnerable. Start gently. If it's too intense, you can practice with a photo instead."
  },

  ritual: {
    title: "Personal Rituals",
    subtitle: "Meaningful practices that mark your days",
    benefits: ["calm", "connection", "agency", "selfRespect"],
    clarity: {
      what: "Intentional, repeated practices that create meaning, mark transitions, or honor important moments.",
      why: "Rituals ground us, create sense of continuity, and help us navigate life's transitions.",
      who: "Anyone wanting more meaning in daily life or seeking ways to honor significant moments.",
      when: "Daily, weekly, seasonally, or during life transitions like beginnings and endings.",
      where: "Anywhere that feels meaningful to you—a corner of your home, nature, or a community space.",
      how: "Start simple. Choose an intention, a symbolic action, and repeat. Let rituals evolve."
    },
    examples: [
      { level: "Beginner", label: "Morning Tea Ritual", description: "Make tea mindfully. Hold the cup. Set an intention for the day while drinking." },
      { level: "Intermediate", label: "Weekly Reflection", description: "Same time each week: review what went well, what was hard, what you're grateful for." },
      { level: "Advanced", label: "Transition Ceremony", description: "Create a personal ritual for major life changes: new beginnings, endings, or healing milestones." }
    ],
    content: "Rituals don't need to be elaborate. The power is in repetition, intention, and presence."
  },

  wisdom: {
    title: "Daily Wisdom",
    subtitle: "Insights for reflection and growth",
    benefits: ["clarity", "connection", "calm", "selfRespect"],
    clarity: {
      what: "Curated insights, quotes, and teachings to inspire reflection and support your growth.",
      why: "Wisdom from others can offer perspective, comfort, and new ways of seeing challenges.",
      who: "Anyone seeking inspiration, perspective, or food for thought.",
      when: "Morning reflection, during difficult moments, or whenever you need a shift in perspective.",
      where: "Anywhere you can pause and consider a new idea.",
      how: "Read slowly. Sit with what resonates. Ask: 'How does this apply to my life?'"
    },
    examples: [
      { level: "Beginner", label: "Quote of the Day", description: "Read one piece of wisdom each morning. Let it simmer throughout your day." },
      { level: "Intermediate", label: "Journaling Response", description: "Write about what the wisdom brings up for you. What does it challenge or affirm?" },
      { level: "Advanced", label: "Wisdom Integration", description: "Choose one insight per week. Look for opportunities to apply it in daily life." }
    ],
    content: "Wisdom isn't just intellectual—it's lived. Let these insights guide you, but trust your own inner knowing too."
  },

  "wisdom-practices": {
    title: "Wisdom Practices",
    subtitle: "Ancient and modern paths to understanding",
    benefits: ["clarity", "calm", "connection", "selfRespect"],
    clarity: {
      what: "Practices drawn from various wisdom traditions that cultivate insight, presence, and perspective.",
      why: "Wisdom traditions have refined practices for thousands of years. We can learn from this collective knowledge.",
      who: "Anyone interested in deepening their practice or exploring contemplative traditions.",
      when: "During dedicated practice time, retreats, or as part of daily spiritual practice.",
      where: "A quiet space conducive to deep reflection and practice.",
      how: "Approach with curiosity and respect. Start with one practice and go deep before adding more."
    },
    examples: [
      { level: "Beginner", label: "Loving-Kindness", description: "Silently repeat: 'May I be happy, may I be healthy, may I be at peace.' Extend to others." },
      { level: "Intermediate", label: "Contemplative Reading", description: "Read a short passage slowly. Pause. Notice what arises. Read again. Listen deeply." },
      { level: "Advanced", label: "Self-Inquiry", description: "Ask 'Who am I?' not seeking intellectual answers, but sitting with the question itself." }
    ],
    content: "These practices come from many traditions. Take what serves you. Leave what doesn't. Honor the sources."
  },

  "wisdom-synthesis": {
    title: "Wisdom Synthesis",
    subtitle: "Integrating insights across traditions",
    benefits: ["clarity", "connection", "agency", "selfRespect"],
    clarity: {
      what: "The practice of finding common threads and complementary insights across different wisdom traditions.",
      why: "No single tradition has all the answers. Synthesis reveals deeper patterns and broader understanding.",
      who: "Those interested in comparative wisdom, interfaith understanding, or integrative approaches.",
      when: "During study, when facing complex questions, or when seeking a broader perspective.",
      where: "In study, discussion, or contemplative reflection.",
      how: "Learn multiple perspectives. Look for commonalities. Honor differences. Integrate what serves your growth."
    },
    examples: [
      { level: "Beginner", label: "Theme Comparison", description: "Choose one theme (compassion, suffering, purpose). See how 2-3 traditions address it." },
      { level: "Intermediate", label: "Practice Integration", description: "Combine practices from different sources that complement each other in your daily routine." },
      { level: "Advanced", label: "Personal Philosophy", description: "Articulate your own integrated worldview, drawing from multiple sources with intellectual honesty." }
    ],
    content: "Synthesis isn't about blending everything together—it's about learning from many while staying grounded in truth."
  },

  companion: {
    title: "Wellness Companion",
    subtitle: "Your supportive guide through each day",
    benefits: ["connection", "calm", "clarity", "agency"],
    clarity: {
      what: "A supportive AI companion that offers encouragement, prompts, and gentle guidance.",
      why: "Sometimes we need a gentle presence to check in, reflect with, or receive encouragement from.",
      who: "Anyone wanting daily support, a reflection partner, or gentle accountability.",
      when: "Daily check-ins, when processing thoughts, or when you need encouragement.",
      where: "Available whenever you need support, on any device.",
      how: "Share what's on your mind. Receive supportive responses. Use prompts for deeper reflection."
    },
    examples: [
      { level: "Beginner", label: "Morning Check-In", description: "Share how you're feeling this morning. Receive a supportive response and intention prompt." },
      { level: "Intermediate", label: "Processing Partner", description: "Talk through a challenge or decision. Receive reflective questions to clarify your thinking." },
      { level: "Advanced", label: "Growth Accountability", description: "Set intentions, track progress, and receive gentle check-ins on your growth journey." }
    ],
    content: "Your companion is here to support, not replace human connection. Use it as one tool in your wellness toolkit."
  },

  tools: {
    title: "Wellness Tools",
    subtitle: "Your complete toolkit for emotional wellbeing",
    benefits: ["agency", "clarity", "calm", "selfRespect"],
    clarity: {
      what: "A curated collection of evidence-based tools for emotional regulation, self-care, and personal growth.",
      why: "Having the right tools available when you need them makes self-care more accessible and effective.",
      who: "Anyone building a personal wellness practice or seeking new resources.",
      when: "Browse when calm to learn new tools. Use specific tools when facing challenges.",
      where: "Available on any device, whenever you need support.",
      how: "Explore different categories. Try tools that resonate. Add favorites to your daily practice."
    },
    examples: [
      { level: "Beginner", label: "Quick Calm Tools", description: "5-minute exercises for immediate stress relief and nervous system regulation." },
      { level: "Intermediate", label: "Reflection Practices", description: "Journaling prompts, thought work exercises, and self-inquiry tools." },
      { level: "Advanced", label: "Deep Work Sessions", description: "Extended practices for processing emotions, examining patterns, and catalyzing growth." }
    ],
    content: "This toolkit grows with you. Start with what feels accessible. Return to discover new tools as you're ready."
  },

  advanced: {
    title: "Advanced Practices",
    subtitle: "Deeper work for continued growth",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "More intensive practices for those ready to go deeper in their healing and growth work.",
      why: "After building foundations, deeper practices can catalyze breakthrough insights and lasting change.",
      who: "Those with an established practice who are ready for more intensive exploration.",
      when: "When you feel stable and resourced. Not during acute crisis. With support available if needed.",
      where: "A safe, private space where you can be fully present. Some benefit from professional guidance.",
      how: "Move slowly. Honor resistance as protection. Have support available. Integration is as important as insight."
    },
    examples: [
      { level: "Beginner", label: "Extended Meditation", description: "Gradually increase meditation time from 10 to 30+ minutes. Notice what emerges in longer sits." },
      { level: "Intermediate", label: "Shadow Work", description: "Explore disowned parts of yourself through journaling, visualization, or with a therapist." },
      { level: "Advanced", label: "Somatic Processing", description: "Work with the body to release stored tension and trauma. Best done with trained guidance." }
    ],
    content: "Advanced doesn't mean better—it means more intensive. Ensure you have proper support for deeper work."
  },

  mastery: {
    title: "Mastery Practices",
    subtitle: "Excellence through devoted practice",
    benefits: ["agency", "clarity", "selfRespect", "connection"],
    clarity: {
      what: "Long-term practices for those committed to sustained growth and deepening their wellness journey.",
      why: "True mastery comes from consistent, devoted practice over months and years, not quick fixes.",
      who: "Those with established practices seeking to deepen their commitment and refine their approach.",
      when: "As a long-term path, not a quick intervention. When you're ready for sustained commitment.",
      where: "Integrated into daily life. Mastery happens in the ordinary moments.",
      how: "Commit to consistent practice. Embrace the plateau. Trust the process. Seek guidance when stuck."
    },
    examples: [
      { level: "Beginner", label: "100-Day Commitment", description: "Choose one practice. Do it every day for 100 days. Track your journey." },
      { level: "Intermediate", label: "Teaching Others", description: "Share what you've learned. Teaching deepens understanding and creates community." },
      { level: "Advanced", label: "Integrated Living", description: "Your practice becomes invisible—woven into how you live, work, and relate to others." }
    ],
    content: "Mastery isn't about perfection. It's about showing up, again and again, with humility and devotion."
  },

  "elite-tools": {
    title: "Elite Wellness Tools",
    subtitle: "Premium practices for dedicated practitioners",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Our most sophisticated tools for those with established practices seeking cutting-edge approaches.",
      why: "Advanced practitioners benefit from refined tools that match their level of development.",
      who: "Those who have completed foundational work and seek more nuanced, powerful practices.",
      when: "After significant foundational work. When you're ready to take your practice to new levels.",
      where: "Designed for deep, focused practice sessions with adequate time and space.",
      how: "Approach with respect for the power of these tools. Move slowly. Integrate thoroughly."
    },
    examples: [
      { level: "Beginner", label: "Advanced Breathwork", description: "Extended breathing protocols that access deeper states of awareness and release." },
      { level: "Intermediate", label: "Somato-Emotional Release", description: "Working with the body-mind connection to release stored patterns and tension." },
      { level: "Advanced", label: "Transpersonal Practices", description: "Practices that explore consciousness, interconnection, and expanded states of being." }
    ],
    content: "Elite tools require a solid foundation. If you're new to wellness work, start with our foundational tools first."
  },

  atlas: {
    title: "Wellness Atlas",
    subtitle: "Navigate your personal growth landscape",
    benefits: ["clarity", "agency", "connection", "selfRespect"],
    clarity: {
      what: "A visual map of your wellness journey, showing where you've been, where you are, and where you might go.",
      why: "Seeing the big picture helps you understand your progress and identify areas for growth.",
      who: "Anyone wanting to understand their overall wellness landscape and plan their journey.",
      when: "Periodically for planning, when feeling lost, or when celebrating progress.",
      where: "A quiet space where you can reflect on your journey without interruption.",
      how: "Explore different domains. Assess where you are. Set intentions for where to focus next."
    },
    examples: [
      { level: "Beginner", label: "Domain Survey", description: "Rate your current state across different wellness domains: physical, emotional, relational, spiritual." },
      { level: "Intermediate", label: "Progress Mapping", description: "Track your growth over time. Notice patterns, celebrate wins, identify growth edges." },
      { level: "Advanced", label: "Integrated Vision", description: "Create a vision for your holistic wellness. Set goals that honor all dimensions of wellbeing." }
    ],
    content: "Your wellness journey is unique. The atlas helps you see the territory, but you choose the path."
  },

  "strategy-maps": {
    title: "Strategy Maps",
    subtitle: "Planning your growth with intention",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Visual planning tools to map out your wellness goals, obstacles, and paths forward.",
      why: "Strategic thinking applied to personal growth increases clarity and follow-through.",
      who: "Anyone wanting to be more intentional about their growth path and overcome obstacles.",
      when: "During planning periods, when facing obstacles, or when setting new goals.",
      where: "A quiet space with room to think, ideally with paper or digital tools for mapping.",
      how: "Clarify your goal. Map current obstacles. Identify resources. Plan specific next steps."
    },
    examples: [
      { level: "Beginner", label: "Goal Clarity Map", description: "Define what you want, why it matters, and one small first step." },
      { level: "Intermediate", label: "Obstacle Analysis", description: "Map what's been blocking you. Identify which obstacles are internal vs external." },
      { level: "Advanced", label: "Systems Design", description: "Design your environment, routines, and relationships to support your goals automatically." }
    ],
    content: "Strategy without action is just dreaming. Use these maps to clarify, then take the first step."
  },

  "collaborative-lab": {
    title: "Collaborative Lab",
    subtitle: "Growing together with others",
    benefits: ["connection", "clarity", "agency", "selfRespect"],
    clarity: {
      what: "Spaces and tools for growing alongside others through shared practice, discussion, and mutual support.",
      why: "We grow faster and deeper when we learn with others. Community provides accountability and perspective.",
      who: "Anyone wanting to grow in community rather than isolation.",
      when: "Regularly as part of your practice. In groups, partnerships, or community settings.",
      where: "In shared spaces, online forums, or with accountability partners.",
      how: "Join or create a group. Show up consistently. Offer and receive support. Learn from others' journeys."
    },
    examples: [
      { level: "Beginner", label: "Accountability Partner", description: "Find one person to check in with weekly about your wellness goals." },
      { level: "Intermediate", label: "Practice Group", description: "Join or form a small group that practices together—meditation, journaling, or reflection." },
      { level: "Advanced", label: "Wisdom Circle", description: "Create a deeper practice community with structured sharing and mutual support protocols." }
    ],
    content: "You don't have to do this alone. Connection with others can accelerate and deepen your growth."
  },

  resilience: {
    title: "Resilience Building",
    subtitle: "Strengthening your ability to bounce back",
    benefits: ["agency", "calm", "clarity", "selfRespect"],
    clarity: {
      what: "Practices that build your capacity to navigate challenges, recover from setbacks, and grow through difficulty.",
      why: "Life includes hardship. Resilience isn't about avoiding difficulty, but building your capacity to move through it.",
      who: "Anyone wanting to increase their ability to handle stress, change, and adversity.",
      when: "During stable periods (to build reserves) and after challenges (to recover and learn).",
      where: "Wherever life presents challenges—which is everywhere.",
      how: "Build on strengths. Learn from setbacks. Cultivate support networks. Practice recovery."
    },
    examples: [
      { level: "Beginner", label: "Strengths Inventory", description: "Name your existing strengths. How have they helped you through past challenges?" },
      { level: "Intermediate", label: "Stress Inoculation", description: "Deliberately face small challenges to build confidence in your ability to handle difficulty." },
      { level: "Advanced", label: "Post-Traumatic Growth", description: "Work with a challenge you've faced. What growth has emerged from that difficulty?" }
    ],
    content: "Resilience isn't about being tough. It's about being flexible, supported, and willing to learn from experience."
  },

  crisis: {
    title: "Crisis Resources",
    subtitle: "Immediate support when you need it most",
    benefits: ["calm", "connection", "clarity", "agency"],
    clarity: {
      what: "Resources, hotlines, and grounding techniques for moments of acute distress or crisis.",
      why: "Everyone deserves access to support in their darkest moments. Help is available.",
      who: "Anyone experiencing acute distress, suicidal thoughts, or overwhelming crisis.",
      when: "Right now, if you're in crisis. Or browse to know resources before you need them.",
      where: "Immediate help is available by phone, text, chat, or in-person emergency services.",
      how: "Reach out. You don't have to have it all figured out. Just make contact."
    },
    examples: [
      { level: "Beginner", label: "Grounding First", description: "Before anything else: 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste." },
      { level: "Intermediate", label: "Crisis Hotlines", description: "988 (US) Suicide and Crisis Lifeline. Crisis Text Line: text HOME to 741741." },
      { level: "Advanced", label: "Safety Planning", description: "Create a safety plan with a professional before crisis hits. Know your warning signs and supports." }
    ],
    content: "You matter. Your life has value. If you're struggling, please reach out. Help is available 24/7."
  }
};

// Add more wellness pages
Object.assign(PAGE_METADATA, {
  "calming-scenes": {
    title: "Calming Scenes",
    subtitle: "Visual escapes for mental rest",
    benefits: ["calm", "clarity", "connection", "agency"],
    clarity: {
      what: "Peaceful images and sounds from nature to help you relax and reset your nervous system.",
      why: "Visual calm activates your parasympathetic nervous system, reducing stress and promoting relaxation.",
      who: "Anyone needing a quick mental escape or visual break from stress.",
      when: "During breaks, before sleep, or when feeling overwhelmed.",
      where: "Anywhere you can view a screen and ideally use headphones.",
      how: "Choose a scene. Breathe slowly. Let your eyes soften. Stay for at least 2-3 minutes."
    },
    examples: [
      { level: "Beginner", label: "2-Minute Nature Break", description: "Watch gentle waves, forest scenes, or clouds passing. Just observe and breathe." },
      { level: "Intermediate", label: "Guided Visual Journey", description: "Follow a narrated visualization through peaceful landscapes." },
      { level: "Advanced", label: "Visualization Practice", description: "Close your eyes and mentally construct your own peaceful scene in detail." }
    ],
    content: "Let your mind rest. These scenes are here whenever you need a moment of peace."
  },

  "healing-library": {
    title: "Healing Library",
    subtitle: "Resources for your healing journey",
    benefits: ["clarity", "connection", "agency", "selfRespect"],
    clarity: {
      what: "A curated collection of articles, guides, and resources to support various aspects of healing.",
      why: "Knowledge empowers healing. Understanding what you're experiencing helps you move through it.",
      who: "Anyone on a healing journey seeking information and guidance.",
      when: "When learning about a topic, processing experiences, or seeking new approaches.",
      where: "Read at your own pace in a comfortable, quiet space.",
      how: "Browse by topic. Read what calls to you. Take notes on what resonates."
    },
    examples: [
      { level: "Beginner", label: "Introduction Guides", description: "Foundational articles explaining key healing concepts in simple terms." },
      { level: "Intermediate", label: "Deep Dives", description: "Comprehensive resources on specific topics like trauma, grief, or boundaries." },
      { level: "Advanced", label: "Research Summaries", description: "Evidence-based findings translated for practical application." }
    ],
    content: "This library grows over time. Check back for new resources to support your journey."
  },

  "wellness-hub": {
    title: "Wellness Hub",
    subtitle: "Your central space for wellbeing",
    benefits: ["agency", "clarity", "calm", "connection"],
    clarity: {
      what: "A central dashboard to access all your wellness tools, track progress, and find what you need.",
      why: "Having everything in one place makes self-care more accessible and sustainable.",
      who: "Everyone using the platform—your home base for wellness.",
      when: "Daily check-ins, when seeking a specific tool, or for regular practice.",
      where: "Available wherever you access the platform.",
      how: "Use the navigation to find tools. Check your progress. Set daily intentions."
    },
    examples: [
      { level: "Beginner", label: "Daily Check-In", description: "Start each session by noting how you're feeling and what you need." },
      { level: "Intermediate", label: "Practice Tracker", description: "See your streaks, completed tools, and areas of focus." },
      { level: "Advanced", label: "Custom Dashboard", description: "Arrange your hub to prioritize the tools you use most." }
    ],
    content: "Your wellness hub is designed to make self-care simple. Everything you need is within reach."
  },

  wellness: {
    title: "Wellness Overview",
    subtitle: "Your path to holistic wellbeing",
    benefits: ["calm", "clarity", "agency", "connection"],
    clarity: {
      what: "An introduction to our approach to wellness—holistic, trauma-informed, and self-directed.",
      why: "Understanding the philosophy behind the tools helps you use them more effectively.",
      who: "Anyone new to the platform or seeking to understand our approach.",
      when: "When getting started, or when you want to revisit the foundations.",
      where: "Read at your own pace, anywhere comfortable.",
      how: "Explore the different dimensions of wellness we address. Find what resonates with your needs."
    },
    examples: [
      { level: "Beginner", label: "Quick Start", description: "Begin with one simple tool. Experience the approach before learning more about it." },
      { level: "Intermediate", label: "Dimension Deep Dive", description: "Learn about each dimension of wellness: physical, emotional, relational, spiritual." },
      { level: "Advanced", label: "Holistic Integration", description: "Understand how different practices work together for comprehensive wellbeing." }
    ],
    content: "Wellness isn't one-size-fits-all. We're here to help you find what works for your unique journey."
  }
});

// Additional pages - Analytics, Progress, Content
Object.assign(PAGE_METADATA, {
  today: {
    title: "Today's Practice",
    subtitle: "Your daily wellness focus",
    benefits: ["calm", "clarity", "agency", "connection"],
    clarity: {
      what: "A daily selection of practices, prompts, and insights tailored to support your wellbeing today.",
      why: "Daily consistency builds lasting change. Small, focused practices compound over time.",
      who: "Anyone wanting a guided daily practice without having to decide what to do.",
      when: "Each morning to set your day, or whenever you need direction.",
      where: "Wherever you start your day or take a wellness break.",
      how: "Review today's offerings. Choose what resonates. Complete at least one practice."
    },
    examples: [
      { level: "Beginner", label: "One Thing Today", description: "Just do one practice from today's selection. That's enough." },
      { level: "Intermediate", label: "Morning + Evening", description: "One practice to start your day, one to close it." },
      { level: "Advanced", label: "Full Daily Flow", description: "Morning intention, midday check-in, evening reflection." }
    ],
    content: "Today is a fresh start. What one small thing will you do to care for yourself?"
  },

  mood: {
    title: "Mood Tracking",
    subtitle: "Understanding your emotional patterns",
    benefits: ["clarity", "agency", "calm", "selfRespect"],
    clarity: {
      what: "A simple way to log and track your emotional states over time to reveal patterns.",
      why: "Awareness of mood patterns helps you understand triggers, plan for vulnerable times, and celebrate progress.",
      who: "Anyone wanting more insight into their emotional life and patterns.",
      when: "Daily or multiple times daily. Consistency reveals more patterns.",
      where: "Quick check-ins work anywhere—at your desk, on your phone, or during breaks.",
      how: "Log your mood. Add brief notes if helpful. Review patterns weekly."
    },
    examples: [
      { level: "Beginner", label: "Simple Daily Log", description: "Rate your overall mood once per day. Use a 1-5 scale or emoji." },
      { level: "Intermediate", label: "Mood + Context", description: "Log mood plus one factor: sleep, stress, activity, or social connection." },
      { level: "Advanced", label: "Comprehensive Tracking", description: "Track mood, energy, anxiety, and triggers. Review weekly for insights." }
    ],
    content: "Your moods are data, not destiny. Tracking helps you understand yourself better."
  },

  state: {
    title: "State Awareness",
    subtitle: "Tuning into how you're doing right now",
    benefits: ["clarity", "calm", "agency", "selfRespect"],
    clarity: {
      what: "Tools to check in with your current physical, emotional, and mental state.",
      why: "We often push through without noticing how we're actually doing. Awareness enables choice.",
      who: "Anyone wanting to develop better self-awareness and respond to their needs.",
      when: "Throughout the day, especially during transitions or when something feels off.",
      where: "Anywhere you can pause for 30 seconds to a few minutes.",
      how: "Pause. Scan body, emotions, and thoughts. Notice without judgment. Respond to what you find."
    },
    examples: [
      { level: "Beginner", label: "Quick Body Scan", description: "Notice tension in shoulders, jaw, stomach. Breathe into tight areas." },
      { level: "Intermediate", label: "Emotional Check-In", description: "Name your current emotion. Ask: what do I need right now?" },
      { level: "Advanced", label: "Full State Assessment", description: "Body, emotions, energy, mental clarity, connection—assess all dimensions." }
    ],
    content: "Noticing how you are is the first step to taking care of yourself."
  },

  journal: {
    title: "Journaling Practice",
    subtitle: "Writing your way to clarity",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Guided and free-form journaling tools to process thoughts, emotions, and experiences.",
      why: "Writing externalizes our thoughts, reduces rumination, and creates space for insight.",
      who: "Anyone seeking mental clarity, emotional processing, or self-discovery.",
      when: "Daily practice is ideal. Also helpful during challenging times or decisions.",
      where: "A quiet space where you can write without interruption.",
      how: "Use prompts or write freely. Don't censor yourself. The goal is expression, not perfection."
    },
    examples: [
      { level: "Beginner", label: "3-Minute Free Write", description: "Set a timer. Write whatever comes to mind. No editing, no judgment." },
      { level: "Intermediate", label: "Prompted Reflection", description: "Use a question or prompt to focus your writing and deepen exploration." },
      { level: "Advanced", label: "Dialogue Practice", description: "Write a conversation between parts of yourself, or with your inner wisdom." }
    ],
    content: "Your journal is a safe space for honest self-expression. Write what's true for you."
  },

  analytics: {
    title: "Wellness Analytics",
    subtitle: "Insights from your practice data",
    benefits: ["clarity", "agency", "selfRespect", "calm"],
    clarity: {
      what: "Visual summaries of your wellness activities, moods, and patterns over time.",
      why: "Data helps you see progress that feels invisible day-to-day. Patterns reveal what's working.",
      who: "Anyone who has been tracking practices and wants to understand their trends.",
      when: "Weekly or monthly reviews to see the bigger picture.",
      where: "When you have time to reflect on what the data reveals.",
      how: "Review your charts and summaries. Notice patterns. Adjust your approach based on insights."
    },
    examples: [
      { level: "Beginner", label: "Weekly Summary", description: "See which days you practiced and how your mood trended." },
      { level: "Intermediate", label: "Correlation Insights", description: "Discover connections between activities (sleep, exercise, journaling) and mood." },
      { level: "Advanced", label: "Long-Term Trends", description: "View months of data to see lasting changes and areas for continued growth." }
    ],
    content: "Your data tells a story. Let it guide your journey, not define it."
  },

  progress: {
    title: "Progress Tracking",
    subtitle: "Celebrating how far you've come",
    benefits: ["selfRespect", "agency", "clarity", "connection"],
    clarity: {
      what: "A view of your accomplishments, streaks, and growth milestones.",
      why: "Recognizing progress builds motivation and self-trust. Small wins matter.",
      who: "Anyone wanting acknowledgment of their efforts and encouragement to continue.",
      when: "When you need motivation, during weekly reviews, or to celebrate milestones.",
      where: "Check your progress whenever you need a boost.",
      how: "Review completed practices, active streaks, and goals achieved. Celebrate yourself."
    },
    examples: [
      { level: "Beginner", label: "Streak Tracker", description: "See how many days in a row you've maintained your practice." },
      { level: "Intermediate", label: "Milestone Badges", description: "Earn recognition for completing challenges and reaching goals." },
      { level: "Advanced", label: "Growth Timeline", description: "View your entire journey—from first practice to where you are now." }
    ],
    content: "Every step forward counts. You're doing better than you might realize."
  },

  "growth-analytics": {
    title: "Growth Analytics",
    subtitle: "Measuring your personal development",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Deeper analysis of your growth across different wellness dimensions over time.",
      why: "Understanding which areas are developing helps you celebrate progress and identify focus areas.",
      who: "Those interested in data-driven self-improvement and long-term tracking.",
      when: "Monthly or quarterly deep-dives into your development.",
      where: "When you have time for thoughtful reflection on your growth trajectory.",
      how: "Review dimension-by-dimension progress. Set intentions based on insights."
    },
    examples: [
      { level: "Beginner", label: "Dimension Overview", description: "See a simple breakdown of activity across emotional, physical, and mental wellness." },
      { level: "Intermediate", label: "Growth Rate Analysis", description: "Compare your pace of growth across different areas and time periods." },
      { level: "Advanced", label: "Predictive Insights", description: "Based on your patterns, see where you might focus for maximum impact." }
    ],
    content: "Growth isn't always linear. These insights help you see the bigger picture."
  },

  "guided-journaling": {
    title: "Guided Journaling",
    subtitle: "Prompts to deepen your reflection",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Carefully crafted journaling prompts that guide you through meaningful self-exploration.",
      why: "Good questions open new perspectives. Guided prompts help you go deeper than free writing alone.",
      who: "Anyone wanting more direction in their journaling or new topics to explore.",
      when: "When you feel stuck in free writing, or when you want to explore a specific theme.",
      where: "A quiet space with your journal or digital writing tool.",
      how: "Choose a prompt that resonates. Write without censoring. Follow where the question leads."
    },
    examples: [
      { level: "Beginner", label: "Daily Reflection Prompts", description: "Simple questions like 'What am I grateful for today?' and 'What challenged me?'" },
      { level: "Intermediate", label: "Theme-Based Prompts", description: "Deeper questions organized by theme: relationships, values, growth, healing." },
      { level: "Advanced", label: "Shadow Work Prompts", description: "Questions that help you explore hidden parts of yourself with compassion." }
    ],
    content: "The right question at the right time can unlock profound insight. Let these prompts guide you."
  }
});

// Knowledge and Learning pages
Object.assign(PAGE_METADATA, {
  "knowledge-synthesis": {
    title: "Knowledge Synthesis",
    subtitle: "Connecting ideas for deeper understanding",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Tools for connecting what you learn into coherent understanding and actionable wisdom.",
      why: "Information alone doesn't create change. Synthesis turns knowledge into practical wisdom.",
      who: "Learners wanting to integrate information into applicable understanding.",
      when: "After consuming new content, during learning periods, or when synthesizing insights.",
      where: "Quiet space for thinking, ideally with notes or journaling tools.",
      how: "Review what you've learned. Ask how ideas connect. Apply insights to your life."
    },
    examples: [
      { level: "Beginner", label: "Key Takeaways", description: "After reading/learning, write 3 key insights in your own words." },
      { level: "Intermediate", label: "Connection Mapping", description: "How does this new knowledge connect to what you already know?" },
      { level: "Advanced", label: "Application Planning", description: "Design specific ways to apply this knowledge in your daily life." }
    ],
    content: "Knowledge becomes wisdom through reflection and application. Take time to synthesize."
  },

  "cognitive-architecture": {
    title: "Cognitive Architecture",
    subtitle: "Understanding how your mind works",
    benefits: ["clarity", "agency", "calm", "selfRespect"],
    clarity: {
      what: "Insights into how your mind processes information, makes decisions, and creates patterns.",
      why: "Understanding your mental patterns gives you more choice in how you think and respond.",
      who: "Anyone interested in metacognition—thinking about thinking.",
      when: "During self-study, when noticing unhelpful patterns, or when optimizing performance.",
      where: "Quiet reflection time for deep thinking.",
      how: "Learn about cognitive patterns. Notice them in yourself. Experiment with changes."
    },
    examples: [
      { level: "Beginner", label: "Bias Awareness", description: "Learn about common cognitive biases. Notice which ones show up for you." },
      { level: "Intermediate", label: "Pattern Recognition", description: "Map your habitual thought patterns. Which serve you? Which limit you?" },
      { level: "Advanced", label: "Mental Model Building", description: "Develop personal frameworks for decision-making and problem-solving." }
    ],
    content: "Your mind has patterns. Understanding them gives you power to choose differently."
  },

  "philosophical-inquiry": {
    title: "Philosophical Inquiry",
    subtitle: "Exploring life's meaningful questions",
    benefits: ["clarity", "connection", "selfRespect", "agency"],
    clarity: {
      what: "Guided exploration of philosophical questions about meaning, purpose, ethics, and existence.",
      why: "Philosophical reflection deepens understanding of yourself and your place in the world.",
      who: "Anyone curious about the deeper questions of life and meaning.",
      when: "During contemplative periods, when facing major decisions, or as ongoing practice.",
      where: "A quiet space for deep thinking, ideally with journaling available.",
      how: "Sit with questions without rushing to answers. Let the inquiry itself be valuable."
    },
    examples: [
      { level: "Beginner", label: "Values Exploration", description: "What matters most to you? Why? How do you know?" },
      { level: "Intermediate", label: "Meaning Questions", description: "What gives your life meaning? Has this changed over time?" },
      { level: "Advanced", label: "Existential Inquiry", description: "Sit with profound questions about freedom, death, purpose, and connection." }
    ],
    content: "The unexamined life may not be worth living—but the examined life is rarely comfortable."
  },

  "systems-thinking": {
    title: "Systems Thinking",
    subtitle: "Seeing patterns and connections",
    benefits: ["clarity", "agency", "connection", "selfRespect"],
    clarity: {
      what: "Tools for understanding how parts of your life connect and influence each other.",
      why: "Life is interconnected. Understanding systems helps you find leverage points for change.",
      who: "Anyone wanting to understand complex patterns in their life or make lasting changes.",
      when: "When facing complex challenges, planning changes, or understanding patterns.",
      where: "Space for mapping and visual thinking is helpful.",
      how: "Map the system. Identify connections. Find leverage points. Test small changes."
    },
    examples: [
      { level: "Beginner", label: "Connection Mapping", description: "Map how different areas of your life (work, health, relationships) affect each other." },
      { level: "Intermediate", label: "Feedback Loops", description: "Identify virtuous and vicious cycles in your patterns." },
      { level: "Advanced", label: "Leverage Points", description: "Find small changes that could create ripple effects across multiple areas." }
    ],
    content: "Everything is connected. Systems thinking helps you see the forest, not just the trees."
  },

  "meta-learning": {
    title: "Meta-Learning",
    subtitle: "Learning how to learn better",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Techniques for improving how you learn, remember, and apply new information.",
      why: "The ability to learn effectively is a meta-skill that improves everything else you learn.",
      who: "Anyone wanting to learn faster, retain more, and apply knowledge more effectively.",
      when: "When starting new learning, or when current learning strategies aren't working.",
      where: "Any learning environment—reading, courses, or experiential learning.",
      how: "Learn about learning. Experiment with techniques. Track what works for you."
    },
    examples: [
      { level: "Beginner", label: "Active Recall", description: "After learning, close the material and try to recall key points. Fill gaps, repeat." },
      { level: "Intermediate", label: "Spaced Repetition", description: "Review material at increasing intervals for long-term retention." },
      { level: "Advanced", label: "Teaching Others", description: "Explain what you've learned to others. Teaching reveals gaps and deepens understanding." }
    ],
    content: "Learning is a skill you can improve. Better learning strategies pay dividends for life."
  },

  "daily-wisdom": {
    title: "Daily Wisdom",
    subtitle: "A daily dose of insight",
    benefits: ["clarity", "calm", "connection", "selfRespect"],
    clarity: {
      what: "A curated daily offering of wisdom, quotes, and reflections to inspire your day.",
      why: "Starting the day with wisdom sets a thoughtful tone and provides perspective.",
      who: "Anyone wanting daily inspiration and food for thought.",
      when: "Morning practice, or whenever you need a shift in perspective.",
      where: "Anywhere you can pause and reflect for a moment.",
      how: "Read the daily wisdom. Sit with it briefly. Let it inform your day."
    },
    examples: [
      { level: "Beginner", label: "Daily Quote", description: "Read one piece of wisdom each morning. Let it simmer." },
      { level: "Intermediate", label: "Journal Response", description: "Write briefly about how today's wisdom applies to your life." },
      { level: "Advanced", label: "Wisdom Integration", description: "Look for opportunities to apply the day's wisdom in specific situations." }
    ],
    content: "Wisdom doesn't need to be complicated. Sometimes one sentence is enough."
  }
});

// Content and Community pages
Object.assign(PAGE_METADATA, {
  blog: {
    title: "Wellness Blog",
    subtitle: "Articles for your journey",
    benefits: ["clarity", "connection", "agency", "selfRespect"],
    clarity: {
      what: "Our collection of articles exploring wellness topics, research, and practical guidance.",
      why: "Reading helps you learn, gain perspective, and feel less alone in your experiences.",
      who: "Anyone seeking information, inspiration, or new perspectives on wellness.",
      when: "During learning time, when exploring a topic, or when you need inspiration.",
      where: "Read at your own pace, anywhere comfortable.",
      how: "Browse by topic or interest. Read what calls to you. Apply what resonates."
    },
    examples: [
      { level: "Beginner", label: "Quick Reads", description: "Short articles you can read in 5 minutes or less." },
      { level: "Intermediate", label: "Deep Dives", description: "Comprehensive explorations of specific topics." },
      { level: "Advanced", label: "Research Summaries", description: "Evidence-based articles with practical applications." }
    ],
    content: "Our blog grows regularly with new insights to support your journey."
  },

  write: {
    title: "Write & Express",
    subtitle: "Share your thoughts and experiences",
    benefits: ["agency", "connection", "clarity", "selfRespect"],
    clarity: {
      what: "A space to write, journal, and optionally share your thoughts with the community.",
      why: "Writing clarifies thought. Sharing creates connection. Both support healing.",
      who: "Anyone wanting to process through writing or share their experience with others.",
      when: "When thoughts need organizing, when you want to be heard, or as regular practice.",
      where: "A quiet space for writing. Sharing is always optional.",
      how: "Write freely. Edit if desired. Choose whether to keep private or share."
    },
    examples: [
      { level: "Beginner", label: "Private Journal", description: "Write for yourself only. No audience, no pressure." },
      { level: "Intermediate", label: "Community Sharing", description: "Share reflections with the supportive community." },
      { level: "Advanced", label: "Story Contribution", description: "Contribute your healing story to inspire others on similar paths." }
    ],
    content: "Your words have power. Write for yourself first, share only if it feels right."
  },

  "content-index": {
    title: "Content Index",
    subtitle: "Find what you need",
    benefits: ["clarity", "agency", "calm", "connection"],
    clarity: {
      what: "A comprehensive index of all content on the platform, organized by topic and type.",
      why: "Finding the right resource quickly saves time and reduces frustration.",
      who: "Anyone looking for specific content or wanting to explore what's available.",
      when: "When searching for something specific or browsing for new resources.",
      where: "Use anytime to navigate the platform efficiently.",
      how: "Search by keyword, browse by category, or explore what's new."
    },
    examples: [
      { level: "Beginner", label: "Topic Browse", description: "See all content organized by wellness topic." },
      { level: "Intermediate", label: "Type Filter", description: "Filter by content type: articles, tools, prompts, etc." },
      { level: "Advanced", label: "Custom Lists", description: "Create and save custom lists of content for your practice." }
    ],
    content: "Everything we offer, organized for easy discovery. Find what you need."
  },

  "content-studio": {
    title: "Content Studio",
    subtitle: "Create and customize your practice",
    benefits: ["agency", "clarity", "selfRespect", "connection"],
    clarity: {
      what: "Tools to create custom prompts, practices, and content for your personal use.",
      why: "Personalized content is more powerful. Creating your own deepens engagement.",
      who: "Anyone wanting to customize their practice or create personal resources.",
      when: "When standard content doesn't quite fit, or when you want to create something personal.",
      where: "A focused space for creative work.",
      how: "Use our templates. Customize to your needs. Save and use in your practice."
    },
    examples: [
      { level: "Beginner", label: "Custom Affirmations", description: "Create personalized affirmations that speak to your specific needs." },
      { level: "Intermediate", label: "Personal Rituals", description: "Design custom rituals and practices for your routine." },
      { level: "Advanced", label: "Full Practice Design", description: "Create comprehensive personal practices drawing on all tools." }
    ],
    content: "The best practices are often the ones you create yourself. Make this platform yours."
  },

  "study-vault": {
    title: "Study Vault",
    subtitle: "Research and evidence behind our approach",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Summaries of research and evidence supporting our practices and recommendations.",
      why: "Understanding the 'why' behind practices increases trust and engagement.",
      who: "Anyone interested in the science and research behind wellness practices.",
      when: "When curious about evidence, or when skepticism arises.",
      where: "Read at your own pace during study time.",
      how: "Browse by practice area. Read summaries. Access original sources if desired."
    },
    examples: [
      { level: "Beginner", label: "Quick Evidence Cards", description: "One-paragraph summaries of key research findings." },
      { level: "Intermediate", label: "Research Summaries", description: "More detailed breakdowns of studies and their implications." },
      { level: "Advanced", label: "Source Library", description: "Links to original research papers and academic sources." }
    ],
    content: "We believe in evidence-based practice. Here's the research supporting our approach."
  },

  research: {
    title: "Research Hub",
    subtitle: "Evidence-based wellness insights",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "A collection of research findings relevant to mental wellness and personal growth.",
      why: "Evidence-based practices are more effective. Research helps you trust the process.",
      who: "Anyone curious about the science behind wellness practices.",
      when: "During learning, when questioning a practice, or for professional development.",
      where: "Focused reading time for complex material.",
      how: "Browse by topic. Read accessible summaries. Explore original sources if interested."
    },
    examples: [
      { level: "Beginner", label: "Key Findings", description: "Simple summaries of important research discoveries." },
      { level: "Intermediate", label: "Practice Implications", description: "How research translates into practical recommendations." },
      { level: "Advanced", label: "Critical Analysis", description: "Nuanced discussions of research limitations and applications." }
    ],
    content: "Science and wisdom together create effective practice. Explore the evidence."
  },

  "how-to-guides": {
    title: "How-To Guides",
    subtitle: "Step-by-step instructions",
    benefits: ["clarity", "agency", "calm", "selfRespect"],
    clarity: {
      what: "Clear, practical guides for specific wellness practices and platform features.",
      why: "Good instructions make learning easier and reduce confusion.",
      who: "Anyone learning a new practice or wanting clear guidance.",
      when: "When starting something new or when you need detailed steps.",
      where: "Follow along wherever you're practicing.",
      how: "Read through once. Then follow step-by-step. Adjust as you learn."
    },
    examples: [
      { level: "Beginner", label: "Getting Started", description: "Simple guides for your first practices and platform navigation." },
      { level: "Intermediate", label: "Technique Guides", description: "Detailed instructions for specific practices and methods." },
      { level: "Advanced", label: "Advanced Methods", description: "Comprehensive guides for complex practices." }
    ],
    content: "Clear instructions make practice accessible. Follow along at your own pace."
  },

  glossary: {
    title: "Wellness Glossary",
    subtitle: "Key terms defined",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Definitions of terms, concepts, and practices used throughout the platform.",
      why: "Understanding the language helps you engage more fully with the material.",
      who: "Anyone encountering unfamiliar terms or wanting clearer understanding.",
      when: "When you encounter a term you don't know, or when reviewing concepts.",
      where: "Reference anytime for quick definitions.",
      how: "Search by term or browse alphabetically. Click through for deeper explanations."
    },
    examples: [
      { level: "Beginner", label: "Quick Definitions", description: "One-sentence explanations of common terms." },
      { level: "Intermediate", label: "Concept Explanations", description: "More detailed explanations with examples." },
      { level: "Advanced", label: "Deep Dives", description: "Comprehensive explorations of complex concepts." }
    ],
    content: "Language matters. Understanding these terms helps you navigate your journey."
  },

  "glossary-full": {
    title: "Complete Glossary",
    subtitle: "Comprehensive term reference",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "The full, searchable glossary of all terms and concepts used on the platform.",
      why: "Complete reference ensures you can always find what you need.",
      who: "Anyone wanting comprehensive access to all term definitions.",
      when: "For thorough study or when the quick glossary isn't enough.",
      where: "Reference anytime during learning or practice.",
      how: "Search, browse, or use alphabetical navigation."
    },
    examples: [
      { level: "Beginner", label: "Alphabetical Browse", description: "Browse all terms organized A-Z." },
      { level: "Intermediate", label: "Category View", description: "Terms organized by topic area." },
      { level: "Advanced", label: "Connected Concepts", description: "See how terms relate to each other." }
    ],
    content: "Every term we use, defined and explained. Your complete reference."
  },

  "insight-cards": {
    title: "Insight Cards",
    subtitle: "Wisdom in bite-sized form",
    benefits: ["clarity", "calm", "connection", "selfRespect"],
    clarity: {
      what: "Short, shareable cards with insights, affirmations, and wisdom snippets.",
      why: "Sometimes you need just one thought to shift your perspective.",
      who: "Anyone wanting quick inspiration or something to share.",
      when: "Daily inspiration, quick pick-me-ups, or when you want to share with others.",
      where: "View on any device, save favorites, share if desired.",
      how: "Browse, save your favorites, share what resonates."
    },
    examples: [
      { level: "Beginner", label: "Daily Card", description: "One insight card each day for simple inspiration." },
      { level: "Intermediate", label: "Theme Collections", description: "Browse cards by theme: courage, compassion, boundaries, etc." },
      { level: "Advanced", label: "Create Your Own", description: "Design personal insight cards from your own wisdom." }
    ],
    content: "Big wisdom in small packages. Take what you need, share what helps."
  },

  news: {
    title: "Wellness News",
    subtitle: "Updates and announcements",
    benefits: ["clarity", "connection", "agency", "selfRespect"],
    clarity: {
      what: "Platform updates, new features, and relevant wellness news.",
      why: "Stay informed about new resources and developments.",
      who: "Anyone wanting to stay current with platform updates and wellness news.",
      when: "Periodically to see what's new.",
      where: "Browse at your convenience.",
      how: "Read what interests you. Note new features to try."
    },
    examples: [
      { level: "Beginner", label: "New Features", description: "Announcements about new tools and content." },
      { level: "Intermediate", label: "Wellness Updates", description: "Relevant news from the broader wellness field." },
      { level: "Advanced", label: "Research Highlights", description: "New research findings and their implications." }
    ],
    content: "Stay informed about what's new and what's coming next."
  },

  examples: {
    title: "Practice Examples",
    subtitle: "See how others practice",
    benefits: ["clarity", "connection", "agency", "selfRespect"],
    clarity: {
      what: "Real examples of how people use the tools and practices on this platform.",
      why: "Seeing examples inspires ideas and normalizes the learning process.",
      who: "Anyone wanting inspiration or guidance on how to use practices.",
      when: "When learning a new practice or seeking ideas.",
      where: "Browse anytime for inspiration.",
      how: "Read examples. Adapt ideas for your own practice. Share your own if inspired."
    },
    examples: [
      { level: "Beginner", label: "Simple Practices", description: "Examples of 5-minute practices anyone can try." },
      { level: "Intermediate", label: "Combined Approaches", description: "How people combine multiple tools effectively." },
      { level: "Advanced", label: "Long-Term Journeys", description: "Stories of sustained practice over months and years." }
    ],
    content: "Learn from others' experiences. Adapt ideas for your own unique journey."
  },

  social: {
    title: "Social Connection",
    subtitle: "Connect with our community",
    benefits: ["connection", "clarity", "agency", "selfRespect"],
    clarity: {
      what: "Links to our social media presence and community spaces.",
      why: "Connection beyond the platform for ongoing inspiration and community.",
      who: "Anyone wanting to connect with us on social platforms.",
      when: "When you want daily inspiration or community interaction.",
      where: "Follow us on your preferred social platforms.",
      how: "Follow, engage, share. Join the conversation."
    },
    examples: [
      { level: "Beginner", label: "Follow Along", description: "Follow us for daily wellness tips and inspiration." },
      { level: "Intermediate", label: "Engage & Share", description: "Comment, share what resonates, connect with others." },
      { level: "Advanced", label: "Community Contribution", description: "Share your journey to inspire others." }
    ],
    content: "Join our growing community across social platforms. We'd love to connect."
  },

  community: {
    title: "Community Hub",
    subtitle: "Growing together with others",
    benefits: ["connection", "selfRespect", "agency", "clarity"],
    clarity: {
      what: "Our community space for connection, support, and shared growth.",
      why: "Healing and growth are often more powerful in community than isolation.",
      who: "Anyone wanting to connect with others on similar journeys.",
      when: "When you want support, connection, or to offer support to others.",
      where: "Our dedicated community spaces.",
      how: "Join conversations. Share when ready. Offer support where you can."
    },
    examples: [
      { level: "Beginner", label: "Read & Listen", description: "Start by reading others' shares. No pressure to participate." },
      { level: "Intermediate", label: "Share & Connect", description: "Contribute your thoughts and connect with like-minded people." },
      { level: "Advanced", label: "Mentorship", description: "Offer guidance to those earlier in their journey." }
    ],
    content: "You're not alone. This community is here to support your journey."
  },

  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Answers to common questions",
    benefits: ["clarity", "agency", "calm", "selfRespect"],
    clarity: {
      what: "Answers to questions we hear most often about the platform and our approach.",
      why: "Clear answers reduce confusion and help you use the platform effectively.",
      who: "Anyone with questions about how things work here.",
      when: "When you have questions or need clarification.",
      where: "Reference anytime.",
      how: "Search or browse by category to find your answer."
    },
    examples: [
      { level: "Beginner", label: "Getting Started Questions", description: "Common questions for new users." },
      { level: "Intermediate", label: "Feature Questions", description: "How specific features and tools work." },
      { level: "Advanced", label: "Technical & Billing", description: "Account, subscription, and technical questions." }
    ],
    content: "Can't find your answer? Contact our support team—we're here to help."
  },

  resources: {
    title: "Additional Resources",
    subtitle: "Curated external resources",
    benefits: ["clarity", "connection", "agency", "selfRespect"],
    clarity: {
      what: "A curated list of external books, organizations, and resources we recommend.",
      why: "We can't cover everything. These trusted resources extend your learning.",
      who: "Anyone wanting to explore beyond what we offer directly.",
      when: "When seeking additional resources or different perspectives.",
      where: "Browse anytime for external resources.",
      how: "Explore what interests you. We've vetted these for quality and alignment."
    },
    examples: [
      { level: "Beginner", label: "Recommended Books", description: "Accessible books for starting your wellness journey." },
      { level: "Intermediate", label: "Organizations", description: "Trusted organizations for specific support needs." },
      { level: "Advanced", label: "Professional Resources", description: "Resources for those seeking deeper study or training." }
    ],
    content: "Your journey extends beyond this platform. These resources can help you go further."
  },

  support: {
    title: "Support Center",
    subtitle: "We're here to help",
    benefits: ["calm", "clarity", "agency", "connection"],
    clarity: {
      what: "Resources and contact options for getting help with the platform.",
      why: "Everyone needs help sometimes. We want to make getting support easy.",
      who: "Anyone needing assistance with the platform or their practice.",
      when: "Whenever you have questions or need help.",
      where: "Contact us through your preferred method.",
      how: "Browse FAQs first. If you need more help, reach out directly."
    },
    examples: [
      { level: "Beginner", label: "Quick Answers", description: "Browse common questions and answers." },
      { level: "Intermediate", label: "Email Support", description: "Send us a message and we'll respond within 24 hours." },
      { level: "Advanced", label: "Community Help", description: "Ask questions in our community forums." }
    ],
    content: "You're not bothering us by asking for help. We're here to support you."
  },

  "professional-resources": {
    title: "Professional Resources",
    subtitle: "For helping professionals",
    benefits: ["clarity", "agency", "connection", "selfRespect"],
    clarity: {
      what: "Resources for therapists, coaches, and other helping professionals.",
      why: "Professionals can recommend and integrate these tools with their clients.",
      who: "Mental health professionals, coaches, and wellness practitioners.",
      when: "For professional development or client resources.",
      where: "Professional-grade materials for your practice.",
      how: "Review resources. Integrate what fits your practice. Contact us for collaboration."
    },
    examples: [
      { level: "Beginner", label: "Client Handouts", description: "Printable resources to share with clients." },
      { level: "Intermediate", label: "Integration Guides", description: "How to incorporate these tools into your practice." },
      { level: "Advanced", label: "Training Materials", description: "Deeper training for professional use." }
    ],
    content: "We welcome collaboration with helping professionals. Reach out to discuss partnership."
  },

  qa: {
    title: "Q&A Sessions",
    subtitle: "Your questions answered",
    benefits: ["clarity", "connection", "agency", "selfRespect"],
    clarity: {
      what: "Recorded and live Q&A sessions addressing community questions.",
      why: "Your questions matter. Hearing others' questions often helps you too.",
      who: "Anyone with questions or wanting to learn from others' questions.",
      when: "Watch recordings anytime. Join live sessions as scheduled.",
      where: "Available on the platform.",
      how: "Watch recordings. Submit questions for future sessions. Join live when available."
    },
    examples: [
      { level: "Beginner", label: "Getting Started Q&A", description: "Common questions for those new to wellness practice." },
      { level: "Intermediate", label: "Topic Q&As", description: "Deep dives on specific topics based on community interest." },
      { level: "Advanced", label: "Submit Questions", description: "Contribute your questions for future sessions." }
    ],
    content: "No question is too simple. Asking is how we learn."
  }
});

// Legal and Settings pages
Object.assign(PAGE_METADATA, {
  terms: {
    title: "Terms of Service",
    subtitle: "Our agreement with you",
    benefits: ["clarity", "agency", "selfRespect", "calm"],
    clarity: {
      what: "The terms governing your use of this platform and our services.",
      why: "Clarity about expectations protects both you and us.",
      who: "All users should review these terms.",
      when: "Before using the platform and periodically when updated.",
      where: "Read at your convenience.",
      how: "Review the key sections. Contact us with questions."
    },
    examples: [
      { level: "Beginner", label: "Key Points Summary", description: "The most important terms in plain language." },
      { level: "Intermediate", label: "Full Terms", description: "Complete legal terms for thorough review." },
      { level: "Advanced", label: "Updates & Changes", description: "How and when terms may be updated." }
    ],
    content: "By using this platform, you agree to these terms. Please review them carefully."
  },

  privacy: {
    title: "Privacy Policy",
    subtitle: "How we protect your information",
    benefits: ["clarity", "agency", "selfRespect", "calm"],
    clarity: {
      what: "How we collect, use, store, and protect your personal information.",
      why: "Your privacy matters. Transparency builds trust.",
      who: "All users should understand how their data is handled.",
      when: "Review before sharing personal information.",
      where: "Read at your convenience.",
      how: "Review how we handle your data. Adjust settings as desired."
    },
    examples: [
      { level: "Beginner", label: "Privacy Summary", description: "Key privacy protections in simple terms." },
      { level: "Intermediate", label: "Data Practices", description: "Details on data collection and use." },
      { level: "Advanced", label: "Your Controls", description: "How to manage your privacy settings." }
    ],
    content: "Your data is yours. We're committed to protecting your privacy."
  },

  legal: {
    title: "Legal Information",
    subtitle: "Important legal notices",
    benefits: ["clarity", "agency", "selfRespect", "calm"],
    clarity: {
      what: "Legal notices, disclaimers, and important information about our services.",
      why: "Legal clarity protects everyone and sets appropriate expectations.",
      who: "All users should be aware of these notices.",
      when: "Review as needed for legal questions.",
      where: "Reference anytime.",
      how: "Review relevant sections. Contact us with questions."
    },
    examples: [
      { level: "Beginner", label: "Key Notices", description: "Most important legal information in plain language." },
      { level: "Intermediate", label: "Full Legal", description: "Complete legal notices and terms." },
      { level: "Advanced", label: "Contact Legal", description: "How to reach us for legal matters." }
    ],
    content: "This is educational wellness content, not medical or mental health treatment."
  },

  ethics: {
    title: "Our Ethics",
    subtitle: "Values that guide us",
    benefits: ["clarity", "connection", "selfRespect", "agency"],
    clarity: {
      what: "The ethical principles and values that guide everything we do.",
      why: "Transparency about our values helps you decide if we're right for you.",
      who: "Anyone wanting to understand what we stand for.",
      when: "When considering using our services or wanting to know more about us.",
      where: "Read at your convenience.",
      how: "Review our values. Hold us accountable to them."
    },
    examples: [
      { level: "Beginner", label: "Core Values", description: "Our fundamental ethical commitments." },
      { level: "Intermediate", label: "Principles in Practice", description: "How these values show up in our work." },
      { level: "Advanced", label: "Accountability", description: "How we hold ourselves accountable to these ethics." }
    ],
    content: "We believe in ethical practice. These values guide every decision we make."
  },

  disclaimer: {
    title: "Important Disclaimers",
    subtitle: "Please read carefully",
    benefits: ["clarity", "agency", "calm", "selfRespect"],
    clarity: {
      what: "Important disclaimers about the nature and limitations of our services.",
      why: "Clear expectations prevent misunderstanding and ensure appropriate use.",
      who: "All users must understand these disclaimers.",
      when: "Before and during use of the platform.",
      where: "Review and reference as needed.",
      how: "Read carefully. Use services appropriately. Seek professional help when needed."
    },
    examples: [
      { level: "Beginner", label: "Key Points", description: "Most important things to understand about our services." },
      { level: "Intermediate", label: "Full Disclaimers", description: "Complete disclaimer information." },
      { level: "Advanced", label: "When to Seek Help", description: "When professional support is recommended." }
    ],
    content: "This platform provides educational wellness tools for adults 18+, not medical care or mental health treatment."
  },

  settings: {
    title: "Settings",
    subtitle: "Customize your experience",
    benefits: ["agency", "clarity", "selfRespect", "calm"],
    clarity: {
      what: "Controls to customize how you use the platform.",
      why: "Your experience should work for you. Customization enables that.",
      who: "All users can personalize their experience here.",
      when: "When you want to adjust your experience.",
      where: "Access anytime from your account.",
      how: "Review options. Adjust as desired. Changes save automatically."
    },
    examples: [
      { level: "Beginner", label: "Display Settings", description: "Theme, text size, and visual preferences." },
      { level: "Intermediate", label: "Privacy Controls", description: "Manage what data is collected and how it's used." },
      { level: "Advanced", label: "Advanced Options", description: "Full customization for power users." }
    ],
    content: "Make this platform work for you. Adjust settings to match your needs."
  },

  premium: {
    title: "Premium Features",
    subtitle: "Unlock your full potential",
    benefits: ["agency", "clarity", "connection", "selfRespect"],
    clarity: {
      what: "An overview of premium features available with a subscription.",
      why: "Premium features enable deeper practice and more personalized support.",
      who: "Anyone ready to invest more deeply in their wellness journey.",
      when: "When you're ready for more than the free tier offers.",
      where: "Learn about and subscribe to premium features.",
      how: "Review features. Choose a plan that fits. Upgrade when ready."
    },
    examples: [
      { level: "Beginner", label: "Feature Overview", description: "What's included in premium subscriptions." },
      { level: "Intermediate", label: "Plan Comparison", description: "Compare different subscription options." },
      { level: "Advanced", label: "Enterprise Options", description: "Options for teams and organizations." }
    ],
    content: "Premium is optional. The free tier offers real value. Upgrade only when it makes sense for you."
  },

  upgrade: {
    title: "Upgrade Your Plan",
    subtitle: "Access more features",
    benefits: ["agency", "clarity", "selfRespect", "connection"],
    clarity: {
      what: "Options to upgrade your subscription for additional features.",
      why: "Upgrading unlocks more tools and personalized support.",
      who: "Free users ready for more, or existing subscribers wanting to upgrade.",
      when: "When you're ready for more features and willing to invest.",
      where: "Complete your upgrade here.",
      how: "Choose your plan. Complete payment. Access new features immediately."
    },
    examples: [
      { level: "Beginner", label: "Choose Your Plan", description: "Compare plans and select what fits your needs." },
      { level: "Intermediate", label: "Secure Checkout", description: "Complete your subscription securely." },
      { level: "Advanced", label: "Manage Subscription", description: "Change, pause, or cancel your subscription anytime." }
    ],
    content: "There's no pressure to upgrade. Only do so if premium features genuinely serve your journey."
  },

  "account-profile": {
    title: "Your Profile",
    subtitle: "Manage your account information",
    benefits: ["agency", "clarity", "selfRespect", "calm"],
    clarity: {
      what: "Your account information and profile settings.",
      why: "Keep your information current and manage your account.",
      who: "Logged-in users managing their account.",
      when: "When you need to update information or check your profile.",
      where: "Access from your account area.",
      how: "Review information. Update as needed. Changes save automatically."
    },
    examples: [
      { level: "Beginner", label: "View Profile", description: "See your current profile information." },
      { level: "Intermediate", label: "Update Information", description: "Change your name, email, or other details." },
      { level: "Advanced", label: "Data Export", description: "Download your data or request account deletion." }
    ],
    content: "Your account, your control. Update your information anytime."
  },

  "account-billing": {
    title: "Billing & Subscription",
    subtitle: "Manage your payment details",
    benefits: ["clarity", "agency", "calm", "selfRespect"],
    clarity: {
      what: "Your subscription status, payment methods, and billing history.",
      why: "Transparency about billing and easy management of your subscription.",
      who: "Subscribers managing their billing information.",
      when: "When you need to update payment info or check billing.",
      where: "Access from your account area.",
      how: "Review status. Update payment methods. Download invoices if needed."
    },
    examples: [
      { level: "Beginner", label: "Current Plan", description: "See your subscription status and renewal date." },
      { level: "Intermediate", label: "Payment Methods", description: "Update or change your payment information." },
      { level: "Advanced", label: "Billing History", description: "View past invoices and payment history." }
    ],
    content: "Manage your subscription with full transparency. Cancel anytime."
  },

  "account-settings": {
    title: "Account Settings",
    subtitle: "Security and preferences",
    benefits: ["agency", "clarity", "selfRespect", "calm"],
    clarity: {
      what: "Security settings, notifications, and account preferences.",
      why: "Control your account security and how you receive updates.",
      who: "All users managing their account settings.",
      when: "When adjusting security or notification preferences.",
      where: "Access from your account area.",
      how: "Review settings. Adjust as needed. Enable security features."
    },
    examples: [
      { level: "Beginner", label: "Security Basics", description: "Password, email verification, and login activity." },
      { level: "Intermediate", label: "Notifications", description: "Control what notifications you receive and how." },
      { level: "Advanced", label: "Advanced Security", description: "Two-factor authentication and security audit." }
    ],
    content: "Your security matters. Review and update these settings regularly."
  }
});

// Admin and Design pages
Object.assign(PAGE_METADATA, {
  admin: {
    title: "Admin Dashboard",
    subtitle: "Platform management",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Administrative controls for managing the platform.",
      why: "Centralized management enables effective platform operation.",
      who: "Authorized administrators only.",
      when: "For platform management tasks.",
      where: "Secure admin area.",
      how: "Access with admin credentials. Manage users, content, and settings."
    },
    examples: [
      { level: "Beginner", label: "Quick Stats", description: "Overview of key platform metrics." },
      { level: "Intermediate", label: "User Management", description: "Manage user accounts and permissions." },
      { level: "Advanced", label: "System Config", description: "Advanced platform configuration options." }
    ],
    content: "Administrative access for authorized personnel only."
  },

  "content-admin": {
    title: "Content Administration",
    subtitle: "Manage platform content",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Tools for managing all content on the platform.",
      why: "Centralized content management ensures quality and consistency.",
      who: "Content administrators and editors.",
      when: "When creating, editing, or managing content.",
      where: "Admin content area.",
      how: "Create, edit, publish, and manage all platform content."
    },
    examples: [
      { level: "Beginner", label: "Content Overview", description: "See all content at a glance." },
      { level: "Intermediate", label: "Edit & Publish", description: "Create and publish new content." },
      { level: "Advanced", label: "Content Strategy", description: "Plan and schedule content releases." }
    ],
    content: "Content administration for authorized editors."
  },

  control: {
    title: "Control Panel",
    subtitle: "System controls",
    benefits: ["clarity", "agency", "selfRespect", "calm"],
    clarity: {
      what: "System-level controls for platform operation.",
      why: "Centralized controls enable efficient system management.",
      who: "System administrators only.",
      when: "For system-level management tasks.",
      where: "Secure control panel.",
      how: "Access with appropriate credentials. Manage system settings."
    },
    examples: [
      { level: "Beginner", label: "System Status", description: "Current system health and status." },
      { level: "Intermediate", label: "Configuration", description: "Adjust system configuration settings." },
      { level: "Advanced", label: "Maintenance", description: "System maintenance and optimization tools." }
    ],
    content: "System administration for authorized personnel."
  },

  health: {
    title: "System Health",
    subtitle: "Platform status and monitoring",
    benefits: ["clarity", "calm", "agency", "selfRespect"],
    clarity: {
      what: "Real-time monitoring of platform health and performance.",
      why: "Monitoring ensures reliable service and quick issue resolution.",
      who: "System administrators and support staff.",
      when: "For ongoing monitoring and troubleshooting.",
      where: "Health monitoring dashboard.",
      how: "Review metrics. Respond to alerts. Maintain system health."
    },
    examples: [
      { level: "Beginner", label: "Status Overview", description: "Quick view of overall system health." },
      { level: "Intermediate", label: "Performance Metrics", description: "Detailed performance data and trends." },
      { level: "Advanced", label: "Diagnostics", description: "Deep diagnostic tools for troubleshooting." }
    ],
    content: "System health monitoring for operational excellence."
  },

  publishing: {
    title: "Publishing Tools",
    subtitle: "Content publication management",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Tools for scheduling, publishing, and managing content release.",
      why: "Organized publishing ensures consistent, timely content delivery.",
      who: "Content managers and publishers.",
      when: "When preparing content for publication.",
      where: "Publishing management area.",
      how: "Schedule, review, publish, and track content releases."
    },
    examples: [
      { level: "Beginner", label: "Publish Now", description: "Quick publishing for immediate content release." },
      { level: "Intermediate", label: "Schedule Content", description: "Set future publication dates and times." },
      { level: "Advanced", label: "Publication Strategy", description: "Plan content calendars and campaigns." }
    ],
    content: "Publication management for content teams."
  },

  "design-system": {
    title: "Design System",
    subtitle: "Visual design reference",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Our design system: colors, typography, components, and patterns.",
      why: "Consistent design creates a cohesive, trustworthy experience.",
      who: "Designers, developers, and content creators.",
      when: "When creating or updating visual elements.",
      where: "Design system documentation.",
      how: "Reference guidelines. Use provided components. Maintain consistency."
    },
    examples: [
      { level: "Beginner", label: "Color Palette", description: "Our brand colors and how to use them." },
      { level: "Intermediate", label: "Components", description: "Standard UI components and patterns." },
      { level: "Advanced", label: "Design Tokens", description: "Technical design specifications." }
    ],
    content: "Design consistency creates trust. Reference this system for all visual work."
  },

  wireframes: {
    title: "Wireframes",
    subtitle: "Page structure templates",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Structural wireframes for key page types and layouts.",
      why: "Wireframes ensure consistent structure and information architecture.",
      who: "Designers and developers building new pages.",
      when: "When planning or building new pages.",
      where: "Wireframe documentation.",
      how: "Reference wireframes. Adapt for specific content. Maintain structural consistency."
    },
    examples: [
      { level: "Beginner", label: "Page Templates", description: "Standard templates for common page types." },
      { level: "Intermediate", label: "Layout Patterns", description: "Reusable layout patterns and grids." },
      { level: "Advanced", label: "Interaction Flows", description: "Wireframes showing user interaction paths." }
    ],
    content: "Wireframes guide structure. Adapt them for your specific content needs."
  },

  "design-dashboard": {
    title: "Design Dashboard",
    subtitle: "Design team workspace",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "Workspace for the design team to manage design assets and projects.",
      why: "Centralized design management enables efficient collaboration.",
      who: "Design team members.",
      when: "For design work and asset management.",
      where: "Design team workspace.",
      how: "Manage assets. Track projects. Collaborate on design work."
    },
    examples: [
      { level: "Beginner", label: "Asset Library", description: "Browse and access design assets." },
      { level: "Intermediate", label: "Project Tracking", description: "Track design projects and tasks." },
      { level: "Advanced", label: "Version Control", description: "Manage design versions and history." }
    ],
    content: "Design team workspace for collaborative design work."
  },

  safety: {
    title: "Safety Information",
    subtitle: "Important safety resources",
    benefits: ["calm", "clarity", "connection", "agency"],
    clarity: {
      what: "Safety guidelines, crisis resources, and important support information.",
      why: "Your safety is paramount. These resources are here when you need them.",
      who: "Anyone needing safety information or crisis support.",
      when: "Whenever you need safety resources or are concerned about someone.",
      where: "Access anytime from any page.",
      how: "Review safety guidelines. Access crisis resources. Reach out for help."
    },
    examples: [
      { level: "Beginner", label: "Crisis Hotlines", description: "Immediate help for those in crisis." },
      { level: "Intermediate", label: "Safety Planning", description: "Create a personal safety plan." },
      { level: "Advanced", label: "Supporting Others", description: "How to help someone who may be struggling." }
    ],
    content: "Your safety matters. If you're in crisis, please reach out to these resources immediately."
  }
});

// Special pages - Wellness domains
Object.assign(PAGE_METADATA, {
  "wellness-sleep": {
    title: "Sleep Wellness",
    subtitle: "Restoring through quality rest",
    benefits: ["calm", "clarity", "selfRespect", "agency"],
    clarity: {
      what: "Comprehensive resources for improving sleep quality and establishing healthy sleep patterns.",
      why: "Sleep is foundational to mental and physical health. Better sleep improves everything else.",
      who: "Anyone struggling with sleep or wanting to optimize their rest.",
      when: "Review during the day. Practice evening routines before bed.",
      where: "Your bedroom and evening environment.",
      how: "Start with sleep hygiene basics. Build consistent routines. Track what works."
    },
    examples: [
      { level: "Beginner", label: "Sleep Hygiene", description: "Basic practices for better sleep: consistent times, dark room, no screens." },
      { level: "Intermediate", label: "Wind-Down Routine", description: "Create a 30-minute pre-sleep ritual to signal rest time." },
      { level: "Advanced", label: "Sleep Optimization", description: "Track and optimize all factors affecting your sleep quality." }
    ],
    content: "Sleep is when your body and mind heal. Prioritizing rest is an act of self-care."
  },

  "wellness-nutrition": {
    title: "Nutrition Wellness",
    subtitle: "Nourishing body and mind",
    benefits: ["clarity", "calm", "selfRespect", "agency"],
    clarity: {
      what: "Resources for understanding how nutrition affects mental wellness and energy.",
      why: "What we eat directly affects how we feel, think, and cope with stress.",
      who: "Anyone wanting to understand the food-mood connection.",
      when: "When planning meals or noticing food-mood patterns.",
      where: "In your kitchen and daily food choices.",
      how: "Notice how different foods affect you. Make small, sustainable changes."
    },
    examples: [
      { level: "Beginner", label: "Food-Mood Basics", description: "Understanding how nutrition affects mental state." },
      { level: "Intermediate", label: "Energy Eating", description: "Foods that support stable energy and mood throughout the day." },
      { level: "Advanced", label: "Mindful Eating", description: "Develop a healthy, intuitive relationship with food." }
    ],
    content: "Nourishment is more than calories. Discover how food supports your wellbeing."
  },

  "wellness-movement": {
    title: "Movement Wellness",
    subtitle: "Moving for mental health",
    benefits: ["calm", "clarity", "agency", "connection"],
    clarity: {
      what: "Resources for using movement and exercise to support mental wellness.",
      why: "Movement is one of the most effective natural mood regulators available.",
      who: "Anyone wanting to use physical activity for mental health benefits.",
      when: "Daily for best results. Even short bursts of movement help.",
      where: "Anywhere you can move—home, outdoors, gym, or office.",
      how: "Start where you are. Any movement counts. Find what you enjoy."
    },
    examples: [
      { level: "Beginner", label: "Gentle Movement", description: "Low-intensity options like walking, stretching, or gentle yoga." },
      { level: "Intermediate", label: "Mood-Boosting Exercise", description: "Activities specifically designed to lift mood and reduce anxiety." },
      { level: "Advanced", label: "Movement Practice", description: "Develop a sustainable movement practice that supports long-term wellness." }
    ],
    content: "Your body was made to move. Find movement that feels good, not punishing."
  },

  "wellness-nature": {
    title: "Nature Wellness",
    subtitle: "Healing through the natural world",
    benefits: ["calm", "connection", "clarity", "selfRespect"],
    clarity: {
      what: "Resources for connecting with nature as a wellness practice.",
      why: "Time in nature reduces stress, improves mood, and restores mental clarity.",
      who: "Anyone seeking the healing benefits of the natural world.",
      when: "Daily if possible. Even brief nature exposure helps.",
      where: "Outdoors—parks, gardens, forests, water, or even houseplants.",
      how: "Get outside. Engage your senses. Let nature do the work."
    },
    examples: [
      { level: "Beginner", label: "Nature Breaks", description: "Short outdoor breaks during your day for stress relief." },
      { level: "Intermediate", label: "Forest Bathing", description: "Slow, sensory immersion in natural environments." },
      { level: "Advanced", label: "Nature Connection", description: "Develop a deep, ongoing relationship with the natural world." }
    ],
    content: "Nature heals. Even a few minutes outside can shift your nervous system toward calm."
  },

  "wellness-creativity": {
    title: "Creative Wellness",
    subtitle: "Healing through creative expression",
    benefits: ["agency", "connection", "clarity", "selfRespect"],
    clarity: {
      what: "Resources for using creative expression as a wellness and healing practice.",
      why: "Creativity accesses parts of us that words alone can't reach. It's a form of processing.",
      who: "Anyone wanting to explore creative expression for wellbeing. No skill required.",
      when: "When you need to process emotions, explore feelings, or just play.",
      where: "Anywhere you can create—home, outdoors, or community spaces.",
      how: "Choose a medium. Let go of outcome. Focus on the process, not the product."
    },
    examples: [
      { level: "Beginner", label: "Creative Play", description: "Simple, pressure-free creative activities like doodling or collage." },
      { level: "Intermediate", label: "Expressive Arts", description: "Use art, music, or writing to process emotions and experiences." },
      { level: "Advanced", label: "Creative Practice", description: "Establish an ongoing creative practice as part of your wellness routine." }
    ],
    content: "Creativity isn't about being good at art. It's about expression, play, and discovery."
  },

  "ai-insights": {
    title: "AI Insights",
    subtitle: "Personalized wisdom from your data",
    benefits: ["clarity", "agency", "selfRespect", "connection"],
    clarity: {
      what: "AI-generated insights based on your patterns, practices, and progress.",
      why: "Pattern recognition can reveal insights you might miss on your own.",
      who: "Users with enough data for meaningful analysis.",
      when: "Review periodically to discover patterns and insights.",
      where: "Access from your dashboard.",
      how: "Review insights. Reflect on what resonates. Apply what's helpful."
    },
    examples: [
      { level: "Beginner", label: "Pattern Highlights", description: "Simple observations about your wellness patterns." },
      { level: "Intermediate", label: "Trend Analysis", description: "How your patterns have changed over time." },
      { level: "Advanced", label: "Predictive Insights", description: "Suggestions based on what's worked for you." }
    ],
    content: "AI helps surface patterns. You decide what the insights mean for your life."
  },

  "ai-coach": {
    title: "AI Wellness Coach",
    subtitle: "Personalized guidance and support",
    benefits: ["connection", "clarity", "agency", "calm"],
    clarity: {
      what: "An AI coaching companion offering personalized guidance and encouragement.",
      why: "Having a supportive presence available anytime can help you stay on track.",
      who: "Anyone wanting additional support and guidance in their wellness journey.",
      when: "Daily check-ins, when facing challenges, or when you need encouragement.",
      where: "Available whenever you need support.",
      how: "Share what's happening. Receive personalized guidance. Apply what helps."
    },
    examples: [
      { level: "Beginner", label: "Daily Check-In", description: "Brief daily conversations about how you're doing." },
      { level: "Intermediate", label: "Goal Support", description: "Guidance and accountability for your wellness goals." },
      { level: "Advanced", label: "Deep Reflection", description: "Extended conversations for processing challenges." }
    ],
    content: "Your AI coach is here to support, not replace, human connection and professional help."
  },

  "ai-meditation": {
    title: "AI-Guided Meditation",
    subtitle: "Personalized meditation experiences",
    benefits: ["calm", "clarity", "connection", "agency"],
    clarity: {
      what: "AI-customized meditation sessions based on your current needs and preferences.",
      why: "Personalized meditation can be more effective than generic sessions.",
      who: "Anyone wanting meditation tailored to their current state and goals.",
      when: "Whenever you need a meditation practice suited to the moment.",
      where: "A quiet space for meditation practice.",
      how: "Share how you're feeling. Receive a customized meditation. Practice and reflect."
    },
    examples: [
      { level: "Beginner", label: "State-Based Sessions", description: "Meditations customized to your current emotional state." },
      { level: "Intermediate", label: "Goal-Oriented Practice", description: "Sessions designed for specific outcomes like sleep or focus." },
      { level: "Advanced", label: "Deep Practice", description: "Extended, highly personalized meditation experiences." }
    ],
    content: "Meditation meets you where you are. These personalized sessions adapt to your needs."
  },

  "community-events": {
    title: "Community Events",
    subtitle: "Gather and grow together",
    benefits: ["connection", "agency", "clarity", "selfRespect"],
    clarity: {
      what: "Live and virtual events for community connection and shared practice.",
      why: "Coming together amplifies growth and creates meaningful connection.",
      who: "Community members wanting to connect with others.",
      when: "Check the schedule for upcoming events.",
      where: "Virtual events online, local events in various locations.",
      how: "Browse events. Register for what interests you. Show up and participate."
    },
    examples: [
      { level: "Beginner", label: "Open Sessions", description: "Beginner-friendly events for newcomers." },
      { level: "Intermediate", label: "Practice Groups", description: "Regular groups for shared practice." },
      { level: "Advanced", label: "Deep Dives", description: "Intensive events for committed practitioners." }
    ],
    content: "Community connection supports your journey. Join us when you're ready."
  },

  "community-stories": {
    title: "Community Stories",
    subtitle: "Journeys of healing and growth",
    benefits: ["connection", "clarity", "selfRespect", "agency"],
    clarity: {
      what: "Stories from community members sharing their wellness journeys.",
      why: "Hearing others' stories normalizes struggle and inspires possibility.",
      who: "Anyone seeking inspiration or feeling alone in their journey.",
      when: "When you need encouragement or want to feel less alone.",
      where: "Read at your own pace.",
      how: "Read stories that resonate. Share your own when ready."
    },
    examples: [
      { level: "Beginner", label: "Getting Started Stories", description: "How others began their wellness journey." },
      { level: "Intermediate", label: "Overcoming Challenges", description: "Stories of working through difficult times." },
      { level: "Advanced", label: "Transformation Stories", description: "Long-term journeys of profound change." }
    ],
    content: "Everyone's journey is unique. These stories remind us we're not alone."
  },

  "community-mentors": {
    title: "Community Mentors",
    subtitle: "Learn from those ahead on the path",
    benefits: ["connection", "clarity", "agency", "selfRespect"],
    clarity: {
      what: "Connect with experienced community members who offer guidance and support.",
      why: "Learning from those further along can accelerate growth and prevent missteps.",
      who: "Anyone wanting guidance from more experienced practitioners.",
      when: "When you're ready for mentorship or have questions for experienced members.",
      where: "Mentor connections happen in the community.",
      how: "Browse mentor profiles. Request a connection. Learn from their experience."
    },
    examples: [
      { level: "Beginner", label: "Find a Mentor", description: "Connect with someone who can guide your early journey." },
      { level: "Intermediate", label: "Mentorship Sessions", description: "Scheduled conversations with your mentor." },
      { level: "Advanced", label: "Become a Mentor", description: "Share your experience to help others." }
    ],
    content: "Mentorship accelerates growth. Connect with those who've walked the path before you."
  },

  "community-challenges": {
    title: "Community Challenges",
    subtitle: "Grow together through shared practice",
    benefits: ["connection", "agency", "selfRespect", "clarity"],
    clarity: {
      what: "Time-limited challenges where the community practices together.",
      why: "Shared challenges create accountability, connection, and collective energy.",
      who: "Anyone wanting to practice alongside others for motivation.",
      when: "Join challenges as they're offered throughout the year.",
      where: "Participate wherever you are, connected with the community.",
      how: "Join a challenge. Complete daily practices. Share your experience."
    },
    examples: [
      { level: "Beginner", label: "7-Day Challenges", description: "Short, accessible challenges perfect for starting." },
      { level: "Intermediate", label: "21-Day Challenges", description: "Longer challenges for building habits." },
      { level: "Advanced", label: "90-Day Journeys", description: "Intensive transformation challenges." }
    ],
    content: "Challenge yourself alongside others. Community makes the journey easier."
  },

  "support-guides": {
    title: "Support Guides",
    subtitle: "Help when you need it",
    benefits: ["clarity", "calm", "agency", "connection"],
    clarity: {
      what: "Detailed guides for getting help with common questions and issues.",
      why: "Clear guidance makes getting help easier and faster.",
      who: "Anyone needing help with the platform or their practice.",
      when: "Whenever you have questions or need assistance.",
      where: "Browse guides or search for specific topics.",
      how: "Find your topic. Follow the guide. Reach out if you need more help."
    },
    examples: [
      { level: "Beginner", label: "Getting Started", description: "Guides for new users learning the platform." },
      { level: "Intermediate", label: "Feature Guides", description: "Detailed explanations of specific features." },
      { level: "Advanced", label: "Troubleshooting", description: "Solutions for common technical issues." }
    ],
    content: "Clear instructions make getting help easier. Start here for common questions."
  },

  "support-feedback": {
    title: "Share Feedback",
    subtitle: "Help us improve",
    benefits: ["agency", "connection", "clarity", "selfRespect"],
    clarity: {
      what: "A channel for sharing your feedback, suggestions, and ideas.",
      why: "Your feedback shapes how we improve. We genuinely want to hear from you.",
      who: "Anyone with thoughts on how we can do better.",
      when: "Whenever you have feedback—positive or constructive.",
      where: "Submit feedback through this page.",
      how: "Share your thoughts. We read everything. We respond when possible."
    },
    examples: [
      { level: "Beginner", label: "Quick Feedback", description: "Share a quick thought or reaction." },
      { level: "Intermediate", label: "Feature Suggestions", description: "Suggest new features or improvements." },
      { level: "Advanced", label: "Detailed Input", description: "Provide comprehensive feedback on your experience." }
    ],
    content: "We're always improving. Your feedback helps us serve you better."
  },

  "support-accessibility": {
    title: "Accessibility",
    subtitle: "Making wellness available to everyone",
    benefits: ["agency", "clarity", "selfRespect", "connection"],
    clarity: {
      what: "Information about our accessibility features and commitment.",
      why: "Wellness should be accessible to everyone, regardless of ability.",
      who: "Anyone needing accessibility accommodations or information.",
      when: "When you need accessibility support or want to learn about our practices.",
      where: "Accessibility resources and settings.",
      how: "Review available accommodations. Adjust settings. Request additional support."
    },
    examples: [
      { level: "Beginner", label: "Accessibility Settings", description: "Adjust the platform for your needs." },
      { level: "Intermediate", label: "Assistive Technology", description: "How to use assistive technology with our platform." },
      { level: "Advanced", label: "Request Accommodations", description: "Contact us for specific accessibility needs." }
    ],
    content: "Everyone deserves access to wellness support. We're committed to accessibility."
  }
});

// Generate page content from metadata
function generatePageContent(routeName, meta) {
  const componentName = routeName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '') + 'Page';

  const benefitsString = meta.benefits.map(b => `"${b}"`).join(', ');
  
  const claritySpec = `{
    what: "${meta.clarity.what.replace(/"/g, '\\"')}",
    why: "${meta.clarity.why.replace(/"/g, '\\"')}",
    who: "${meta.clarity.who.replace(/"/g, '\\"')}",
    when: "${meta.clarity.when.replace(/"/g, '\\"')}",
    where: "${meta.clarity.where.replace(/"/g, '\\"')}",
    how: "${meta.clarity.how.replace(/"/g, '\\"')}"
  }`;

  const examplesSpec = meta.examples.map(ex => 
    `{ level: "${ex.level}", label: "${ex.label.replace(/"/g, '\\"')}", description: "${ex.description.replace(/"/g, '\\"')}" }`
  ).join(',\n    ');

  return `// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ${componentName}() {
  const benefits = pickBenefits([${benefitsString}], 4);
  
  const clarity = ${claritySpec};

  const examples = [
    ${examplesSpec}
  ];

  return (
    <>
      <SEO
        title="${meta.title.replace(/"/g, '\\"')} | The Genuine Love Project"
        description="${meta.subtitle.replace(/"/g, '\\"')} - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="${meta.title.replace(/"/g, '\\"')}"
        subtitle="${meta.subtitle.replace(/"/g, '\\"')}"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            ${meta.content.replace(/"/g, '\\"')}
          </p>
          <p className="text-sm opacity-70 mt-6">
            Adults 18+ only. Educational wellness tools, not medical care or mental health treatment.
            You may pause or stop at any time.
          </p>
        </div>
      </WellnessPageShell>
    </>
  );
}
`;
}

// Generate "Coming Soon" page for routes without metadata
function generateComingSoonPage(routeName) {
  const componentName = routeName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '') + 'Page';

  const title = routeName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ${componentName}() {
  const benefits = pickBenefits(["calm", "clarity", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "This feature is coming soon. We're working on creating valuable content for you.",
    why: "Quality takes time. We want to ensure everything we offer is helpful and well-crafted.",
    who: "Everyone interested in this topic will benefit when it launches.",
    when: "Check back soon. We're actively developing this feature.",
    where: "This will be available right here when it's ready.",
    how: "Sign up for updates to be notified when this feature launches."
  };

  const examples = [
    { level: "Beginner", label: "Coming Soon", description: "Beginner-friendly content will be available when this feature launches." },
    { level: "Intermediate", label: "Coming Soon", description: "Intermediate content will be available when this feature launches." },
    { level: "Advanced", label: "Coming Soon", description: "Advanced content will be available when this feature launches." }
  ];

  return (
    <>
      <SEO
        title="${title} | The Genuine Love Project"
        description="${title} - Coming soon. Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="${title}"
        subtitle="Coming Soon"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            This feature is currently in development. We're creating thoughtful, 
            evidence-based content to support your wellness journey. Check back soon!
          </p>
          <p className="text-sm opacity-70 mt-6">
            Adults 18+ only. Educational wellness tools, not medical care or mental health treatment.
            You may pause or stop at any time.
          </p>
        </div>
      </WellnessPageShell>
    </>
  );
}
`;
}

// Skip these files - they're special cases
const SKIP_FILES = [
  '404.jsx',
  'not-found.jsx',
  'home.jsx',
  'welcome.jsx',
  'blog-slug.jsx',
  'blog-[param].jsx',
  'community-discussion-id.jsx',
  'community-discussion-[param].jsx',
  'healing-test.jsx',
  'index.jsx', // Main index file
  'landing.jsx', // Marketing page
  'original-home.jsx', // Legacy
  'healing.jsx', // Core healing page
  'pricing.jsx', // Sales page
  'login.jsx',
  'login-callback.jsx',
  'register.jsx',
  'forgot-password.jsx',
  'reset-password.jsx',
  'onboarding.jsx',
  'dashboard.jsx',
  'crm.jsx',
  'chat.jsx', // AI chat interface
  'about.jsx',
  'features.jsx',
  'testimonials.jsx',
  'canva-landing.jsx',
  'challenge.jsx',
  'challenge-day.jsx',
  'ai-chat.jsx',
  'signup.jsx',
  'sign-up.jsx',
  'signin.jsx',
  'sign-in.jsx',
];

// Main execution
async function main() {
  const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'));
  
  let patched = 0;
  let skipped = 0;
  let comingSoon = 0;
  const errors = [];

  for (const file of files) {
    if (SKIP_FILES.includes(file)) {
      skipped++;
      console.log(`SKIP: ${file} (special case)`);
      continue;
    }

    const filePath = path.join(GENERATED_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if file uses ConfigRoute (needs patching)
    if (!content.includes('ConfigRoute')) {
      skipped++;
      console.log(`SKIP: ${file} (no ConfigRoute)`);
      continue;
    }

    // Get route name from filename
    const routeName = file.replace(/\.jsx$/, '').replace(/\.tsx$/, '');
    
    try {
      let newContent;
      if (PAGE_METADATA[routeName]) {
        newContent = generatePageContent(routeName, PAGE_METADATA[routeName]);
        patched++;
        console.log(`PATCH: ${file}`);
      } else {
        newContent = generateComingSoonPage(routeName);
        comingSoon++;
        console.log(`COMING SOON: ${file}`);
      }
      
      fs.writeFileSync(filePath, newContent, 'utf-8');
    } catch (err) {
      errors.push({ file, error: err.message });
      console.error(`ERROR: ${file} - ${err.message}`);
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Patched: ${patched}`);
  console.log(`Coming Soon: ${comingSoon}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(e => console.log(`  ${e.file}: ${e.error}`));
  }
}

main().catch(console.error);
