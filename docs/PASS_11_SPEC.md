# twoballoons Pass 11 Specification: Complete Feature Parity, Zero-Mock Implementation, 4D Spatiotemporal Timeline & ZFS Snapshot Engine

## 1. Overview & Core Mission
Pass 11 enforces a strict **Zero-Mock & Zero-Stub Mandate** across the entire codebase. Every placeholder, stubbed parser, synthetic mock response, and disconnected UI element must be replaced with real, fully functional, and production-ready implementations.

---

## 2. Complete Existing Feature Audit & Stub Elimination (Mandatory)
1. **Rust AST & PhiloDSL Parser Full Implementation** (`src-tauri/src/ast/philo_parser.rs`):
   - Replace the stubbed parser with a complete recursive descent AST parser supporting all PhiloDSL dialect grammar (modal worlds, alethic/epistemic/deontic formulas, and relations).
2. **Real MCP Resource Provider** (`src-tauri/src/mcp/resources.rs`):
   - Eliminate hardcoded mock JSON responses. Implement live workspace file resolution, real AST graph introspection, and active memory inspection.
3. **Live Vault Explorer & File Integration** (`src/components/VaultExplorer.tsx`):
   - Wire the vault explorer to real local files, displaying actual `.balloon` and `.logi` files with one-click load/save.
4. **AI Generation & Thoughts Widget** (`src/components/ThoughtsWidget.tsx`):
   - Full live streaming generation connected to local/remote LLM backend, with real-time graph diff preview.

---

## 3. 4D Spatiotemporal History & Keyframe Animation Engine
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

## 4. Visual Editing Parity & High-Velocity Mind Mapping
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

## 5. Quality & Production Bounds
- **Zero Mocks/Stubs**: No placeholder functions, no `TODO` mocks in production files.
- **100% Build & Test Health**: `npm run build` and `npx vitest run` must pass with 0 errors.
