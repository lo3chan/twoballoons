import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateCanvasDiff } from '../src/ai/canvasDiffEngine';
import { NodeItem, EdgeItem } from '../src/store';
import { offlineCache } from '../src/services/offlineCache';
import { useStore } from '../src/store';

// Set up fake indexeddb for tests
import 'fake-indexeddb/auto';

describe('Local System Persistent Storage & Diff Engine', () => {
  beforeEach(async () => {
    // Reset state before each test
    vi.useFakeTimers();
    useStore.setState({ nodes: [], edges: [], balloonCode: '', diffOperations: [], presentationKeyframes: [] });
  });

  it('generates a deterministic diff for refactoring', () => {
    const nodes: NodeItem[] = [
      { id: 'n1', label: 'Legacy Node', type: 'unknown_type', worldType: 'unknown_world' }
    ];
    const diff = generateCanvasDiff(nodes, [], 'please refactor this architecture', ['n1']);

    expect(diff.operations.length).toBe(1);
    expect(diff.operations[0].type).toBe('update');
    expect(diff.operations[0].changes?.type).toBe('service');
    expect(diff.operations[0].changes?.worldType).toBe('epistemic');
    expect(diff.operations[0].changes?.label).toBe('Legacy Node (Refactored)');
  });

  it('generates a deterministic diff for generating subsystems', () => {
    const nodes: NodeItem[] = [{ id: 'n1', label: 'Existing' }];
    const diff = generateCanvasDiff(nodes, [], 'generate a subsystem', []);

    expect(diff.operations.length).toBe(3); // 2 nodes, 1 edge
    expect(diff.operations[0].type).toBe('add');
    expect(diff.operations[0].entity.id).toBe('gen_svc_2'); // length was 1, so 1+1=2
    expect(diff.operations[2].type).toBe('add');
    expect(diff.operations[2].entityType).toBe('edge');
  });

  it('generates a deterministic diff for optimizing (removing orphans)', () => {
    const nodes: NodeItem[] = [
      { id: 'connected-1' },
      { id: 'connected-2' },
      { id: 'orphan-1' }
    ];
    const edges: EdgeItem[] = [
      { id: 'e1', from: 'connected-1', to: 'connected-2' }
    ];
    const diff = generateCanvasDiff(nodes, edges, 'optimize and clean up', []);

    expect(diff.operations.length).toBe(1);
    expect(diff.operations[0].type).toBe('remove');
    expect(diff.operations[0].entity.id).toBe('orphan-1');
  });

  it('autosaves vault state when nodes change (debounced)', async () => {
    const saveSpy = vi.spyOn(offlineCache, 'saveVaultState').mockResolvedValue(undefined);

    const store = useStore.getState();
    const newNodes = [{ id: 'test-node-1', x: 0, y: 0 }];

    // Trigger action that calls debounced save
    store.setNodes(newNodes);

    // Fast forward debounce timer
    vi.advanceTimersByTime(600);

    expect(saveSpy).toHaveBeenCalledWith('default', expect.objectContaining({ nodes: newNodes }));
    saveSpy.mockRestore();
  });

  it('loads vault state from cache', async () => {
    const cachedData = {
      nodes: [{ id: 'cache-node-1', label: 'Cached' }],
      edges: []
    };
    const getSpy = vi.spyOn(offlineCache, 'getVaultState').mockResolvedValue(cachedData);

    const store = useStore.getState();
    await store.loadVaultState();

    const currentNodes = useStore.getState().nodes;
    expect(currentNodes.length).toBe(1);
    expect(currentNodes[0].id).toBe('cache-node-1');
    expect(currentNodes[0].label).toBe('Cached');

    getSpy.mockRestore();
  });
});
