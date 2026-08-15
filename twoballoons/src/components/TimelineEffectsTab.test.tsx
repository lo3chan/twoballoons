
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimelineEffectsTab } from './TimelineEffectsTab';

describe('TimelineEffectsTab', () => {
    it('renders effect toggles', () => {
        render(<TimelineEffectsTab />);
        const flowToggle = screen.getByText(/Animated Flows/i);
        expect(flowToggle).toBeInTheDocument();
    });
});
