import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TimelineHUD } from './TimelineHUD';
import { useStore } from '../store';
import { Snapshot } from '../history/zfsVersioning';

describe('TimelineHUD', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the timeline scrubber and handles interactions', () => {
        let scrubbedId = '';
        let contextMenuArgs: any[] = [];
        
        useStore.setState({
            openContextMenu: (x, y, type, id) => {
                contextMenuArgs = [x, y, type, id];
            }
        });
        
        const snapshots: Snapshot[] = [
            { id: 'snap1', state: { nodes: [], edges: [], timestamp: 1000 }, timestamp: 1000, milestone: 'Init' },
            { id: 'snap2', state: { nodes: [], edges: [], timestamp: 2000 }, timestamp: 2000, milestone: 'Added Node' }
        ];

        render(<TimelineHUD snapshots={snapshots} onScrub={(id) => { scrubbedId = id; }} />);
        
        const heading = screen.getByText(/Timeline Engine/i);
        expect(heading).toBeInTheDocument();
        
        const markers = screen.getAllByTitle(/Init|Added Node/);
        expect(markers.length).toBe(2);

        act(() => {
            fireEvent.click(markers[1]);
        });
        expect(scrubbedId).toBe('snap2');

        act(() => {
            fireEvent.contextMenu(markers[0], { clientX: 100, clientY: 200 });
        });
        expect(contextMenuArgs).toEqual([100, 200, "timeline", "snap1"]);
    });
});
