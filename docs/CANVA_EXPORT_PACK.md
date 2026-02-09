# The Genuine Love Project — Canva Export Pack

> Visual scripting guide for creating on-brand social and content assets in Canva.
> No Canva API required — this is a human-operated design playbook.

---

## Brand Palette Reference

All colors reference existing brand tokens from `client/src/styles/brand-tokens.css`:

| Token | Hex | Usage |
|---|---|---|
| `--glp-sage` | `#8fbf9f` | Calming backgrounds, secondary elements |
| `--glp-sage-deep` | `#2f5d5d` | Primary text, headers, buttons |
| `--glp-blush` / `--glp-rose` | `#f4c7c3` | Warm accents, highlight backgrounds |
| `--glp-paper` | `#faf9f7` | Light backgrounds, card surfaces |
| `--glp-ink` | `#3a3a3a` | Body text, readable content |
| `--glp-gold` | `#eac33b` | Premium accents, CTAs, highlights |
| `--glp-gold-dark` | `#ddb12d` | Gradient endpoint for gold elements |

**Do not invent new brand colors.** Use only the palette above.

---

## Export Naming Convention

```
GLP_YYYYMMDD_theme_format.png
```

Examples:
- `GLP_20260209_trust_quote-card.png`
- `GLP_20260209_boundaries_carousel-01.png`
- `GLP_20260209_safety_reels-cover.png`

---

## Template 1: Quote Card (Square)

**Dimensions:** 1080 × 1080 px
**Use:** Instagram feed, X/Twitter, Facebook

