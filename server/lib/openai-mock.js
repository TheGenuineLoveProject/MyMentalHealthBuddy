// Mock OpenAI implementation to fix build errors
export class OpenAI {
    constructor(config) {
        this.chat = {
            completions: {
                create: async (params) => {
                    // Fallback response for AI chat
                    return {
                        choices: [{
                                message: {
                                    content: "I'm here to support you. While the AI service is being configured, please know that you're not alone in this journey."
                                }
                            }]
                    };
                }
            }
        };
        this.audio = {
            speech: {
                create: async (params) => {
                    // Mock audio response
                    return {
                        arrayBuffer: async () => new ArrayBuffer(0)
                    };
                }
            },
            transcriptions: {
                create: async (params) => {
                    return {
                        text: "Mock transcription"
                    };
                }
            }
        };
    }
}
