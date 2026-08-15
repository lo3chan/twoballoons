import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LayerManager } from './LayerManager';
import { useStore } from '../store';

describe('LayerManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return null if not open', () => {
        useStore.setState({ isLayerManagerOpen: false });
        const { container } = render(<LayerManager />);
        expect(container.firstChild).toBeNull();
    });

    it('should render layer lists based on depth sorting', () => {
        useStore.setState({
            isLayerManagerOpen: true,
            layers: [
                { id: 'l1', name: 'Layer 1', visible: true, locked: false, depth: 1 },
                { id: 'l2', name: 'Layer 2', visible: true, locked: false, depth: 2 },
            ]
        });
        render(<LayerManager />);
        
        const layers = screen.getAllByText(/Layer \d/);
        expect(layers[0]).toHaveTextContent('Layer 2');
        expect(layers[1]).toHaveTextContent('Layer 1');
    });

    it('should toggle lock and visibility', () => {
        let toggledLockId = '';
        let toggledVisId = '';
        
        useStore.setState({
            isLayerManagerOpen: true,
            layers: [
                { id: 'l1', name: 'Layer 1', visible: true, locked: false, depth: 1 }
            ],
            toggleLayerLock: (id: string) => { toggledLockId = id; },
            toggleLayerVisibility: (id: string) => { toggledVisId = id; }
        });
        
        render(<LayerManager />);
        fireEvent.click(screen.getByTitle('Toggle Lock'));
        fireEvent.click(screen.getByTitle('Toggle Visibility'));
        
        expect(toggledLockId).toBe('l1');
        expect(toggledVisId).toBe('l1');
    });

    it('should add a new layer', () => {
        let addedLayerName = '';
        useStore.setState({
            isLayerManagerOpen: true,
            layers: [],
            addLayer: (layer) => { addedLayerName = layer.name; }
        });
        
        render(<LayerManager />);
        const input = screen.getByPlaceholderText('New Layer Name...');
        fireEvent.change(input, { target: { value: 'New Test Layer' } });
        fireEvent.click(screen.getByText('+'));
        
        expect(addedLayerName).toBe('New Test Layer');
    });
});
