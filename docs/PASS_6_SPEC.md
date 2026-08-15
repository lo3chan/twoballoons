# 📐 Twoballoons Pass 6 Specification: Idiomatic Tree-Sitter Crates, Universal Diagram Transpilers & Axum MCP Gateway

---

## 1. Objective & Architecture Overview
This iteration focuses on three production-grade engineering milestones:
1. **Idiomatic Modular Tree-Sitter Crates**: Refactor `tree-sitter-logi` and `tree-sitter-philo` into self-contained, official Tree-Sitter Rust crates with standalone `bindings/rust/build.rs` and `tree_sitter_language::LanguageFn` exports, removing all raw `extern "C"` blocks from `src-tauri`.
2. **Universal Diagram Transpiler**: Implement bidirectional AST emitters and parsers for **PlantUML**, **Mermaid.js**, **Graphviz/DOT**, and **LaTeX/TikZ**.
3. **Embedded Axum MCP Gateway**: Expose an SSE MCP server on `localhost:8080/mcp/sse` allowing external AI agents to query diagrams, inspect Kripke world models, and execute AST modifications via Model Context Protocol tools.

---

## 2. Subsystem 1: Idiomatic Tree-Sitter Crates

### 2.1 `twoballoons/tree-sitter-logi/`
Create standard Tree-Sitter crate layout:
- `Cargo.toml`:
  ```toml
  [package]
  name = "tree-sitter-logi"
  version = "0.1.0"
  edition = "2021"
  build = "bindings/rust/build.rs"
  include = ["bindings/rust/*", "grammar.js", "src/*"]

  [lib]
  path = "bindings/rust/lib.rs"

  [dependencies]
  tree-sitter-language = "0.1"

  [build-dependencies]
  cc = "1.0"
  ```
- `bindings/rust/build.rs`:
  ```rust
  fn main() {
      let src_dir = std::path::Path::new("src");
      let mut c_config = cc::Build::new();
      c_config.include(&src_dir);
      c_config.file(src_dir.join("parser.c"));
      if src_dir.join("scanner.c").exists() {
          c_config.file(src_dir.join("scanner.c"));
      }
      c_config.compile("tree-sitter-logi");
  }
  ```
- `bindings/rust/lib.rs`:
  ```rust
  use tree_sitter_language::LanguageFn;

  extern "C" {
      fn tree_sitter_logi() -> *const ();
  }

  pub const LANGUAGE: LanguageFn = unsafe { LanguageFn::from_raw(tree_sitter_logi) };
  ```

### 2.2 `twoballoons/tree-sitter-philo/`
Ensure `tree-sitter-philo` follows the exact same pattern with `tree_sitter_language::LanguageFn` exported as `LANGUAGE`.

### 2.3 `twoballoons/src-tauri/`
- Update `Cargo.toml`:
  ```toml
  [dependencies]
  tree-sitter-logi = { path = "../tree-sitter-logi" }
  tree-sitter-philo = { path = "../tree-sitter-philo" }
  ```
- In `src-tauri/src/ast/parser.rs` and `philo_parser.rs`:
  ```rust
  use tree_sitter::Parser;

  pub fn parse_logi(source: &str) -> Option<LogiAst> {
      let mut parser = Parser::new();
      parser.set_language(&tree_sitter_logi::LANGUAGE.into()).ok()?;
      let tree = parser.parse(source, None)?;
      // traverse syntax tree cleanly
  }
  ```
- Simplify `src-tauri/build.rs` to just invoke `tauri_build::build();`.

---

## 3. Subsystem 2: Universal Diagram Transpiler

Implement the `DiagramEmitter` trait in `src-tauri/src/ast/emitter.rs`:
```rust
pub trait DiagramEmitter {
    fn emit_mermaid(&self, ast: &LogiAst) -> String;
    fn emit_plantuml(&self, ast: &LogiAst) -> String;
    fn emit_dot(&self, ast: &LogiAst) -> String;
    fn emit_latex_tikz(&self, ast: &LogiAst) -> String;
}
```
- Add Tauri commands `export_diagram(format: &str)` and `import_diagram(format: &str, content: &str)`.

---

## 4. Subsystem 3: Embedded Axum MCP Gateway (`:8080/mcp/sse`)

Expose MCP tools over SSE in `src-tauri/src/mcp/`:
1. `twoballoons_query_graph`: Returns current nodes, edges, and possible worlds in JSON.
2. `twoballoons_evaluate_formula`: Runs Kripke model evaluator on a modal formula.
3. `twoballoons_export_diagram`: Generates PlantUML / Mermaid / TikZ representation.
4. `twoballoons_apply_patch`: Applies AST delta to the active Monaco editor session.

---

## 5. Verification & Testing Requirements
1. Run `cargo test` across `tree-sitter-logi`, `tree-sitter-philo`, and `src-tauri`.
2. Run `npx vitest run` for frontend components.
3. Run `npx playwright test` to verify canvas and editor interactions.
