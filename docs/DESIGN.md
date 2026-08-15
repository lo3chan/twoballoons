# 🎨 twoballoons Frontend UI Design Specification: Adobe-Style Modular Workspace

> **This document contains the UI/UX design specifications, component wireframes, design tokens, and a Google Stitch prompt block for an Adobe-style (Photoshop/Illustrator/After Effects) modular, tabbed, and dockable workspace.**

---

## 📋 Google Stitch Copy-Paste Prompt Block (Adobe-Style Workspace)

```markdown
Generate a high-tech, ultra-sleek, Adobe-style (Photoshop / Illustrator / After Effects) modular desktop application interface for "twoballoons"—a local-first visual diagramming and logic engine software.

Workspace Architecture:
1. Far Left Vertical Tool Strip (Adobe-Style Toolbar, 44px wide):
   - Vertical column of dark slate tool icons with shortcut tooltips:
     - ↖ Select / Move Tool (V)
     - 🔲 Spatial Selection Marquee ("Generative Fill") Tool (M)
     - 📦 C4 Component / Node Spawn Tool (C)
     - ↗ Vector Relation Line Tool (L)
     - 🏷 Annotation & Claim Tool (T)
     - ⚡ AI Magic Wand Tool (W)
     - 🔍 Zoom & Pan Tool (Z)

2. Top Application & Contextual Tool Option Bar (40px high):
   - Row 1: Window control dots (red, yellow, green), Logo "🎈🎈 twoballoons", main menu bar [File | Edit | View | Selection | Logic | AI | Window | Help], Workspace Preset Dropdown: "Architecture Studio [v]".
   - Row 2 (Contextual Tool Options): Shows active tool options based on left toolbar selection (e.g. when Marquee M is active: Tool: "Spatial Marquee" | Model: "Gemini 3.6 Flash" | Scope: "Selected AST Nodes Only" | [✦ Run Generative Fill]).

3. Center Main Work Area (Tabbed Document Canvas):
   - Document Tab Bar at top: [ 📜 Auth_System.logi ✖ ] [ 📐 C4_Container_Map ✖ ] [ 📄 database_spec.md ✖ ]
   - Central Infinite WebGPU Grid Canvas: Dark slate canvas (#0B0F19) displaying C4 architecture nodes and glowing cyan vector lines (#06B6D4).
   - Spatial Selection Marquee Box: Translucent cyan dashed box selecting 3 nodes with a floating AI Prompt Dialog: "Auto-layout selected nodes and optimize for clarity." [Run AI].

4. Far Right Dockable Panel Stack (Adobe Panel Groups, 360px wide):
   - Panel Group 1 (Top Right): Docked tabs [ Layers & C4 Objects | Vault Explorer ] displaying hierarchical tree view of layers, C4 components, and vault files.
   - Panel Group 2 (Middle Right): Docked tabs [ Properties Inspector | BalloonDSL Code Editor ] showing YAML frontmatter metadata, technology tags, and live syntax-highlighted code.
   - Panel Group 3 (Bottom Right): Docked tabs [ History Stack | Google Jules Sessions ] showing time-travel undo steps and active cloud agent sessions.

5. Bottom Console Drawer (Adobe Premiere / After Effects Style Drawer, 160px high):
   - Tab Bar: [ 🧠 Console (Antigravity Reasoning Stream) | ⚠️ Logic Warnings | 📊 AST Output ]
   - Terminal styling (#070A11) displaying live streaming thought logs from Antigravity engine ("streaming AI reasoning: Analyzing auth block dependencies...").

Color Palette:
- Base Dark Background: #0B0F19
- Panel Surfaces: #1E293B
- Active Tab / Selected Borders: #3B82F6
- Accent Cyan Vectors & Selection: #06B6D4
- Verified Logic / Success: #10B981
- Text Primary: #F8FAFC, Text Muted: #94A3B8

Style: Professional Adobe Creative Cloud suite aesthetic translated into a high-performance modern developer tool.
```

---

## 🎨 Adobe-Style Modular Panel Architecture

The **twoballoons** workspace uses a flexible, dockable panel layout engine (FlexLayout / GoldenLayout model). Panels can be dragged, docked, tabbed, or popped out into floating windows.

