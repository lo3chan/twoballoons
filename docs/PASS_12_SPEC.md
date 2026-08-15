# twoballoons Pass 12 Specification: Antigravity Context-Aware AI Window, Universal Right-Click & Generative Canvas Diffing

## 1. Overview
Pass 12 integrates the **Antigravity Context-Aware Intelligence Window** and **Universal Right-Click Action Dispatcher**, enabling deep agentic modification of selected nodes, tabs, layers, and architectures.

---

## 2. Antigravity Context-Aware Window (`src/components/AntigravityWindow.tsx`)
1. **Full Context Awareness**:
   - Monitors active document tab, active layer, breadcrumb drill-down depth, and selected node IDs.
   - When multiple nodes are selected, Antigravity displays targeted operations: *"Refactor to Event-Driven"*, *"Synthesize Modal Contracts"*, *"Generate Error Boundaries"*.
2. **Universal Right-Click Context Menu** (`src/components/ContextMenu.tsx`):
   - Right-click anywhere (canvas node, edge, timeline keyframe, code line, wiki document) to invoke targeted Antigravity actions:
     - Node: *"Refactor with Antigravity"*, *"Add Modal Constraints"*, *"Explain Dependencies"*.
     - Canvas Background: *"Generate Subsystem Architecture"*, *"Auto-Layout & Optimize"*.
     - Timeline: *"Interpolate Keyframes with AI"*.
3. **Generative Canvas Ghost Diffing**:
   - AI outputs render as ghost previews (green additions, red removals, blue updates) on the canvas for one-click merge or rejection.

---

## 3. Deliverables
- `src/components/AntigravityWindow.tsx`
- `src/components/ContextMenu.tsx`
- `src/ai/canvasDiffEngine.ts`
