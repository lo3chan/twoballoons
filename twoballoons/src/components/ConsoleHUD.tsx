import { useState, useEffect } from "react";
import { useStore } from "../store";
import { FloatingWindow } from "./FloatingWindow";
import { Snapshot } from "../history/zfsVersioning";

export function ConsoleHUD() {
  const { reasoningLogs, zfsHistory, isConsoleOpen, setIsConsoleOpen } = useStore();
  const [activeTab, setActiveTab] = useState<"console" | "history">("console");
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isConsoleOpen) return null;

  return (
    <FloatingWindow
      title="System Terminal"
      icon="terminal"
      onClose={() => setIsConsoleOpen(false)}
      initialPosition={{ x: 20, y: windowSize.height - 240 }}
      initialWidth={480}
      initialHeight={220}
    >
      <div className="flex flex-col h-full font-mono text-xs">
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
            zfsHistory.map((snap: Snapshot, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-[#d8d0c8]/40 text-[#3a302a]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-[#c2652a]">history</span>
                  <span className="font-semibold">{snap.milestone || `Snapshot #${idx + 1}`}</span>
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
    </FloatingWindow>
  );
}
