import { useStore } from "../store";

export function AntigravityWindow() {
  const { selectedNodeIds, activeTabId, activeDrillPath, generateGhostDiff, applyDiff, rejectDiff, diffOperations } = useStore();

  if (selectedNodeIds.length < 2 && diffOperations.length === 0) return null;

  const handleAction = (action: string) => {
    generateGhostDiff(action, selectedNodeIds);
  };

  return (
    <div className="absolute top-24 right-4 w-80 hud-glass rounded-xl shadow-2xl p-4 z-50 animate-slide-in-right flex flex-col gap-3 font-sans text-[#3a302a]">
      <div className="flex items-center justify-between border-b border-[#c2652a]/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c2652a] animate-pulse" />
          <h3 className="font-bold uppercase tracking-widest text-[11px] text-[#c2652a]">
            Antigravity AI
          </h3>
        </div>
        <span className="text-[10px] text-[#9a9088] bg-[#f6f0e8] px-2 py-0.5 rounded-full border border-[#d8d0c8]/50">
          Context Aware
        </span>
      </div>

      <div className="text-[12px] text-[#605850] space-y-1">
        <div><strong className="text-[#3a302a]">Active Tab:</strong> {activeTabId}</div>
        <div><strong className="text-[#3a302a]">Depth:</strong> {activeDrillPath.length - 1}</div>
        <div><strong className="text-[#3a302a]">Selected:</strong> {selectedNodeIds.length} nodes</div>
      </div>

      {diffOperations.length > 0 ? (
        <div className="bg-[#f6f0e8] rounded-lg p-3 border border-[#d8d0c8]/60 flex flex-col gap-2">
          <p className="text-[13px] font-bold">Ghost Diff Proposed</p>
          <p className="text-[12px] text-[#605850]">{diffOperations.length} operations generated.</p>
          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 bg-[#c2652a] text-[#faf5ee] rounded py-1 text-[12px] font-bold hover:bg-[#a55220] transition-colors"
              onClick={applyDiff}
            >
              Merge
            </button>
            <button
              className="flex-1 bg-transparent border border-[#9a9088] text-[#605850] rounded py-1 text-[12px] font-bold hover:bg-[#e0d8d0] transition-colors"
              onClick={rejectDiff}
            >
              Reject
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-[12px] text-[#9a9088] uppercase tracking-wider font-bold mb-1">Suggested Operations</p>
          {[
            "Refactor to Event-Driven",
            "Synthesize Modal Contracts",
            "Generate Error Boundaries"
          ].map((action, idx) => (
            <button
              key={idx}
              className="w-full text-left px-3 py-2 text-[13px] rounded-lg border border-[#d8d0c8]/50 bg-[#faf5ee] hover:bg-[#f6f0e8] hover:border-[#c2652a]/40 transition-all shadow-sm"
              style={{ fontFamily: "'EB Garamond', serif" }}
              onClick={() => handleAction(action)}
            >
              ✨ {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
