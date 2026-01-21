# Content Maintenance Workflow

This guide covers how to add and maintain content on The Genuine Love Project platform while maintaining quality, consistency, and ethical standards.

## Ethical Engagement Principles

**We do NOT use:**
- Infinite scroll or addictive mechanics
- Manipulative notifications or "hooks"
- Loot-box or gambling-style features
- Fear-based messaging or urgency tactics

**We prioritize:**
- User-controlled experiences
- Calm, consent-based interactions
- Saved items and progress journaling
- Gentle, optional reminders
- Clear exits and boundaries

---

## Adding Glossary Terms

Location: `client/src/pages/GlossaryPage.jsx`

### Format
```javascript
{
  term: "Term Name",
  category: "Category", // Psychology, Neuroscience, Practice, Therapy, Behavior, etc.
  definition: "Clear, accessible definition without jargon.",
  example: "A practical, relatable example of this term in action."
}
```

### Categories Available
- Neuroscience
- Psychology
- Practice
- Therapy
- Behavior
- Skills
- Relationships
- Mental Health

### Quality Checklist
- [ ] Definition is under 100 words
- [ ] Uses everyday language
- [ ] Example is specific and relatable
- [ ] No medical claims or diagnoses
- [ ] Category matches existing options

---

## Adding Q&A Entries

Location: `client/src/pages/QAPage.jsx`

### Format
```javascript
{
  category: "category-id",
  question: "Question in natural language?",
  answer: "Clear, supportive answer. Include actionable guidance where appropriate."
}
```

### Categories
- `getting-started` - Platform orientation
- `healing-basics` - Foundational healing concepts
- `mental-health` - Educational mental health info
- `practices` - Tools and techniques
- `crisis` - Crisis support and resources
- `community` - Community features

### Quality Checklist
- [ ] Question reflects real user needs
- [ ] Answer is concise (under 150 words ideal)
- [ ] Includes actionable next step when relevant
- [ ] No diagnostic language
- [ ] Crisis content links to professional resources

---

## Adding News/Updates

Location: `client/src/pages/NewsPage.jsx`

### Format
```javascript
{
  id: unique_number,
  category: "research" | "wellness" | "features" | "community",
  title: "Clear, engaging title",
  summary: "2-3 sentence summary of the content",
  date: "YYYY-MM-DD",
  readTime: "X min",
  featured: true | false,
  link: "/internal-route"
}
```

### Quality Checklist
- [ ] Title is clear and non-clickbait
- [ ] Summary accurately represents content
- [ ] Date is accurate
- [ ] Link points to valid route in App.jsx
- [ ] Featured sparingly (max 2 at a time)

---

## Adding Examples

Location: `client/src/pages/ExamplesPage.jsx`

### Format
```javascript
{
  id: "unique-slug",
  category: "Category Name",
  title: "Scenario Title",
  scenario: "Relatable situation description",
  steps: [
    { step: "Step Name", detail: "What to do and why" }
  ],
  outcome: "Expected positive result",
  relatedTools: ["/tool-path"],
  timeNeeded: "X minutes"
}
```

### Quality Checklist
- [ ] Scenario is specific and relatable
- [ ] Steps are actionable and clear
- [ ] Outcome is realistic (not cure/fix language)
- [ ] Related tools link to valid routes
- [ ] Time estimate is accurate

---

## Tone Guidelines

### DO Use
- "May help with..." (not "will cure")
- "Many people find..." (not "this fixes")
- "Consider trying..." (not "you must do")
- "Professional support is available..." (not "you need therapy")
- "This is one approach..." (not "the only way")

### DON'T Use
- Medical diagnoses or clinical terms without context
- Promises of cures or guaranteed results
- Fear-based or urgent language
- Shaming or judgmental phrases
- Over-promising ("life-changing", "miracle")

---

## Review Checklist Before Publishing

### Content Quality
- [ ] Spell-checked and grammar-verified
- [ ] Links tested and working
- [ ] No raw hex colors (use tokens)
- [ ] Consistent with existing tone
- [ ] Mobile-friendly formatting

### Technical Compliance
- [ ] Routes added to App.jsx if new page
- [ ] Imports updated correctly
- [ ] Build passes: `npm run build`
- [ ] Audit passes: `npm run audit`
- [ ] Test passes: `npm run test:auth`

### Ethical Review
- [ ] No manipulative engagement tactics
- [ ] User controls the experience
- [ ] Clear exit points
- [ ] No addictive patterns
- [ ] Respects user boundaries

---

## Quick Reference: Run Governance Loop

```bash
npm run governance:loop
```

This runs:
1. `npm install` - Ensure dependencies
2. `npm run test:auth` - Authentication tests
3. `npm run audit` - Visual and nav audits
4. `npm run build` - Production build

All must pass before deploying changes.
