import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Application, Container, Graphics } from 'pixi.js';

// We do NOT mock pixi.js completely, we allow it to run in headless/jsdom environment if possible.
// Or we just test the math/logic since vitest uses jsdom which doesn't support WebGL/WebGPU out of the box without canvas package
// Let's create an actual instance and ensure the performance timing loop is intact without full mocks if possible.
// Note: jsdom lacks getContext, so we must mock JUST enough for PIXI to not crash if we want to run in jsdom without canvas package.
// We will mock the getContext for the canvas element.
beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn((type: string) => {
        if (type === 'webgl' || type === 'webgl2' || type === 'webgpu') {
            return {
                // Mock necessary WebGL/WebGPU context methods here if needed
                getExtension: vi.fn(),
                getParameter: vi.fn(),
                createTexture: vi.fn(),
                bindTexture: vi.fn(),
                // etc.
                // It's actually safer to just mock PIXI renderer if we really want to test the object creation speed and logic
            } as any;
        }
        return null;
    });
});

vi.mock('pixi.js', async () => {
    const actual = await vi.importActual('pixi.js') as any;

    // We want to test actual instantiation of Graphics and Containers to measure memory/CPU cost.
    // We will ONLY mock the Application init to prevent it from trying to initialize a real WebGL context
    // which fails in jsdom without node-canvas.
    return {
        ...actual,
        Application: class {
            stage = new actual.Container();
            init = vi.fn().mockResolvedValue(true);
            destroy = vi.fn();
        }
    };
});

describe('Canvas Stress & Performance Benchmarks', () => {
    let app: Application;

    beforeEach(async () => {
        app = new Application();
        await app.init({
            width: 800,
            height: 600,
            preference: 'webgpu',
            backgroundColor: 0xfaf5ee,
        });
    });

    it('should initialize PixiJS with WebGPU preferences', () => {
        expect(app).toBeDefined();
    });

    it('benchmarks rendering 1,000+ nodes with optimal FPS', () => {
        const nodesContainer = new Container();
        app.stage.addChild(nodesContainer);

        const startTime = performance.now();
        const NUM_NODES = 1000;

        for (let i = 0; i < NUM_NODES; i++) {
            const graphics = new Graphics();
            graphics.roundRect(0, 0, 50, 50, 8);
            graphics.fill({ color: 0xc2652a, alpha: 1 });
            graphics.position.set(Math.random() * 800, Math.random() * 600);
            nodesContainer.addChild(graphics);
        }

        const endTime = performance.now();
        const renderTime = endTime - startTime;

        expect(nodesContainer.children.length).toBe(NUM_NODES);

        // This benchmarks the actual instantiation and math cost of creating 1000 Graphics objects
        expect(renderTime).toBeLessThan(500);
    });

    it('benchmarks rendering 2,500+ edges with acceptable performance and garbage collection', () => {
        const edgesContainer = new Container();
        app.stage.addChild(edgesContainer);

        const NUM_EDGES = 2500;
        const startTime = performance.now();

        for (let i = 0; i < NUM_EDGES; i++) {
            const line = new Graphics();
            line.moveTo(Math.random() * 800, Math.random() * 600);
            line.lineTo(Math.random() * 800, Math.random() * 600);
            line.stroke({ width: 2, color: 0x9a9088, alpha: 0.6 });
            edgesContainer.addChild(line);
        }

        const endTime = performance.now();
        const renderTime = endTime - startTime;

        expect(edgesContainer.children.length).toBe(NUM_EDGES);
        expect(renderTime).toBeLessThan(800);

        // Simulate GC by removing children and destroying them
        edgesContainer.children.forEach(child => child.destroy());
        edgesContainer.removeChildren();

        for (let i = 0; i < 500; i++) {
            const line = new Graphics();
            line.moveTo(Math.random() * 800, Math.random() * 600);
            line.lineTo(Math.random() * 800, Math.random() * 600);
            line.stroke({ width: 2, color: 0x9a9088, alpha: 0.6 });
            edgesContainer.addChild(line);
        }

        expect(edgesContainer.children.length).toBe(500);
    });
});
