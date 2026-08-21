import { NodeItem, EdgeItem } from "../store";

export interface GraphState {
    nodes: NodeItem[];
    edges: EdgeItem[];
    timestamp: number;
}

export interface Snapshot {
    id: string;
    milestone: string;
    state: GraphState;
    timestamp: number;
}

export class HistoryManager {
    private snapshots: Map<string, Snapshot>;
    private currentState: GraphState | null;

    constructor() {
        this.snapshots = new Map();
        this.currentState = null;
    }

    createSnapshot(milestone: string, state: GraphState): string {
        const id = crypto.randomUUID();
        const snapshot: Snapshot = {
            id,
            milestone,
            state: JSON.parse(JSON.stringify(state)), // Deep copy for immutability
            timestamp: Date.now(),
        };
        this.snapshots.set(id, snapshot);
        this.currentState = state;
        return id;
    }

    rollbackToSnapshot(id: string): GraphState | null {
        const snapshot = this.snapshots.get(id);
        if (snapshot) {
            this.currentState = JSON.parse(JSON.stringify(snapshot.state));
            return this.currentState;
        }
        return null;
    }

    getSnapshots(): Snapshot[] {
        return Array.from(this.snapshots.values()).sort((a, b) => a.timestamp - b.timestamp);
    }

    getCurrentState(): GraphState | null {
        return this.currentState;
    }
}
