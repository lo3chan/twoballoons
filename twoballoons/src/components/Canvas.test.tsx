import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Canvas } from './Canvas';
import { useStore } from '../store';

vi.mock('../store', () => ({
    useStore: vi.fn(),
}));

vi.mock('./TimelineHUD', () => ({
  TimelineHUD: () => <div data-testid="timeline-hud" />
}));

vi.mock('./TimelineEffectsTab', () => ({
  TimelineEffectsTab: () => <div data-testid="timeline-effects-tab" />
}));

// Mock PixiJS Application
vi.mock('pixi.js', () => {
    return {
        Application: class {
            init = vi.fn().mockResolvedValue(true);
            stage = {
                addChild: vi.fn(),
                on: vi.fn(),
                scale: { set: vi.fn() },
                position: { set: vi.fn() },
            };
            destroy = vi.fn();
        },
        Graphics: class {
            circle = vi.fn();
            roundRect = vi.fn();
            fill = vi.fn();
            stroke = vi.fn();
            clear = vi.fn();
            rect = vi.fn();
        },
        Rectangle: class {
            constructor() {}
            contains = vi.fn().mockReturnValue(false);
        },
        Container: class {
            addChild = vi.fn();
            removeChildren = vi.fn();
            position = { set: vi.fn() };
            on = vi.fn();
        },
        Text: class {
            position = { set: vi.fn() };
            width = 50;
            height = 20;
        },
    };
});

describe('Canvas', () => {
    it('renders standard nodes correctly', () => {
        (useStore as any).mockReturnValue({
            nodes: [
                { id: '1', kind: 'actor', label: 'User' },
                { id: '2', kind: 'component', label: 'Service' }
            ]
        });

        const { container } = render(<Canvas />);
        // Ensure a canvas element is rendered
        expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('renders kripke world nodes correctly', () => {
        (useStore as any).mockReturnValue({
            nodes: [
                { id: 'w1', kind: 'state', label: 'World 1', evaluated: true },
                { id: 'w2', kind: 'nominal', label: 'World 2', evaluated: false }
            ]
        });

        const { container } = render(<Canvas />);
        expect(container.querySelector('canvas')).toBeInTheDocument();
    });
});
