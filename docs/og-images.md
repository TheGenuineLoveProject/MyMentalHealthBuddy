# Open Graph Image Strategy

## Overview

OG images improve social sharing appearance. This document outlines our strategy.

## Image Specifications

| Platform | Size | Format |
|----------|------|--------|
| Facebook/LinkedIn | 1200x630 | PNG/JPG |
| Twitter | 1200x600 | PNG/JPG |
| Default | 1200x630 | PNG |

## Image Types

### 1. Default Site Image
- Used when page has no specific OG image
- Located: `/public/og-default.png`
- Content: Logo + tagline + brand colors

### 2. Page-Specific Images
For key pages, create custom OG images:
- Home: Welcome messaging
- Crisis: Crisis resources highlight
- Tools: Tool overview visual

### 3. Dynamic Blog Images
For blog posts, consider:
- Template with title overlay
- Featured image from post
- Author byline

## Implementation

### Meta Tags (in SEO component)
```tsx
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content={ogImage} />
```

### Fallback Chain
1. Page-specific OG image
2. Category default image
3. Site-wide default image

## Design Guidelines

- Include brand logo
- Use brand colors (HSL values from design tokens)
- Text: Max 10 words (readable at small sizes)
- High contrast for accessibility
- No tiny text (<24px effective)

## Testing

Use these validators:
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

## Future Enhancement

Consider dynamic OG image generation:
- @vercel/og or similar
- Generate on-the-fly from content
- Reduces manual image creation
