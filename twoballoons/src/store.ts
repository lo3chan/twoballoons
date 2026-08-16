import { create } from 'zustand';
import { DiffOperation, generateCanvasDiff } from './ai/canvasDiffEngine';
import { offlineCache } from './services/offlineCache';

// Generic debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

const debouncedSaveVaultState = debounce((nodes: NodeItem[], edges: EdgeItem[]) => {
  offlineCache.saveVaultState("default", { nodes, edges }).catch(() => {});
}, 500);

const debouncedSaveKeyframes = debounce((keyframes: { id: string, x: number, y: number, zoom: number, title: string }[]) => {
  offlineCache.saveKeyframes("default_timeline", keyframes).catch(() => {});
}, 500);

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  depth: number;
}

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
  wikiContent?: string;
  layerId?: string;
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
  cameraPos: { x: number; y: number };
  setCameraPos: (pos: { x: number; y: number }) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
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

  // Layers
  layers: Layer[];
  activeLayerId: string;
  addLayer: (layer: Layer) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  setActiveLayerId: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;

  // UI Drawers & Modals
  isWikiEditorOpen: boolean;
  selectedWikiNodeId: string | null;
  setIsWikiEditorOpen: (open: boolean) => void;
  setSelectedWikiNodeId: (id: string | null) => void;
  isCodeDrawerOpen: boolean;
  isVisualCodeStackOpen: boolean;
  setIsVisualCodeStackOpen: (open: boolean) => void;
  isLayerManagerOpen: boolean;
  setIsLayerManagerOpen: (open: boolean) => void;
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
  loadVaultState: () => Promise<void>;

  // Evaluation & Language
  evaluations: Record<string, any>;
  setEvaluations: (evals: Record<string, any>) => void;
  language: string;
  setLanguage: (lang: string) => void;

  // Context Menu State
  contextMenu: { isOpen: boolean; x: number; y: number; contextType: 'node' | 'canvas' | 'timeline' | 'none'; targetId?: string };
  openContextMenu: (x: number, y: number, contextType: 'node' | 'canvas' | 'timeline', targetId?: string) => void;
  closeContextMenu: () => void;

  // Diff Engine State
  diffOperations: DiffOperation[];
  setDiffOperations: (ops: DiffOperation[]) => void;
  generateGhostDiff: (prompt: string, selectedIds: string[]) => void;
  applyDiff: () => void;
  rejectDiff: () => void;
  // Presentation Mode State
  isPresenting: boolean;
  setIsPresenting: (isPresenting: boolean) => void;
  presentationKeyframes: { id: string, x: number, y: number, zoom: number, title: string }[];
  setPresentationKeyframes: (keyframes: { id: string, x: number, y: number, zoom: number, title: string }[]) => void;
  loadPresentationKeyframes: () => Promise<void>;
  activeKeyframeIndex: number;
  setActiveKeyframeIndex: (index: number) => void;

  // Visual Merge State
  isMerging: boolean;
  setIsMerging: (isMerging: boolean) => void;
  mergeConflicts: any[]; // Placeholder for actual conflict structure
  setMergeConflicts: (conflicts: any[]) => void;
}

