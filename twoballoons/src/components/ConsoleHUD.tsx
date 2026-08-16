import { useState } from "react";
import { useStore } from "../store";

export function ConsoleHUD() {
  const { reasoningLogs, zfsHistory, isConsoleOpen, setIsConsoleOpen } = useStore();
  const [activeTab, setActiveTab] = useState<"console" | "history">("console");

  if (!isConsoleOpen) return null;

  return (
    <div className="hud-glass fixed bottom-6 left-6 w-[480px] h-[220px] rounded-lg shadow-xl flex flex-col z-40 overflow-hidden font-mono text-xs animate-slide-in-up">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-8 bg-[#f2ece4] border-b border-[#d8d0c8] select-none">
        <div className="flex items-center gap-1 h-full">
          <button 
            onClick={() => setActiveTab("console")}
            className={`px-3 py-1 text-[10px] font-bold h-full transition-colors cursor-pointer ${activeTab === "console" ? "text-[#c2652a] border-b-2 border-[#c2652a]" : "text-[#605850] hover:text-[#c2652a]"}`}
          >
            Terminal Output
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1 text-[10px] font-bold h-full transition-colors cursor-pointer flex items-center gap-1 ${activeTab === "history" ? "text-[#c2652a] border-b-2 border-[#c2652a]" : "text-[#605850] hover:text-[#c2652a]"}`}
          >
            <span>ZFS History</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => useStore.setState({ reasoningLogs: [] })}
            className="text-[10px] text-[#605850] hover:text-[#c2652a] cursor-pointer"
            title="Clear Output"
          >
            Clear
          </button>
          <button 
            onClick={() => setIsConsoleOpen(false)}
            className="text-[#605850] hover:text-[#3a302a] text-sm leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-3 overflow-y-auto bg-[#faf5ee]/90 flex flex-col gap-1 select-text">
        {activeTab === "console" ? (
          reasoningLogs && reasoningLogs.length > 0 ? (
            reasoningLogs.map((log: string, idx: number) => (
              <div key={idx} className="leading-relaxed flex gap-2 text-[#3a302a]">
                <span className="text-[#c2652a] select-none">›</span>
                <span className="break-all whitespace-pre-wrap">{log}</span>
              </div>
            ))
          ) : (
            <div className="text-[#605850] italic">No console logs recorded. System idle.</div>
          )
        ) : (
          zfsHistory && zfsHistory.length > 0 ? (
            zfsHistory.map((snap: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-[#d8d0c8]/40 text-[#3a302a]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-[#c2652a]">history</span>
                  <span className="font-semibold">{snap.name || `Snapshot #${idx + 1}`}</span>
                </div>
                <span className="text-[10px] text-[#605850]">{snap.timestamp ? new Date(snap.timestamp).toLocaleTimeString() : 'Recent'}</span>
              </div>
            ))
          ) : (
            <div className="text-[#605850] italic">No ZFS snapshots recorded yet. Working tree clean.</div>
          )
        )}
      </div>
    </div>
  );
}
