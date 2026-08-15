import { create } from 'zustand';

export interface NodeItem {
  id: string;
  name?: string;
  label?: string;
  title?: string;
  x?: number;
  y?: number;
  type?: string;
  kind?: string;
  formulas?: any;
  worldType?: string;
  parentId?: string | null;
  [key: string]: any;
}

export interface EdgeItem {
  from: string;
  to: string;
  type?: string;
  label?: string;
  [key: string]: any;
}

export interface DocumentTab {
  id: string;
  title: string;
  isDirty?: boolean;
}

export interface AppState {
  // Navigation & Tools
  activeTool: 'select' | 'marquee' | 'node' | 'connect' | 'world' | 'dropper' | 'text';
  setActiveTool: (tool: 'select' | 'marquee' | 'node' | 'connect' | 'world' | 'dropper' | 'text') => void;
  
  // Tabs
  tabs: DocumentTab[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  addTab: (title?: string) => void;
  closeTab: (id: string) => void;
  setTabDirty: (id: string, isDirty: boolean) => void;

  // Breadcrumbs & Scopes
  activeDrillPath: { id: string; name: string }[];
  drillDown: (nodeId: string, name: string) => void;
  drillUp: () => void;
  drillTo: (index: number) => void;

  // Visual Graph
  nodes: NodeItem[];
  edges: EdgeItem[];
  selectedNodeIds: string[];
  selectionBox: { x1: number; y1: number; x2: number; y2: number } | null;
  sampledStyle: Partial<NodeItem> | null;
  
  setNodes: (nodes: NodeItem[]) => void;
  setEdges: (edges: EdgeItem[]) => void;
  addNode: (node: NodeItem) => void;
  updateNode: (id: string, updates: Partial<NodeItem>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: EdgeItem) => void;
  removeEdge: (from: string, to: string) => void;
  setSelectedNodeIds: (ids: string[]) => void;
  setSelectionBox: (box: { x1: number; y1: number; x2: number; y2: number } | null) => void;
  setSampledStyle: (style: Partial<NodeItem> | null) => void;

  // UI Drawers & Modals
  isCodeDrawerOpen: boolean;
  setIsCodeDrawerOpen: (open: boolean) => void;
  isDiagramModalOpen: boolean;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  setIsDiagramModalOpen: (open: boolean) => void;
  isConsoleOpen: boolean;
  setIsConsoleOpen: (open: boolean) => void;

  // AI & Reasoning Logs
  aiModel: string;
  setAiModel: (model: string) => void;
  reasoningLogs: string[];
  addReasoningLog: (log: string) => void;
  clearReasoningLogs: () => void;

  // Editor Content & Sync
  editorContent: string;
  setEditorContent: (content: string) => void;
  balloonCode: string;
  setBalloonCode: (code: string) => void;
  syncCanvasToCode: () => void;
  syncCodeToCanvas: (code: string) => void;

  // Evaluation & Language
  evaluations: Record<string, any>;
  setEvaluations: (evals: Record<string, any>) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  activeTool: 'select',
  setActiveTool: (activeTool) => set({ activeTool }),

  tabs: [
    { id: 'tab-1', title: 'architecture.balloon', isDirty: false },
    { id: 'tab-2', title: 'domain_model.balloon', isDirty: false }
  ],
  activeTabId: 'tab-1',
  setActiveTabId: (activeTabId) => set({ activeTabId }),
  addTab: (title = 'untitled.balloon') => {
    const newId = 'tab-' + Date.now();
    set((state) => ({
      tabs: [...state.tabs, { id: newId, title, isDirty: false }],
      activeTabId: newId
    }));
  },
  closeTab: (id) => {
    set((state) => {
      const remaining = state.tabs.filter((t) => t.id !== id);
      if (remaining.length === 0) {
        remaining.push({ id: 'tab-1', title: 'untitled.balloon', isDirty: false });
      }
      return {
        tabs: remaining,
        activeTabId: state.activeTabId === id ? remaining[0].id : state.activeTabId
      };
    });
  },
  setTabDirty: (id, isDirty) => {
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, isDirty } : t))
    }));
  },

  activeDrillPath: [{ id: 'root', name: 'Root Architecture' }],
  drillDown: (nodeId, name) => {
    set((state) => ({
      activeDrillPath: [...state.activeDrillPath, { id: nodeId, name }]
    }));
  },
  drillUp: () => {
    set((state) => {
      if (state.activeDrillPath.length <= 1) return state;
      return { activeDrillPath: state.activeDrillPath.slice(0, -1) };
    });
  },
  drillTo: (index) => {
    set((state) => ({
      activeDrillPath: state.activeDrillPath.slice(0, index + 1)
    }));
  },

  nodes: [
    { id: 'w1', name: 'Auth Gateway', label: 'Auth Gateway', x: 280, y: 220, type: 'container', worldType: 'alethic' },
    { id: 'w2', name: 'Core Ledger', label: 'Core Ledger', x: 560, y: 220, type: 'container', worldType: 'epistemic' },
    { id: 'w3', name: 'Audit Vault', label: 'Audit Vault', x: 420, y: 380, type: 'database', worldType: 'deontic' }
  ],
  edges: [
    { from: 'w1', to: 'w2', type: 'rel', label: 'sync_events' },
    { from: 'w2', to: 'w3', type: 'rel', label: 'persist_audit' }
  ],
  selectedNodeIds: [],
  selectionBox: null,
  sampledStyle: null,

  setNodes: (nodes) => {
    set({ nodes });
    get().syncCanvasToCode();
  },
  setEdges: (edges) => {
    set({ edges });
    get().syncCanvasToCode();
  },
  addNode: (node) => {
    set((state) => ({ nodes: [...state.nodes, { x: 300, y: 200, ...node }] }));
    get().syncCanvasToCode();
  },
  updateNode: (id, updates) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n))
    }));
    get().syncCanvasToCode();
  },
  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.from !== id && e.to !== id),
      selectedNodeIds: state.selectedNodeIds.filter((nid) => nid !== id)
    }));
    get().syncCanvasToCode();
  },
  addEdge: (edge) => {
    set((state) => ({
      edges: state.edges.some((e) => e.from === edge.from && e.to === edge.to)
        ? state.edges
        : [...state.edges, edge]
    }));
    get().syncCanvasToCode();
  },
  removeEdge: (from, to) => {
    set((state) => ({
      edges: state.edges.filter((e) => !(e.from === from && e.to === to))
    }));
    get().syncCanvasToCode();
  },
  setSelectedNodeIds: (selectedNodeIds) => set({ selectedNodeIds }),
  setSelectionBox: (selectionBox) => set({ selectionBox }),
  setSampledStyle: (sampledStyle) => set({ sampledStyle }),

  isCodeDrawerOpen: false,
  setIsCodeDrawerOpen: (isCodeDrawerOpen) => set({ isCodeDrawerOpen }),
  isDiagramModalOpen: false,
  isExportModalOpen: false,
  setIsExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
  isSearchModalOpen: false,
  setIsSearchModalOpen: (isSearchModalOpen) => set({ isSearchModalOpen }),
  setIsDiagramModalOpen: (isDiagramModalOpen) => set({ isDiagramModalOpen }),
  isConsoleOpen: true,
  setIsConsoleOpen: (isConsoleOpen) => set({ isConsoleOpen }),

  aiModel: 'gemini-1.5-pro',
  setAiModel: (aiModel) => set({ aiModel }),
  reasoningLogs: [
    'System initialized in Sahara Warm Minimalism mode.',
    'PixiJS WebGPU canvas pipeline online.',
    'BalloonAST parser registered and active.'
  ],
  addReasoningLog: (log) => set((state) => ({ reasoningLogs: [...state.reasoningLogs, log] })),
  clearReasoningLogs: () => set({ reasoningLogs: [] }),

  editorContent: `system BankingSystem {
  container AuthGateway [type="gateway", world="alethic"]
  container CoreLedger [type="service", world="epistemic"]
  database AuditVault [type="database", world="deontic"]

  AuthGateway -> CoreLedger : "sync_events"
  CoreLedger -> AuditVault : "persist_audit"
}`,
  setEditorContent: (editorContent) => set({ editorContent }),

  balloonCode: `// BalloonDSL Architecture Document
system BankingSystem {
  container AuthGateway [type="gateway", world="alethic"]
  container CoreLedger [type="service", world="epistemic"]
  database AuditVault [type="database", world="deontic"]

  AuthGateway -> CoreLedger : "sync_events"
  CoreLedger -> AuditVault : "persist_audit"
}
`,
  setBalloonCode: (balloonCode) => set({ balloonCode }),
  syncCanvasToCode: () => {
    const { nodes, edges } = get();
    let code = '// BalloonDSL Live Graph Model\n';
    code += 'system ArchitectureVault {\n';
    for (const n of nodes) {
      code += `  node ${n.id} [label="${n.label || n.name || n.id}", type="${n.type || 'generic'}", x=${Math.round(n.x || 0)}, y=${Math.round(n.y || 0)}]\n`;
    }
    for (const e of edges) {
      code += `  ${e.from} -> ${e.to} : "${e.label || ''}"\n`;
    }
    code += '}\n';
    set({ balloonCode: code });
  },
  syncCodeToCanvas: (code: string) => {
    set({ balloonCode: code });
    const nodeMatches = code.matchAll(/node\s+([a-zA-Z0-9_]+)\s+\[(.*)\]/g);
    const parsedNodes: NodeItem[] = [];
    for (const match of nodeMatches) {
      const id = match[1];
      const props = match[2];
      const labelMatch = props.match(/label="([^"]+)"/);
      const xMatch = props.match(/x=(\d+)/);
      const yMatch = props.match(/y=(\d+)/);
      parsedNodes.push({
        id,
        name: labelMatch ? labelMatch[1] : id,
        label: labelMatch ? labelMatch[1] : id,
        x: xMatch ? parseInt(xMatch[1], 10) : Math.random() * 400 + 200,
        y: yMatch ? parseInt(yMatch[1], 10) : Math.random() * 300 + 150
      });
    }
    if (parsedNodes.length > 0) {
      set({ nodes: parsedNodes });
    }
  },

  evaluations: {},
  setEvaluations: (evaluations) => set({ evaluations }),
  language: 'logidsl',
  setLanguage: (language) => set({ language })
}));
