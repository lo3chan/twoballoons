import { useState, useEffect, useMemo } from 'react';
import { useStore, NodeItem } from '../store';
import { VectorIndex } from '../search/vectorIndex';

export const SearchModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { nodes, setSelectedNodeIds } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NodeItem[]>([]);

  const index = useMemo(() => new VectorIndex(), []);

  useEffect(() => {
    index.indexNodes(nodes);
  }, [nodes, index]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const res = index.search(query, 5);
    setResults(res);
  }, [query, index]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="hud-glass w-[480px] max-h-[500px] rounded-xl shadow-2xl border border-[#c2652a]/30 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-[#d8d0c8] flex items-center gap-2 bg-[#f6f0e8]">
          <span className="material-symbols-outlined text-[#c2652a]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Vector semantic search across architecture..."
            className="flex-1 bg-transparent border-none outline-none font-sans text-xs text-[#3a302a]"
            autoFocus
          />
          <button onClick={onClose} className="p-1 hover:bg-[#c2652a]/10 rounded text-[#605850]">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 bg-[#faf5ee]">
          {results.map((node) => (
            <div
              key={node.id}
              onClick={() => {
                setSelectedNodeIds([node.id]);
                onClose();
              }}
              className="p-2.5 rounded-lg hover:bg-[#c2652a]/10 cursor-pointer flex items-center justify-between border border-transparent hover:border-[#c2652a]/20 transition-all"
            >
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xs text-[#3a302a]">{node.label || node.name || node.id}</span>
                <span className="font-mono text-[10px] text-[#605850]">Type: {node.type || 'generic'}</span>
              </div>
              <span className="text-[10px] font-mono text-[#c2652a] font-bold">Select</span>
            </div>
          ))}
          {query && results.length === 0 && (
            <div className="p-4 text-center text-xs text-[#9a9088]">No matching architecture nodes found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
