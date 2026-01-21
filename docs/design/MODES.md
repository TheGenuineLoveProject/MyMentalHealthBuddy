# Visual Modes - The Genuine Love Project

## Overview
Three visual modes optimize the experience for different user needs:

## Default Mode
**Trigger:** No `data-mode` attribute (or `data-mode="default"`)

| Property | Value |
|----------|-------|
| Shadows | Full (`--glp-shadow-1/2`) |
| Gold | Vibrant (#EAC33B) |
| Background | Ivory (#FAF9F7) |
| Decorative Orbs | Visible |
| Gradients | Full richness |

Best for: General browsing, marketing pages

## Low-Stim Mode
**Trigger:** `<html data-mode="low-stim">`

| Property | Value |
|----------|-------|
| Shadows | Removed (none) |
| Gold | Quieter (#D9B43A) |
| Background | Slightly muted |
| Decorative Orbs | Hidden via CSS |
| Gradients | Simplified |

Best for: Sensory-sensitive users, focus tasks

## Reading Mode
**Trigger:** `<html data-mode="reading">`

| Property | Value |
|----------|-------|
| Shadows | Minimal |
| Background | Pure white (#FFFFFF) |
| Text | Darker (#2A2A2A) |
| Decorative Elements | Minimal |
| Line Height | Optimized for reading |

Best for: Long-form content, journaling, accessibility

## Implementation
```javascript
// Toggle mode
function setMode(mode) {
  document.documentElement.dataset.mode = mode;
  localStorage.setItem('glp-mode', mode);
}

// Initialize from localStorage
const savedMode = localStorage.getItem('glp-mode') || 'default';
if (savedMode !== 'default') {
  document.documentElement.dataset.mode = savedMode;
}
```

## Mode Toggle Location
Header dropdown with options: Default / Low-Stim / Reading
