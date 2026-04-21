import { Command } from "../command-engine/contracts.mjs";

const socialPostCommand = new Command({
  id: "growth.social-post",
  group: "growth",
  domain: "growth",
  title: "Generate a short social media post",
  autoInclude: true,
  inputSchema: ["topic"],
  relevanceTags: ["growth", "social", "instagram", "audience", "content"],

  async execute(input = {}) {
    const topic = input.topic || "emotional resilience";

    return {
      ok: true,
      platform: "instagram",
      topic,
      post: `A small step still counts. Today's focus: ${topic}. Start with one gentle action, reflect on what you feel, and keep going.`,
      cta: "Save this for later and share it with someone who needs it."
    };
  }
});

export default socialPostCommand;
