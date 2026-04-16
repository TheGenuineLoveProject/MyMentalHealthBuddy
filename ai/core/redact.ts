const PII_PATTERNS: [RegExp, string][] = [
  [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]'],
  [/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,                       '[PHONE]'],
  [/\b\d{3}-\d{2}-\d{4}\b/g,                               '[SSN]'],
  [/\b(?:\d[ -]?){13,16}\b/g,                              '[CARD]'],
];

export function redactPII<T>(data: T): T {
  const str  = JSON.stringify(data);
  const safe = PII_PATTERNS.reduce((s, [re, mask]) => s.replace(re, mask), str);
  return JSON.parse(safe) as T;
}
