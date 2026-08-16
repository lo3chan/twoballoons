import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../src/store';

describe('twoballoons Studio Cohesion & Multi-Document Isolation', () => {
  beforeEach(() => {
    useStore.setState({
      activeTabId: 'tab-1',
      tabs: [
        {
          id: 'tab-1',
          title: 'architecture.balloon',
          nodes: [{ id: 'A', label: 'Service A', x: 100, y: 100, type: 'service' }],
          edges: [],
          balloonCode: 'system A { container A }',
          cameraPos: { x: 0, y: 0 },
          zoom: 1
        },
        {
          id: 'tab-2',
          title: 'data_pipeline.balloon',
          nodes: [
            { id: 'B', label: 'Database B', x: 200, y: 200, type: 'database' },
            { id: 'C', label: 'Cache C', x: 400, y: 200, type: 'cache' }
          ],
          edges: [{ from: 'B', to: 'C', label: 'replicate' }],
          balloonCode: 'system B { database B; container C; B -> C }',
          cameraPos: { x: 50, y: 50 },
          zoom: 1.5
        }
      ],
      nodes: [{ id: 'A', label: 'Service A', x: 100, y: 100, type: 'service' }],
      edges: [],
      activeTool: 'select'
    });
  });

  it('correctly isolates and rehydrates document state when switching tabs', () => {
    const { setActiveTabId } = useStore.getState();

    // 1. Initial active tab has 1 node
    expect(useStore.getState().nodes.length).toBe(1);
    expect(useStore.getState().nodes[0].id).toBe('A');

    // 2. Switch to tab-2
    setActiveTabId('tab-2');
    expect(useStore.getState().activeTabId).toBe('tab-2');
    expect(useStore.getState().nodes.length).toBe(2);
    expect(useStore.getState().nodes[0].id).toBe('B');
    expect(useStore.getState().edges.length).toBe(1);
    expect(useStore.getState().cameraPos).toEqual({ x: 50, y: 50 });
    expect(useStore.getState().zoom).toBe(1.5);

    // 3. Mutate tab-2 by adding a node
    useStore.getState().addNode({ id: 'D', label: 'Queue D', x: 600, y: 200, type: 'queue' });
    expect(useStore.getState().nodes.length).toBe(3);

    // 4. Switch back to tab-1
    setActiveTabId('tab-1');
    expect(useStore.getState().activeTabId).toBe('tab-1');
    expect(useStore.getState().nodes.length).toBe(1);
    expect(useStore.getState().nodes[0].id).toBe('A');

    // 5. Switch to tab-2 and verify saved mutation persists
    setActiveTabId('tab-2');
    expect(useStore.getState().nodes.length).toBe(3);
    expect(useStore.getState().nodes.find(n => n.id === 'D')).toBeDefined();
  });

  it('creates new document tabs with clean isolated state on addTab()', () => {
    const { addTab } = useStore.getState();
    addTab('new_cluster.balloon');

    const state = useStore.getState();
    expect(state.tabs.length).toBe(3);
    expect(state.activeTabId.startsWith('tab-')).toBe(true);
    expect(state.nodes.length).toBe(1);
    expect(state.nodes[0].id).toBe('Node1');
  });

  it('handles closing tabs cleanly without crashing', () => {
    const { closeTab } = useStore.getState();
    closeTab('tab-1');

    const state = useStore.getState();
    expect(state.tabs.length).toBe(1);
    expect(state.activeTabId).toBe('tab-2');
    expect(state.nodes.length).toBe(2);
  });

  it('governs activeTool interaction modes in LeftToolbar and Canvas', () => {
    const { setActiveTool, addNode } = useStore.getState();
    setActiveTool('node');
    expect(useStore.getState().activeTool).toBe('node');

    addNode({ id: 'N_new', label: 'New Node', x: 250, y: 250, type: 'generic' });
    expect(useStore.getState().nodes.find(n => n.id === 'N_new')).toBeDefined();

    setActiveTool('kripke');
    expect(useStore.getState().activeTool).toBe('kripke');
  });
});
