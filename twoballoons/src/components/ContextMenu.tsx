import { useStore } from "../store";

export function ContextMenu() {
  const { contextMenu, closeContextMenu, generateGhostDiff } = useStore();

  if (!contextMenu.isOpen) return null;

  const handleAction = (action: string) => {
    generateGhostDiff(action, contextMenu.targetId ? [contextMenu.targetId] : []);
    closeContextMenu();
  };

  let actions: string[] = [];
  if (contextMenu.contextType === "node") {
    actions = [
      "Refactor with Antigravity",
      "Add Modal Constraints",
      "Explain Dependencies"
    ];
  } else if (contextMenu.contextType === "canvas") {
    actions = [
      "Generate Subsystem Architecture",
      "Auto-Layout & Optimize"
    ];
  } else if (contextMenu.contextType === "timeline") {
    actions = [
      "Interpolate Keyframes with AI"
    ];
  }

  return (
    <div
      className="absolute z-[100] w-56 bg-[#faf5ee] border border-[#d8d0c8]/60 shadow-xl rounded-lg py-1 pointer-events-auto"
      style={{
        left: contextMenu.x,
        top: contextMenu.y,
        fontFamily: "'EB Garamond', serif"
      }}
      onMouseLeave={closeContextMenu}
    >
      <div className="px-3 py-1 mb-1 border-b border-[#d8d0c8]/30">
        <span className="text-[10px] uppercase tracking-wider text-[#9a9088] font-sans font-bold">
          {contextMenu.contextType} actions
        </span>
      </div>
      {actions.map((action, idx) => (
        <button
          key={idx}
          className="w-full text-left px-4 py-2 text-[14px] text-[#3a302a] hover:bg-[#f6f0e8] hover:text-[#c2652a] transition-colors"
          onClick={() => handleAction(action)}
        >
          {action}
        </button>
      ))}
    </div>
  );
}
