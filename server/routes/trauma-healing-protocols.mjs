import { Router } from "express";

const router = Router();

// ===== TRAUMA-INFORMED GROUNDING =====
router.get("/grounding", (req, res) => {
  res.json({
    success: true,
    data: {
      techniques: [
        {
          id: "5-4-3-2-1",
          name: "5-4-3-2-1 Sensory Grounding",
          description: "Anchor to the present moment through your senses",
          steps: [
            { sense: "See", instruction: "Name 5 things you can see right now" },
            { sense: "Touch", instruction: "Name 4 things you can feel (texture, temperature)" },
            { sense: "Hear", instruction: "Name 3 things you can hear" },
            { sense: "Smell", instruction: "Name 2 things you can smell" },
            { sense: "Taste", instruction: "Name 1 thing you can taste" }
          ],
          whenToUse: "Anxiety, flashbacks, dissociation, panic"
        },
        {
          id: "feet-floor",
          name: "Feet on the Floor",
          description: "Simple physical grounding for immediate presence",
          steps: [
            "Press your feet firmly into the ground",
            "Notice the sensation of the floor beneath you",
            "Feel your weight being held by the earth",
            "Wiggle your toes and feel them moving",
            "Say silently: 'I am here. I am safe. I am grounded.'"
          ],
          whenToUse: "Quick reset, meetings, public spaces"
        },
        {
          id: "cold-water",
          name: "Cold Water Reset",
          description: "Uses temperature to shift nervous system state",
          steps: [
            "Run cold water over your wrists for 30 seconds",
            "Or: Hold ice cubes in your palms",
            "Or: Splash cold water on your face",
            "Focus entirely on the sensation of cold",
            "Breathe slowly while doing this"
          ],
          whenToUse: "Intense emotions, feeling overwhelmed, dissociation"
        },
        {
          id: "container-exercise",
          name: "Container Exercise",
          description: "Safely put away overwhelming content for later processing",
          steps: [
            "Imagine a strong, secure container (safe, vault, chest)",
            "Make it as detailed as possible in your mind",
            "Visualize placing the distressing thoughts/memories inside",
            "See the container closing securely",
            "Know that you can return to this content when you're ready, with support"
          ],
          note: "This is not avoidance—it's regulated pacing of processing",
          whenToUse: "After therapy, before sleep, when triggered"
        }
      ],
      safetyStatement: "These techniques are supportive tools, not replacements for professional trauma therapy. If you're experiencing severe symptoms, please reach out to a mental health professional."
    }
  });
});

// ===== NERVOUS SYSTEM REGULATION =====
router.get("/nervous-system", (req, res) => {
  res.json({
    success: true,
    data: {
      polyVagalStates: [
        {
          state: "Ventral Vagal (Safe & Social)",
          signs: ["Calm", "Connected", "Curious", "Creative", "Compassionate"],
          body: "Relaxed muscles, steady heart rate, open posture",
          goal: "This is our target state—we want to spend more time here"
        },
        {
          state: "Sympathetic (Fight/Flight)",
          signs: ["Anxious", "Angry", "Overwhelmed", "Hypervigilant", "Racing thoughts"],
          body: "Tense muscles, rapid heart rate, shallow breathing",
          regulation: "Slow exhales, grounding, movement, social connection"
        },
        {
          state: "Dorsal Vagal (Freeze/Shutdown)",
          signs: ["Numb", "Disconnected", "Hopeless", "Exhausted", "Dissociated"],
          body: "Low energy, slow movement, collapsed posture",
          regulation: "Gentle movement, warmth, rhythm, gradual activation"
        }
      ],
      regulationTechniques: [
        {
          name: "Physiological Sigh",
          description: "Double inhale followed by long exhale",
          steps: [
            "Inhale through nose",
            "Take a second, smaller inhale on top",
            "Exhale slowly through mouth (longer than the inhales)",
            "Repeat 2-3 times"
          ],
          effect: "Quickly activates parasympathetic nervous system"
        },
        {
          name: "Vagal Toning Hum",
          description: "Humming to stimulate the vagus nerve",
          steps: [
            "Take a deep breath in",
            "Hum on the exhale, feeling vibration in chest",
            "Continue for 2-3 minutes",
            "Notice the calming effect"
          ],
          effect: "Stimulates vagus nerve, promotes calm"
        },
        {
          name: "Bilateral Stimulation",
          description: "Rhythmic left-right movements to process activation",
          options: [
            "Butterfly hug: Cross arms, tap shoulders alternately",
            "Walking: Focus on left-right foot contact",
            "Eye movements: Slowly track finger left to right",
            "Tapping: Alternate tapping knees or thighs"
          ],
          effect: "Helps process distress, similar to EMDR"
        },
        {
          name: "Safe Place Visualization",
          description: "Create an internal place of safety",
          steps: [
            "Close your eyes and imagine a place where you feel completely safe",
            "This can be real or imagined",
            "Notice what you see, hear, smell, and feel there",
            "Notice how your body feels in this safe place",
            "Give it a name or keyword you can use to return"
          ],
          effect: "Builds internal resource for self-soothing"
        }
      ]
    }
  });
});

