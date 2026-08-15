# twoballoons Pass 12 Specification: Local Architecture Copilot, Visual Ghost Diffing & Anti-Pattern Linter

## 1. Overview
Pass 12 introduces an offline-first AI Architecture Copilot powered by local WebLLM / Gemini API, featuring generative canvas diffing, anti-pattern detection, and omni-prompt refactoring.

---

## 2. Core Capabilities
1. **Generative Canvas Diffing**:
   - Natural language commands generate visual ghost diffs (green additions, red removals) on the canvas for one-click merge.
2. **Architecture Smells & Fallacy Linter**:
   - Autonomous background linter identifying circular dependencies, modal logic contradictions, and untrusted C4 boundaries.
3. **Omni-Prompt Generative Fill (`Cmd+J` / `Ctrl+J`)**:
   - Auto-populate APIs, data contracts, and formal invariants for selected node clusters.

---

## 3. Deliverables
- `src/ai/architectureCopilot.ts`
- `src/components/GhostDiffOverlay.tsx`
- `src/components/LinterHUD.tsx`
