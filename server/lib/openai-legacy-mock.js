// Mock OpenAI legacy API implementation to fix build errors
export class Configuration {
    constructor(config) { }
}
export class OpenAIApi {
    constructor(config) { }
    async createChatCompletion(params) {
        return {
            data: {
                choices: [{
                        message: {
                            content: "I'm here to support you. While the AI service is being configured, please know that you're not alone."
                        }
                    }]
            }
        };
    }
}
