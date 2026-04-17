function logEvent(event, data = {}) {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    ...data
  };

  console.log(JSON.stringify(payload));
  return payload;
}

function trackPromptUsage(engine, promptId, inputText) {
  return logEvent("prompt_used", {
    engine,
    promptId,
    inputLength: String(inputText || "").length
  });
}

function trackOutcome(engine, promptId, success = true) {
  return logEvent("prompt_outcome", {
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