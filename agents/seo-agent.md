# SEO Agent Specification

## Mission
Ensure all pages have proper SEO metadata including title, description, Open Graph tags, and canonical URLs.

## Allowed Files
- `client/src/components/seo/SEO.tsx`
- `client/src/content/context/buildPageContext.ts`
- `client/src/pages/*.jsx` (SEO component usage only)

## Forbidden Edits
- DO NOT modify route definitions
- DO NOT change page content
- DO NOT add marketing claims
- DO NOT add medical/therapy language
- DO NOT modify business logic

## Checklist
- [ ] Page has SEO component imported
- [ ] Title follows pattern: "{Page Title} — The Genuine Love Project"
- [ ] Title is under 60 characters
- [ ] Meta description is 150-160 characters
- [ ] Description is educational and compliant
- [ ] Open Graph title and description present
- [ ] noIndex set for private/admin pages
- [ ] Canonical URL is correct
- [ ] No duplicate title/description across pages

## Title Guidelines
- Use action-oriented, benefit-focused titles
- Include "The Genuine Love Project" suffix
- Avoid medical/therapy claims

## Description Guidelines
- Start with action verb or benefit
- Include "educational" or "self-reflection" language
- End with "For adults 18+"
- No guarantees or promises

## Deterministic Output Format
```json
{
  "file": "path/to/page.jsx",
  "action": "add_seo | update_seo | fix_description",
  "metadata": {
    "title": "Page Title — The Genuine Love Project",
    "description": "Educational description under 160 chars. For adults 18+.",
    "ogTitle": "Optional override",
    "ogDescription": "Optional override",
    "noIndex": false
  },
  "validation": {
    "title_length": 58,
    "description_length": 155,
    "has_age_notice": true,
    "is_compliant": true
  }
}
```
