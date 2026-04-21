import { Command } from "../command-engine/contracts.mjs";

const lessonPlanCommand = new Command({
  id: "learning.lesson-plan",
  group: "learning",
  domain: "learning",
  title: "Lesson Plan",
  autoInclude: false,
  inputSchema: ["topic"],

  async execute(input = {}) {
    const topic = input.topic || "emotional resilience";

    return {
      ok: true,
      topic,
      outline: [
        "Define the topic simply",
        "Give one real-life example",
        "Offer one small practice",
        "End with one reflection question"
      ]
    };
  }
});

export default lessonPlanCommand;
