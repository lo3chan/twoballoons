import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ydoc, ynodesMap, awareness } from '../src/sync/crdtProvider';

describe('WebRTC Collaboration Tests', () => {
    beforeEach(() => {
        // Clear Yjs document
        ynodesMap.clear();
        // Provide a default user object to local state since setLocalStateField merges into it.
        // It could be null if not initialized, causing the setLocalStateField to ignore or not set properly if it relies on object.
        awareness.setLocalState({ user: { name: 'Test', color: '#000000' } });
    });

    it('syncs node state to yjs map properly', () => {
        const node = { id: 'test-node', x: 100, y: 100, name: 'Test', type: 'container', label: 'Test Node' };
        ynodesMap.set(node.id, node);
        
        expect(ynodesMap.get('test-node')).toEqual(node);
    });

    it('broadcasts cursor presence to awareness state', () => {
        awareness.setLocalStateField('cursor', { x: 50, y: 75 });
        
        const state = awareness.getLocalState();
        expect(state?.cursor).toEqual({ x: 50, y: 75 });
    });

    it('broadcasts node selection halos to awareness state', () => {
        const selectedIds = ['node-1', 'node-2'];
        awareness.setLocalStateField('selection', selectedIds);
        
        const state = awareness.getLocalState();
        expect(state?.selection).toEqual(['node-1', 'node-2']);
    });
    
    it('broadcasts viewport status to awareness state', () => {
        awareness.setLocalStateField('viewport', { x: 10, y: 10, zoom: 1.5 });
        const state = awareness.getLocalState();
        expect(state?.viewport).toEqual({ x: 10, y: 10, zoom: 1.5 });
    });

});
