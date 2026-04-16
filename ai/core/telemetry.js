const fs = require("fs");

function logEvent(event, data = {}) {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    ...data
  };

  const line = JSON.stringify(payload) + "\n";

  console.log(line);
  fs.appendFileSync("logs/ai.log", line);
}

module.exports = { logEvent };
