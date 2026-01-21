# Canva Template Specifications - The Genuine Love Project

**Last Updated:** January 2026  
**Brand System:** Deep Teal + Gold Power Pair

---

## Canvas Sizes

### Square (Instagram Feed, Facebook)
- **Dimensions:** 1080 x 1080 px
- **Safe Zone:** 80px margin all sides (960 x 960 px usable)
- **Bleed:** None required for digital

### Story/Reel (Instagram, TikTok, Pinterest)
- **Dimensions:** 1080 x 1920 px
- **Safe Zone:** 80px sides, 200px top/bottom (account for UI overlays)
- **Usable Content Area:** 920 x 1520 px

---

## Grid System

### 12-Column Grid
- **Column Width:** 73px (1080 / 12 = 90px with gutters)
- **Gutter:** 16px
- **Margins:** 80px left/right

### Baseline Grid
- **Base Unit:** 8px
- **Line Height Multiples:** 24px, 32px, 40px, 48px

### Alignment Rules
1. All elements snap to 8px grid
2. Text blocks align to column edges
3. Icons/graphics center on column intersections
4. Spacing between elements: 16px, 24px, 32px, 48px

---

## Typography Scale

### Headings (Playfair Display)

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Hero | 72px | 600 | 1.1 | Single-word impact |
| Title | 56px | 600 | 1.15 | Main headline |
| Subtitle | 40px | 400 | 1.2 | Supporting headline |
| Section | 32px | 600 | 1.25 | Card titles |

### Body Text (Inter)

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Lead | 24px | 400 | 1.5 | Intro paragraphs |
| Body | 18px | 400 | 1.65 | Main content |
| Caption | 14px | 500 | 1.4 | Labels, metadata |
| Micro | 12px | 500 | 1.3 | Legal, timestamps |

### Mobile Adjustments
- Hero: 56px
- Title: 44px
- Subtitle: 32px
- Section: 24px

---

## Color Usage

### Primary Backgrounds

| Surface | Color | Hex | Usage |
|---------|-------|-----|-------|
| Ivory | Warm white | `#FAF9F7` | Default background |
| White | Pure white | `#FFFFFF` | Cards, overlays |
| Deep Teal | Primary brand | `#2F5D5D` | Hero sections, CTAs |

### Text Colors

| Role | Color | Hex | On Surface |
|------|-------|-----|------------|
| Primary Text | Charcoal | `#3A3A3A` | Ivory/White |
| Contrast Text | Ivory | `#FAF9F7` | Deep Teal |
| Accent Text | Deep Teal | `#2F5D5D` | Ivory (headings only) |

### Accent Usage

| Element | Color | Hex | Notes |
|---------|-------|-----|-------|
| Highlight | Gold | `#EAC33B` | Sparingly, never body text |
| Support | Sage | `#8FBF9F` | Soft backgrounds, icons |
| Emotion | Blush | `#F4C7C3` | Rare, emotional moments |

---

## Template Types

### Quote Card (1080 x 1080)

```
┌────────────────────────────────────┐
│           80px margin              │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │    "Quote text here in      │  │
│  │     Playfair Display 40px   │  │
│  │     centered, charcoal"     │  │
│  │                              │  │
│  │         — Attribution        │  │
│  │         Inter 18px          │  │
│  │                              │  │
│  │     [GLP Logo / Mark]       │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│           80px margin              │
└────────────────────────────────────┘
```

**Specs:**
- Background: Ivory (`#FAF9F7`)
- Quote: Playfair Display 40px, Charcoal
- Attribution: Inter 18px, 72% opacity Charcoal
- Optional: Gold accent line above quote (2px, 120px width)
- Logo: Bottom center, 48px height

### Prompt Card (1080 x 1080)

```
┌────────────────────────────────────┐
│      Deep Teal background          │
│  ┌──────────────────────────────┐  │
│  │   [Icon - thin outline]     │  │
│  │        40px, Ivory          │  │
│  │                              │  │
│  │    "Journal Prompt"         │  │
│  │     Inter 14px caps         │  │
│  │                              │  │
│  │   Main prompt text here     │  │
│  │   Playfair Display 36px     │  │
│  │   Ivory, centered           │  │
│  │                              │  │
│  │   [Subtle decorative orb]   │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│         [GLP wordmark]             │
└────────────────────────────────────┘
```

**Specs:**
- Background: Deep Teal (`#2F5D5D`)
- Label: Inter 14px, uppercase, letter-spacing 2px, Ivory
- Prompt: Playfair Display 36px, Ivory
- Icon: Lucide-style, 40px, thin stroke, Ivory
- Decorative: Sage orb at 10% opacity, positioned off-center

### Carousel Slide (1080 x 1080)

**Cover Slide:**
- Background: Deep Teal with subtle sage gradient
- Title: Playfair Display 48px, Ivory
- Subtitle: Inter 20px, Ivory at 85% opacity
- Gold accent line: 4px, 200px width, centered below title

**Content Slides:**
- Background: Ivory
- Number: Playfair Display 72px, Teal at 20% opacity (top left)
- Heading: Playfair Display 32px, Charcoal
- Body: Inter 20px, Charcoal, 1.6 line height
- Max 3 bullet points per slide

**Final Slide (CTA):**
- Background: Deep Teal
- CTA Text: Inter 24px bold, Ivory
- Button style: Ivory background, Teal text, rounded corners

### Story Template (1080 x 1920)

```
┌────────────────────────────────────┐
│         200px safe zone            │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │   [Decorative sage orb]     │  │
│  │                              │  │
│  │                              │  │
│  │    Main content area        │  │
│  │    Playfair 48-56px         │  │
│  │    centered vertically      │  │
│  │                              │  │
│  │                              │  │
│  │   [Supporting text]         │  │
│  │   Inter 20px                │  │
│  │                              │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│         200px safe zone            │
│   [GLP logo mark - bottom center]  │
└────────────────────────────────────┘
```

---

## Visual Elements

### Decorative Orbs
- **Size:** 200-400px diameter
- **Color:** Sage (`#8FBF9F`) at 10-15% opacity
- **Blur:** 80-120px Gaussian blur
- **Position:** Off-center, bleeding off canvas edges

### Accent Lines
- **Width:** 2-4px
- **Length:** 80-200px
- **Color:** Gold (`#EAC33B`)
- **Usage:** Above quotes, below headlines

### Icons
- **Style:** Lucide-style thin outline (1.5-2px stroke)
- **Size:** 32px (small), 48px (medium), 64px (large)
- **Color:** Match text color of context

### Logo Placement
- **Size:** 48px height (scaled proportionally)
- **Position:** Bottom center, 60px from bottom edge
- **Versions:** Full wordmark (Ivory on Teal, Teal on Ivory)

---

## Export Settings

### Instagram/Social
- **Format:** PNG
- **Resolution:** 1x (1080px)
- **Color Profile:** sRGB

### Print-Ready
- **Format:** PDF
- **Resolution:** 300 DPI
- **Color Profile:** CMYK (convert from sRGB)

---

## Checklist Before Export

1. All text within safe zones
2. No text smaller than 14px
3. Gold used only for accents (not body text)
4. Consistent 8px grid alignment
5. Logo present on every template
6. Contrast ratio meets accessibility standards
7. No stretched or warped elements
