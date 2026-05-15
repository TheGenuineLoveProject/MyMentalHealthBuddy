export type WritingMetrics = {
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  avgWordLength: number;
  emotionalPace: "slow" | "moderate" | "fast";
  topWords: { word: string; count: number }[];
  readingTime: number;
};

const STOP_WORDS = new Set([
  "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
  "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she",
  "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
  "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
  "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
  "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
  "at", "by", "for", "with", "about", "against", "between", "into", "through",
  "during", "before", "after", "above", "below", "to", "from", "up", "down",
  "in", "out", "on", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "each",
  "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only",
  "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just",
  "don", "should", "now", "d", "ll", "m", "o", "re", "ve", "y", "ain", "aren",
  "couldn", "didn", "doesn", "hadn", "hasn", "haven", "isn", "ma", "mightn",
  "mustn", "needn", "shan", "shouldn", "wasn", "weren", "won", "wouldn",
]);

export function analyzeWriting(text: string): WritingMetrics {
  const cleanText = text.trim();
  if (!cleanText) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      avgWordsPerSentence: 0,
      avgWordLength: 0,
      emotionalPace: "moderate",
      topWords: [],
      readingTime: 0,
    };
  }

  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(sentences.length, 1);

  const avgWordsPerSentence = Math.round((wordCount / sentenceCount) * 10) / 10;

  const totalChars = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, "").length, 0);
  const avgWordLength = Math.round((totalChars / Math.max(wordCount, 1)) * 10) / 10;

  let emotionalPace: "slow" | "moderate" | "fast" = "moderate";
  if (avgWordsPerSentence < 10) emotionalPace = "fast";
  else if (avgWordsPerSentence > 20) emotionalPace = "slow";

  const wordFreq: Record<string, number> = {};
  for (const w of words) {
    const clean = w.toLowerCase().replace(/[^a-zA-Z']/g, "");
    if (clean.length > 2 && !STOP_WORDS.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  }

  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  const readingTime = Math.ceil(wordCount / 200);

  return {
    wordCount,
    sentenceCount,
    avgWordsPerSentence,
    avgWordLength,
    emotionalPace,
    topWords,
    readingTime,
  };
}

export function getWritingInsight(metrics: WritingMetrics): string {
  if (metrics.wordCount === 0) {
    return "Start writing to see your patterns.";
  }

  const insights: string[] = [];

  if (metrics.emotionalPace === "fast") {
    insights.push("Your writing has a quick rhythm - short, direct thoughts.");
  } else if (metrics.emotionalPace === "slow") {
    insights.push("Your writing flows in longer waves - complex, layered thoughts.");
  }

  if (metrics.topWords.length > 0) {
    const topThree = metrics.topWords.slice(0, 3).map(w => w.word);
    insights.push(`Words appearing often: ${topThree.join(", ")}`);
  }

  return insights.join(" ") || "Keep writing to discover your patterns.";
}
