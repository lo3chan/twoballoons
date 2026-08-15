import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AntigravityWindow } from './AntigravityWindow';
import { useStore } from '../store';

describe('AntigravityWindow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return null if conditions are not met', () => {
        useStore.setState({
            selectedNodeIds: [],
            diffOperations: []
        });
        const { container } = render(<AntigravityWindow />);
        expect(container.firstChild).toBeNull();
    });

    it('should render correctly with selected nodes and suggest operations', () => {
        useStore.setState({
            selectedNodeIds: ['node1', 'node2'],
            activeTabId: 'test-tab',
            activeDrillPath: [{id: 'root', name: 'root'}, {id: 'sub', name: 'sub'}],
            diffOperations: []
        });
        render(<AntigravityWindow />);
        expect(screen.getByText('Antigravity AI')).toBeInTheDocument();
        expect(screen.getByText('2 nodes')).toBeInTheDocument();
        expect(screen.getByText('✨ Refactor to Event-Driven')).toBeInTheDocument();
    });

    it('should show proposed ghost diff operations and allow merge/reject', () => {
        useStore.setState({
            selectedNodeIds: ['node1', 'node2'],
            diffOperations: [
                { id: 'diff1', type: 'add', entityType: 'node', entity: { id: 'new-node', name: 'new', type: 'container', x: 0, y: 0 } }
            ]
        });
        render(<AntigravityWindow />);
        expect(screen.getByText('Ghost Diff Proposed')).toBeInTheDocument();
        expect(screen.getByText('1 operations generated.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Merge' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument();
    });

    it('should trigger ghost diff generation on action click', () => {
        let generatedPrompt = '';
        useStore.setState({
            selectedNodeIds: ['node1', 'node2'],
            diffOperations: [],
            generateGhostDiff: (prompt: string) => { generatedPrompt = prompt; }
        });
        
        render(<AntigravityWindow />);
        const actionButton = screen.getByText('✨ Refactor to Event-Driven');
        fireEvent.click(actionButton);
        expect(generatedPrompt).toBe('Refactor to Event-Driven');
    });
});
