import React from 'react';
import { useStore } from '../store';

export const BalloonCodeDrawer: React.FC = () => {
  const { isCodeDrawerOpen, setIsCodeDrawerOpen, balloonCode, syncCodeToCanvas } = useStore();

  if (!isCodeDrawerOpen) return null;

  return (
    <div className="absolute top-24 right-4 bottom-12 w-[380px] hud-glass rounded-xl shadow-2xl flex flex-col border border-[#c2652a]/30 z-50 animate-slide-in-right overflow-hidden">
      <div className="h-10 bg-[#f6f0e8] border-b border-[#d8d0c8] px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c2652a] text-[18px]">terminal</span>
          <span className="font-serif font-bold text-xs text-[#c2652a]">BalloonDSL Code Drawer</span>
        </div>
        <button
          onClick={() => setIsCodeDrawerOpen(false)}
          className="p-1 hover:bg-[#c2652a]/10 rounded text-[#605850]"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-2 bg-[#faf5ee]">
        <div className="flex items-center justify-between text-[11px] text-[#605850]">
          <span>Live 2-Way Synchronized Buffer</span>
          <button
            onClick={() => navigator.clipboard.writeText(balloonCode)}
            className="px-2 py-0.5 text-[10px] bg-[#c2652a]/10 text-[#c2652a] hover:bg-[#c2652a]/20 rounded font-bold"
          >
            Copy
          </button>
        </div>

        <textarea
          value={balloonCode}
          onChange={(e) => syncCodeToCanvas(e.target.value)}
          className="w-full flex-1 bg-[#faf5ee] border border-[#d8d0c8] rounded p-3 font-mono text-xs text-[#3a302a] outline-none resize-none focus:border-[#c2652a]/60 leading-relaxed shadow-inner"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
