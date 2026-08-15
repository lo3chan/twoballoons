# twoballoons Pass 11 Specification: Visual Diagram Editing Parity, Dynamic DEL Simulation & Real-Time Epistemic Proof Engine

## 1. Overview & Core Mission
Pass 11 bridges 100% visual editing parity between the visual WebGPU canvas and the backend Rust AST engine, while introducing real-time computational proof execution for **Dynamic Epistemic Logic (DEL)** and Kripke semantics.

---

## 2. Mandatory Visual Editing Capabilities
1. **In-Place Visual Editing**:
   - Double-click any node/edge to edit text, logic formulas, and C4 metadata in an inline floating glass editor.
   - Multi-Node Alignment HUD: Align Left, Center, Right, Top, Middle, Bottom, and Distribute Horizontally/Vertically.
   - Orthogonal & Curved Bezier Edge Routing: Smart obstacle avoidance preventing edges from intersecting node boxes.
2. **High-Velocity Mind Mapping**:
   - `Tab` on node -> spawns connected child node.
   - `Enter` on node -> spawns sibling node with aligned layout.
   - `Shift+Enter` -> inserts parent wrapper node.
3. **Function Dropper (I Key)**:
   - Sample node style, modal world family, and truth evaluations, then stamp onto target nodes.
4. **Hierarchical Drill-Down & Breadcrumbs**:
   - Sub-canvas transitions on compound nodes with smooth viewport camera easing.

---

## 3. Dynamic Proof Simulation Engine
1. **Interactive Proof Stepper HUD**:
   - Step forward, step back, and play public announcement updates (`psi !`) across Kripke frames.
2. **Glow Pulse Propagation**:
   - Animated terracotta pulses travelling along accessibility relations (`R_{ab}`) indicating truth flow.
3. **Counter-Model Generator**:
   - Automatic SAT solving visualizing falsifying worlds directly on the canvas.

---

## 4. Deliverables & Testing Bounds
- `src/components/Canvas.tsx` (Enhanced with in-place text editors, bezier curves, and port snaps).
- `src/components/AlignmentHUD.tsx` (Multi-node alignment and distribution tools).
- `src/components/ProofStepperHUD.tsx` (Dynamic DEL simulation playback bar).
- `src-tauri/src/ast/balloon_parser.rs` (Bidirectional serialization parity).
- `npm run build` and `npx vitest run` must pass 100%.
