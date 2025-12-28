import { getDailyInsight, getAllInsights } from "../server/insights/daily.mjs";

describe("Daily Insights", () => {
  test("Insight is gentle and non-directive", () => {
    const insight = getDailyInsight();
    expect(insight).not.toMatch(/you should|you must|you need to|fix yourself/i);
  });

  test("All insights follow guardrails", () => {
    const insights = getAllInsights();
    const forbiddenPatterns = [
      /you should/i,
      /you must/i,
      /you need to/i,
      /fix yourself/i,
      /what's wrong with you/i,
      /you are broken/i,
    ];

    insights.forEach((insight) => {
      forbiddenPatterns.forEach((pattern) => {
        expect(insight).not.toMatch(pattern);
      });
    });
  });

  test("Returns a string", () => {
    const insight = getDailyInsight();
    expect(typeof insight).toBe("string");
    expect(insight.length).toBeGreaterThan(0);
  });
});
