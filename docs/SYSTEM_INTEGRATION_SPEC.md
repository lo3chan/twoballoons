# 🔗 twoballoons Master System Linkage & Integration Specification

> **Comprehensive architectural deep-dive into the linkages, data plumbing, state machines, and event streams across all components in twoballoons.**

---

## 1. Master System Linkage Architecture

The diagram below maps the complete interaction topology connecting the **Adobe-Style Modular UI Layer**, the **Rust Native Engine**, the **Persistence Store**, the **Antigravity AI Engine Sidecar**, and the **Google Jules MCP Gateway**:

```mermaid
graph TD
    subgraph UI_Workspace["1. Adobe-Style Modular UI Layer (Tauri Webview / WebGPU)"]
        UI_Toolbar["Far-Left Vertical Toolstrip (V, M, C, L, T, W, Z)"]
        UI_Canvas["WebGPU Infinite Canvas (PixiJS 60 FPS)"]
        UI_Editor["Monaco LogiDSL Code & Markdown Editor"]
        UI_Timeline["Temporal Timeline Scrub Bar & Effects Panel"]
        UI_Focus["Context-Aware Selection Watcher"]
        UI_Menu["Universal Right-Click 'Ask Antigravity' Menu"]
    end

    subgraph Rust_Core["2. Native Core Compute Engine (Tauri 2.0 / Rust)"]
        IPC["Zero-Copy Tauri IPC Channel"]
        Petgraph["Petgraph In-Memory Graph Index (RAM)"]
        TreeSitter["Tree-Sitter LogiDSL Incremental AST Parser"]
        TemporalEngine["$2D + T$ Keyframe & Velocity Interpolator"]
        MCPServer["Axum Async SSE/Stdio MCP Gateway"]
    end

    subgraph Persistence_Store["3. Persistence & Local Storage"]
        Vault_MD["Markdown Specification Notes (.md)"]
        Vault_Logi["LogiDSL Source Files (.logi)"]
        Vault_Canvas["Visual Layout Files (.canvas)"]
        SQLite["SQLite DB + FTS5 Trigram Full-Text Search"]
    end

    subgraph GenAI_Sidecar["4. Antigravity AI Engine (Python Sidecar)"]
        Daemon["FastAPI IPC Daemon"]
        AgentRuntime["google.antigravity Agent Runtime"]
        ThoughtsStream["Reasoning Streamer ('response.thoughts')"]
        TokenStream["Code Streamer ('response.chat()')"]
    end

    subgraph Agent_Gateway["5. External Agents & Cloud Services"]
        Jules["Google Jules Cloud Platform"]
        IDEs["External IDEs (Cursor, VS Code, Claude Desktop)"]
        Gemini["Gemini 3.6 Pro / Flash APIs"]
    end

    UI_Toolbar -->|Active Tool Events| UI_Canvas
    UI_Canvas <-->|Render Matrix & Node Selection| IPC
    UI_Editor <-->|Text Buffers & Line Anchors| IPC
    UI_Timeline <-->|Playhead Timestamp & Keyframes| IPC
    UI_Focus -->|Active Window Context| Daemon
    UI_Menu -->|Contextual AI Prompts| Daemon

    IPC <--> Petgraph
    IPC <--> TreeSitter
    IPC <--> TemporalEngine
    IPC <--> SQLite

    SQLite <--> Vault_MD
    SQLite <--> Vault_Logi
    SQLite <--> Vault_Canvas

    IPC <-->|Localhost SSE / HTTP| Daemon
    Daemon <--> AgentRuntime
    AgentRuntime <--> ThoughtsStream
    AgentRuntime <--> TokenStream
    AgentRuntime <-->|gRPC / HTTPS| Gemini

    MCPServer <-->|MCP Protocol (JSON-RPC 2.0)| IDEs
    IPC <-->|Jules REST API & Webhooks| Jules
    MCPServer <--> Petgraph
```

---

## 2. Spatial AI "Generative Fill" Data Plumbing Flow

