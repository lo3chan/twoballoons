# 🎨 twoballoons Frontend UI Design Specification & Google Stitch Prompt Guide

> **This document contains the complete UI/UX design specifications, component wireframes, design tokens, and a Google Stitch prompt block ready to copy and paste into Stitch / AI UI generators.**

---

## 📋 Google Stitch Copy-Paste Prompt Block

```markdown
Generate a high-tech, ultra-sleek, modern dark-themed desktop application interface for "twoballoons"—a local-first visual diagramming and logic engine software.

Key Sections:
1. Top Application Bar:
   - Window control dots (red, yellow, green).
   - Left side: App logo "🎈🎈 twoballoons" and breadcrumb navigation "Project Alpha > Architecture > Auth_System.logi".
   - Center: Segmented View Switcher pills [ Canvas View | Split Code | Document View | Logic Graph ].
   - Right side: Model selection badge "Gemini 3.6 Flash (Active)", Antigravity AI Engine status dot (glowing cyan), and Settings gear.

2. Left Sidebar (Collapsible Vault Explorer, 260px wide):
   - Search bar at top with shortcut "Cmd/Ctrl + K".
   - File Tree: "pages/", "diagrams/", "canvas/".
   - C4 Object Catalog section listing reusable components (Gateway, IdentityService, UserDB).
   - Active Google Jules sessions widget at bottom ("Session #104: Auth Refactor - Running").

3. Main Central Workspace (Infinite WebGPU Canvas):
   - Dark grid canvas background (#0B0F19) with subtle dot-matrix grid pattern.
   - Diagram Cards: Dark slate card containers (#1E293B) with glowing cyan vector lines (#06B6D4) connecting nodes.
   - C4 Container Box: A dashed translucent boundary labeled "Authentication Sub-system".
   - Spatial Selection Overlay: A glowing cyan dashed bounding box selecting 3 nodes with a floating AI Prompt Pill: "Convert auth block to Keycloak OAuth2" [Run AI].

4. Right Panel (Dual-Tab Split Editor & Inspector, 380px wide):
   - Tab 1: LogiDSL Code Editor with line numbers and syntax highlighting (blue keywords, cyan relations, green claims).
   - Tab 2: Node Inspector showing frontmatter metadata, C4 stereotypes, and logic assertions.

5. Bottom Collapsible Panel (Antigravity AI Reasoning Stream Drawer, 180px high):
   - Real-time terminal log styling (#0F172A).
   - Live streaming thoughts ("Analysis: Keycloak OAuth2 integration identified...", "Recommendation: Replace custom auth flow...").

Color Palette:
- Background: #0B0F19 (Deep Obsidian)
- Card Surfaces: #1E293B (Slate Dark)
- Accent Vectors: #06B6D4 (Neon Cyan)
- Secondary Accent: #3B82F6 (Electric Blue)
- Logic Success / Verified: #10B981 (Emerald Green)
- Text Primary: #F8FAFC, Text Secondary: #94A3B8

Typography: Inter for UI text, JetBrains Mono for LogiDSL code.
Style: Premium, modern developer tool aesthetic (similar to Linear, Raycast, and Cursor).
```

---

## 🎨 UI Design Tokens & Theme Specification

### 1. Color Palette Tokens
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `--bg-base` | `#0B0F19` | Main application background & WebGPU canvas grid base |
| `--bg-surface-1` | `#1E293B` | Node cards, sidebar background, inspector containers |
| `--bg-surface-2` | `#334155` | Elevated menus, tooltips, hover states |
| `--border-subtle` | `#1E293B` | Panel dividers and card borders |
| `--accent-cyan` | `#06B6D4` | Primary vector connection lines, spatial selection bounds |
| `--accent-blue` | `#3B82F6` | Primary action buttons, active tab indicators |
| `--accent-emerald` | `#10B981` | Formal logic verified states, success indicators |
| `--accent-amber` | `#F59E0B` | Google Jules active planning phase warnings |
| `--text-primary` | `#F8FAFC` | Primary headings, node titles, active code text |
| `--text-muted` | `#94A3B8` | Subtitles, line numbers, inactive tab labels |

### 2. Typography
* **UI Font Family**: `Inter, system-ui, -apple-system, sans-serif`
* **Code & DSL Font**: `'JetBrains Mono', 'Fira Code', monospace`
* **Font Sizes**:
  * Display Header: `18px / 1.3 (Font Weight: 600)`
  * Section Title: `14px / 1.4 (Font Weight: 600)`
  * Body Text: `13px / 1.5 (Font Weight: 400)`
  * Micro / Code: `12px / 1.4 (Font Weight: 400)`

---

