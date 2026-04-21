import { Command } from "../command-engine/contracts.mjs";

const hookGeneratorCommand = new Command({
  id: "growth.hook-generator",
  group: "growth",
  domain: "growth",
  title: "Hook Generator",
  autoInclude: true,
  inputSchema: ["topic"],
  relevanceTags: ["growth", "hooks", "audience", "content", "social"],

  async execute(input = {}) {
    const topic = input.topic || "emotional resilience";

    return {
      ok: true,
      topic,
      hooks: [
        `The quiet reason ${topic} feels harder than it should`,
        `Most people misunderstand ${topic}. Here is the useful part.`,
        `A simple shift that can improve ${topic} starting today`
      ]
    };
  }
});

export default hookGeneratorCommand;