### Layout
- Background: `--glp-paper` (#faf9f7) or soft gradient from `--glp-sage` to `--glp-paper`
- Quote text: Centered, `--glp-sage-deep` (#2f5d5d)
- Attribution line: Below quote, `--glp-ink` (#3a3a3a), smaller size
- Bottom bar: Thin strip of `--glp-gold` (#eac33b) with logo monogram

### Typography
- Quote: Serif font (e.g., Playfair Display, Lora), 36–48pt
- Attribution: Sans-serif (e.g., Inter, Open Sans), 16–20pt
- URL: Sans-serif, 14pt, `--glp-sage-deep`

### Sample Copy (from Post ns-001)
> "Some of the most important work happens in private — in the space between you and your own thoughts."
>
> — The Genuine Love Project

### Export
`GLP_YYYYMMDD_[theme]_quote-card.png`

---

## Template 2: Carousel (5 Slides)

**Dimensions:** 1080 × 1350 px (4:5 portrait)
**Use:** Instagram carousel, LinkedIn

### Slide Layout

**Slide 1 — Cover**
- Background: Gradient from `--glp-sage-deep` to `--glp-sage`
- Title text: White, serif, 42pt, centered
- Subtitle: `--glp-paper`, sans-serif, 20pt
- Swipe indicator: Small arrow + "Swipe" text in `--glp-gold`

**Slides 2–4 — Content**
- Background: `--glp-paper`
- Content text: `--glp-ink`, sans-serif, 22–26pt
- Accent number/bullet: `--glp-gold` circle or `--glp-sage` marker
- Top bar: 4px strip of `--glp-sage`

**Slide 5 — Closing**
- Background: `--glp-sage-deep`
- CTA text: White, sans-serif, 24pt
- URL: `--glp-gold`, 18pt
- Logo: Centered, small

### Sample Copy (from Post ns-003)
- Slide 1: "What ethical wellness tools look like"
- Slide 2: "We don't track streaks to make you feel guilty."
- Slide 3: "We don't send notifications to pull you back."
- Slide 4: "Your wellness journey isn't our engagement metric."
- Slide 5: "Explore at your pace → thegenuineloveproject.com/blog"

### Export
`GLP_YYYYMMDD_[theme]_carousel-01.png` through `carousel-05.png`

---

## Template 3: Reels Cover (Vertical)

**Dimensions:** 1080 × 1920 px (9:16)
**Use:** Instagram Reels, TikTok, YouTube Shorts thumbnail

### Layout
- Background: `--glp-sage-deep` solid or gradient to `--glp-sage`
- Title text: White, serif, 48–56pt, upper-center
- Subtitle: `--glp-paper`, sans-serif, 22pt
- Bottom strip: `--glp-gold` bar with logo + URL
- Safe zone: Keep text within center 60% (avoid top/bottom UI overlaps)

### Typography
- Title: Serif, bold, 48–56pt
- Subtitle: Sans-serif, regular, 20–24pt

### Sample Copy (from Post ns-007)
> "We won't tell you we can heal your trauma."
>
> Because no app can. Here's what we actually offer.

### Export
`GLP_YYYYMMDD_[theme]_reels-cover.png`

---

## Template 4: Story (Vertical)

**Dimensions:** 1080 × 1920 px (9:16)
**Use:** Instagram Stories, Facebook Stories

### Layout
- Background: `--glp-paper` with subtle `--glp-sage` geometric shapes or leaf pattern
- Text block: Centered, `--glp-sage-deep`, serif, 32–40pt
- CTA area: Bottom third, `--glp-gold` rounded button shape with "Tap to explore" text
- Logo: Top-left corner, small, semi-transparent

### Typography
- Main text: Serif, 32–40pt
- CTA text: Sans-serif, bold, 18pt

### Sample Copy (from Post ns-008)
> "Every prompt on our platform is invitational."
>
> Wellness tools should ask, not demand.

### Export
`GLP_YYYYMMDD_[theme]_story.png`

---

## Template 5: Newsletter Header Image

**Dimensions:** 600 × 200 px (3:1 landscape)
**Use:** Email newsletter header (Resend templates)

### Layout
- Background: Gradient from `--glp-sage` to `--glp-paper`
- Logo: Left-aligned, 48px height
- Title text: Right of logo, `--glp-sage-deep`, sans-serif, 24pt
- Tagline: Below title, `--glp-ink`, 14pt, "Live in Genuine Love"
- Bottom edge: 2px `--glp-gold` line

### Typography
- Title: Sans-serif, semi-bold, 24pt
- Tagline: Sans-serif, regular, 14pt

### Sample Copy
> The Genuine Love Project
>
> A quieter kind of wellness

### Export
`GLP_YYYYMMDD_newsletter-header.png`

---

## Template 6: Blog Featured Image

**Dimensions:** 1200 × 630 px (≈1.9:1 landscape)
**Use:** Blog post header, Open Graph image, social sharing preview

### Layout
- Background: `--glp-paper` with soft `--glp-sage` gradient edge
- Title text: Centered, `--glp-sage-deep`, serif, 36–42pt
- Subtitle/category: Above title, `--glp-gold`, sans-serif, uppercase, 14pt
- Logo: Bottom-right corner, small
- Border: Optional 1px `--glp-sage` frame with rounded corners

### Typography
- Category: Sans-serif, uppercase, letter-spacing 2px, 14pt
- Title: Serif, 36–42pt
- URL: Sans-serif, 12pt, bottom-center

### Sample Copy (from Post ns-005)
> COMMUNITY
>
> A quiet space for people exploring what it means to live with a little more self-awareness.

### Export
`GLP_YYYYMMDD_[theme]_blog-featured.png`

---

## General Design Notes

1. **Whitespace is intentional.** Don't fill every pixel. Let the content breathe.
2. **Avoid stock photos of people.** Use abstract patterns, nature textures, or solid colors.
3. **Logo usage:** Use the monogram (`brand/logo-monogram.png`) for small placements. Use the full logo (`brand/logo.png`) only on covers and headers.
4. **Accessibility:** Ensure text contrast ratio meets WCAG AA (4.5:1 for normal text, 3:1 for large text).
5. **No watermarks or "follow us" overlays.** Keep it clean and invitational.

---

*Last updated: 2026-02-09*
*References: `client/src/styles/brand-tokens.css`*
