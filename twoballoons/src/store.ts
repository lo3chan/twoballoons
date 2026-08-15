import { create } from "zustand";

interface AppState {
  nodes: any[];
  edges: any[];
  evaluations: Record<string, boolean>;
  setNodes: (nodes: any[]) => void;
  setEdges: (edges: any[]) => void;
  setEvaluations: (evaluations: Record<string, boolean>) => void;
}

export const useStore = create<AppState>((set) => ({
  nodes: [],
  edges: [],
  evaluations: {},
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setEvaluations: (evaluations) => set({ evaluations }),
}));
