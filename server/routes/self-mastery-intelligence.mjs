import { Router } from "express";

const router = Router();

// ===== DISCIPLINE SYSTEMS =====
router.get("/discipline", (req, res) => {
  res.json({
    success: true,
    data: {
      coreDisciplines: [
        {
          id: "self-control",
          name: "Self-Control Mastery",
          description: "The ability to regulate impulses, emotions, and behaviors",
          pillars: ["Delayed gratification", "Impulse regulation", "Emotional discipline", "Behavioral consistency"],
          dailyPractice: "Identify one area where you typically give in to impulse. Practice the 10-minute rule: wait 10 minutes before acting on any urge.",
          stages: [
            { level: 1, name: "Awareness", description: "Recognize impulses before acting" },
            { level: 2, name: "Pause", description: "Create space between stimulus and response" },
            { level: 3, name: "Choice", description: "Consciously choose aligned action" },
            { level: 4, name: "Mastery", description: "Automatic alignment with values" }
          ]
        },
        {
          id: "focus-mastery",
          name: "Deep Focus Cultivation",
          description: "Training sustained attention in a distracted world",
          pillars: ["Single-tasking", "Attention training", "Distraction elimination", "Flow cultivation"],
          dailyPractice: "Practice 25 minutes of completely undistracted work. No phone, no notifications, no multitasking.",
          techniques: [
            { name: "Pomodoro Method", duration: "25 min work, 5 min rest", focus: "Time-boxing attention" },
            { name: "Deep Work Blocks", duration: "90-120 min sessions", focus: "Extended concentration" },
            { name: "Attention Residue Clearing", duration: "2 min transitions", focus: "Complete previous task mentally" }
          ]
        },
        {
          id: "habit-architecture",
          name: "Habit Architecture",
          description: "Designing automatic behaviors that serve your highest self",
          pillars: ["Cue design", "Routine optimization", "Reward engineering", "Identity alignment"],
          dailyPractice: "Stack one new positive habit onto an existing habit. 'After I [existing habit], I will [new habit].'",
          framework: {
            name: "Atomic Habits Integration",
            steps: [
              "Make it obvious (cue design)",
              "Make it attractive (craving creation)",
              "Make it easy (response simplification)",
              "Make it satisfying (reward design)"
            ]
          }
        }
      ],
      weeklyChallenge: {
        name: "The Discipline Sprint",
        duration: "7 days",
        rules: [
          "Wake at the same time every day",
          "No social media until noon",
          "Complete your hardest task first",
          "End each day with a 5-minute reflection",
          "Say 'no' to one request that doesn't align with your goals"
        ]
      }
    }
  });
});

// ===== EMOTIONAL INTELLIGENCE MASTERY =====
router.get("/emotional-intelligence", (req, res) => {
  res.json({
    success: true,
    data: {
      eqDomains: [
        {
          id: "self-awareness",
          name: "Self-Awareness",
          description: "Recognizing your emotions and their impact",
          competencies: [
            { name: "Emotional Self-Awareness", practice: "Name the emotion you're feeling right now and locate it in your body" },
            { name: "Accurate Self-Assessment", practice: "Identify one strength and one growth edge without judgment" },
            { name: "Self-Confidence", practice: "Recall a moment when you acted from your values despite fear" }
          ],
          dailyCheck: "What am I feeling right now? What triggered this? What does this emotion need?"
        },
        {
          id: "self-management",
          name: "Self-Management",
          description: "Managing your emotions and impulses effectively",
          competencies: [
            { name: "Emotional Self-Control", practice: "STOP technique: Stop, Take a breath, Observe, Proceed mindfully" },
            { name: "Transparency", practice: "Share an authentic feeling with someone you trust today" },
            { name: "Adaptability", practice: "When plans change, pause and ask 'What opportunity does this create?'" },
            { name: "Achievement Drive", practice: "Set one small, meaningful goal for today and celebrate completion" },
            { name: "Initiative", practice: "Do one thing without being asked that would help someone" },
            { name: "Optimism", practice: "Reframe one challenge as a growth opportunity" }
          ]
        },
        {
          id: "social-awareness",
          name: "Social Awareness",
          description: "Understanding others' emotions and perspectives",
          competencies: [
            { name: "Empathy", practice: "In your next conversation, focus entirely on understanding their perspective" },
            { name: "Organizational Awareness", practice: "Notice the unspoken dynamics in your next group interaction" },
            { name: "Service Orientation", practice: "Ask 'How can I help?' and listen for the deeper need" }
          ]
        },
        {
          id: "relationship-management",
          name: "Relationship Management",
          description: "Building and maintaining healthy relationships",
          competencies: [
            { name: "Inspirational Leadership", practice: "Share a vision that connects to others' values" },
            { name: "Influence", practice: "Seek to understand before being understood" },
            { name: "Developing Others", practice: "Offer specific, constructive feedback with care" },
            { name: "Change Catalyst", practice: "Model the change you want to see" },
            { name: "Conflict Management", practice: "Address conflicts directly with curiosity, not blame" },
            { name: "Teamwork", practice: "Celebrate someone else's contribution publicly" }
          ]
        }
      ],
      emotionalAgility: {
        steps: [
          { name: "Show Up", description: "Face your thoughts and emotions willingly with curiosity" },
          { name: "Step Out", description: "Detach from and observe your thoughts to see them clearly" },
          { name: "Walk Your Why", description: "Let your values, not emotions or thoughts, guide your actions" },
          { name: "Move On", description: "Take small, deliberate actions aligned with your values" }
        ],
        practice: "When difficult emotions arise, say: 'I notice I am having the thought that...' This creates space between you and the thought."
      }
    }
  });
});

