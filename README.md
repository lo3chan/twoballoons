# 🎈🎈 twoballoons

> **Local-first visual diagramming & logic engine powered by a diagram-agnostic syntax (`LogiDSL`), Tauri 2.0, WebGPU, Antigravity AI sidecar, and Google Jules MCP integration.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tauri 2.0](https://img.shields.io/badge/Tauri-2.0-orange.svg)](https://tauri.app)
[![Rust](https://img.shields.io/badge/Rust-1.80%2B-red.svg)](https://www.rust-lang.org)
[![MCP Protocol](https://img.shields.io/badge/MCP-JSON--RPC_2.0-green.svg)](https://modelcontextprotocol.io)

---

## 📌 Executive Summary

**twoballoons** synthesizes the best aspects of personal knowledge management (**Obsidian**), hierarchical software architecture modeling (**IcePanel**), and spatial generative AI diagramming (**DiagramGPT**) into a unified native desktop environment.

At its core, **twoballoons** introduces **`LogiDSL`**—a diagram-agnostic logical syntax that acts as an intermediate representation (IR) between human thought, formal logic, and visual diagram targets. A single `.logi` file can be projected dynamically into PlantUML, Mermaid.js, Graphviz/DOT, D2, and LaTeX/TikZ.

---

## ✨ Core Pillars

1. **📄 Nodes as Deep Documents**: Every canvas shape doubles as a full Markdown document with WikiLinks (`[[Page]]`), block references, YAML frontmatter, and embedded code blocks.
2. **🏗️ Hierarchical C4 Modeling**: Single source of truth object-oriented catalog. Drill down seamlessly from Level 1 (System Context) to Level 2 (Containers) to Level 3 (Components).
3. **🧮 Diagram-Agnostic Logical Syntax (`LogiDSL`)**: Intermediate Representation (IR) unifying informal argument mapping (Premise $\rightarrow$ Conclusion) with formal logic circuits (AND, OR, NOT, Predicates).
4. **🎨 Spatial AI "Generative Fill"**: Bounding-box drag selection triggers targeted AST updates via an embedded **Antigravity AI Sidecar** without breaking existing layout placement.
5. **🔌 Google Jules & IDE MCP Integration**: Bi-directional Model Context Protocol server/client allowing Google Jules cloud agents and IDEs to query system architecture via `twoballoons://` URIs and log Architecture Decision Records (ADRs).
6. **⚡ High-Performance Native Core**: Built with Tauri 2.0, Rust (`petgraph` + `tree-sitter`), SQLite + FTS5 full-text search, and WebGPU canvas rendering at 60+ FPS.

---

## 📚 Architectural Documentation Sitemap

Explore our detailed design specifications in the [`docs/`](docs/) directory:

* 📐 [**System Architecture Specs** (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md): Complete layer-by-layer breakdown of the Tauri 2.0 Rust engine, WebGPU UI, SQLite database choice, and process IPC.
* 🧮 [**Diagram-Agnostic Logical Syntax** (`docs/LOGIDSL_SPEC.md`)](docs/LOGIDSL_SPEC.md): Full `LogiDSL` grammar, operator taxonomy, AST structs, and transpilation emitters for PlantUML, Mermaid, DOT, D2, and LaTeX.
* 🤖 [**Google Jules & MCP Gateway** (`docs/JULES_MCP_SPEC.md`)](docs/JULES_MCP_SPEC.md): Specification for the embedded Axum SSE/Stdio MCP server, resource endpoints, tool definitions, visual patch previewer, and ADR logging.
* 🧠 [**Antigravity Generative AI Engine** (`docs/ANTIGRAVITY_GENAI.md`)](docs/ANTIGRAVITY_GENAI.md): Python sidecar architecture using `google-antigravity`, real-time reasoning thought streams (`response.thoughts`), and sandboxed execution.

---

## 🗺️ System Topology

```mermaid
graph TD
    subgraph UI["WebGPU Frontend View Layer"]
        Canvas["PixiJS WebGPU Canvas"]
        Editor["Monaco Split Code/Markdown Editor"]
        Spatial["Spatial Drag-Select Overlay ('Generative Fill')"]
    end

    subgraph Core["Rust Native Engine (Tauri 2.0)"]
        Petgraph["Petgraph In-Memory Graph Index"]
        TreeSitter["Tree-Sitter LogiDSL AST Parser"]
        SQLite["SQLite + FTS5 Search Engine"]
        MCPServer["Axum SSE/Stdio MCP Gateway"]
    end

    subgraph Sidecar["Antigravity AI Engine"]
        Daemon["Python FastAPI / IPC Daemon"]
        Agent["google.antigravity Agent Runtime"]
    end

    subgraph External["External Services & Agents"]
        Jules["Google Jules Cloud Agent"]
        IDEs["External IDEs (Cursor, VS Code)"]
        Gemini["Gemini 3.6 Pro / Flash API"]
    end

    UI <--> Core
    Core <--> Sidecar
    Sidecar <--> Gemini
    MCPServer <--> IDEs
    Core <--> Jules
```

---

## 📄 License

MIT © twoballoons contributors.
