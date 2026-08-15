# twoballoons Pass 11 Specification: 4D Spatiotemporal Timeline Engine, Visual Keyframing, Effects Tab & ZFS-Style Snapshot Versioning

## 1. Overview & Core Mission
Pass 11 introduces a groundbreaking **4D Spatiotemporal Engine** that adds time as a third dimension to 2D graph architectures, alongside a **ZFS-Style Copy-on-Write Versioning System** and 100% visual editing parity.

---

## 2. 4D Spatiotemporal History & Keyframe Animation Engine
1. **Interactive Timeline Scrubber HUD** (`src/components/TimelineHUD.tsx`):
   - Scrub smoothly backward and forward through time across all graph states.
   - Assign animation keyframes to individual nodes, edges, or compound groups (position, scale, opacity, state, truth assignment).
2. **Left-Docked Effects Tab & Temporal Flow Pipeline** (`src/components/TimelineEffectsTab.tsx`):
   - Configurable animation effects per keyframe:
     - **Animated Flow**: Data pulses and glowing token flows travelling along relations as you scrub.
     - **Temporal Reveal / Dissolve**: Nodes materialize, morph, or fade across distinct architectural epochs.
     - **Modal State Transitions**: Dynamic Epistemic Logic (DEL) public announcement updates visually morphing worlds.
3. **ZFS-Style Copy-on-Write (CoW) Versioning**:
   - Snapshot creation (`snapshot @milestone-name`) with instant zero-cost branching.
   - Immutable snapshot tree with visual delta diffing and instant one-click rollback.

---

## 3. Visual Editing Parity & High-Velocity Mind Mapping
1. **In-Place Visual Editing**:
   - Double-click any node/edge to edit text, logic formulas, and C4 metadata in an inline floating glass editor.
   - Multi-Node Alignment HUD: Align Left, Center, Right, Top, Middle, Bottom, and Distribute Horizontally/Vertically.
   - Orthogonal & Curved Bezier Edge Routing with smart obstacle avoidance.
2. **High-Velocity Mind Mapping**:
   - `Tab` -> spawns connected child node.
   - `Enter` -> spawns sibling node.
   - `Shift+Enter` -> inserts parent wrapper node.
3. **Function Dropper (I Key)**:
   - Sample node style, modal world family, and truth evaluations, then stamp onto target nodes.

---

## 4. Deliverables & Testing Bounds
- `src/components/TimelineHUD.tsx`
- `src/components/TimelineEffectsTab.tsx`
- `src/history/zfsVersioning.ts`
- `src/components/AlignmentHUD.tsx`
- `src/components/Canvas.tsx` (Enhanced with keyframe ghost interpolation and bezier routing).
- `npm run build` and `npx vitest run` must pass 100%.