// ===== MINDSET MASTERY =====
router.get("/mindset", (req, res) => {
  res.json({
    success: true,
    data: {
      mindsetTypes: [
        {
          id: "growth-mindset",
          name: "Growth Mindset",
          coreBeliefs: [
            "Abilities can be developed through dedication and hard work",
            "Challenges are opportunities to grow",
            "Effort is the path to mastery",
            "Feedback is valuable information for improvement",
            "Others' success is inspiring, not threatening"
          ],
          languageShifts: [
            { from: "I can't do this", to: "I can't do this YET" },
            { from: "I'm not good at this", to: "I'm learning to get better at this" },
            { from: "I made a mistake", to: "Mistakes help me grow" },
            { from: "This is too hard", to: "This may take time and effort" },
            { from: "I'll never be as good as them", to: "I can learn from their example" }
          ]
        },
        {
          id: "abundance-mindset",
          name: "Abundance Mindset",
          coreBeliefs: [
            "There is enough for everyone",
            "Opportunities are limitless",
            "Giving creates more receiving",
            "Success is not zero-sum",
            "Gratitude opens doors to more good"
          ],
          dailyPractice: "List 3 things you have in abundance today. Notice how it feels to appreciate what you have."
        },
        {
          id: "antifragile-mindset",
          name: "Antifragile Mindset",
          coreBeliefs: [
            "I grow stronger from stressors and challenges",
            "Volatility and uncertainty are opportunities",
            "Small failures prevent large catastrophes",
            "Optionality is more valuable than optimization",
            "I thrive in disorder, not despite it"
          ],
          practices: [
            "Embrace small, reversible risks regularly",
            "Build redundancy into critical systems",
            "Seek challenges that stretch but don't break",
            "Learn to love the process, not just outcomes"
          ]
        }
      ],
      limitingBeliefWork: {
        process: [
          { step: 1, name: "Identify", instruction: "What belief is limiting you right now? Write it down." },
          { step: 2, name: "Question", instruction: "Is this belief absolutely true? What evidence contradicts it?" },
          { step: 3, name: "Origin", instruction: "Where did this belief come from? Is that source reliable?" },
          { step: 4, name: "Cost", instruction: "What is this belief costing you in your life?" },
          { step: 5, name: "Replace", instruction: "What belief would serve you better? Make it specific and believable." },
          { step: 6, name: "Embody", instruction: "How would you act if you fully believed the new belief?" }
        ]
      }
    }
  });
});

