# Content Quality Assurance Checklist

## Before Publishing

### Content Tier Compliance
- [ ] Uses ONLY Beginner/Intermediate/Advanced tier labels
- [ ] No "reading level", "grade level", or legacy terms
- [ ] Content difficulty matches selected tier

### Safety & Compliance
- [ ] 18+ age gate on wellness content
- [ ] Safety footer present
- [ ] Crisis resources linked where appropriate
- [ ] Educational-only framing (not therapy/diagnosis)
- [ ] No harmful content or misinformation

### Accessibility (WCAG AA)
- [ ] Heading hierarchy correct (H1 → H2 → H3)
- [ ] Alt text for all images
- [ ] Color contrast sufficient (4.5:1 text)
- [ ] Links are descriptive (not "click here")
- [ ] Content works with screen readers

### SEO Requirements
- [ ] Title tag < 60 characters
- [ ] Meta description 150-160 characters
- [ ] One H1 per page
- [ ] Canonical URL set
- [ ] OG tags complete

### Editorial Standards
- [ ] Spelling and grammar checked
- [ ] Tone is trauma-informed and supportive
- [ ] No copyrighted content
- [ ] Sources cited where needed
- [ ] Reviewed by second person (if substantial)

## Automated Checks

Run before publish:
```bash
npm run content-check  # Tier compliance
npm run lint           # Code quality
npm run build          # Build validation
```

## Review Workflow

1. **Draft** → Author creates content
2. **Review** → Editor checks quality
3. **Approve** → Meets all criteria
4. **Publish** → Live on site

## Escalation

Flag for additional review if:
- Discusses crisis/self-harm topics
- Makes health-related claims
- Contains personal stories
- Addresses trauma directly
