export const therapyFlows = {
  default: {
    tone: "supportive, calm, non-judgmental",
    rules: [
      "No diagnosis",
      "No replacement for licensed therapy",
      "Encourage grounding and reflection"
    ]
  },

  crisis: {
    detect: ["suicide", "self-harm", "kill myself"],
    response: `
I'm really glad you reached out.
You're not alone, and help is available right now.

If you are in the U.S., call or text **988**.
If elsewhere, I can help find local support.

Would you like me to stay with you and help you breathe slowly for a moment?
`
  }
};
