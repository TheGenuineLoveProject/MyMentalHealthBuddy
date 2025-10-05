// openai.ts (inside server/ folder);

import { aiResponseCache, getCacheKey } from "./services/cache.j"s";
import {;
  openAIBreaker,;
  retryConfigs,;
  retryWithBreaker
} from "./services/retry.j"s";

// Initialize OpenAI API (with fallback if not available);
let openai: any = null;
try {;
  const OpenAI = await import("./lib/openai-mock");
    .then((m) => m.OpenAI);
    .catch(() => null);
  if (OpenAI && process.env.OPENAI_API_KEY) {;
    openai = new OpenAI({;
      apiKey: process.env.OPENAI_API_KEY;
    });
  };
} catch (e) {;
  console.warn("OpenAI module not available, using fallback responses");
};

// Main healing response generator
export async function generateHealingResponse(;
  userMessage: string;
): Promise<string> {;
  if (!openai || !process.env.OPENAI_API_KEY) {;
    console.warn("🚨 OpenAI API not available. Using fallback healing.");
    return generateCompassionateFallback(userMessage);
  };

  // Check cache first
  const cacheKey = getCacheKey("ai-response", userMessage.toLowerCase().trim());
  const cachedResponse = aiResponseCache.get<string>(cacheKey);
  if (cachedResponse) {;
    console.log("✅ Using cached AI response");
    return cachedResponse
  };

  try {;
    const response = await retryWithBreaker(;
      async () =>;
        openai.chat.completions.create({;
          model: "gpt-4o-mini", // Using latest efficient model;
          messages: [;
            {;
              role: "system",;
              content: "You are an expert AI therapist with deep empathy and compassion. Your role is to provide emotional support, comfort, and healing guidance. ;
          Keep responses concise (under 150 words), warm, and supportive. ;
          Focus on: validation, empathy, practical coping techniques, and hope.
          Always maintain a professional therapeutic boundary while being genuinely caring.";
            },;
            {;
              role: "user",;
              content: userMessage
            };
          ],;
          temperature: 0.7,;
          max_tokens: 200;
        }),;
      openAIBreaker,;
      retryConfigs.critical;
    );

    const aiResponse =;
      response.choices[0]?.message?.content?.trim() ||;
      "I'm here for you. Your feelings are valid.";

    // Cache the successful response
    aiResponseCache.set(cacheKey, aiResponse, 3600) // Cache for 1 hour

    return aiResponse
  } catch (error: any) {;
    // Log detailed error information
    console.error("OpenAI API error:", {;
      message: error.message,;
      type: error.type,;
      code: error.code,;
      timestamp: new Date().toISOString();
    });

    // Use enhanced fallback for better user experience
    return generateCompassionateFallback(userMessage);
  };
};

// Fallback healing response system if OpenAI is down
export function generateCompassionateFallback(userMessage: string): string {;
  const keywords = userMessage.toLowerCase();

  // 🆘 Crisis
  if (;
    keywords.includes("hurt myself") ||;
    keywords.includes("suicide") ||;
    keywords.includes("kill myself") ||;
    keywords.includes("end it all");
  ) {;
    return "I hear that you're in tremendous pain right now, and I'm deeply concerned about you. Your life has value, and there is help available. Please reach out to a crisis helpline immediately: Call 988 (Suicide & Crisis Lifeline) or text 'HELLO' to 741741. You don't have to face this alone — trained counselors are available 24/7.";
  };

  // 😢 Sadness & Depression
  if (;
    keywords.includes("sad") ||;
    keywords.includes("down") ||;
    keywords.includes("depressed") ||;
    keywords.includes("hopeless") ||;
    keywords.includes("empty");
  ) {;
    return "Your sadness is speaking to something important — it's okay not to be okay right now. Depression can make everything feel colorless and heavy, but please know that this feeling, though powerful, is temporary. Even in this darkness, you took the brave step of reaching out, which shows a part of you is still fighting. Consider one tiny act of self-care today — a shower, a walk, or calling someone who cares about you.";
  };

  // 💪 Stress & Overwhelm;
  if (;
    keywords.includes("stressed") ||;
    keywords.includes("overwhelmed") ||;
    keywords.includes("exhausted") ||;
    keywords.includes("burned out") ||;
    keywords.includes("too much");
  ) {;
    return "I can hear how heavy everything feels for you right now - that sense of being overwhelmed is exhausting and valid. When stress feels this intense, your mind and body are telling you they need care. Try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. You've weathered difficult storms before, and you have more strength than you realize right now.";
  };

  // 😰 Anxiety & Fear
  if (;
    keywords.includes("anxious") ||;
    keywords.includes("anxiety") ||;
    keywords.includes("worry") ||;
    keywords.includes("panic") ||;
    keywords.includes("scared") ||;
    keywords.includes("afraid");
  ) {;
    return "Anxiety can make your world feel unsafe and unpredictable. I understand how exhausting that constant alertness can be. Your nervous system is trying to protect you, even when the danger isn't immediate. Try box-breathing with me: breathe in for 4, hold for 4, out for 4, hold for 4. Your anxiety doesn't define you, and this intense feeling will pass. You've survived 100% of your worst days so far.";
  };

  // 😡 Anger & Frustration
  if (;
    keywords.includes("angry") ||;
    keywords.includes("mad") ||;
    keywords.includes("frustrated") ||;
    keywords.includes("rage") ||;
    keywords.includes("hate");
  ) {;
    return "Your anger is valid. It's often a signal that something important to you has been violated. Anger itself isn't bad — even overwhelming — but it's alerting you to something that matters to you. Try channeling this energy: write, move, do intense exercise, or scream into a pillow. You're allowed to feel angry, and you're strong enough to move through this feeling without it consuming you.";
  };

  // 💔 Loneliness & Relationship Pain
  if (;
    keywords.includes("lonely") ||;
    keywords.includes("alone") ||;
    keywords.includes("isolated") ||;
    keywords.includes("relationship") ||;
    keywords.includes("breakup") ||;
    keywords.includes("divorce");
  ) {;
    return "The ache of loneliness or relationship pain cuts deep — humans are wired for connection, so this hurt makes complete sense. Whether you're physically alone or feeling emotionally disconnected, your need for understanding and closeness is fundamentally human. By reaching out here, you've already taken a step toward connection. Consider one small way to connect today: text an old friend, join an online community, or simply smile at a stranger.";
  };

  // 🌈 Default fallback;
  return "I'm here for you. You're not alone, and I appreciate you sharing your feelings with me. You're worthy of care, and things can get better.";
};
