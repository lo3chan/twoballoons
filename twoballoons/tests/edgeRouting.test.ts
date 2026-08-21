import { describe, it, expect } from 'vitest';

describe('Edge Routing Logic', () => {

    // We mock the coordinate generation logic that was embedded in Canvas.tsx
    // to test the deterministic output of the routing algorithm.
    const computeEdgePath = (style: 'straight' | 'bezier' | 'orthogonal', fromPos: {x: number, y: number}, toPos: {x: number, y: number}, offsetDist: number = 55) => {
        let pathEndX = toPos.x;
        let pathEndY = toPos.y;
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);

        let pathData = `M ${fromPos.x},${fromPos.y}`;

        if (style === 'straight') {
           pathData += ` L ${toPos.x},${toPos.y}`;
           pathEndX = toPos.x - Math.cos(angle) * offsetDist;
           pathEndY = toPos.y - Math.sin(angle) * offsetDist;
        } else if (style === 'bezier') {
           const midX = (fromPos.x + toPos.x) / 2;
           pathData += ` C ${midX},${fromPos.y} ${midX},${toPos.y} ${toPos.x},${toPos.y}`;
           pathEndX = toPos.x - Math.cos(angle) * offsetDist;
           pathEndY = toPos.y - Math.sin(angle) * offsetDist;
        } else if (style === 'orthogonal') {
           const midX = (fromPos.x + toPos.x) / 2;
           pathData += ` L ${midX},${fromPos.y} L ${midX},${toPos.y} L ${toPos.x},${toPos.y}`;
           const orthoAngle = toPos.x > fromPos.x ? 0 : Math.PI;
           pathEndX = toPos.x - Math.cos(orthoAngle) * offsetDist;
           pathEndY = toPos.y - Math.sin(orthoAngle) * offsetDist;
        }

        return { pathData, pathEndX, pathEndY };
    };

    it('should compute straight edge correctly', () => {
        const result = computeEdgePath('straight', {x: 0, y: 0}, {x: 100, y: 0}, 10);
        expect(result.pathData).toBe('M 0,0 L 100,0');
        expect(result.pathEndX).toBeCloseTo(90);
        expect(result.pathEndY).toBeCloseTo(0);
    });

    it('should compute bezier edge correctly', () => {
        const result = computeEdgePath('bezier', {x: 0, y: 0}, {x: 100, y: 100}, 10);
        expect(result.pathData).toBe('M 0,0 C 50,0 50,100 100,100');
        // Angle is Math.PI / 4
        expect(result.pathEndX).toBeCloseTo(100 - Math.cos(Math.PI/4)*10);
        expect(result.pathEndY).toBeCloseTo(100 - Math.sin(Math.PI/4)*10);
    });

    it('should compute orthogonal edge correctly pointing right', () => {
        const result = computeEdgePath('orthogonal', {x: 0, y: 0}, {x: 100, y: 50}, 10);
        expect(result.pathData).toBe('M 0,0 L 50,0 L 50,50 L 100,50');
        expect(result.pathEndX).toBeCloseTo(90); // 100 - 10 * cos(0)
        expect(result.pathEndY).toBeCloseTo(50);
    });

    it('should compute orthogonal edge correctly pointing left', () => {
        const result = computeEdgePath('orthogonal', {x: 100, y: 0}, {x: 0, y: 50}, 10);
        expect(result.pathData).toBe('M 100,0 L 50,0 L 50,50 L 0,50');
        expect(result.pathEndX).toBeCloseTo(10); // 0 - 10 * cos(PI) = 0 - 10 * -1 = 10
        expect(result.pathEndY).toBeCloseTo(50);
    });
});
