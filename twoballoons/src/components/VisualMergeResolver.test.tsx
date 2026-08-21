import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VisualMergeResolver } from './VisualMergeResolver';
import { useStore } from '../store';

vi.mock('pixi.js', () => {
    return {
        Application: class {
            init = vi.fn().mockResolvedValue(undefined);
            destroy = vi.fn();
            stage = { addChild: vi.fn() };
        },
        Graphics: class {
            roundRect = vi.fn();
            fill = vi.fn();
            stroke = vi.fn();
            position = { set: vi.fn() };
            addChild = vi.fn();
        },
        Container: class {
            addChild = vi.fn();
        },
        Text: class {
            position = { set: vi.fn() };
        }
    };
});

describe('VisualMergeResolver', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        act(() => {
            useStore.setState({ isMerging: false, mergeConflicts: [] });
        });
    });

    it('should return null if not merging', () => {
        act(() => {
            useStore.setState({ isMerging: false });
        });
        const { container } = render(<VisualMergeResolver />);
        expect(container.firstChild).toBeNull();
    });

    it('should render OURS and THEIRS sections', async () => {
        act(() => {
            useStore.setState({ isMerging: true });
        });
        render(<VisualMergeResolver />);
        
        expect(screen.getByText('OURS (Current)')).toBeInTheDocument();
        expect(screen.getByText('THEIRS (Incoming)')).toBeInTheDocument();
        expect(screen.getByText('Visual Merge Conflict Resolution')).toBeInTheDocument();
    });

    it('should handle Accept Ours', async () => {
        let isMerging = true;
        let mergeConflicts: unknown[] = [{ id: 'conflict', type: 'node' }];
        act(() => {
            useStore.setState({
                isMerging: true,
                setIsMerging: (val) => { isMerging = val; },
                setMergeConflicts: (val: unknown[]) => { mergeConflicts = val; }
            });
        });
        
        render(<VisualMergeResolver />);
        
        act(() => {
            fireEvent.click(screen.getByText('Accept Ours'));
        });
        
        expect(isMerging).toBe(false);
        expect(mergeConflicts).toEqual([]);
    });

    it('should handle Accept Theirs', async () => {
        let isMerging = true;
        let mergeConflicts: unknown[] = [{ id: 'conflict', type: 'node' }];
        act(() => {
            useStore.setState({
                isMerging: true,
                setIsMerging: (val) => { isMerging = val; },
                setMergeConflicts: (val: unknown[]) => { mergeConflicts = val; }
            });
        });
        
        render(<VisualMergeResolver />);
        
        act(() => {
            fireEvent.click(screen.getByText('Accept Theirs'));
        });
        
        expect(isMerging).toBe(false);
        expect(mergeConflicts).toEqual([]);
    });

    it('should handle Auto-Combine', async () => {
        let isMerging = true;
        let mergeConflicts: unknown[] = [{ id: 'conflict', type: 'node' }];
        act(() => {
            useStore.setState({
                isMerging: true,
                setIsMerging: (val) => { isMerging = val; },
                setMergeConflicts: (val: unknown[]) => { mergeConflicts = val; }
            });
        });
        
        render(<VisualMergeResolver />);
        
        act(() => {
            fireEvent.click(screen.getByText('Auto-Combine'));
        });
        
        expect(isMerging).toBe(false);
        expect(mergeConflicts).toEqual([]);
    });
});
