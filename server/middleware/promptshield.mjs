const INJECTION_PATTERNS = [
  /ignore (all )?previous instructions/i,
  /system prompt/i,
  /developer message/i,
  /reveal.*(keys?|secrets?|tokens?|password)/i,
  /act as.*unrestricted/i,
  /\bjailbreak\b/i,
  /\bdan mode\b/i,
  /bypass.*(rules?|filters?|safety)/i,
  /disregard.*instructions/i,
];

export function promptShield(req, res, next) {
  const text = JSON.stringify(req.body ?? {});
  for (const re of INJECTION_PATTERNS) {
    if (re.test(text)) {
      return res.status(400).json({
        error: "prompt_injection_detected",
        message: "Your message contains patterns we don't process. Please rephrase.",
      });
    }
  }
  next();
}

export default promptShield;
