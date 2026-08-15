import { NodeItem } from '../store';

export class VectorIndex {
  private documents: { id: string, text: string, tokens: string[], tfidf: Record<string, number>, node: NodeItem }[] = [];
  private allDocsTokens: string[][] = [];

  constructor() {}

  private tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 0);
  }

  private getTfIdf(tokens: string[], allDocsTokens: string[][]): Record<string, number> {
    const tf: Record<string, number> = {};
    tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });

    const tfidf: Record<string, number> = {};
    const N = allDocsTokens.length;

    for (const term in tf) {
      const df = allDocsTokens.filter(d => d.includes(term)).length;
      const idf = Math.log((N + 1) / (df + 1)) + 1;
      tfidf[term] = tf[term] * idf;
    }

    return tfidf;
  }

  public indexNodes(nodes: NodeItem[]) {
    this.documents = [];
    this.allDocsTokens = nodes.map(n => this.tokenize(`${n.name} ${n.label || ''} ${n.description || ''}`));

    nodes.forEach((node, i) => {
        const tokens = this.allDocsTokens[i];
        const tfidf = this.getTfIdf(tokens, this.allDocsTokens);

        this.documents.push({
            id: node.id,
            text: `${node.name} ${node.label || ''} ${node.description || ''}`,
            tokens,
            tfidf,
            node
        });
    });
  }

  public search(query: string, topK: number = 5): NodeItem[] {
    if (this.documents.length === 0) return [];

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    // Compute query tfidf against the corpus
    const queryTfidf = this.getTfIdf(queryTokens, this.allDocsTokens);

    const results = this.documents.map(doc => {
      const allUnique = Array.from(new Set([...queryTokens, ...doc.tokens]));

      let dot = 0;
      let nA = 0;
      let nB = 0;

      for (const term of allUnique) {
          const qVal = queryTfidf[term] || 0;
          const dVal = doc.tfidf[term] || 0;

          dot += qVal * dVal;
          nA += qVal * qVal;
          nB += dVal * dVal;
      }

      const score = (nA === 0 || nB === 0) ? 0 : dot / (Math.sqrt(nA) * Math.sqrt(nB));

      return { node: doc.node, score };
    });

    results.sort((a, b) => b.score - a.score);
    return results.filter(r => r.score > 0).slice(0, topK).map(r => r.node);
  }
}
