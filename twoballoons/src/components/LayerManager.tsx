import { useState, useEffect } from "react";
import { useStore } from "../store";
import { FloatingWindow } from "./FloatingWindow";

export function LayerManager() {
  const { isLayerManagerOpen, setIsLayerManagerOpen, layers, activeLayerId, setActiveLayerId, toggleLayerVisibility, toggleLayerLock, addLayer } = useStore();
  const [newLayerName, setNewLayerName] = useState("");
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <FloatingWindow
      title="Layer Depth Planes"
      icon="layers"
      onClose={() => setIsLayerManagerOpen(false)}
      initialPosition={{ x: windowSize.width - 300, y: 80 }}
      initialWidth={280}
    >
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
    </FloatingWindow>
  );
}
