import React from 'react';
import { useStore } from '../store';

export const TabBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTabId, addTab, closeTab } = useStore();

  return (
    <div className="h-9 bg-[#f2ece4] border-b border-[#d8d0c8] flex items-center px-2 gap-1 overflow-x-auto z-40 select-none">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group flex items-center gap-2 px-3 py-1 text-xs rounded-t-md cursor-pointer transition-all border-t border-x ${
              isActive
                ? 'bg-[#faf5ee] border-[#c2652a]/30 text-[#c2652a] font-semibold shadow-sm'
                : 'bg-transparent border-transparent text-[#605850] hover:bg-[#faf5ee]/60'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#c2652a]">article</span>
            <span className="font-mono text-[11px] truncate max-w-[140px]">{tab.title}</span>
            {tab.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-[#c2652a]" title="Unsaved changes" />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="p-0.5 hover:bg-[#c2652a]/10 rounded text-[#9a9088] hover:text-[#c2652a] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-[12px]">close</span>
            </button>
          </div>
        );
      })}

      <button
        onClick={() => addTab()}
        className="p-1 hover:bg-[#c2652a]/10 text-[#605850] hover:text-[#c2652a] rounded transition-colors"
        title="New Architecture Document"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
      </button>
    </div>
  );
};