When a user drag-selects a bounding box over canvas nodes and issues a prompt (e.g. *"Convert auth block to Keycloak OAuth2"*), the sequence below demonstrates the precise data flow from visual selection to AST compilation:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Canvas as WebGPU Canvas
    participant Rust as Rust Engine
    participant AST as Tree-Sitter LogiAST
    participant Sidecar as Antigravity Sidecar
    participant Gemini as Gemini 3.6 Flash
    participant DB as SQLite FTS5

    User->>Canvas: Drag-selects spatial bounding box (Tool M)
    Canvas->>Rust: Send selected node IDs & spatial coordinates
    Rust->>AST: Extract AST code fragment for selected node IDs
    AST-->>Rust: Return isolated target AST code block
    User->>Canvas: Types prompt in floating pill & clicks 'Run AI'
    Canvas->>Rust: Send user prompt + target AST fragment
    Rust->>Sidecar: POST /generate/spatial-fill (AST + Prompt)
    Sidecar->>Gemini: Stream prompt to Antigravity Agent instance
    
    loop Real-Time Thought Streaming
        Gemini-->>Sidecar: Emit reasoning deltas (response.thoughts)
        Sidecar-->>Rust: SSE event (type: "thought")
        Rust-->>Canvas: Render streaming thoughts in Antigravity Console
    end

    loop Real-Time Code Token Streaming
        Gemini-->>Sidecar: Emit generated code tokens
        Sidecar-->>Rust: SSE event (type: "token")
        Rust-->>Canvas: Render partial diff preview on canvas nodes
    end

    Sidecar-->>Rust: Stream finished (Final AST fragment)
    Rust->>AST: Mutate only target byte spans in LogiAST
    AST-->>Rust: Re-validate AST syntax & connection anchors
    Rust->>DB: Update SQLite FTS5 index & Petgraph memory edges
    Rust-->>Canvas: Rerender affected canvas sub-region at 60 FPS
```

---

## 3. Temporal $2\text{D} + T$ Animation & Keyframe Pipeline

The sequence below illustrates how the timeline scrubber interpolates keyframe states and streams particle flow animations across visual nodes:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Timeline as Timeline Scrub Bar
    participant Effects as Left Effects Panel
    participant Rust as Rust Temporal Engine
    participant Petgraph as Petgraph RAM Index
    participant WebGPU as WebGPU Shader Renderer

    User->>Effects: Configures Packet Flow Velocity (75%) & Ease-Out Curve
    Effects->>Rust: Send velocity curve parameters & interpolation matrix
    User->>Timeline: Drags time playhead to t = 24.00s
    Timeline->>Rust: Send playhead timestamp event (t = 24.00s)
    Rust->>Petgraph: Query active nodes V(t) & relations E(t) at t = 24.00s
    Petgraph-->>Rust: Return node visibility, states, & relation vectors
    Rust->>Rust: Calculate velocity interpolation D(t) = EaseOut(t, 75%)
    Rust->>WebGPU: Push frame transform buffer (Zero-copy GPU memory)
    WebGPU->>WebGPU: Render particle stream shaders along vector lines at 60 FPS
```

---

## 4. LogiDSL Multi-Dialect Transpilation Pipeline

`LogiDSL` operates as the intermediate representation (IR) between human inputs and external diagram rendering syntaxes:

```mermaid
graph LR
    subgraph Inputs["1. Input Sources"]
        In_Canvas["Visual Canvas Drag"]
        In_Text["LogiDSL Editor (.logi)"]
        In_AI["Antigravity GenAI"]
    end

    subgraph LogiAST_Core["2. Diagram-Agnostic LogiAST Engine"]
        TreeSitter["Tree-sitter Parser"]
        AST["LogiAST Core Struct"]
        Petgraph["Petgraph Solver"]
        ViewEngine["@view Projection Selector"]
    end

    subgraph Dialect_Emitters["3. Dialect Emitters"]
        Emit_Puml["PlantUML Emitter"]
        Emit_Mermaid["Mermaid.js Emitter"]
        Emit_DOT["Graphviz (DOT) Emitter"]
        Emit_D2["D2 Emitter"]
        Emit_TikZ["LaTeX / TikZ Emitter"]
    end

    Inputs --> TreeSitter
    TreeSitter --> AST
    AST <--> Petgraph
    AST --> ViewEngine

    ViewEngine --> Emit_Puml
    ViewEngine --> Emit_Mermaid
    ViewEngine --> Emit_DOT
    ViewEngine --> Emit_D2
    ViewEngine --> Emit_TikZ
```

