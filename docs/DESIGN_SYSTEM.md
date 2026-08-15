# 🎈🎈 twoballoons Design System: Sahara — Warm Minimalism

> **North Star**: *"Sun-Baked Simplicity"* — Luxurious warmth meets disciplined minimalism. Golden tones, editorial serif headings, and abundant whitespace.

---

## 1. Palette Tokens (Warm-Shifted Terracotta & Parchment)

The entire palette is warm-shifted. Even grays have warm undertones. Never cold white.

| Token Name | Hex Code | Purpose / Usage |
| :--- | :---: | :--- |
| **`primary`** | `#c2652a` | Burnt sienna — warm, earthy CTAs, brand mark, and active focus states. |
| **`primary-container`** | `#e08850` | Secondary sienna fills, badge borders, active selection glow. |
| **`background`** | `#faf5ee` | Warm linen base canvas — never stark or cold white. |
| **`on-background`** | `#3a302a` | Primary rich charcoal text, titles, heading labels. |
| **`surface`** | `#faf5ee` | Card and popup base surface. |
| **`surface-container`** | `#f2ece4` | Secondary button hover states, toolbar dropdown items. |
| **`surface-container-low`** | `#f6f0e8` | HUD headers, explorer titlebars, modal navigation tabs. |
| **`on-surface-variant`** | `#605850` | Muted text, secondary menu items, parameter labels. |
| **`outline`** | `#9a9088` | Icons, inactive tool indicators, subtle dividers. |
| **`outline-variant`** | `#d8d0c8` | Borders (thin and warm at 60% opacity). |
| **`tertiary`** | `#8c3c3c` | Dusty rose — sparse accent for epistemic emphasis and invariants. |

---

## 2. Typography Rules (Editorial Luxury Serif/Sans Pairing)

- **Headlines & Display**: `EB Garamond` — Elegant, editorial serif. Large sizes with tight leading for a luxury editorial feel.
- **Body & Controls**: `Manrope` — Clean, geometric sans-serif providing modern contrast to the serif.
- **Code & Syntax**: `monospace` / `JetBrains Mono` — Monospace formatting for BalloonDSL and reasoning streams.

---

## 3. Elevation & Surfaces

- **Ultra-Soft Shadows**: `0 2px 16px rgba(58, 48, 42, 0.04)` (barely visible, subtle ambient occlusion).
- **Surface Hierarchy**: Prefer warm background tinting (`#f6f0e8`, `#f2ece4`) over stark elevation.
- **Thin Warm Borders**: `#d8d0c8` at 60% opacity (`rgba(216, 208, 200, 0.6)`).
- **Glassmorphic HUD Containers**:
  ```css
  .hud-glass {
    background: rgba(250, 245, 238, 0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(194, 101, 42, 0.18);
  }
  .canvas-bg {
    background-color: #faf5ee;
    background-image: 
      linear-gradient(335deg, rgba(194, 101, 42, 0.04) 23px, transparent 23px),
      linear-gradient(155deg, rgba(194, 101, 42, 0.04) 23px, transparent 23px),
      linear-gradient(335deg, rgba(194, 101, 42, 0.04) 23px, transparent 23px),
      linear-gradient(155deg, rgba(194, 101, 42, 0.04) 23px, transparent 23px);
    background-size: 58px 58px;
    background-position: 0px 2px, 4px 35px, 29px 31px, 34px 6px;
  }
  ```

---

## 4. Component Rules

- **Buttons**: Primary = solid sienna fill (`#c2652a`), 8px radius. Secondary = outlined with warm border. Text links underlined on hover.
- **Cards**: Warm white or `surface_container_low` (`#f6f0e8`), generous padding (28–32px), minimal borders.
- **Inputs**: Warm linen background, warm gray border, sienna focus ring (`#c2652a`).
- **Whitespace**: Whitespace is the primary design tool. When in doubt, add more. Content must feel curated, disciplined, and uncluttered.

---

## 5. Visual Asset Reference

The original design template and visual mockups are stored in the repository:
- [`docs/design/SAHARA_MINIMALISM.md`](./design/SAHARA_MINIMALISM.md)
- [`docs/design/reference_template.html`](./design/reference_template.html)
- [`docs/design/screen.png`](./design/screen.png)
