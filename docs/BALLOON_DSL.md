# 🎈 BalloonDSL Specification & Grammar Reference

`BalloonDSL` is the unified declarative language powering **twoballoons Architecture Studio**. It unifies structural architecture topology (C4 model) with formal modal logic semantics (Kripke frames).

---

## 1. Syntax Overview

```balloon
system SystemName {
  // 1. Elements & Nodes
  container ContainerName [type="...", world="...", x=100, y=200] {
    description: "..."
    formula: "..."
  }

  database DatabaseName [type="...", world="..."]

  // 2. Relations & Flows
  ContainerName -> DatabaseName : "action_label" [protocol="...", flow="sync|async"]
}
```

---

## 2. Modal World Types
Nodes in `BalloonDSL` can be assigned to formal modal logic frames:
* **`alethic`** (`[]`, `<>`): Necessity and possibility invariants.
* **`epistemic`** (`K_agent`, `B_agent`): Knowledge and belief states.
* **`deontic`** (`O`, `P`): Obligations and permissions for compliance.

---

## 3. Tree-sitter Grammar
The formal Tree-sitter grammar is maintained in `tree-sitter-balloon/` and compiles directly to WebAssembly for sub-millisecond syntax highlighting and AST construction.
