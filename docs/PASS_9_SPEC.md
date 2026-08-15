# twoballoons Pass 9 Specification: Hierarchical Drill-Down Sub-Canvases, Breadcrumbs, GPU Force Layout, and Bi-Directional BalloonDSL Code Drawer

## 1. Overview & Vision
Pass 9 elevates **twoballoons Architecture Studio** into a deeply hierarchical, dynamic thinking environment. Users can drill down infinitely into nested architecture sub-systems, auto-organize complex logical diagrams using GPU-accelerated force-directed layout, and edit architecture visually or via a live bi-directional `.balloon` code editor drawer.

---

## 2. Core Architectural Pillars

### 2.1 Hierarchical Drill-Down & Sub-Canvases
- **Nested Scopes**: Any node can contain sub-nodes (e.g. C4 System -> Container -> Component, or Modal Logic World Cluster -> Frame -> Proposition).
- **Drill-Down Trigger**: Double-clicking a compound node smoothly transitions the viewport into that node's isolated sub-canvas.
- **Breadcrumb Navigation**: A glass breadcrumb bar at the top of the canvas displays the active hierarchy path (`Root / Banking System / API Gateway / Auth Controller`). Clicking any crumb or pressing `Escape` navigates back up.
- **Scope State Management**: Store active drill path in Zustand (`activeDrillPath: string[]`), filtering visible nodes to the current scope.

### 2.2 WebGPU / Web Worker Force-Directed Layout Engine
- **Force Simulation**: Barnes-Hut / repulsive electrostatic + spring-tension layout simulation running in a dedicated Web Worker or WebGPU compute pass.
- **Auto-Organize Trigger**: Quick toolbar button and shortcut (`F` key) to neatly arrange nodes, resolving overlapping clusters and minimizing edge crossings.
- **Preserved Manual Layout**: Manual drags lock node positions (`fx`, `fy`) unless unlocked.

### 2.3 Bi-Directional BalloonDSL Code Drawer
- **Drawer Component** (`src/components/BalloonCodeDrawer.tsx`): Collapsible sliding HUD drawer docked to the right or bottom.
- **Live Two-Way Sync**:
  - Visual Canvas -> Code: Editing node labels, adding edges, or modifying truth values serializes directly into formatted `BalloonDSL` (`.balloon` syntax).
  - Code -> Visual Canvas: Typing or pasting `BalloonDSL` code parses via `tree-sitter-balloon` / AST and reconstructs the canvas graph instantaneously with preserved node layout.

### 2.4 Design System Adherence (Sahara Warm Minimalism)
- **Palette**: Terracotta (`#c2652a`), Warm Linen base (`#faf5ee`), Charcoal text (`#3a302a`), Dusty Rose (`#8c3c3c`).
- **Glass Tokens**: `.hud-glass` (`rgba(250, 245, 238, 0.88)` + backdrop blur) and `.node-glass`.
- **Canvas Texture**: Native GPU running-bond brick grid on solid `#faf5ee`.

---

## 3. Key Deliverables & Target Files
1. `src/components/BreadcrumbBar.tsx` - Interactive hierarchical path header HUD.
2. `src/layout/forceLayoutWorker.ts` - High-performance force-directed graph simulation.
3. `src/components/BalloonCodeDrawer.tsx` - Sliding bi-directional code editor drawer.
4. `src/store.ts` - Updated Zustand store with `activeDrillPath`, `drillDown(nodeId)`, `drillUp()`, and `syncCodeToCanvas()`.
5. `src/components/Canvas.tsx` - Double-click drill-down handlers and force layout integration.
6. `src/components/LeftToolbar.tsx` - Auto-organize (`F`) and Code Drawer toggle buttons.
7. Test suites in Vitest covering Breadcrumb navigation, Drill-Down state transitions, and Force Layout convergence.

---

## 4. Verification & Quality Bounds
- `npm run build` must compile cleanly with 0 TypeScript or Vite warnings.
- `npx vitest run` must pass 100% of all unit and integration tests.