// ===== PERSONAL POWER =====
router.get("/personal-power", (req, res) => {
  res.json({
    success: true,
    data: {
      powerSources: [
        {
          id: "inner-authority",
          name: "Inner Authority",
          description: "The power that comes from self-trust and self-knowledge",
          cultivation: [
            "Make decisions aligned with your values, even when uncomfortable",
            "Keep promises to yourself consistently",
            "Listen to your intuition and act on it",
            "Set boundaries without needing approval",
            "Take full responsibility for your choices"
          ]
        },
        {
          id: "presence",
          name: "Powerful Presence",
          description: "The ability to be fully here, commanding attention naturally",
          elements: [
            { name: "Groundedness", practice: "Feel your feet on the floor. Breathe into your belly. Be here." },
            { name: "Stillness", practice: "Eliminate nervous movements. Let your body be calm." },
            { name: "Eye Contact", practice: "Hold gentle, confident eye contact. Don't look away first." },
            { name: "Vocal Resonance", practice: "Speak from your chest, not your throat. Slow down." },
            { name: "Spaciousness", practice: "Don't rush to fill silences. Let them breathe." }
          ]
        },
        {
          id: "sovereignty",
          name: "Personal Sovereignty",
          description: "Complete ownership of your life, choices, and outcomes",
          declarations: [
            "I am the author of my own life story",
            "No one can diminish my worth without my consent",
            "I choose my responses to all circumstances",
            "My power does not depend on others' approval",
            "I set the standards for my own life"
          ],
          practice: "Daily morning affirmation: 'Today, I choose how I think, feel, and act. I am sovereign over my inner world.'"
        }
      ],
      dailyPowerPractice: {
        morning: [
          "State your intention for the day out loud",
          "Visualize yourself handling challenges with grace",
          "Affirm your core identity statement"
        ],
        evening: [
          "Acknowledge three moments where you acted from power",
          "Forgive yourself for any lapses with compassion",
          "Set your intention to wake tomorrow in power"
        ]
      }
    }
  });
});

// ===== EXCELLENCE FRAMEWORKS =====
router.get("/excellence", (req, res) => {
  res.json({
    success: true,
    data: {
      excellenceModels: [
        {
          id: "kaizen",
          name: "Kaizen (Continuous Improvement)",
          origin: "Japanese philosophy",
          principle: "Small, continuous improvements compound into massive transformation",
          application: [
            "Ask: 'What one small thing could I improve today?'",
            "Focus on 1% better, not 100% better",
            "Celebrate tiny wins",
            "Never stop refining"
          ],
          question: "What would be just slightly better than yesterday?"
        },
        {
          id: "mastery-path",
          name: "The Mastery Path",
          source: "George Leonard",
          phases: [
            { name: "Plateau", description: "Most of mastery is spent here - embrace it" },
            { name: "Breakthrough", description: "Sudden jumps in ability - brief but exciting" },
            { name: "Regression", description: "Temporary setbacks - normal, not permanent" },
            { name: "Integration", description: "New skills become automatic" }
          ],
          keyInsight: "The master loves the plateau. Those who can't accept plateaus never achieve mastery."
        },
        {
          id: "deliberate-practice",
          name: "Deliberate Practice",
          source: "Anders Ericsson",
          elements: [
            { name: "Specific Goals", description: "Clear, measurable objectives for each session" },
            { name: "Full Concentration", description: "Complete focus during practice" },
            { name: "Immediate Feedback", description: "Know quickly if you're on track" },
            { name: "Edge of Ability", description: "Practice just beyond current skill level" },
            { name: "Mental Models", description: "Build rich mental representations" }
          ],
          rule: "10,000 hours is meaningless without deliberate practice. Quality over quantity."
        }
      ],
      weeklyExcellenceReview: {
        questions: [
          "What was my biggest win this week?",
          "Where did I fall short of my standards?",
          "What will I do differently next week?",
          "What did I learn that I can apply immediately?",
          "Who can I thank or appreciate?"
        ]
      }
    }
  });
});

// ===== ALL SELF-MASTERY DATA =====
router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: {
      categories: [
        { id: "discipline", name: "Discipline Systems", endpoint: "/api/self-mastery-intelligence/discipline" },
        { id: "emotional-intelligence", name: "Emotional Intelligence", endpoint: "/api/self-mastery-intelligence/emotional-intelligence" },
        { id: "mindset", name: "Mindset Mastery", endpoint: "/api/self-mastery-intelligence/mindset" },
        { id: "personal-power", name: "Personal Power", endpoint: "/api/self-mastery-intelligence/personal-power" },
        { id: "excellence", name: "Excellence Frameworks", endpoint: "/api/self-mastery-intelligence/excellence" }
      ],
      dailyMasteryPractice: {
        morning: "Set one intention. Visualize success. Affirm your identity.",
        midday: "Check alignment. Are you on track? Course correct if needed.",
        evening: "Review wins. Forgive lapses. Prepare for tomorrow."
      }
    }
  });
});

export default router;
