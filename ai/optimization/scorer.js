function scorePrompt(stats) {
  const usage = stats.usageCount || 0;
  const success = stats.successCount || 0;
  const failure = stats.failureCount || 0;
  const avgLatency = stats.avgLatencyMs || 0;

  const successRate = usage > 0 ? success / usage : 0;
  const failureRate = usage > 0 ? failure / usage : 0;
  const latencyPenalty = avgLatency > 0 ? Math.min(avgLatency / 5000, 1) : 0;

  const score =
    (successRate * 100) -
    (failureRate * 50) -
    (latencyPenalty * 20);

  return {
    usage,
    successRate,
    failureRate,
    avgLatency,
    score: Number(score.toFixed(2))
  };
}

module.exports = { scorePrompt };
