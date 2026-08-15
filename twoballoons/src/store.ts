import { create } from "zustand";

export interface NodeItem {
  id: string;
  name?: string;
  label?: string;
  kind?: string;
  x?: number;
  y?: number;
  description?: string;
  properties?: Record<string, any>;
  formulas?: any[];
  [key: string]: any;
}

export interface EdgeItem {
  from: string;
  to: string;
  label?: string;
  rel_type?: string;
  [key: string]: any;
}

interface AppState {
  language: "logidsl" | "philodsl";
  setLanguage: (lang: "logidsl" | "philodsl") => void;
  activeTool: "select" | "marquee" | "nodes" | "connect" | "logic" | "text";
  setActiveTool: (tool: "select" | "marquee" | "nodes" | "connect" | "logic" | "text") => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  nodes: NodeItem[];
  edges: EdgeItem[];
  evaluations: Record<string, any>;
  editorContent: string;
  reasoningLogs: string[];
  isDiagramModalOpen: boolean;
  setIsDiagramModalOpen: (open: boolean) => void;
  setNodes: (nodes: NodeItem[]) => void;
  setEdges: (edges: EdgeItem[]) => void;
  setEvaluations: (evals: Record<string, any>) => void;
  setEditorContent: (content: string) => void;
  addReasoningLog: (log: string) => void;
}

export const useStore = create<AppState>((set) => ({
  language: "logidsl",
  setLanguage: (language) => set({ language }),
  activeTool: "marquee",
  setActiveTool: (activeTool) => set({ activeTool }),
  aiModel: "Gemini 3.6 Flash",
  setAiModel: (aiModel) => set({ aiModel }),
  nodes: [
    { id: "web_app", name: "Web Application", label: "Web Application", kind: "Container", x: 180, y: 140, description: "Delivers the static content and twoballoons SPA to the browser." },
    { id: "api_gw", name: "API Gateway", label: "API Gateway", kind: "Container", x: 500, y: 320, description: "Routes incoming requests to the appropriate microservices." },
  ],
  edges: [
    { from: "web_app", to: "api_gw", label: "HTTPS / REST", rel_type: "DirectedFlow" }
  ],
  evaluations: {},
  editorContent: `actor User "Architect"
component WebApp "Web Application"
store VaultDB "Local SQLite Vault"

WebApp -> VaultDB : "Sync AST & Layout"
`,
  reasoningLogs: [
    "twoballoons AI Engine | Reasoning Logs Active",
    "> Initialize Generative Fill for Selected Nodes...",
    "streaming AI reasoning: Analyzing architecture block dependencies...",
    "Evaluating spatial constraints for active canvas elements...",
    "Ready for user input."
  ],
  isDiagramModalOpen: false,
  setIsDiagramModalOpen: (isDiagramModalOpen) => set({ isDiagramModalOpen }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setEvaluations: (evaluations) => set({ evaluations }),
  setEditorContent: (editorContent) => set({ editorContent }),
  addReasoningLog: (log) => set((state) => ({ reasoningLogs: [...state.reasoningLogs.slice(-30), log] })),
}));