export const useStore = create<AppState>((set, get) => ({
  cameraPos: { x: 0, y: 0 },
  setCameraPos: (cameraPos) => set({ cameraPos }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
  activeTool: 'select',
  layers: [
    { id: "layer-1", name: "Base Layer", visible: true, locked: false, depth: 1 },
    { id: "layer-2", name: "Background", visible: true, locked: false, depth: 0 }
  ],
  activeLayerId: "layer-1",
  addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
  toggleLayerVisibility: (id) => set((state) => ({
    layers: state.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
  })),
  toggleLayerLock: (id) => set((state) => ({
    layers: state.layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l)
  })),
  setActiveLayerId: (activeLayerId) => set({ activeLayerId }),
  updateLayer: (id, updates) => set((state) => ({
    layers: state.layers.map(l => l.id === id ? { ...l, ...updates } : l)
  })),
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

  isWikiEditorOpen: false,
  selectedWikiNodeId: null,
  setIsWikiEditorOpen: (isWikiEditorOpen) => set({ isWikiEditorOpen }),
  setSelectedWikiNodeId: (selectedWikiNodeId) => set({ selectedWikiNodeId }),
  isVisualCodeStackOpen: false,
  setIsVisualCodeStackOpen: (isVisualCodeStackOpen) => set({ isVisualCodeStackOpen }),
  isLayerManagerOpen: false,
  setIsLayerManagerOpen: (isLayerManagerOpen) => set({ isLayerManagerOpen }),
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
    debouncedSaveVaultState(nodes, edges);
  },
  loadVaultState: async () => {
    try {
      const state = await offlineCache.getVaultState("default");
      if (state && state.nodes && state.edges) {
        set({ nodes: state.nodes, edges: state.edges });
        get().syncCanvasToCode();
      }
    } catch (e) {
      console.warn("Could not load vault state from cache", e);
    }
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
  language: 'balloondsl',
  setLanguage: (language) => set({ language }),

  contextMenu: { isOpen: false, x: 0, y: 0, contextType: 'none' },
  openContextMenu: (x, y, contextType, targetId) => set({ contextMenu: { isOpen: true, x, y, contextType, targetId } }),
  closeContextMenu: () => set((state) => ({ contextMenu: { ...state.contextMenu, isOpen: false } })),

  diffOperations: [],
  setDiffOperations: (diffOperations) => set({ diffOperations }),
  generateGhostDiff: (prompt, selectedIds) => {
    const { nodes, edges } = get();
    const diff = generateCanvasDiff(nodes, edges, prompt, selectedIds);
    set({ diffOperations: diff.operations });
  },
  applyDiff: () => {
    const { diffOperations, nodes, edges } = get();
    let newNodes = [...nodes];
    let newEdges = [...edges];

    for (const op of diffOperations) {
      if (op.entityType === 'node') {
        if (op.type === 'add') {
          newNodes.push(op.entity as NodeItem);
        } else if (op.type === 'remove') {
          newNodes = newNodes.filter(n => n.id !== op.entity.id);
        } else if (op.type === 'update') {
          newNodes = newNodes.map(n => n.id === op.entity.id ? { ...n, ...op.changes } : n);
        }
      } else if (op.entityType === 'edge') {
         if (op.type === 'add') {
           newEdges.push(op.entity as EdgeItem);
         } else if (op.type === 'remove') {
           newEdges = newEdges.filter(e => e.id !== op.entity.id);
         } else if (op.type === 'update') {
           newEdges = newEdges.map(e => e.id === op.entity.id ? { ...e, ...op.changes } : e);
         }
      }
    }

    set({ nodes: newNodes, edges: newEdges, diffOperations: [] });
    get().syncCanvasToCode();
  },
  
  rejectDiff: () => {
    set({ diffOperations: [] });
  },

  // Presentation Mode Implementation
  isPresenting: false,
  setIsPresenting: (isPresenting) => set({ isPresenting }),
  presentationKeyframes: [],
  setPresentationKeyframes: (presentationKeyframes) => {
    set({ presentationKeyframes });
    debouncedSaveKeyframes(presentationKeyframes);
  },
  loadPresentationKeyframes: async () => {
    try {
      const kfs = await offlineCache.getKeyframes("default_timeline");
      if (kfs && kfs.length > 0) {
        set({ presentationKeyframes: kfs });
      }
    } catch (e) {
      console.warn("Could not load keyframes from cache", e);
    }
  },
  activeKeyframeIndex: 0,
  setActiveKeyframeIndex: (activeKeyframeIndex) => set({ activeKeyframeIndex }),

  // Visual Merge Implementation
  isMerging: false,
  setIsMerging: (isMerging) => set({ isMerging }),
  mergeConflicts: [],
  setMergeConflicts: (mergeConflicts) => set({ mergeConflicts }),
}));
