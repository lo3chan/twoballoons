# twoballoons Pass 8: BalloonDSL Unification, High-Velocity Mind Mapping, Adobe Tabs, and Function Dropper

> **Mandatory Implementation Specification for Google Jules Pass 8**

---

## 1. Executive Summary & Core Objectives

Pass 8 delivers the foundational creation velocity and unified logical syntax for **twoballoons - Architecture Studio**:
1. **BalloonDSL Unification**: Merge `logidsl` and `philodsl` into a single, unified parser and AST (`tree-sitter-balloon` / `BalloonAst`) that models both C4 structural architecture and 9 formal logic families (epistemic, doxastic, temporal LTL, justification, and dialogical game blocks) in the same document.
2. **Adobe-Style Document Tabs (`TabBar.tsx`)**: Implement persistent glass tab strip with unsaved dirty indicators (`●`), tab closing (`✕`), and multi-document switching (`.balloon`, `.md`).
3. **High-Velocity Mind Mapping Mechanics**:
   - `Tab` on canvas node: Instantly spawns and connects a child node to the right with auto-layout spacing.
   - `Enter` on canvas node: Instantly spawns and connects a sibling node below.
   - Quick-Insert Palette (`/` or `Space`): Spotlight-style search to drop components at cursor position.
4. **Architectural Function Dropper Tool (`I`)**:
   - Sample traits, ports, security boundaries, and logic invariants from an existing node to stamp identical components across the canvas or drop markdown references.
5. **Rich Glass Tooltips & Node Hover Inspectors**:
   - Micro-HUD tooltips explaining tool shortcuts and live node evaluation inspectors.
6. **Comprehensive Test Suite**: Vitest unit tests for TabBar/Dropper and Cargo unit tests for BalloonDSL AST.

---

## 2. Technical Architecture & Component Deliverables

### A. Backend Rust AST & Parser (`twoballoons/src-tauri/src/ast/`)
- `src-tauri/src/ast/balloon_parser.rs`: Unified parser combining C4 entities (`actor`, `component`, `store`, `boundary`), relations (`->`, `<->`, `..>`), and modal assertions (`knows`, `believes`, `assert`, `world`, `future_nec`, `always`, `common_knowledge`).
- `src-tauri/src/main.rs`: Register `parse_balloondsl` and `evaluate_balloon_invariants` Tauri commands.

### B. Frontend Components (`twoballoons/src/`)
- `src/components/TabBar.tsx`: Adobe-style persistent tab strip.
- `src/components/LeftToolbar.tsx`: Add Function Dropper (`I`) and update keyboard shortcuts.
- `src/components/Canvas.tsx`: Implement `Tab` child branching, `Enter` sibling branching, and Dropper sampling/stamping.
- `src/components/TooltipHUD.tsx`: Rich glass tooltip system with `.hud-glass` styling.
- `src/store.ts`: Manage open document tabs, active tab index, and Dropper cursor buffer.

---

## 3. Design System Adherence
All UI additions MUST strictly adhere to `docs/DESIGN_SYSTEM.md` (Sahara Warm Minimalism):
- Primary: `#c2652a` (Burnt Sienna)
- Background: `#faf5ee` (Warm Linen)
- Surface Containers: `#f6f0e8` / `#f2ece4`
- Glass Tokens: `.hud-glass` (12px backdrop blur, 1px border `rgba(194, 101, 42, 0.18)`)
- Typography: `EB Garamond` headings and `Manrope` body/controls.
