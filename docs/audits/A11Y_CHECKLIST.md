# Accessibility Checklist - The Genuine Love Project

## Focus States
- [x] All interactive elements have visible focus indicators
- [x] Focus ring uses gold (`--glp-ring`) for visibility
- [x] Focus order follows logical reading order
- [x] Skip link available (header → main content)

## Keyboard Navigation
- [x] All functionality accessible via keyboard
- [x] Tab order follows visual layout
- [x] Escape closes modals/dropdowns
- [x] Arrow keys navigate within components

## Screen Readers
- [x] All images have alt text (or aria-hidden if decorative)
- [x] Icon buttons have aria-label
- [x] Form inputs have associated labels
- [x] Error messages linked via aria-describedby
- [x] Dynamic content uses aria-live regions

## Color & Contrast
- [x] Text meets WCAG AA contrast (4.5:1 for body, 3:1 for large)
- [x] Gold never used for body text (accent only)
- [x] Information not conveyed by color alone
- [x] Focus states visible in all modes

## Motion
- [x] Respects `prefers-reduced-motion`
- [x] No auto-playing animations that distract
- [x] Animation durations under 5 seconds

## Forms
- [x] All inputs have visible labels
- [x] Required fields marked clearly
- [x] Error states include text description
- [x] Form validation messages accessible

## Structure
- [x] Proper heading hierarchy (h1 → h2 → h3)
- [x] Semantic HTML elements used (nav, main, aside, etc.)
- [x] Landmarks present for screen reader navigation
- [x] Tables have headers and captions where used

## Responsive & Zoom
- [x] Content readable at 200% zoom
- [x] No horizontal scroll at standard widths
- [x] Touch targets minimum 44x44px

## ARIA Usage
- [x] ARIA used only when needed
- [x] aria-expanded on toggleable elements
- [x] aria-current on active navigation
- [x] role="status" for live updates

## Crisis Resources
- [x] Crisis hotlines prominently displayed
- [x] One-click access to emergency resources
- [x] Phone numbers are clickable (tel: links)
