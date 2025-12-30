import express from "express";

const router = express.Router();

router.get("/breathwork", (req, res) => {
  res.json({
    techniques: [
      {
        id: "4-7-8-breathing",
        name: "4-7-8 Relaxation Breath",
        category: "calming",
        duration: "3-5 minutes",
        steps: [
          "Exhale completely through your mouth",
          "Inhale through your nose for 4 counts",
          "Hold your breath for 7 counts",
          "Exhale through your mouth for 8 counts",
          "Repeat 4 cycles"
        ],
        benefits: ["Reduces anxiety", "Promotes sleep", "Activates parasympathetic nervous system"],
        bestFor: ["Pre-sleep", "Acute stress", "Anxiety relief"]
      },
      {
        id: "coherent-breathing",
        name: "Coherent Breathing",
        category: "balancing",
        duration: "10-20 minutes",
        steps: [
          "Breathe in for 5-6 seconds",
          "Breathe out for 5-6 seconds",
          "Maintain smooth, even breaths",
          "Focus on heart area"
        ],
        benefits: ["Heart rate variability", "Emotional regulation", "Stress resilience"],
        bestFor: ["Daily practice", "Emotional balance", "Performance optimization"]
      },
      {
        id: "tummo-breath",
        name: "Tummo Inner Fire Breath",
        category: "energizing",
        duration: "15-30 minutes",
        steps: [
          "Sit in comfortable position",
          "Visualize inner fire at navel",
          "Perform forceful belly breaths",
          "Hold breath with bandhas",
          "Visualize heat rising through central channel"
        ],
        benefits: ["Increased body temperature", "Enhanced focus", "Spiritual awakening"],
        bestFor: ["Advanced practitioners", "Cold exposure", "Meditation enhancement"],
        caution: "Requires proper instruction and gradual progression"
      },
      {
        id: "alternate-nostril",
        name: "Nadi Shodhana (Alternate Nostril)",
        category: "balancing",
        duration: "5-15 minutes",
        steps: [
          "Close right nostril with thumb",
          "Inhale through left nostril",
          "Close left nostril with ring finger",
          "Exhale through right nostril",
          "Inhale through right, exhale left",
          "Continue alternating"
        ],
        benefits: ["Balances hemispheres", "Clears energy channels", "Calms mind"],
        bestFor: ["Pre-meditation", "Mental clarity", "Stress reduction"]
      }
    ]
  });
});

router.get("/somatic-practices", (req, res) => {
  res.json({
    practices: [
      {
        id: "progressive-muscle-relaxation",
        name: "Progressive Muscle Relaxation (PMR)",
        origin: "Edmund Jacobson",
        duration: "15-20 minutes",
        description: "Systematically tense and release muscle groups",
        steps: [
          "Start with feet - tense for 5 seconds, release",
          "Move to calves, thighs, buttocks",
          "Continue through abdomen, chest, hands, arms",
          "End with shoulders, neck, face",
          "Notice the contrast between tension and relaxation"
        ],
        benefits: ["Physical tension release", "Body awareness", "Sleep improvement"]
      },
      {
        id: "body-scan",
        name: "Body Scan Meditation",
        origin: "MBSR (Jon Kabat-Zinn)",
        duration: "20-45 minutes",
        description: "Mindful attention to each body part",
        steps: [
          "Lie down comfortably",
          "Bring awareness to breath",
          "Scan from toes to crown of head",
          "Notice sensations without judgment",
          "Breathe into areas of tension"
        ],
        benefits: ["Embodiment", "Stress reduction", "Pain management"]
      },
      {
        id: "shaking-practice",
        name: "Neurogenic Tremoring (TRE)",
        origin: "David Berceli",
        duration: "15-30 minutes",
        description: "Therapeutic tremoring to release trauma",
        steps: [
          "Perform specific exercises to fatigue muscles",
          "Lie down in butterfly position",
          "Allow natural tremoring to occur",
          "Don't control or stop the shaking",
          "Rest and integrate afterward"
        ],
        benefits: ["Trauma release", "Nervous system reset", "Deep relaxation"],
        caution: "Start slowly, may surface emotions"
      },
      {
        id: "grounding",
        name: "Earthing/Grounding Practices",
        duration: "5-30 minutes",
        description: "Physical connection with the earth",
        methods: [
          "Walk barefoot on grass, sand, or soil",
          "Lie directly on the ground",
          "Hug a tree (yes, really)",
          "Garden with bare hands",
          "Swim in natural bodies of water"
        ],
        benefits: ["Reduces inflammation", "Improves sleep", "Electron transfer from earth"]
      }
    ]
  });
});

