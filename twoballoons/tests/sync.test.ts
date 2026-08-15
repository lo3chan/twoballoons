import { describe, it, expect, beforeEach } from 'vitest';
import * as Y from 'yjs';
import { useStore } from '../src/store';
import { ynodesMap, yedgesMap, initSync } from '../src/sync/crdtProvider';

describe('CRDT State Sync', () => {
  let cleanup: () => void;

  beforeEach(() => {
    if (cleanup) cleanup();

    // Reset Zustand store
    useStore.setState({
      nodes: [],
      edges: []
    });

    // Reset Yjs maps
    Array.from(ynodesMap.keys()).forEach(k => ynodesMap.delete(k));
    Array.from(yedgesMap.keys()).forEach(k => yedgesMap.delete(k));
  });

  it('should sync from Zustand to Yjs Map', async () => {
    cleanup = initSync();

    // Trigger state change in Zustand
    useStore.getState().setNodes([
      { id: '1', name: 'Test Node', x: 0, y: 0, kind: 'Container', label: '' }
    ]);

    // Give some time for sync listener
    await new Promise(r => setTimeout(r, 10));

    expect(Array.from(ynodesMap.values()).length).toBe(1);
    expect(ynodesMap.get('1')?.name).toBe('Test Node');
  });

  it('should sync from Yjs Map to Zustand', async () => {
    cleanup = initSync();

    // Trigger state change in Yjs
    ynodesMap.set('2', { id: '2', name: 'Yjs Node', x: 10, y: 10, kind: 'Container', label: '' });

    // Give some time for sync listener
    await new Promise(r => setTimeout(r, 10));

    const zustandNodes = useStore.getState().nodes;
    expect(zustandNodes.length).toBe(1);
    expect(zustandNodes[0].id).toBe('2');
  });
});
