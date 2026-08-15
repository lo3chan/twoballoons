import React, { useState } from "react";
import { useStore } from "../store";

export function LayerManager() {
  const { isLayerManagerOpen, setIsLayerManagerOpen, layers, activeLayerId, setActiveLayerId, toggleLayerVisibility, toggleLayerLock, addLayer } = useStore();
  const [newLayerName, setNewLayerName] = useState("");

  if (!isLayerManagerOpen) return null;

  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      addLayer({
        id: `layer-${Date.now()}`,
        name: newLayerName,
        visible: true,
        locked: false,
        depth: layers.length + 1
      });
      setNewLayerName("");
    }
  };

  return (
    <div className="absolute top-16 right-4 w-[280px] z-40 flex flex-col shadow-2xl rounded-lg overflow-hidden hud-glass animate-slide-in-right">
      <div className="h-10 bg-[#f6f0e8] border-b border-[#d8d0c8] flex items-center justify-between px-4">
        <h3 className="font-serif font-bold text-[#3a302a]">Layer Depth Planes</h3>
        <button className="text-sm text-[#605850] hover:text-[#c2652a]" onClick={() => setIsLayerManagerOpen(false)}>
          ✕
        </button>
      </div>

      <div className="p-3 bg-[#faf5ee] border-b border-[#d8d0c8] flex gap-2">
        <input
          className="flex-1 bg-transparent border border-[#d8d0c8] rounded px-2 py-1 text-sm outline-none focus:border-[#c2652a]"
          placeholder="New Layer Name..."
          value={newLayerName}
          onChange={(e) => setNewLayerName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddLayer()}
        />
        <button
          className="bg-[#c2652a] text-[#faf5ee] px-2 py-1 rounded text-sm hover:bg-[#e08850]"
          onClick={handleAddLayer}
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#faf5ee] p-2 flex flex-col gap-1 max-h-[300px]">
        {/* Render layers in reverse depth order so top layers are at the top of the list */}
        {[...layers].sort((a, b) => b.depth - a.depth).map(layer => (
          <div
            key={layer.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer border ${activeLayerId === layer.id ? 'bg-[#f6f0e8] border-[#e08850]' : 'border-transparent hover:bg-[#f2ece4]'}`}
            onClick={() => setActiveLayerId(layer.id)}
          >
            <span className={`text-sm ${activeLayerId === layer.id ? 'text-[#c2652a] font-medium' : 'text-[#3a302a]'}`}>
              {layer.name}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                className="text-xs focus:outline-none"
                title="Toggle Lock"
              >
                {layer.locked ? '🔒' : '🔓'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                className={`text-xs focus:outline-none ${layer.visible ? 'text-[#3a302a]' : 'text-[#9a9088]'}`}
                title="Toggle Visibility"
              >
                {layer.visible ? '👁️' : '🕶️'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