router.get("/movement-therapy", (req, res) => {
  res.json({
    modalities: [
      {
        id: "yoga",
        name: "Yoga",
        styles: [
          { name: "Hatha", focus: "Foundational postures and breath", intensity: "gentle" },
          { name: "Vinyasa", focus: "Flowing movement sequences", intensity: "moderate" },
          { name: "Yin", focus: "Long-held passive stretches", intensity: "restorative" },
          { name: "Kundalini", focus: "Energy awakening practices", intensity: "energetic" },
          { name: "Restorative", focus: "Deep relaxation with props", intensity: "very gentle" }
        ],
        benefits: ["Flexibility", "Strength", "Mind-body connection", "Stress relief"]
      },
      {
        id: "qigong",
        name: "Qigong",
        description: "Chinese energy cultivation practice",
        types: [
          { name: "Medical Qigong", purpose: "Healing and health" },
          { name: "Martial Qigong", purpose: "Internal power development" },
          { name: "Spiritual Qigong", purpose: "Enlightenment and cultivation" }
        ],
        principles: [
          "Regulate body (posture/movement)",
          "Regulate breath",
          "Regulate mind"
        ],
        benefits: ["Energy cultivation", "Stress reduction", "Longevity", "Mental clarity"]
      },
      {
        id: "tai-chi",
        name: "Tai Chi Chuan",
        description: "Moving meditation martial art",
        styles: ["Yang", "Chen", "Wu", "Sun"],
        principles: [
          "Softness overcomes hardness",
          "Continuous flowing movement",
          "Mind leads body",
          "Root to earth, suspended from above"
        ],
        benefits: ["Balance", "Fall prevention", "Stress reduction", "Gentle exercise"]
      },
      {
        id: "authentic-movement",
        name: "Authentic Movement",
        origin: "Mary Whitehouse, Janet Adler",
        description: "Spontaneous movement from inner impulse",
        process: [
          "Close eyes and wait for movement impulse",
          "Follow body's wisdom without planning",
          "Witness observes without judgment",
          "Verbal sharing and integration"
        ],
        benefits: ["Unconscious expression", "Self-discovery", "Trauma processing"]
      }
    ]
  });
});

router.get("/nervous-system", (req, res) => {
  res.json({
    polyvagalTheory: {
      overview: "Stephen Porges' theory of the autonomic nervous system",
      states: [
        {
          name: "Ventral Vagal (Social Engagement)",
          description: "Feeling safe, connected, calm yet alert",
          physiology: "Heart rate regulated, facial muscles relaxed, prosody in voice",
          behaviors: ["Social engagement", "Play", "Intimacy", "Learning", "Creativity"],
          color: "green"
        },
        {
          name: "Sympathetic (Fight/Flight)",
          description: "Mobilization in response to danger",
          physiology: "Increased heart rate, shallow breathing, muscle tension",
          behaviors: ["Anxiety", "Anger", "Restlessness", "Hypervigilance"],
          color: "yellow/red"
        },
        {
          name: "Dorsal Vagal (Freeze/Shutdown)",
          description: "Immobilization in overwhelming threat",
          physiology: "Heart rate drops, dissociation, numbness",
          behaviors: ["Depression", "Disconnection", "Hopelessness", "Collapse"],
          color: "blue/gray"
        }
      ],
      coregulation: "Nervous systems synchronize through safe social interaction"
    },
    regulationPractices: [
      {
        name: "Voo Breath",
        description: "Long 'voo' sound on exhale stimulates vagus nerve",
        howTo: "Inhale, then exhale making a low 'vooooo' sound until breath is empty"
      },
      {
        name: "Cold Exposure",
        description: "Cold water on face activates dive reflex",
        howTo: "Splash cold water on face or take brief cold showers"
      },
      {
        name: "Humming/Singing",
        description: "Vibration stimulates vagus nerve",
        howTo: "Hum or sing for several minutes daily"
      },
      {
        name: "Safe Touch",
        description: "Gentle touch signals safety to nervous system",
        howTo: "Self-massage, hugs, or weighted blankets"
      }
    ]
  });
});

router.get("/embodiment-exercises", (req, res) => {
  res.json({
    exercises: [
      {
        id: "felt-sense",
        name: "Focusing (Felt Sense)",
        origin: "Eugene Gendlin",
        duration: "10-30 minutes",
        description: "Accessing body's implicit wisdom",
        steps: [
          "Clear a space - mentally set aside issues",
          "Feel for a felt sense of 'something'",
          "Find a handle - word, phrase, or image that fits",
          "Resonate - check if handle matches felt sense",
          "Ask - what is it about this situation that makes it so...",
          "Receive - welcome whatever comes with friendly attention"
        ],
        benefits: ["Access unconscious knowing", "Problem resolution", "Emotional processing"]
      },
      {
        id: "pendulation",
        name: "Pendulation",
        origin: "Peter Levine (Somatic Experiencing)",
        description: "Moving between activation and resource",
        process: [
          "Identify a resource - body part that feels calm or neutral",
          "Notice activation - area of tension or discomfort",
          "Pendulate attention between the two",
          "Allow natural discharge of activation",
          "Return to resource as needed"
        ],
        benefits: ["Builds capacity", "Integrates difficult material", "Prevents overwhelm"]
      },
      {
        id: "containment",
        name: "Container Exercise",
        origin: "Trauma therapy",
        description: "Creating internal safe space for difficult material",
        steps: [
          "Imagine a strong container (vault, box, safe)",
          "Give it sensory details - material, size, lock",
          "Place difficult thoughts/feelings inside",
          "Close and secure the container",
          "Know you can return to it when ready"
        ],
        benefits: ["Emotional regulation", "Boundary setting", "Sleep improvement"]
      }
    ]
  });
});

router.get("/daily", (req, res) => {
  const practices = [
    "Begin your day with 3 minutes of coherent breathing before rising",
    "Do a brief body scan during your morning routine - where is tension held?",
    "Take three conscious breaths before each meal",
    "Practice 'grounding' by feeling your feet on the floor during stressful moments",
    "End your day with progressive muscle relaxation for better sleep"
  ];
  res.json({
    practice: practices[Math.floor(Math.random() * practices.length)],
    theme: "Mind-Body Integration"
  });
});

export default router;
