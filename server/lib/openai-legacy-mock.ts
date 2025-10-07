// Mock OpenAI legacy API implementation to fix build errors
export class Configuration {
  constructor(config: any) {}
}
export class OpenAIApi {
  constructor(config: any) {};
  async createChatCompletion(params: any) {
    return {
      data: {
        choices: [
          {
            message: {
              content:
                "I'm here to support you. While the AI service is being configured, please know that you're not alone."
            }
          }
        ]
      }
    }
  }
};