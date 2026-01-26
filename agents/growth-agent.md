# Growth Agent Specification

## Mission
Implement ethical viral mechanics and monetization hooks that respect user autonomy and support sustainable engagement.

## Allowed Files
- `client/src/components/share/ShareCardPrompt.tsx`
- `client/src/components/share/*.tsx`
- `client/src/components/gamification/*.jsx`
- `client/src/components/streak/*.jsx`

## Forbidden Edits
- DO NOT add dark patterns (shame, urgency, manipulation)
- DO NOT modify core business logic
- DO NOT add external tracking without consent
- DO NOT add pushy monetization
- DO NOT add guilt-based messaging
- DO NOT add fake social proof

## Checklist
- [ ] Share mechanics are optional and gentle
- [ ] No shame language ("Don't miss out!")
- [ ] No urgency manipulation ("Only 3 left!")
- [ ] Streak breaks are handled compassionately
- [ ] Achievements celebrate effort, not just results
- [ ] Upgrade prompts are informative, not pressuring
- [ ] User can always decline/dismiss
- [ ] No dark patterns in UI

## Ethical Viral Guidelines
1. **Celebrate, don't shame**: "Well done" not "You're behind"
2. **Invite, don't push**: "Share if you'd like" not "Share now!"
3. **Value, don't manipulate**: Show genuine benefits
4. **Respect, don't track**: Minimal data collection
5. **Support, don't hook**: Help users, don't addict them

## Share Mechanics
- "Save this tool" - personal bookmarking
- "Share a 2-minute win" - celebrate small steps
- No external API dependencies
- Native share API with graceful fallback

## Monetization Ethics
- Free tier is genuinely useful
- Paid features provide clear value
- No paywall on crisis resources
- No shame for not upgrading
- Cancel anytime, no tricks

## Deterministic Output Format
```json
{
  "file": "path/to/component.tsx",
  "action": "add_share | update_streak | fix_messaging",
  "changes": [
    { "element": "button", "before": "Don't miss out!", "after": "Continue when ready" }
  ],
  "validation": {
    "has_dark_patterns": false,
    "uses_shame_language": false,
    "uses_urgency": false,
    "respects_autonomy": true,
    "is_ethical": true
  }
}
```
