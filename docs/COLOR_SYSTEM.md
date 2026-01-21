# The Genuine Love Project — Color System (v17)
**Primary pair:** Green-Teal + Gold  
**Purpose:** Calm, grounded trust + premium warmth, without visual noise.

## 1) Brand Palette (Core)
- **Green-Teal (Primary):** `#2F5D5D`
- **Gold (Accent):** `#EAC33B`
- **Ivory (Background):** `#FAF9F7`
- **Charcoal (Text):** `#3A3A3A`
- **Sage (Support):** `#8FBF9F` (soft surfaces, supportive highlights)
- **Blossom (Support):** `#F4C7C3` (rare emotional accent only)

## 2) Semantic Tokens (Single Source of Truth)
### Meaning
- `primary` = actions, nav, CTAs, key UI structure
- `accent` = focus, premium emphasis, badges, “spark” moments
- `bg/surface` = calm breathable layouts
- `text` = high readability, non-clinical calm authority

### Allowed usage map
- **Buttons (Primary):** `primary` background + `primary-contrast` text
- **Focus ring:** `accent` only
- **Links:** `primary` + underline on hover
- **Warnings/Errors:** reserved semantic states only (do not use gold as warning)

## 3) Accessibility (Hard Rules)
- **Body text:** must be `text-1` (charcoal) on light surfaces.
- **Gold is NOT body text.** Gold may be used for:
  - focus ring
  - small icon accents
  - badges/chips
  - large highlight words (headline-size only)

### Safe pairings (recommended)
- **Charcoal on Ivory:** `#3A3A3A` on `#FAF9F7` (default reading)
- **Ivory on Green-Teal:** `#FAF9F7` on `#2F5D5D` (CTA)
- **Green-Teal on Ivory:** headings, nav links
- **Gold on Green-Teal:** small accents, badges, lines, icons (NOT paragraphs)

## 4) Do / Don’t
### Do
- Use Green-Teal for structure and action clarity.
- Use Gold sparingly (premium + focus + emphasis).
- Keep lots of Ivory space.
- Use Sage/Blossom only as soft supports.

### Don’t
- Don’t use Gold for paragraphs or dense UI text.
- Don’t introduce non-brand colors.
- Don’t do high-saturation neon variants.
- Don’t put Green-Teal text on Sage backgrounds unless contrast is verified.

## 5) UI Recipes (Standardized)
### Primary Button
- Background: `primary`
- Text: `primary-contrast`
- Focus ring: `accent`
- Hover: darker teal (token-derived)

### Secondary Button
- Background: transparent
- Border: `primary`
- Text: `primary`
- Focus ring: `accent`

### Card
- Background: `surface-1`
- Border: subtle neutral
- Shadow: minimal (disabled in low-stim mode)

## 6) Modes
- **Default:** balanced teal/gold
- **Low-Stimulation:** lower saturation + remove decorative shadows
- **Reading:** maximize contrast + reduce decoration