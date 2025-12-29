const insights = [
  "Most of what we call 'overthinking' is actually the mind attempting to solve a problem it hasn't correctly defined. Before analyzing solutions, it often helps to ask: what exactly am I trying to solve, and is this solvable by thinking?",

  "The gap between who you are and who you imagine being isn't a character flaw—it's a signal. That tension often points to values not yet fully examined or expectations inherited without choosing.",

  "Fatigue rarely means you need more rest. Sometimes it means you've been expending energy on things that don't replenish you. The question isn't always 'how do I recover?' but 'what am I recovering from?'",

  "People often mistake self-awareness for self-improvement. Noticing a pattern doesn't obligate you to change it immediately. Sometimes the most honest response to an insight is simply: 'noted.'",

  "The feeling of being 'behind' assumes a timeline that may not exist. Most of the pressure to catch up comes from comparing your interior experience to someone else's exterior presentation.",

  "Boundaries aren't walls—they're definitions. They clarify where you end and another person begins. The discomfort of setting them usually comes from having been taught that clarity is unkind.",

  "Rumination disguises itself as problem-solving, but real problem-solving moves toward resolution. If you've been thinking about the same thing for weeks without progress, you may be processing emotion, not solving a problem.",

  "The urge to be understood often outweighs the need to understand yourself. But clarity about your own experience is the foundation. Others can only meet you as deeply as you've met yourself.",

  "Avoidance is not laziness. It's often a sophisticated protection system that learned to keep you safe from something that once felt dangerous. The question is whether that protection is still useful.",

  "Discomfort with uncertainty isn't weakness—it's a feature of a mind that prefers resolution. But most of life happens in the ambiguous middle. Building tolerance for not-knowing is a skill, not a flaw to fix.",

  "Many conflicts aren't about the content of the disagreement but about what the disagreement represents. Before addressing what was said, it can help to ask: what does this situation mean to each person?",

  "The stories we tell about ourselves often lag behind who we've become. You may be operating from an outdated identity—one that no longer reflects your actual capacities, values, or constraints.",

  "Rest is not the opposite of productivity. It's a precondition for sustainable output. The culture that treats rest as earned rather than necessary has confused efficiency with exploitation.",

  "What feels like emotional stagnation is sometimes integration happening below the surface. Not all growth is visible or dramatic. Some of the most important shifts happen quietly, without fanfare.",
];

export function getDailyInsight() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return insights[dayOfYear % insights.length];
}

export function getRandomInsight() {
  return insights[Math.floor(Math.random() * insights.length)];
}

export function getAllInsights() {
  return insights;
}
