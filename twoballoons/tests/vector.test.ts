import { describe, it, expect } from 'vitest';
import { VectorIndex } from '../src/search/vectorIndex';
import { NodeItem } from '../src/store';

describe('Vector Search Index', () => {
  it('should rank results using TF-IDF/Cosine Similarity', () => {
    const index = new VectorIndex();

    const nodes: NodeItem[] = [
      { id: '1', name: 'Web Application', label: 'Frontend', description: 'React SPA', kind: 'Container', x: 0, y: 0 },
      { id: '2', name: 'Database', label: 'Backend', description: 'PostgreSQL instance storing user data', kind: 'Container', x: 0, y: 0 },
      { id: '3', name: 'API Gateway', label: 'Backend', description: 'Routes incoming traffic', kind: 'Container', x: 0, y: 0 },
    ];

    index.indexNodes(nodes);

    const results = index.search('database');

    // The database node should be at the top
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('2');

    const results2 = index.search('react');
    expect(results2[0].id).toBe('1');
  });

  it('should return empty if no match', () => {
    const index = new VectorIndex();
    const nodes: NodeItem[] = [
      { id: '1', name: 'Web Application', label: 'Frontend', description: 'React SPA', kind: 'Container', x: 0, y: 0 },
    ];

    index.indexNodes(nodes);
    const results = index.search('kubernetes');

    expect(results.length).toBe(0);
  });
});
