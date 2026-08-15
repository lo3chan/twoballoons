# 🎈🎈 twoballoons Design System: Architecture Studio

> **Mandatory Visual & Styling Specification for all Frontend Agents and UI Modules**

---

## 1. Palette Tokens (Warm Terracotta & Parchment)

The visual design is grounded in warm architectural parchment, burnt orange/terracotta accents, and crisp glass HUDs:

| Token Name | Hex Code | Purpose / Usage |
| :--- | :---: | :--- |
| **primary** | `#c2652a` | Terracotta brand accent, active tool buttons, active tab borders, logo. |
| **primary-container** | `#e08850` | Secondary terracotta fills, badge borders, focus rings. |
| **background** | `#faf5ee` | Canvas and app base parchment color. |
| **on-background** | `#3a302a` | Primary text, titles, heading labels. |
| **surface** | `#faf5ee` | Card and popup base surface. |
| **surface-container** | `#f2ece4` | Secondary button hover states, toolbar dropdown items. |
| **surface-container-low** | `#f6f0e8` | HUD headers, explorer titlebars, modal navigation tabs. |
| **on-surface-variant** | `#605850` | Muted text, secondary menu items, parameter labels. |
| **outline** | `#9a9088` | Icons, inactive icons, subtle dividers. |
| **outline-variant** | `#d8d0c8` | Borders, glass card outlines, table borders. |
| **tertiary** | `#8c3c3c` | Epistemic logic highlights, warnings, reasoning deltas. |

---

## 2. Typography Rules

1. **Display & Brand Headings**: `EB Garamond` (Serif)
   - Used for the application logo (`🎈🎈 twoballoons`), modal titles, and major diagram headers.
2. **Body, Controls & Labels**: `Manrope` (Sans-serif)
   - Used for all buttons, menus, dropdowns, tree explorer items, and body descriptions.
3. **Code & Syntax**: `monospace` / `JetBrains Mono`
   - Used for LogiDSL/PhiloDSL editors, console output, and formula evaluators.

---

## 3. Glassmorphism & Surface CSS Classes

```css
/* 1. Interlaced Parchment Brick Canvas */
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

/* 2. Floating HUD Glass Containers */
.hud-glass {
  background: rgba(250, 245, 238, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(194, 101, 42, 0.18);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 3. Interactive AST Node Glass */
.node-glass {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(194, 101, 42, 0.22);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
```

---

## 4. UI Layout Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOP NAVIGATION BAR (TopNav.tsx)                                            │
│  • Logo (EB Garamond), Export/Import Trigger, Model Selector, Fill Button    │
├─────────────┬───────────────────────────────────────────────────────────────┤
│  LEFT       │  CENTER CANVAS (Canvas.tsx)                                   │
│  TOOLBAR    │  • Interlaced brick canvas, interactive AST node dragging,    │
│  (12w HUD)  │    marquee bounding box, and gold halo selection highlights.   │
│             ├───────────────────────────────────────────────────────────────┤
│  Select,    │  FLOATING RIGHT HUD (Top: VaultExplorer, Bottom: LogiEditor)  │
│  Marquee,   │  • Monospace Monaco editor inside .hud-glass container.       │
│  Nodes,     ├───────────────────────────────────────────────────────────────┤
│  Connect,   │  FLOATING BOTTOM CONSOLE (ConsoleHUD.tsx)                     │
│  Logic,     │  • Real-time streaming AI reasoning logs & MCP server status. │
│  Search     │                                                               │
└─────────────┴───────────────────────────────────────────────────────────────┘
```

---

## 5. Strict Behavioral Directives for Agents

1. **NO Dark Violet / Cyberpunk Clichés**: Do not introduce dark purple, neon violet, or glow gradients. All dark accents must be rich charcoal `#3a302a` and warm mahogany `#8c3c3c`.
2. **NO Pure Blacks**: Use `#3a302a` for dark text and dark borders.
3. **Preserve Glass Tokens**: Every floating modal, explorer, toolbar, and editor HUD MUST use the `.hud-glass` class.
4. **Interactive Micro-Animations**: Use `.animate-slide-in-down`, `.animate-slide-in-left`, `.animate-slide-in-right`, and `.animate-fade-in-up` on all HUD mounts.
