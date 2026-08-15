import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useStore } from '../store';
import type { NodeItem, EdgeItem } from '../store';

// Initialize a shared document
export const ydoc = new Y.Doc();

// Define shared types
// Use Y.Map to prevent duplication on insert
export const ynodesMap = ydoc.getMap<NodeItem>('nodesMap');
export const yedgesMap = ydoc.getMap<EdgeItem>('edgesMap');

// Connect to the WebSocket provider
export const provider = new WebsocketProvider(
  'ws://localhost:1234',
  'twoballoons-room',
  ydoc
);

// We keep a flag to avoid echo loops
let isSyncingFromYjs = false;

// Function to initialize the binding between Zustand and Yjs
export const initSync = () => {
  const syncNodesFromYjs = () => {
    isSyncingFromYjs = true;
    useStore.getState().setNodes(Array.from(ynodesMap.values()));
    isSyncingFromYjs = false;
  };

  const syncEdgesFromYjs = () => {
    isSyncingFromYjs = true;
    useStore.getState().setEdges(Array.from(yedgesMap.values()));
    isSyncingFromYjs = false;
  };

  ynodesMap.observe(syncNodesFromYjs);
  yedgesMap.observe(syncEdgesFromYjs);

  // Sync from Zustand to Yjs
  const unsubscribeStore = useStore.subscribe((state, prevState) => {
    if (isSyncingFromYjs) return;

    if (state.nodes !== prevState.nodes) {
      ydoc.transact(() => {
        // Map current node IDs to detect deletes
        const currentIds = new Set(state.nodes.map(n => n.id));

        // Remove nodes that are no longer in Zustand
        Array.from(ynodesMap.keys()).forEach(id => {
            if (!currentIds.has(id)) {
                ynodesMap.delete(id);
            }
        });

        // Add or update current nodes
        state.nodes.forEach(node => {
          ynodesMap.set(node.id, node);
        });
      });
    }

    if (state.edges !== prevState.edges) {
      ydoc.transact(() => {
        // Assume edges have a unique identifier derived from from-to-rel_type or similar
        // Let's create a synthetic ID for edges if they don't have one
        const edgeId = (e: EdgeItem) => `${e.from}-${e.to}-${e.rel_type}`;

        const currentIds = new Set(state.edges.map(edgeId));

        Array.from(yedgesMap.keys()).forEach(id => {
            if (!currentIds.has(id)) {
                yedgesMap.delete(id);
            }
        });

        state.edges.forEach(edge => {
            yedgesMap.set(edgeId(edge), edge);
        });
      });
    }
  });

  return () => {
    ynodesMap.unobserve(syncNodesFromYjs);
    yedgesMap.unobserve(syncEdgesFromYjs);
    unsubscribeStore();
  };
};

export const awareness = provider.awareness;

// Initialize user for awareness
export const initAwareness = (user: { name: string, color: string }) => {
  awareness.setLocalStateField('user', user);
};

export const updateCursor = (pos: { x: number, y: number } | null) => {
  if (pos) {
    awareness.setLocalStateField('cursor', pos);
  } else {
    awareness.setLocalStateField('cursor', null);
  }
};