// ===== PARTS WORK (IFS-Informed) =====
router.get("/parts-work", (req, res) => {
  res.json({
    success: true,
    data: {
      overview: {
        description: "Internal Family Systems teaches that we have different parts of ourselves, all trying to help in their own way",
        keyIdea: "There are no bad parts—only parts with extreme roles they took on to protect us"
      },
      partTypes: [
        {
          type: "Managers",
          role: "Proactive protectors that try to keep us safe by controlling our environment",
          examples: ["The perfectionist", "The people-pleaser", "The controller", "The critic"],
          approach: "Thank them for their protection. Ask what they're afraid would happen if they relaxed."
        },
        {
          type: "Firefighters",
          role: "Reactive protectors that jump in when pain surfaces",
          examples: ["The numbing part", "The angry part", "The addictive part", "The dissociator"],
          approach: "Understand they're trying to put out fires of pain. Don't shame them."
        },
        {
          type: "Exiles",
          role: "Wounded parts carrying pain, often from childhood",
          examples: ["The abandoned child", "The shamed one", "The lonely part", "The frightened one"],
          approach: "Approach only when protectors give permission. Offer compassion, not rescue."
        },
        {
          type: "Self",
          role: "The core, undamaged essence—calm, curious, compassionate",
          qualities: ["Calm", "Curious", "Compassionate", "Connected", "Confident", "Creative", "Courageous", "Clear"],
          approach: "This is who leads the healing. Access Self to be with all parts."
        }
      ],
      selfLeadGuidedPractice: {
        steps: [
          { step: 1, instruction: "Find a quiet place and take some centering breaths" },
          { step: 2, instruction: "Notice: Is there a part that wants your attention right now?" },
          { step: 3, instruction: "Where do you notice it in or around your body?" },
          { step: 4, instruction: "How do you feel toward this part? (If anything other than curious compassion, that's another part)" },
          { step: 5, instruction: "Ask any other parts to give you space to be with this part" },
          { step: 6, instruction: "From a place of curiosity, ask the part: What do you want me to know?" },
          { step: 7, instruction: "Listen without judgment. Thank the part for sharing." },
          { step: 8, instruction: "Ask: What are you afraid would happen if you stopped doing your job?" },
          { step: 9, instruction: "Let the part know you're here now. You're not the child anymore." }
        ]
      },
      reminder: "Parts work is most effective with a trained IFS therapist. This is an introduction, not a replacement for professional guidance."
    }
  });
});

// ===== SOMATIC HEALING =====
router.get("/somatic", (req, res) => {
  res.json({
    success: true,
    data: {
      principles: [
        "The body keeps the score—trauma is stored physically",
        "We must feel it to heal it (at a pace we can tolerate)",
        "Small, slow movements can unlock big patterns",
        "Completion of protective responses releases stored energy",
        "Pendulation: moving between activation and calm builds capacity"
      ],
      practices: [
        {
          name: "Body Scan for Tension",
          description: "Awareness practice to locate held tension",
          steps: [
            "Lie down or sit comfortably",
            "Close your eyes and breathe normally",
            "Start at the top of your head",
            "Slowly move attention down through your body",
            "Notice any areas of tension, tightness, or sensation",
            "Don't try to change anything—just notice",
            "When you reach your feet, take a few breaths and open your eyes"
          ],
          duration: "10-15 minutes"
        },
        {
          name: "Shaking & Tremoring",
          description: "Release stored nervous system activation through natural movement",
          steps: [
            "Stand with feet shoulder-width apart, knees slightly bent",
            "Begin gently bouncing from your knees",
            "Let the movement spread through your body",
            "Allow shaking, tremoring, or spontaneous movements",
            "Continue for 5-15 minutes",
            "Slowly come to stillness",
            "Rest and notice how you feel"
          ],
          note: "Animals naturally shake after threat—we can reclaim this release mechanism"
        },
        {
          name: "Orienting to Safety",
          description: "Look around slowly to signal safety to the nervous system",
          steps: [
            "Slowly turn your head to look around the room",
            "Really see what's there—not just glancing",
            "Notice colors, shapes, textures",
            "Let your eyes rest on anything that feels neutral or pleasant",
            "Complete a full 360 degree scan if possible",
            "Your nervous system is checking for danger—show it there is none"
          ],
          effect: "Signals to the survival brain that you are safe NOW"
        },
        {
          name: "Resourcing Touch",
          description: "Self-touch to activate the social engagement system",
          options: [
            { name: "Hand on heart", effect: "Activates self-compassion circuits" },
            { name: "Cradling your own face", effect: "Mimics nurturing touch" },
            { name: "Hugging yourself", effect: "Releases oxytocin" },
            { name: "Hand on belly", effect: "Grounds and centers" }
          ]
        }
      ]
    }
  });
});