```
┌──┬───────────────────────────────────────────────────────────────────────────┬─────────────────────────┐
│🎈│ File  Edit  View  Selection  Logic  AI  Window  Help  [Architecture v] 🔍 │ [⚙️ Settings] [⚡ AI Dot]│
├──┼───────────────────────────────────────────────────────────────────────────┼─────────────────────────┤
│↖ │ Tool: Spatial Marquee | Model: Gemini 3.6 Flash | Target: Selected AST    │ [✦ Generative Fill]     │
├──┼───────────────────────────────────────────────────────────────────────────┼─────────────────────────┤
│🔲│ [ 📜 Auth_System.logi ✖ ]  [ 📐 C4_Container_Map ✖ ]  [ 📄 database.md ✖ ] │ 👁️ LAYERS & C4 OBJECTS   │
│📦│ ┌───────────────────────────────────────────────────────────────────────┐ │ ├─ 📁 AuthSystem (C4)   │
│↗ │ │ [WebGPU Canvas Workspace]                                             │ │ │  ├─ 📦 Gateway        │
│🏷│ │                                                                       │ │ │  ├─ 📦 IdentityService│
│⚡│ │  ┌───────────────┐     ┌────────────────┐     ┌───────────────────┐   │ │ │  └─ 🗄️ UserDB         │
│🔍│ │  │ IngressGateway│ ──> │ IdentityService│ ──> │ User Credentials  │   │ ├─────────────────────────┤
├──┤ │  └───────────────┘     └────────────────┘     └───────────────────┘   │ │ 📝 PROPERTIES INSPECTOR │
│⚙️│ │  ▲ Spatial Marquee Selection Box                                      │ │ Object: IngressGateway  │
│  │ │  └─ ✦ [Auto-layout selected nodes and optimize for clarity.] [AI]      │ │ Kind: Container         │
│  │ └───────────────────────────────────────────────────────────────────────┘ │ Tech: Rust / Axum       │
├──┴───────────────────────────────────────────────────────────────────────────┼─────────────────────────┤
│ 🧠 CONSOLE - ANTIGRAVITY REASONING STREAM                         [Collapse ^]│ 📜 HISTORY / UNDO       │
│ [18:44:33] Auto-layout selected nodes... Analyzing vector connections...       │ ├─ Move Node (Gateway)  │
│ [18:44:34] Applied force-directed layout. Pre-computing AST updates...         │ └─ AI Spatial Fill      │
└──────────────────────────────────────────────────────────────────────────────┴─────────────────────────┘
```

---

## 🛠️ Adobe-Style Toolbar Specification

The far-left vertical toolstrip provides direct access to primary workspace tools, matching Adobe tool selection patterns:

| Icon | Tool Name | Shortcut | Primary Canvas Function | Context Bar Options Enabled |
| :---: | :--- | :---: | :--- | :--- |
| ↖ | **Select / Move** | `V` | Pan canvas, select nodes, drag node placement. | Selection Mode (Single, Multi, Sub-tree), Snap-to-Grid toggle. |
| 🔲 | **Spatial Marquee** | `M` | Drag-select bounding box over canvas sub-regions. | Prompt Input Pill, Model Picker (Flash/Pro), Scope Rules. |
| 📦 | **C4 Component Spawn** | `C` | Click canvas to spawn C4 objects or logic nodes. | Entity Type (System, Container, Component, Gate, Claim). |
| ↗ | **Vector Relation Line** | `L` | Drag from Node A to Node B to create typed relations. | Relation Type (`->`, `<=>`, `=>`, `=/=`, `..>`), Line Style. |
| 🏷 | **Annotation & Claim** | `T` | Click canvas to add informal logic claims or callout text. | Status (Accepted, Proposed, Refuted), Font Size. |
| ⚡ | **AI Magic Wand** | `W` | Click any node to trigger quick AI refactors/ADRs. | AI Action (Refactor, Generate ADR, Expand Sub-graph). |
| 🔍 | **Zoom & Pan** | `Z` | Drag to zoom canvas level, click to re-center. | Zoom Level %, Fit-to-Screen, Reset 100%. |

---

## 🖼️ Visual UI Mockup Previews

### 1. Adobe-Style Modular Workspace (Tabbed Panels & Toolbar)
![twoballoons Adobe Workspace](assets/twoballoons_adobe_workspace.jpg)

### 2. Standard Dual-Pane Canvas & Code View
![twoballoons UI Mockup](assets/twoballoons_ui_mockup.jpg)
