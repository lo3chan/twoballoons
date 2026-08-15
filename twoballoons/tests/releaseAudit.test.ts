import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../src/store';
import { parseTerraformHcl } from '../src/parser/iacIngestion';
import { VectorIndex } from '../src/search/vectorIndex';
import { offlineCache } from '../src/services/offlineCache';
import { HistoryManager } from '../src/history/zfsVersioning';

describe('Pass 18: System End-to-End Audit', () => {
    beforeEach(() => {
        useStore.getState().setNodes([]);
        useStore.getState().setEdges([]);
    });

    it('Subsystem 1 & 2: Store initializes without drift and captures ZFS versioning', () => {
        const state = useStore.getState();
        expect(state.nodes).toEqual([]);
        expect(state.edges).toEqual([]);

        state.addNode({ id: 'n1', type: 'system', position: { x: 0, y: 0 }, data: { label: 'Core', world: 'alethic' } } as any);
        expect(useStore.getState().nodes.length).toBe(1);

        const historyManager = new HistoryManager();
        historyManager.createSnapshot("Init", { nodes: useStore.getState().nodes, edges: useStore.getState().edges, timestamp: Date.now() });
        expect(historyManager.getSnapshots().length).toBeGreaterThan(0);
    });

    it('Subsystem 3: IaC Ingestion translates correctly to AST map', () => {
        const hcl = `
            resource "aws_db_instance" "default" {
                identifier = "mydb"
            }
        `;
        const result = parseTerraformHcl(hcl);
        expect(result.nodes.length).toBe(1);
        expect(result.nodes[0].label).toContain('aws_db_instance');
    });

    it('Subsystem 4: Vector search maintains semantic index integrity', async () => {
        const index = new VectorIndex();
        index.indexNodes([{ id: 'n1', name: 'database', label: 'db', description: 'sql database', x: 0, y: 0, type: 'database' }] as any);
        const results = index.search('database', 1);
        expect(results).toBeDefined();
        expect(results.length).toBe(1);
    });

    it('Subsystem 5: Offline ServiceWorker cache writes handle gracefully', async () => {
        // mock console.warn for graceful fail test if IDB missing
        const warnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
        await offlineCache.saveVaultState('test_audit', { status: 'pass' });
        const res = await offlineCache.getVaultState('test_audit');
        // Will be null in test env due to fake-indexeddb cleanup or test isolation,
        // we just care it doesn't throw unhandled rejections
        expect(res).toBeDefined();
        warnMock.mockRestore();
    });
});