## 🖥️ Screen Layout Wireframe Architecture

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [🔴 🟡 🟢] 🎈🎈 twoballoons  | Project Alpha > Auth_System.logi   [Canvas|Split|Doc|Graph]   ⚡ Gemini Flash │
├───────────────────┬────────────────────────────────────────────────────────┬──────────────────────────┤
│ 🔍 Search (Ctrl+K)│  [WebGPU Infinite Canvas Workspace]                    │ 📝 LogiDSL Editor         │
├───────────────────┤                                                        ├──────────────────────────┤
│ 📁 PAGES          │   ┌────────────────────────────────────────────────┐   │ 1  actor User {          │
│  ├─ auth_doc.md   │   │ Authentication Sub-system (C4 Boundary)         │   │ 2    label: "Client"     │
│  └─ database.md   │   │                                                │   │ 3  }                     │
│                   │   │  ┌──────────┐  ┌────────────┐  ┌───────────┐   │   │ 4                        │
│ 📐 DIAGRAMS       │   │  │ User DB  │  │ Session C. │  │ Login H.  │   │   │ 5  component Gateway {   │
│  └─ auth.logi     │   │  └──────────┴──┴────────────┴──┴───────────┘   │   │ 6    kind: "container"   │
│                   │   │  ▲ Spatial Selection Bounding Box              │   │ 7  }                     │
│ 🏗️ C4 CATALOG     │   └────────────────────────────────────────────────┘   │ 8                        │
│  ├─ Gateway       │     │                                                  │ 9  User -> Gateway : ... │
│  ├─ AuthServer    │     └─ ✦ [Convert auth block to Keycloak OAuth2] [AI]  │                          │
│  └─ UserDB        │                                                        │                          │
├───────────────────┴────────────────────────────────────────────────────────┴──────────────────────────┤
│ 🧠 AI Reasoning Stream (Antigravity Engine)                                               [Collapse ^] │
│ [Info] Analyzing auth block dependencies... Keycloak OAuth2 identified. Replacing custom flow...      │
└───────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ HTML / CSS Prototype Snippet

You can render or inspect this standalone HTML/CSS layout preview directly:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  :root {
    --bg-base: #0B0F19;
    --bg-surface: #1E293B;
    --accent-cyan: #06B6D4;
    --accent-blue: #3B82F6;
    --text-main: #F8FAFC;
    --text-muted: #94A3B8;
  }
  body {
    margin: 0; background: var(--bg-base); color: var(--text-main);
    font-family: Inter, sans-serif; display: flex; flex-direction: column; height: 100vh;
  }
  header {
    height: 48px; background: #0F172A; border-bottom: 1px solid #1E293B;
    display: flex; align-items: center; justify-content: space-between; padding: 0 16px;
  }
  .main-body { display: flex; flex: 1; overflow: hidden; }
  sidebar { width: 250px; background: #0F172A; border-right: 1px solid #1E293B; padding: 12px; }
  canvas-view {
    flex: 1; position: relative; background: radial-gradient(circle, #1E293B 1px, transparent 1px);
    background-size: 24px 24px; display: flex; align-items: center; justify-content: center;
  }
  editor-pane { width: 360px; background: #0F172A; border-left: 1px solid #1E293B; padding: 12px; font-family: monospace; }
  footer-drawer { height: 140px; background: #070A11; border-top: 1px solid #1E293B; padding: 12px; font-size: 12px; color: var(--accent-cyan); }
  .prompt-pill {
    position: absolute; bottom: 40px; background: rgba(30, 41, 59, 0.9);
    border: 1px solid var(--accent-cyan); padding: 8px 16px; borderRadius: 24px;
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); display: flex; gap: 8px; align-items: center;
  }
</style>
</head>
<body>
  <header>
    <div>🎈🎈 <b>twoballoons</b> &nbsp;|&nbsp; <span style="color:var(--text-muted)">Project Alpha / Auth_System.logi</span></div>
    <div><button style="background:var(--accent-blue);color:#fff;border:none;padding:4px 12px;border-radius:12px">Canvas View</button></div>
    <div style="color:var(--accent-cyan)">⚡ Gemini 3.6 Flash Active</div>
  </header>
  <div class="main-body">
    <sidebar>
      <div style="color:var(--text-muted);font-size:12px;margin-bottom:8px">VAULT EXPLORER</div>
      <div>📁 pages/</div>
      <div>📐 diagrams/auth.logi</div>
      <div>🏗️ C4 Catalog</div>
    </sidebar>
    <canvas-view>
      <div style="border:2px dashed var(--accent-cyan);padding:40px;border-radius:12px;background:rgba(6,182,212,0.05)">
        <div style="background:var(--bg-surface);padding:16px;border-radius:8px">Auth System Sub-Graph</div>
      </div>
      <div class="prompt-pill">
        <span>✨ Convert auth block to Keycloak OAuth2</span>
        <button style="background:var(--accent-cyan);color:#000;border:none;padding:4px 12px;border-radius:12px;font-weight:bold">Run AI</button>
      </div>
    </canvas-view>
    <editor-pane>
      <div style="color:var(--text-muted)">// LogiDSL Editor</div>
      <div><span style="color:var(--accent-blue)">actor</span> User</div>
      <div><span style="color:var(--accent-blue)">component</span> Gateway</div>
      <div>User -&gt; Gateway : <span style="color:var(--accent-cyan)">"1. POST /login"</span></div>
    </editor-pane>
  </div>
  <footer-drawer>
    <div><b>🧠 Antigravity Reasoning Stream</b></div>
    <div>[Info] Analyzing selected auth block... Keycloak integration candidate verified.</div>
  </footer-drawer>
</body>
</html>
```

---

## 🖼️ Visual UI Mockup Preview

![twoballoons UI Mockup](assets/twoballoons_ui_mockup.jpg)
