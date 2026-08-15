
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimelineHUD } from './TimelineHUD';

describe('TimelineHUD', () => {
    it('renders the timeline scrubber', () => {
        render(<TimelineHUD snapshots={[]} />);
        const heading = screen.getByText(/Timeline Engine/i);
        expect(heading).toBeInTheDocument();
    });
});
