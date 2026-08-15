# twoballoons Pass 7 Architecture Specification

## Bi-Directional Diagram Transpilers, Live Multi-Modal Canvas Sync, and Desktop Polish

### 1. Objective
Pass 7 elevates twoballoons into a universal diagram translation workstation by implementing bi-directional import parsers (Mermaid, PlantUML, DOT to LogiAST), live multi-modal text/canvas synchronization, and complete export tooling.

---

### 2. Key Architecture Components

#### 2.1 Bi-Directional Import Parsers (`src-tauri/src/ast/importers/`)
Implement `DiagramImporter` trait in Rust to parse external diagram text formats into `LogiAST`:
1. `mermaid_importer.rs`: Ingests Mermaid flowchart/sequence syntax (`graph TD`, `A --> B: label`, `classDef`) and constructs nodes/edges.
2. `plantuml_importer.rs`: Ingests PlantUML class/component/sequence syntax (`@startuml ... @enduml`, `[ComponentA] -> [ComponentB]`).
3. `dot_importer.rs`: Ingests Graphviz DOT syntax (`digraph { A -> B [label="..."]; }`).
4. Tauri command `import_diagram(format: String, content: String) -> Result<String, String>`: Returns serialized AST JSON and updates the UI state.

#### 2.2 Live Multi-Modal Canvas Sync & Diagram Modal
1. Update `App.tsx` and `src/components/DiagramModal.tsx`:
   - Dual-pane or drawer view allowing side-by-side editing of DSL text and generated PlantUML / Mermaid output.
   - One-click copy buttons for Mermaid, PlantUML, DOT, and LaTeX/TikZ.
   - Import tab allowing users to paste Mermaid/PlantUML code and immediately generate a canvas diagram.
2. Export Canvas as SVG/PNG image directly from the toolbar.

#### 2.3 Diagnostic Logging & Error Resilience
1. Integrate with the newly added `src/logger.ts` and `ErrorBoundary.tsx`.
2. Ensure all Axum MCP Server endpoints (`localhost:8080/mcp/sse`) gracefully handle import/export queries.

---

### 3. Verification & Test Suite
- Run `cargo test` on all importers and emitters in `src-tauri`.
- Run `npx vitest run` on frontend store and components.
- Run `npx playwright test` on UI integration flows.
