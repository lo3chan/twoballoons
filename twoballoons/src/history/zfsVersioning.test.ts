import { describe, it, expect } from 'vitest';
import { HistoryManager, GraphState } from './zfsVersioning';

describe('ZFS-Style Versioning (HistoryManager)', () => {
    it('creates a snapshot and rolls back', () => {
        const manager = new HistoryManager();

        const state1: GraphState = { nodes: [{ id: '1' }], edges: [], timestamp: 1000 };
        const id1 = manager.createSnapshot('Initial State', state1);

        const state2: GraphState = { nodes: [{ id: '1' }, { id: '2' }], edges: [], timestamp: 2000 };
        manager.createSnapshot('Added node 2', state2);

        expect(manager.getSnapshots().length).toBe(2);

        const rolledBackState = manager.rollbackToSnapshot(id1);
        expect(rolledBackState).toEqual(state1);
        expect(manager.getCurrentState()).toEqual(state1);
    });
});
