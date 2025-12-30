import express from "express";

const router = express.Router();

router.get("/inner-security", (req, res) => {
  res.json({
    framework: {
      name: "Inner Security Development",
      description: "Building psychological safety and resilience from within",
      foundations: [
        {
          foundation: "Secure Attachment to Self",
          description: "Becoming your own secure base",
          practices: [
            "Self-compassion meditation",
            "Internal validation practices",
            "Self-soothing techniques",
            "Positive self-talk rewiring"
          ]
        },
        {
          foundation: "Emotional Regulation",
          description: "Ability to manage emotional intensity",
          practices: [
            "Window of tolerance expansion",
            "Grounding techniques",
            "Co-regulation seeking",
            "Distress tolerance skills"
          ]
        },
        {
          foundation: "Identity Stability",
          description: "Consistent sense of self across situations",
          practices: [
            "Values clarification",
            "Core beliefs exploration",
            "Self-narrative coherence",
            "Identity anchoring"
          ]
        },
        {
          foundation: "Healthy Boundaries",
          description: "Knowing where you end and others begin",
          practices: [
            "Boundary awareness exercises",
            "Assertiveness training",
            "Learning to say no",
            "Protecting energy"
          ]
        }
      ]
    },
    selfCompassion: {
      origin: "Kristin Neff",
      components: [
        {
          component: "Self-Kindness",
          opposite: "Self-Judgment",
          practice: "Treat yourself as you would a dear friend",
          phrases: ["This is hard right now", "May I be gentle with myself", "I'm doing my best"]
        },
        {
          component: "Common Humanity",
          opposite: "Isolation",
          practice: "Recognize suffering is part of shared human experience",
          phrases: ["Everyone struggles sometimes", "I'm not alone in this", "This is part of being human"]
        },
        {
          component: "Mindfulness",
          opposite: "Over-identification",
          practice: "Observe pain without getting swept away",
          phrases: ["This is a moment of suffering", "I can notice this without drowning in it"]
        }
      ],
      selfCompassionBreak: [
        "Acknowledge: 'This is a moment of suffering'",
        "Connect: 'Suffering is part of the human experience'",
        "Kindness: 'May I give myself the compassion I need'"
      ]
    }
  });
});

router.get("/safety-signals", (req, res) => {
  res.json({
    polyvagalPerspective: {
      concept: "Neuroception - unconscious detection of safety or danger",
      safetySignals: [
        { signal: "Warm facial expressions", application: "Seek warm, friendly faces" },
        { signal: "Melodic voice prosody", application: "Listen to soothing voices" },
        { signal: "Soft eye contact", application: "Practice gentle eye connection" },
        { signal: "Slow, rhythmic movements", application: "Move gently, avoid sudden gestures" },
        { signal: "Predictable environment", application: "Create routines and consistency" }
      ],
      dangerSignals: [
        "Harsh or flat facial expressions",
        "Monotone or loud voice",
        "Staring or lack of eye contact",
        "Sudden, jerky movements",
        "Unpredictable environments"
      ]
    },
    creatingInternalSafety: [
      {
        practice: "Safe Place Visualization",
        steps: [
          "Close eyes and breathe slowly",
          "Imagine a place where you feel completely safe",
          "Engage all senses - what do you see, hear, smell, feel?",
          "Notice the feeling of safety in your body",
          "Anchor this with a word or gesture"
        ]
      },
      {
        practice: "Protective Figure Meditation",
        steps: [
          "Imagine a figure who embodies protection and unconditional love",
          "This can be real, imagined, spiritual, or symbolic",
          "Feel their protective presence around you",
          "Receive their message of safety and care",
          "Carry their presence with you"
        ]
      },
      {
        practice: "Container Exercise",
        steps: [
          "Imagine a strong container for difficult emotions",
          "Visualize its material, size, lock mechanism",
          "Place overwhelming feelings inside temporarily",
          "Know you can open it when ready with support",
          "Return attention to present moment"
        ]
      }
    ]
  });
});

router.get("/resilience-factors", (req, res) => {
  res.json({
    protectiveFactors: {
      internal: [
        { factor: "Self-efficacy", description: "Belief in ability to handle challenges" },
        { factor: "Optimism", description: "Expectation of positive outcomes" },
        { factor: "Emotional awareness", description: "Ability to identify and express feelings" },
        { factor: "Problem-solving skills", description: "Capacity to find solutions" },
        { factor: "Sense of purpose", description: "Connection to meaning beyond self" },
        { factor: "Flexibility", description: "Ability to adapt to changing circumstances" }
      ],
      relational: [
        { factor: "Secure attachment", description: "At least one stable, caring relationship" },
        { factor: "Social support", description: "Network of supportive people" },
        { factor: "Mentorship", description: "Guidance from experienced others" },
        { factor: "Community belonging", description: "Feeling part of something larger" }
      ],
      environmental: [
        { factor: "Safety and stability", description: "Predictable, secure environment" },
        { factor: "Access to resources", description: "Basic needs reliably met" },
        { factor: "Opportunities for growth", description: "Chances to develop and contribute" }
      ]
    },
    buildingResilience: [
      {
        area: "Cognitive",
        strategies: [
          "Challenge catastrophic thinking",
          "Develop realistic optimism",
          "Practice cognitive reframing",
          "Build problem-solving skills"
        ]
      },
      {
        area: "Emotional",
        strategies: [
          "Expand emotional vocabulary",
          "Practice distress tolerance",
          "Develop self-soothing skills",
          "Cultivate positive emotions"
        ]
      },
      {
        area: "Behavioral",
        strategies: [
          "Take small actions toward goals",
          "Build healthy routines",
          "Seek help when needed",
          "Practice self-care consistently"
        ]
      },
      {
        area: "Social",
        strategies: [
          "Nurture supportive relationships",
          "Join communities of meaning",
          "Give help as well as receive",
          "Practice vulnerability appropriately"
        ]
      }
    ]
  });
});

