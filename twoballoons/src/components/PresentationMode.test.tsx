import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PresentationMode } from './PresentationMode';
import { useStore } from '../store';

describe('PresentationMode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return null if not presenting', () => {
        useStore.setState({ isPresenting: false });
        const { container } = render(<PresentationMode />);
        expect(container.firstChild).toBeNull();
    });

    it('should handle prev and next slide buttons', () => {
        let activeIndex = 0;
        useStore.setState({
            isPresenting: true,
            presentationKeyframes: [
                { id: 'kf1', x: 0, y: 0, zoom: 1, title: 'Slide 1' },
                { id: 'kf2', x: 0, y: 0, zoom: 1, title: 'Slide 2' }
            ],
            activeKeyframeIndex: 0,
            setActiveKeyframeIndex: (i) => { activeIndex = i; }
        });
        
        const { rerender } = render(<PresentationMode />);
        
        act(() => {
            fireEvent.click(screen.getByTitle('Next Slide'));
        });
        expect(activeIndex).toBe(1);

        act(() => {
            useStore.setState({ activeKeyframeIndex: 1 });
        });
        rerender(<PresentationMode />);
        
        act(() => {
            fireEvent.click(screen.getByTitle('Previous Slide'));
        });
        expect(activeIndex).toBe(0);
    });

    it('should handle add keyframe button', () => {
        let keyframesCount = 0;
        useStore.setState({
            isPresenting: true,
            presentationKeyframes: [],
            setPresentationKeyframes: (kfs) => { keyframesCount = kfs.length; }
        });
        
        render(<PresentationMode />);
        act(() => {
            fireEvent.click(screen.getByTitle('Add Keyframe'));
        });
        
        expect(keyframesCount).toBe(1);
    });
});
