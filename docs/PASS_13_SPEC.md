# twoballoons Pass 13 Specification: Integrated Wiki/Markdown Editor, Visual Code Stacks & Layer Manager

## 1. Overview
Pass 13 introduces an **Integrated Wiki & Markdown View/Editor** for nodes and systems, along with a **Toggable Visual Code Stack View** where the diagram is represented as structured, draggable, highly readable code.

---

## 2. Integrated Wiki & Markdown Editor (`src/components/WikiEditor.tsx`)
1. **Node & System Markdown Sheets**:
   - Each node, container, and world has an attached rich Markdown documentation sheet (ADRs, runbooks, formal proofs, API contracts).
   - Split-view and inline Markdown rendering with live syntax highlighting and LaTeX math equations.

---

## 3. Workspace as Highly Readable Visual Code Stacks (`src/components/VisualCodeStackView.tsx`)
1. **Interactive Code Stacks**:
   - Diagram represented as structured code with visual indentation, group boxes, and layer stacks.
   - Draggable code elements: drag node blocks between stacks, reorder execution layers, or drag out onto the visual canvas.
   - Granular visual toggles: toggle syntax highlighting, fold layers, collapse compound stacks, and show/hide metadata badges.
2. **Layer Manager & Depth Planes** (`src/components/LayerManager.tsx`):
   - Manage multi-layer visual depth planes, lock layers, toggle visibility, and isolate subsystems.

---

## 4. Deliverables
- `src/components/WikiEditor.tsx`
- `src/components/VisualCodeStackView.tsx`
- `src/components/LayerManager.tsx`
