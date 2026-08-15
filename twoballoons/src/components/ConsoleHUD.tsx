import { useStore } from "../store";

export function ConsoleHUD() {
  const { reasoningLogs } = useStore();

  return (
    <div className="absolute bottom-10 left-20 right-[360px] hud-glass rounded-lg h-36 z-40 flex flex-col overflow-hidden shadow-sm pointer-events-auto animate-fade-in-up">
      <div className="flex h-8 bg-[#f6f0e8] border-b border-[#d8d0c8] px-2 items-center gap-1">
        <button className="px-3 py-1 text-[10px] font-bold text-[#c2652a] border-b-2 border-[#c2652a] h-full flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">terminal</span> Console
        </button>
        <button className="px-3 py-1 text-[10px] font-medium text-[#605850] hover:text-[#c2652a] h-full flex items-center gap-1.5 transition-colors">
          <span className="material-symbols-outlined text-[14px]">psychology</span> Reasoning Stream
        </button>
        <div className="flex-1"></div>
        <span className="text-[10px] text-[#9a9088] font-mono mr-2">Port 8080 (MCP SSE Online)</span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed text-[#3a302a] bg-[#faf5ee]">
        {reasoningLogs.map((log, index) => (
          <div key={index} className={log.startsWith(">") ? "text-[#c2652a] font-semibold mt-1" : "text-[#605850]"}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
