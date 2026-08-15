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

  if (!isMerging || mergeConflicts.length === 0) return null;

  const currentConflict = mergeConflicts[0];

  const handleAcceptOurs = () => {
    // Keep current local state, dismiss conflict
    setMergeConflicts(mergeConflicts.slice(1));
    if (mergeConflicts.length <= 1) setIsMerging(false);
  };

  const handleAcceptTheirs = () => {
    // Apply incoming change from incoming AST
    if (currentConflict.type === 'node') {
      const incomingNode = currentConflict.incomingNode;
      if (incomingNode) {
        const exists = nodes.some(n => n.id === incomingNode.id);
        if (!exists) addNode(incomingNode);
      }
    } else if (currentConflict.type === 'edge') {
      const incomingEdge = currentConflict.incomingEdge;
      if (incomingEdge) {
        const exists = edges.some(e => e.id === incomingEdge.id);
        if (!exists) addEdge(incomingEdge);
      }
    }
    setMergeConflicts(mergeConflicts.slice(1));
    if (mergeConflicts.length <= 1) setIsMerging(false);
  };

  const handleAcceptBoth = () => {
    // Ingest incoming alongside existing
    if (currentConflict.type === 'node' && currentConflict.incomingNode) {
      const renamedNode = {
        ...currentConflict.incomingNode,
        id: currentConflict.incomingNode.id + '_incoming',
        x: (currentConflict.incomingNode.x || 0) + 120,
        y: (currentConflict.incomingNode.y || 0) + 60
      };
      addNode(renamedNode);
    }
    setMergeConflicts(mergeConflicts.slice(1));
    if (mergeConflicts.length <= 1) setIsMerging(false);
  };

  return (
    <div className="fixed top-16 right-6 z-40 bg-[#faf5ee]/95 backdrop-blur border border-[#c2652a]/40 p-4 rounded-xl shadow-xl w-96 font-sans">
      <div className="flex items-center justify-between border-b border-[#d8d0c8] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c2652a] text-lg">call_split</span>
          <span className="font-serif font-bold text-sm text-[#3a302a]">3-Way Merge Conflict</span>
        </div>
        <span className="text-xs font-mono bg-[#c2652a]/10 text-[#c2652a] px-2 py-0.5 rounded font-semibold">
          {mergeConflicts.length} Pending
        </span>
      </div>

      <div className="text-xs text-[#605850] mb-3 space-y-1">
        <p className="font-medium text-[#3a302a]">Conflict Target: <span className="font-mono text-[#c2652a]">{currentConflict.targetId}</span></p>
        <p className="text-[11px]">{currentConflict.description || 'Simultaneous modifications detected in AST topology.'}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-2 bg-[#f2ece4] rounded-lg border border-[#d8d0c8] text-[11px] mb-4">
        <div>
          <span className="font-bold text-[#3a302a] block mb-0.5">Local (Ours)</span>
          <p className="text-[#605850] truncate font-mono">{currentConflict.localSummary || 'Current Version'}</p>
        </div>
        <div className="border-l border-[#d8d0c8] pl-2">
          <span className="font-bold text-[#c2652a] block mb-0.5">Incoming (Theirs)</span>
          <p className="text-[#605850] truncate font-mono">{currentConflict.incomingSummary || 'Remote Branch'}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleAcceptOurs}
          className="flex-1 py-1.5 text-xs bg-[#f2ece4] hover:bg-[#e6ded4] text-[#3a302a] font-medium rounded border border-[#d8d0c8] transition-colors"
        >
          Keep Ours
        </button>
        <button
          onClick={handleAcceptTheirs}
          className="flex-1 py-1.5 text-xs bg-[#c2652a] hover:bg-[#a85320] text-[#faf5ee] font-medium rounded shadow-sm transition-colors"
        >
          Accept Theirs
        </button>
        <button
          onClick={handleAcceptBoth}
          className="px-2.5 py-1.5 text-xs bg-[#3a302a] hover:bg-[#251e1a] text-[#faf5ee] font-medium rounded transition-colors"
          title="Keep both by creating branch clone"
        >
          Both
        </button>
      </div>
    </div>
  );
}
