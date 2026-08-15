import { useStore } from '../store';

export function VisualMergeResolver() {
  const {
    isMerging,
    setIsMerging,
    mergeConflicts,
    setMergeConflicts,
    nodes,
    edges,
    addNode,
    addEdge
  } = useStore();

  if (!isMerging) return null;

  const currentConflict = (mergeConflicts && mergeConflicts.length > 0) ? mergeConflicts[0] : null;

  const handleAcceptOurs = () => {
    if (setMergeConflicts) setMergeConflicts([]);
    if (setIsMerging) setIsMerging(false);
  };

  const handleAcceptTheirs = () => {
    if (currentConflict && typeof currentConflict === 'object') {
      if (currentConflict.type === 'node' && currentConflict.incomingNode) {
        const exists = nodes.some(n => n.id === currentConflict.incomingNode.id);
        if (!exists) addNode(currentConflict.incomingNode);
      } else if (currentConflict.type === 'edge' && currentConflict.incomingEdge) {
        const exists = edges.some(e => e.id === currentConflict.incomingEdge.id);
        if (!exists) addEdge(currentConflict.incomingEdge);
      }
    }
    if (setMergeConflicts) setMergeConflicts([]);
    if (setIsMerging) setIsMerging(false);
  };

  const handleAutoCombine = () => {
    if (currentConflict && typeof currentConflict === 'object' && currentConflict.type === 'node' && currentConflict.incomingNode) {
      const renamedNode = {
        ...currentConflict.incomingNode,
        id: currentConflict.incomingNode.id + '_incoming',
        x: (currentConflict.incomingNode.x || 0) + 120,
        y: (currentConflict.incomingNode.y || 0) + 60
      };
      addNode(renamedNode);
    }
    if (setMergeConflicts) setMergeConflicts([]);
    if (setIsMerging) setIsMerging(false);
  };

  return (
    <div className="fixed top-16 right-6 z-40 bg-[#faf5ee]/95 backdrop-blur border border-[#c2652a]/40 p-4 rounded-xl shadow-xl w-96 font-sans">
      <div className="flex items-center justify-between border-b border-[#d8d0c8] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c2652a] text-lg">call_split</span>
          <span className="font-serif font-bold text-sm text-[#3a302a]">Visual Merge Conflict Resolution</span>
        </div>
        <span className="text-xs font-mono bg-[#c2652a]/10 text-[#c2652a] px-2 py-0.5 rounded font-semibold">
          {mergeConflicts?.length || 0} Pending
        </span>
      </div>

      <div className="text-xs text-[#605850] mb-3 space-y-1">
        <p className="font-medium text-[#3a302a]">Conflict Target: <span className="font-mono text-[#c2652a]">{currentConflict?.targetId || 'Global AST Topology'}</span></p>
        <p className="text-[11px]">{currentConflict?.description || 'Simultaneous modifications detected in AST topology.'}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-2 bg-[#f2ece4] rounded-lg border border-[#d8d0c8] text-[11px] mb-4">
        <div>
          <span className="font-bold text-[#3a302a] block mb-0.5">OURS (Current)</span>
          <p className="text-[#605850] truncate font-mono">{currentConflict?.localSummary || 'Current Version'}</p>
        </div>
        <div className="border-l border-[#d8d0c8] pl-2">
          <span className="font-bold text-[#c2652a] block mb-0.5">THEIRS (Incoming)</span>
          <p className="text-[#605850] truncate font-mono">{currentConflict?.incomingSummary || 'Remote Branch'}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleAcceptOurs}
          className="flex-1 py-1.5 text-xs bg-[#f2ece4] hover:bg-[#e6ded4] text-[#3a302a] font-medium rounded border border-[#d8d0c8] transition-colors"
        >
          Accept Ours
        </button>
        <button
          onClick={handleAcceptTheirs}
          className="flex-1 py-1.5 text-xs bg-[#c2652a] hover:bg-[#a85320] text-[#faf5ee] font-medium rounded shadow-sm transition-colors"
        >
          Accept Theirs
        </button>
        <button
          onClick={handleAutoCombine}
          className="px-2.5 py-1.5 text-xs bg-[#3a302a] hover:bg-[#251e1a] text-[#faf5ee] font-medium rounded transition-colors"
          title="Auto-Combine both branches"
        >
          Auto-Combine
        </button>
      </div>
    </div>
  );
}
