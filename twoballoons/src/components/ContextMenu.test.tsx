import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContextMenu } from './ContextMenu';
import { useStore } from '../store';

describe('ContextMenu', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return null if not open', () => {
        useStore.setState({
            contextMenu: { isOpen: false, x: 0, y: 0, contextType: 'node' }
        });
        const { container } = render(<ContextMenu />);
        expect(container.firstChild).toBeNull();
    });

    it('should render correct actions for node context', () => {
        useStore.setState({
            contextMenu: { isOpen: true, x: 10, y: 10, contextType: 'node', targetId: 'node1' }
        });
        render(<ContextMenu />);
        expect(screen.getByText('node actions')).toBeInTheDocument();
        expect(screen.getByText('Refactor with Antigravity')).toBeInTheDocument();
        expect(screen.getByText('Add Modal Constraints')).toBeInTheDocument();
        expect(screen.getByText('Explain Dependencies')).toBeInTheDocument();
    });

    it('should render correct actions for canvas context', () => {
        useStore.setState({
            contextMenu: { isOpen: true, x: 10, y: 10, contextType: 'canvas' }
        });
        render(<ContextMenu />);
        expect(screen.getByText('canvas actions')).toBeInTheDocument();
        expect(screen.getByText('Generate Subsystem Architecture')).toBeInTheDocument();
        expect(screen.getByText('Auto-Layout & Optimize')).toBeInTheDocument();
    });

    it('should trigger ghost diff and close menu on action click', () => {
        let generatedPrompt = '';
        let generatedIds: string[] = [];
        let menuClosed = false;

        useStore.setState({
            contextMenu: { isOpen: true, x: 10, y: 10, contextType: 'node', targetId: 'test-node' },
            generateGhostDiff: (prompt: string, ids: string[]) => {
                generatedPrompt = prompt;
                generatedIds = ids;
            },
            closeContextMenu: () => {
                menuClosed = true;
            }
        });
        
        render(<ContextMenu />);
        fireEvent.click(screen.getByText('Refactor with Antigravity'));
        
        expect(generatedPrompt).toBe('Refactor with Antigravity');
        expect(generatedIds).toEqual(['test-node']);
        expect(menuClosed).toBe(true);
    });
});
