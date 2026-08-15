import React from 'react';
import { useStore } from '../store';

export const BreadcrumbBar: React.FC = () => {
  const { activeDrillPath, drillTo, drillUp } = useStore();

  return (
    <div className="absolute top-14 left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 hud-glass rounded-lg shadow-sm border border-[#c2652a]/20 text-xs text-[#3a302a]">
      <button 
        onClick={drillUp}
        disabled={activeDrillPath.length <= 1}
        className="p-1 hover:bg-[#c2652a]/10 rounded disabled:opacity-30 text-[#c2652a] font-bold transition-colors"
        title="Navigate Up (Esc)"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
      </button>

      <span className="text-[#9a9088] font-mono">/</span>

      {activeDrillPath.map((item, index) => {
        const isLast = index === activeDrillPath.length - 1;
        return (
          <React.Fragment key={item.id}>
            <button
              onClick={() => drillTo(index)}
              className={`px-2 py-0.5 rounded font-serif text-[13px] transition-colors ${
                isLast
                  ? 'font-bold text-[#c2652a] bg-[#c2652a]/10'
                  : 'text-[#605850] hover:bg-[#c2652a]/5 hover:text-[#3a302a]'
              }`}
            >
              {item.name}
            </button>
            {!isLast && <span className="text-[#9a9088] text-[10px]">&gt;</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
};
