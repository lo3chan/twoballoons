import React from 'react';
import { useStore } from '../store';

export const LeftToolbar: React.FC = () => {
  const { 
    activeTool, 
    setActiveTool, 
    isCodeDrawerOpen, 
    setIsCodeDrawerOpen,
    nodes,
    setNodes
  } = useStore();

  const handleAutoOrganize = () => {
    // Quick circular/force arrange
    const updated = nodes.map((node, i) => {
      const angle = (i / Math.max(1, nodes.length)) * Math.PI * 2;
      const radius = 180;
      return {
        ...node,
        x: 480 + radius * Math.cos(angle),
        y: 320 + radius * Math.sin(angle)
      };
    });
    setNodes(updated);
  };

  const tools = [
    { id: 'select', icon: 'near_me', label: 'Select / Move (V)' },
    { id: 'node', icon: 'add_circle', label: 'Add Node (N)' },
    { id: 'edge', icon: 'timeline', label: 'Connect Nodes (C)' },
    { id: 'kripke', icon: 'public', label: 'Modal World (W)' },
    { id: 'pan', icon: 'pan_tool', label: 'Pan Canvas (Space)' },
    { id: 'erase', icon: 'ink_eraser', label: 'Eraser (E)' },
  ];

  return (
    <aside className="absolute top-24 left-4 z-40 flex flex-col gap-1.5 p-1.5 hud-glass rounded-xl shadow-lg border border-[#c2652a]/20">
      {tools.map((t) => {
        const isActive = activeTool === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id as any)}
            title={t.label}
            className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
              isActive
                ? 'bg-[#c2652a] text-white shadow-md'
                : 'text-[#605850] hover:bg-[#c2652a]/10 hover:text-[#c2652a]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
          </button>
        );
      })}

      <div className="h-px bg-[#d8d0c8] my-1" />

      {/* Force Auto Organize */}
      <button
        onClick={handleAutoOrganize}
        title="Auto-Organize Layout (F)"
        className="p-2.5 rounded-lg text-[#605850] hover:bg-[#c2652a]/10 hover:text-[#c2652a] flex items-center justify-center transition-all"
      >
        <span className="material-symbols-outlined text-[20px]">hub</span>
      </button>

      {/* Toggle Balloon Code Drawer */}
      <button
        onClick={() => setIsCodeDrawerOpen(!isCodeDrawerOpen)}
        title="Toggle BalloonDSL Drawer (D)"
        className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
          isCodeDrawerOpen
            ? 'bg-[#c2652a] text-white'
            : 'text-[#605850] hover:bg-[#c2652a]/10 hover:text-[#c2652a]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">code_blocks</span>
      </button>
    </aside>
  );
};