// ===== REPARENTING PRACTICES =====
router.get("/reparenting", (req, res) => {
  res.json({
    success: true,
    data: {
      overview: "Reparenting means giving your inner child what they needed but didn't receive",
      domains: [
        {
          need: "Safety",
          woundSigns: ["Chronic anxiety", "Hypervigilance", "Difficulty relaxing"],
          reparentingPractices: [
            "Create a safe physical space in your home",
            "Tell yourself: 'You are safe now'",
            "Establish consistent, predictable routines",
            "Learn to set and maintain boundaries"
          ]
        },
        {
          need: "Nurturing",
          woundSigns: ["Self-neglect", "Difficulty receiving", "Harsh self-criticism"],
          reparentingPractices: [
            "Speak to yourself as you would to a child you love",
            "Take care of your physical needs consistently",
            "Celebrate small wins and efforts",
            "Allow yourself to receive help and care"
          ]
        },
        {
          need: "Validation",
          woundSigns: ["People-pleasing", "Imposter syndrome", "Seeking external approval"],
          reparentingPractices: [
            "Acknowledge your feelings without judgment",
            "Tell yourself: 'It makes sense that you feel this way'",
            "Keep a list of your strengths and accomplishments",
            "Practice saying: 'My feelings are valid'"
          ]
        },
        {
          need: "Autonomy",
          woundSigns: ["Difficulty making decisions", "Enmeshment", "Guilt for having needs"],
          reparentingPractices: [
            "Practice making small decisions without asking others",
            "Set boundaries even when it feels uncomfortable",
            "Ask yourself: 'What do I actually want?'",
            "Give yourself permission to say no"
          ]
        }
      ],
      innerChildMeditation: {
        description: "A gentle practice to connect with and comfort your younger self",
        steps: [
          "Close your eyes and take several deep breaths",
          "Imagine yourself at an age when you needed support",
          "See this younger you as clearly as possible",
          "Approach them with gentleness and warmth",
          "Let them know: 'I'm here. I'm your future self. You made it.'",
          "Ask: 'What do you need to hear?'",
          "Tell them what they needed to hear",
          "Offer a hug or comforting gesture",
          "Let them know they can always come to you",
          "Slowly return to the present, bringing that connection with you"
        ]
      },
      dailyReparentingPrompt: "What is one thing my inner child needed today that I can give them?"
    }
  });
});

// ===== WINDOW OF TOLERANCE =====
router.get("/window-of-tolerance", (req, res) => {
  res.json({
    success: true,
    data: {
      concept: {
        description: "The Window of Tolerance is the zone of arousal in which we can function effectively",
        author: "Dan Siegel",
        zones: [
          { zone: "Hyperarousal (Above Window)", signs: ["Anxiety", "Panic", "Anger", "Hypervigilance", "Racing thoughts"] },
          { zone: "Window of Tolerance (Optimal)", signs: ["Calm", "Alert", "Present", "Thinking clearly", "Feeling emotions without overwhelm"] },
          { zone: "Hypoarousal (Below Window)", signs: ["Numbness", "Exhaustion", "Dissociation", "Shutdown", "Depression"] }
        ]
      },
      expandingWindow: {
        description: "Trauma shrinks our window. Healing expands it.",
        strategies: [
          "Practice tolerating small amounts of activation, then regulate",
          "Build a toolkit of calming techniques",
          "Develop awareness of your early warning signs",
          "Use pendulation: oscillate between activation and calm",
          "Work with a trauma-informed therapist"
        ]
      },
      trackingPrompts: [
        "Where am I right now? (Above/In/Below my window)",
        "What pushed me out of my window today?",
        "What helped me get back into my window?",
        "What's one thing that reliably brings me into my window?"
      ],
      emergencyProtocol: {
        description: "If you've left your window of tolerance",
        steps: [
          "Name it: 'I am [above/below] my window right now'",
          "Locate yourself: 'I am [name], I am in [location], the year is [year]'",
          "Choose one grounding technique from your toolkit",
          "Move slowly and deliberately",
          "Seek connection if possible and safe",
          "Be patient—returning to window takes time"
        ]
      }
    }
  });
});

// ===== ALL TRAUMA HEALING DATA =====
router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: {
      categories: [
        { id: "grounding", name: "Grounding Techniques", endpoint: "/api/trauma-healing/grounding" },
        { id: "nervous-system", name: "Nervous System Regulation", endpoint: "/api/trauma-healing/nervous-system" },
        { id: "parts-work", name: "Parts Work", endpoint: "/api/trauma-healing/parts-work" },
        { id: "somatic", name: "Somatic Healing", endpoint: "/api/trauma-healing/somatic" },
        { id: "reparenting", name: "Reparenting Practices", endpoint: "/api/trauma-healing/reparenting" },
        { id: "window-of-tolerance", name: "Window of Tolerance", endpoint: "/api/trauma-healing/window-of-tolerance" }
      ],
      safetyReminder: "Trauma healing is profound work. These tools are meant to support your journey, not replace professional care. If you're struggling, please reach out to a trauma-informed therapist. You deserve support.",
      crisisResources: {
        us: "988 Suicide & Crisis Lifeline: Call or text 988",
        text: "Crisis Text Line: Text HOME to 741741",
        international: "Find your local crisis line at findahelpline.com"
      }
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "trauma-healing-protocols", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
