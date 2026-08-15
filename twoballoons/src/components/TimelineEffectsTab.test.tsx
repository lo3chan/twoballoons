import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimelineEffectsTab } from './TimelineEffectsTab';

describe('TimelineEffectsTab', () => {
    it('renders effect toggles and allows interaction', () => {
        render(<TimelineEffectsTab />);
        
        const animatedFlowsLabel = screen.getByText(/Animated Flows/i);
        const temporalRevealsLabel = screen.getByText(/Temporal Reveals/i);
        const modalTransitionsLabel = screen.getByText(/Modal Transitions/i);

        expect(animatedFlowsLabel).toBeInTheDocument();
        expect(temporalRevealsLabel).toBeInTheDocument();
        expect(modalTransitionsLabel).toBeInTheDocument();
        
        const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
        expect(checkboxes.length).toBe(3);
        
        expect(checkboxes[0].checked).toBe(false);
        act(() => {
            fireEvent.click(checkboxes[0]);
        });
        expect(checkboxes[0].checked).toBe(true);

        expect(checkboxes[1].checked).toBe(false);
        act(() => {
            fireEvent.click(checkboxes[1]);
        });
        expect(checkboxes[1].checked).toBe(true);

        expect(checkboxes[2].checked).toBe(false);
        act(() => {
            fireEvent.click(checkboxes[2]);
        });
        expect(checkboxes[2].checked).toBe(true);
    });
});
