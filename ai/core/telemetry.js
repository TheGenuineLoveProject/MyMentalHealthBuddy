function logEvent(event, data = {}) {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    ...data
  };

  console.log(JSON.stringify(payload));
}

function trackPromptUsage(engine, promptId, inputText) {
  logEvent("prompt_used", {
    engine,
    promptId,
    inputLength: inputText.length
  });
}

function trackOutcome(engine, promptId, success = true) {
  logEvent("prompt_outcome", {
    engine,
    promptId,
    success
  });
}

module.exports = {
  logEvent,
  trackPromptUsage,
  trackOutcome
};
