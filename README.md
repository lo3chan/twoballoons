# 🎈 twoballoons Architecture Studio

> **A Next-Generation Visual-First Architecture & Logic Studio built with WebGPU, PixiJS, Tauri 2.0, and the unified `BalloonDSL` language.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tauri 2.0](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![PixiJS v8](https://img.shields.io/badge/PixiJS-v8%20WebGPU-e91e63.svg)](https://pixijs.com/)
[![DSL: BalloonDSL](https://img.shields.io/badge/DSL-BalloonDSL-c2652a.svg)](docs/BALLOON_DSL.md)

---

## 🏛️ What is twoballoons?

**twoballoons** is a high-velocity architectural design studio and formal logic workbench that bridges the gap between **intuitive visual diagramming** and **computational formal modeling**. 

Unlike conventional static drawing canvases, every node, relation, and layer in twoballoons is backed by an AST compiled from **`BalloonDSL`**—a formal, bidirectional domain-specific language that unifies C4 structural topology, Kripke modal logic frames, and dynamic epistemic simulations.

---

## ✨ Core Pillars & Features

### 1. 🎈 Unified `BalloonDSL` Engine
* Complete **bidirectional synchronization**: moving or connecting nodes on the canvas generates clean `.balloon` code instantly; editing code updates the visual diagram in real time.
* Expresses **C4 System Context, Containers, and Components** alongside **Alethic, Epistemic, and Deontic modal logic** invariants.
* First-class Tree-sitter grammar support (`tree-sitter-balloon`).

### 2. 🎨 Sahara Warm Minimalism Design System
* Warm linen canvas base (`#faf5ee`), burnt terracotta accents (`#c2652a`), and deep charcoal typography (`#3a302a`).
* Hardware-accelerated GPU terracotta brick running-bond canvas texture on WebGPU.
* Glassmorphic HUDs, floating in-place node editors, and smooth camera keyframing.

### 3. 🕰️ 4D Spatiotemporal Timeline & Keyframe Engine
* Adds a **temporal 3rd dimension to 2D graph architectures**.
* Scrub smoothly through time across architectural evolutions.
* Assign keyframes to nodes/edges with animated pulse flows, temporal reveals, and modal world transitions.

### 4. ⚡ High-Velocity Visual Editing & Mind Mapping
* **Rapid Branching**: Press `Tab` to spawn a connected child node; press `Enter` to spawn a sibling node.
* **Function Dropper (`I` key)**: Sample styles, modal types, and truth assignments from one node and stamp them onto others.
* **Multi-Node Alignment**: Smart alignment HUD (Align Left, Center, Right, Top, Middle, Bottom, Distribute).
* **Orthogonal & Curved Bezier Edge Routing**: Obstacle avoidance around nodes.

### 5. 🌐 Real-Time CRDT Sync & Universal Transpilation
* Conflict-free multi-user collaboration powered by **Yjs** with live remote peer cursors (`PeerCursors.tsx`).
* Bi-directional transpilation between `BalloonDSL` and **Mermaid, PlantUML, Graphviz DOT, and LaTeX TikZ**.
* Standalone Interactive HTML, SVG, and TikZ export engine.

### 6. 🗄️ ZFS-Style Snapshot Versioning
* Zero-cost immutable snapshot bookmarks (`snapshot @v1.0.0-auth`) with instant branching and visual delta diffing.

---

## 📜 Example `BalloonDSL` Code

```balloon
// twoballoons Architecture Model: Distributed Payment Ledger
system PaymentArchitecture {
  container AuthGateway [type="gateway", world="alethic", x=240, y=180] {
    description: "OAuth2 & JWT Token Verifier"
    formula: "[](token_valid -> <>authorized)"
  }

  container CoreLedger [type="service", world="epistemic", x=540, y=180] {
    description: "Double-entry accounting transaction engine"
    formula: "K_ledger(account_balance >= transaction_amount)"
  }

  database AuditVault [type="database", world="deontic", x=390, y=360] {
    description: "Immutable compliance audit log"
    formula: "O(audit_logged_before_commit)"
  }

  // Relations & Topology
  AuthGateway -> CoreLedger : "dispatch_transaction" [protocol="gRPC", flow="sync"]
  CoreLedger -> AuditVault : "append_entry" [protocol="TLS", flow="async"]
}
```

---

## 🚀 Quick Start & Development

### Prerequisites
* **Node.js**: `>= 20.0.0`
* **Rust**: `>= 1.78.0`
* **Tauri CLI**: `npm install -g @tauri-apps/cli`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/lo3chan/twoballoons.git
cd twoballoons/twoballoons

# 2. Install dependencies
npm install

# 3. Run desktop app in development
npm run tauri dev

# 4. Run frontend in browser dev server
npm run dev
```

### Running Tests
```bash
# Run unit & integration test suites
npx vitest run

# Run production build
npm run build
```

---

## 🗺️ Engineering Roadmap
See [docs/ROADMAP.md](docs/ROADMAP.md) for the active pass schedule and the Continuous Hardening Loop.
