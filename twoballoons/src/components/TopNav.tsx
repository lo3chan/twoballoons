import { useStore } from "../store";
import { localFileSystem } from "../services/localFileSystem";

export function TopNav() {
  const { 
    language, 
    setLanguage, 
    activeTool, 
    aiModel, 
    setAiModel, 
    setIsDiagramModalOpen,
    setIsPresenting,
    setIsMerging,
    addReasoningLog
  } = useStore();

  const handleRunGenerativeFill = () => {
    addReasoningLog(`> Triggered Generative Fill using ${aiModel} on ${language} scope...`);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none w-[95%] max-w-7xl animate-slide-in-down">
      {/* Main Nav */}
      <nav className="hud-glass rounded-lg flex justify-between items-center w-full px-4 h-12 shadow-sm pointer-events-auto">
        <div className="flex items-center gap-6">
          <div className="font-serif text-xl font-bold text-[#c2652a] tracking-tight flex items-center gap-1.5">
            <span>🎈🎈</span>
            <span>twoballoons</span>
          </div>
          <div className="hidden md:flex gap-4">
            <button 
              onClick={async () => { await localFileSystem.openDirectory(); }}
              className="text-[#605850] hover:text-[#c2652a] transition-colors cursor-pointer text-xs uppercase tracking-wider px-2 py-1 rounded font-medium"
              title="Open Local Folder"
            >
              Open Folder
            </button>
            <button
              onClick={async () => {
                const code = useStore.getState().balloonCode;
                await localFileSystem.saveWorkspace(code);
              }}
              className="text-[#605850] hover:text-[#c2652a] transition-colors cursor-pointer text-xs uppercase tracking-wider px-2 py-1 rounded font-medium"
              title="Save Workspace"
            >
              Save Workspace
            </button>
            <button
              onClick={async () => {
                const code = useStore.getState().balloonCode;
                await localFileSystem.exportBundle(code);
              }}
              className="text-[#605850] hover:text-[#c2652a] transition-colors cursor-pointer text-xs uppercase tracking-wider px-2 py-1 rounded font-medium"
              title="Export .balloon Bundle"
            >
              Export Bundle
            </button>
            <button 
              onClick={() => setLanguage(language === "logidsl" ? "philodsl" : "logidsl")}
              className="text-[#c2652a] font-bold border-b-2 border-[#c2652a] pb-0.5 text-xs uppercase tracking-wider px-2"
            >
              {language === "logidsl" ? "LogiDSL" : "PhiloDSL"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDiagramModalOpen(true)}
            className="flex items-center gap-2 bg-[#faf5ee] border border-[#d8d0c8] rounded px-3 py-1 text-sm font-medium hover:bg-[#f2ece4] hover:text-[#c2652a] transition-colors text-[#3a302a]"
          >
            <span>Architecture Studio</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <div className="flex items-center gap-2 text-[#605850]">
            <button 
              onClick={() => setIsDiagramModalOpen(true)}
              title="Universal Transpilers" 
              className="p-1 hover:text-[#c2652a] hover:bg-[#c2652a]/10 rounded transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">transform</span>
            </button>
            <button 
              title="Account & Workspace"
              className="p-1 hover:text-[#c2652a] hover:bg-[#c2652a]/10 rounded transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Context Bar */}
      <div className="hud-glass rounded-lg flex items-center h-10 px-4 text-xs text-[#605850] gap-6 shadow-sm pointer-events-auto self-center w-fit">
        <div className="flex items-center gap-2 text-[#c2652a]">
          <span className="material-symbols-outlined text-[16px]">crop</span>
          <span className="font-medium capitalize">Tool: {activeTool}</span>
        </div>
        <div className="h-4 w-px bg-[#d8d0c8]"></div>
        <div className="flex items-center gap-2">
          <span>Model:</span>
          <select 
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            className="bg-[#faf5ee] border border-[#d8d0c8] rounded px-2 py-0.5 text-xs text-[#3a302a] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none"
          >
            <option>Gemini 3.6 Flash</option>
            <option>Claude 3.5 Sonnet</option>
          </select>
        </div>
        <div className="h-4 w-px bg-[#d8d0c8]"></div>
        <div className="flex items-center gap-2">
          <span>Scope: Selected AST Nodes</span>
        </div>

        <div className="h-4 w-px bg-[#d8d0c8]"></div>
        <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsPresenting(true)}
              className="text-[#605850] hover:text-[#c2652a] flex items-center gap-1"
              title="Enter Presentation Mode"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
            </button>
            <button 
              onClick={() => setIsMerging(true)}
              className="text-[#605850] hover:text-[#c2652a] flex items-center gap-1"
              title="Simulate Merge Conflict"
            >
              <span className="material-symbols-outlined text-[16px]">call_split</span>
            </button>
            <button 
              onClick={async () => {
                 const content = await localFileSystem.importIaC();
                 if (content) {
                   addReasoningLog(`> Imported IaC Configuration (${content.length} bytes)`);
                   // In a real scenario, we'd parse this into AST nodes here.
                 }
              }}
              className="text-[#605850] hover:text-[#c2652a] flex items-center gap-1"
              title="Import IaC"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_download</span>
            </button>
        </div>

        <div className="w-4"></div>
        <button 
          onClick={handleRunGenerativeFill}
          className="bg-[#c2652a]/10 text-[#c2652a] hover:bg-[#c2652a]/20 border border-[#c2652a]/20 px-3 py-1 rounded font-medium flex items-center gap-1 transition-colors hover:shadow-sm"
        >
          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
          Run Generative Fill
        </button>
      </div>
    </div>
  );
}
