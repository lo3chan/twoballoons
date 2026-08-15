import { useStore } from "../store";

export function LeftToolbar() {
  const { activeTool, setActiveTool } = useStore();

  const tools = [
    { id: "select", icon: "near_me", title: "Select (V)" },
    { id: "marquee", icon: "crop", title: "Marquee (M)" },
    { id: "nodes", icon: "schema", title: "Nodes (C)" },
    { id: "connect", icon: "timeline", title: "Connect (L)" },
    { id: "logic", icon: "psychology", title: "Logic (W)" },
    { id: "text", icon: "title", title: "Text (T)" },
  ] as const;

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-4 hud-glass rounded-lg flex flex-col items-center py-4 space-y-4 w-12 z-40 shadow-sm animate-slide-in-left">
      <div className="flex flex-col gap-3 w-full px-1">
        {tools.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`w-full p-1.5 rounded transition-all flex justify-center ${
                isActive
                  ? "bg-[#c2652a] text-white shadow-md shadow-[#c2652a]/30 scale-105"
                  : "text-[#605850] hover:text-[#c2652a] hover:bg-[#c2652a]/10 hover:scale-110"
              }`}
              title={t.title}
            >
              <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
            </button>
          );
        })}
      </div>
      <div className="h-4"></div>
      <div className="flex flex-col gap-3 w-full px-1">
        <button 
          className="w-full text-[#605850] p-1.5 hover:text-[#c2652a] hover:bg-[#c2652a]/10 hover:scale-110 rounded transition-all flex justify-center" 
          title="Search Vault"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
        <button 
          className="w-full text-[#605850] p-1.5 hover:text-[#c2652a] hover:bg-[#c2652a]/10 hover:scale-110 rounded transition-all flex justify-center" 
          title="Layers"
        >
          <span className="material-symbols-outlined text-[20px]">layers</span>
        </button>
      </div>
    </div>
  );
}