router.get("/trauma-informed-care", (req, res) => {
  res.json({
    principles: [
      {
        principle: "Safety",
        description: "Physical and emotional safety is the first priority",
        practices: ["Create predictable environments", "Establish clear boundaries", "Communicate transparently"]
      },
      {
        principle: "Trustworthiness",
        description: "Interactions must build trust through reliability",
        practices: ["Keep commitments", "Be honest about limitations", "Maintain confidentiality"]
      },
      {
        principle: "Choice",
        description: "Restore sense of control through choices",
        practices: ["Offer options whenever possible", "Respect decisions", "Avoid coercion"]
      },
      {
        principle: "Collaboration",
        description: "Work with, not on, people",
        practices: ["Share power in relationship", "Value lived experience", "Co-create solutions"]
      },
      {
        principle: "Empowerment",
        description: "Build on strengths rather than deficits",
        practices: ["Recognize capabilities", "Support self-advocacy", "Celebrate growth"]
      },
      {
        principle: "Cultural Humility",
        description: "Honor cultural, historical, and gender contexts",
        practices: ["Learn about different backgrounds", "Address biases", "Adapt approaches respectfully"]
      }
    ],
    windowOfTolerance: {
      concept: "The zone where we can experience and integrate emotions",
      zones: [
        {
          zone: "Hyperarousal",
          signs: ["Anxiety", "Panic", "Anger", "Racing thoughts", "Hypervigilance"],
          strategies: ["Grounding", "Slow breathing", "Cold water", "Physical movement"]
        },
        {
          zone: "Window of Tolerance",
          signs: ["Calm alertness", "Ability to think and feel", "Present moment awareness"],
          strategies: ["Maintain through regular self-care", "Expand gradually over time"]
        },
        {
          zone: "Hypoarousal",
          signs: ["Numbness", "Disconnection", "Fatigue", "Dissociation", "Depression"],
          strategies: ["Movement", "Sensory stimulation", "Social engagement", "Orienting to environment"]
        }
      ]
    }
  });
});

router.get("/grounding-techniques", (req, res) => {
  res.json({
    techniques: [
      {
        name: "5-4-3-2-1 Sensory Grounding",
        category: "sensory",
        duration: "2-5 minutes",
        steps: [
          "Name 5 things you can SEE",
          "Name 4 things you can TOUCH",
          "Name 3 things you can HEAR",
          "Name 2 things you can SMELL",
          "Name 1 thing you can TASTE"
        ]
      },
      {
        name: "Feet on Floor",
        category: "physical",
        duration: "1-2 minutes",
        steps: [
          "Press feet firmly into ground",
          "Notice the sensation of support",
          "Feel the ground holding you up",
          "Breathe and feel your roots"
        ]
      },
      {
        name: "Cold Water Grounding",
        category: "physical",
        duration: "30 seconds - 1 minute",
        steps: [
          "Run cold water over hands or wrists",
          "Splash cold water on face",
          "Focus fully on the sensation",
          "Let the cold bring you to present"
        ]
      },
      {
        name: "Box Breathing",
        category: "breath",
        duration: "3-5 minutes",
        steps: [
          "Inhale for 4 counts",
          "Hold for 4 counts",
          "Exhale for 4 counts",
          "Hold for 4 counts",
          "Repeat 4-8 cycles"
        ]
      },
      {
        name: "Body Scan Grounding",
        category: "body",
        duration: "5-10 minutes",
        steps: [
          "Start at feet, notice sensations",
          "Move attention slowly upward",
          "Notice areas of tension or ease",
          "Breathe into each area",
          "End at top of head"
        ]
      },
      {
        name: "Object Focus",
        category: "cognitive",
        duration: "2-3 minutes",
        steps: [
          "Pick up a nearby object",
          "Describe it in detail - color, texture, weight",
          "Notice every feature",
          "Stay curious and present"
        ]
      }
    ],
    whenToUse: [
      "When feeling anxious or panicky",
      "During flashbacks or intrusive memories",
      "When dissociating or feeling 'unreal'",
      "Before entering stressful situations",
      "As daily practice to build capacity"
    ]
  });
});

router.get("/daily", (req, res) => {
  const practices = [
    "Practice the self-compassion break when you notice self-criticism today",
    "Identify three safety signals in your environment right now",
    "Use the 5-4-3-2-1 grounding technique to anchor in the present moment",
    "Notice your window of tolerance - are you in it, above it, or below it?",
    "Speak to yourself today as you would to someone you deeply love"
  ];
  res.json({
    practice: practices[Math.floor(Math.random() * practices.length)],
    theme: "Psychological Safety"
  });
});

export default router;
