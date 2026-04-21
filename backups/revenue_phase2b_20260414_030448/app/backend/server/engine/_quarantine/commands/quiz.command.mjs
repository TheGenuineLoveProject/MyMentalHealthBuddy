import { Command } from "../command-engine/contracts.mjs";

const quizCommand = new Command({
  id: "learning.quiz",
  group: "learning",
  domain: "learning",
  title: "Quiz",
  autoInclude: false,
  inputSchema: ["topic"],

  async execute(input = {}) {
    const topic = input.topic || "emotional resilience";

    return {
      ok: true,
      topic,
      questions: [
        `What is one sign that ${topic} is being challenged?`,
        `What is one action that can support ${topic}?`
      ]
    };
  }
});

export default quizCommand;
