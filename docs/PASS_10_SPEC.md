# twoballoons Pass 10 Specification: Real-Time CRDT State Sync, Local Vector Search, and High-Fidelity Multi-Format Export Engine

## 1. Overview & Vision
Pass 10 solidifies **twoballoons Architecture Studio** as an enterprise-ready, collaborative, and offline-first thinking hub. It introduces real-time conflict-free replicated data types (CRDT / Yjs state sync), offline semantic vector indexing for instant node discovery across giant architecture vaults, and a high-fidelity export engine for Interactive HTML, vector SVG, and LaTeX TikZ diagrams.

---

## 2. Core Architectural Pillars

### 2.1 CRDT / Multi-User Conflict-Free Synchronization
- **Yjs / Automerge Provider**: `src/sync/crdtProvider.ts` manages real-time state sharing over WebSockets or local P2P mesh (Tailscale).
- **Awareness & Presence**: Multi-cursor rendering on the WebGPU PixiJS canvas with peer name tags, active selections, and smooth cursor interpolation.
- **Offline Merging**: Automatic reconciliation of offline edits when reconnecting with 0 state loss.

### 2.2 Local Vector Search & Hybrid Knowledge Retrieval
- **Local Embedding Indexer**: `src/search/vectorIndex.ts` generates fast embedding vectors for node titles, descriptions, formulas, and truth tables.
- **Omni-Search HUD**: Enhances the Global Search HUD (`Cmd+K` / `Ctrl+K`) with hybrid fuzzy + cosine similarity ranking.

### 2.3 Universal High-Fidelity Export Engine
- **Interactive Standalone HTML**: Export complete interactive diagram bundles that open in any browser with panning, zooming, and tooltips.
- **Crisp Vector SVG & LaTeX TikZ**: Export production-ready vector graphics and academic LaTeX TikZ snippets for publication.

### 2.4 Design System Adherence (Sahara Warm Minimalism)
- **Palette**: Terracotta (`#c2652a`), Warm Linen base (`#faf5ee`), Charcoal text (`#3a302a`), Dusty Rose (`#8c3c3c`).
- **Glass Tokens**: `.hud-glass` (`rgba(250, 245, 238, 0.88)` + backdrop blur) and `.node-glass`.
- **Canvas Texture**: Native GPU running-bond brick grid on solid `#faf5ee`.

---

## 3. Key Deliverables & Target Files
1. `src/sync/crdtProvider.ts` - Yjs document synchronization and awareness store.
2. `src/components/PeerCursors.tsx` - Multi-cursor presence overlay on PixiJS canvas.
3. `src/search/vectorIndex.ts` - Local lightweight cosine vector similarity engine.
4. `src/components/ExportModal.tsx` - Universal export modal for Interactive HTML, SVG, and LaTeX TikZ.
5. `src/store.ts` - Zustand bindings for CRDT awareness, peer cursors, and vector search queries.
6. Comprehensive Vitest test suite for CRDT delta reconciliation, vector search ranking, and SVG serialization.

---

## 4. Verification & Quality Bounds
- `npm run build` must compile cleanly with 0 TypeScript or Vite warnings.
- `npx vitest run` must pass 100% of all unit and integration tests.