---

## 5. Google Jules Autonomous Agent Loop

The lifecycle below shows how **Google Jules** interacts with **twoballoons** via the Model Context Protocol (MCP):

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Canvas as twoballoons Canvas
    participant MCPServer as Axum MCP Gateway
    participant Jules as Google Jules Cloud Platform
    participant ADR as ADR Logger

    User->>Canvas: Right-clicks node -> 'Launch Jules Session'
    Canvas->>MCPServer: Bundle C4 context + node specs
    MCPServer->>Jules: jules_create_session(prompt + bundled_context)
    
    loop Session Execution
        Jules->>MCPServer: GET twoballoons://vault/architecture/c4
        MCPServer-->>Jules: Return C4 JSON & Markdown specs
        Jules->>MCPServer: POST /tools/twoballoons_validate_logic_constraints
        MCPServer-->>Jules: Return validation result (passed/failed)
        Jules-->>Canvas: Stream session plan & execution steps
    end

    Jules->>MCPServer: Push completed git code patch (jules_get_patch)
    MCPServer->>Canvas: Overlay visual diff preview over C4 nodes
    User->>Canvas: Clicks 'Approve & Merge'
    Canvas->>ADR: Invoke twoballoons_create_adr(title, decision)
    ADR->>MCPServer: Log Architecture Decision Record into vault (.md)
    MCPServer->>Jules: jules_approve_plan / complete session
```

---

## 6. Antigravity Context-Aware Focus State Machine

The state machine below tracks how the **Antigravity AI Engine** adapts its capabilities depending on the user's active focus in the UI:

```mermaid
stateDiagram-v2
    [*] --> Idle_ContextWatcher

    state Idle_ContextWatcher {
        [*] --> MonitoringUI
    }

    MonitoringUI --> CodeEditor_Focus : Focus Monaco Code Editor
    MonitoringUI --> MarkdownDoc_Focus : Focus Markdown Document Tab
    MonitoringUI --> CanvasSelection_Focus : Drag-Select Canvas Nodes
    MonitoringUI --> TimelineTrack_Focus : Select Timeline Keyframe Track

    state CodeEditor_Focus {
        [*] --> AST_RefactorMode
        AST_RefactorMode : Context = Active Line Numbers & LogiAST
        AST_RefactorMode : Capabilities = Code Refactor, Logic Verification
    }

    state MarkdownDoc_Focus {
        [*] --> TechWriter_Mode
        TechWriter_Mode : Context = Active Markdown Note & ADRs
        TechWriter_Mode : Capabilities = Spec Expansion, C4 Summarization
    }

    state CanvasSelection_Focus {
        [*] --> Spatial_GenerativeFillMode
        Spatial_GenerativeFillMode : Context = Selected Node IDs & Bounding Box
        Spatial_GenerativeFillMode : Capabilities = Localized AST Rewriting
    }

    state TimelineTrack_Focus {
        [*] --> Sequence_AnimationMode
        Sequence_AnimationMode : Context = Active Timestamp & Keyframes
        Sequence_AnimationMode : Capabilities = Particle Velocity & Flow Animation
    }

    CodeEditor_Focus --> RightClick_Menu : Universal Right-Click Event
    MarkdownDoc_Focus --> RightClick_Menu : Universal Right-Click Event
    CanvasSelection_Focus --> RightClick_Menu : Universal Right-Click Event
    TimelineTrack_Focus --> RightClick_Menu : Universal Right-Click Event

    state RightClick_Menu {
        [*] --> Execute_AntigravityAction
        Execute_AntigravityAction : Pops up 'Ask Antigravity...' contextual menu
    }

    RightClick_Menu --> MonitoringUI : Action Executed / Dismissed
```
