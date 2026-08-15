import { Canvas } from "./components/Canvas";
import { LogiEditor } from "./components/LogiEditor";
import { TopNav } from "./components/TopNav";
import { LeftToolbar } from "./components/LeftToolbar";
import { ConsoleHUD } from "./components/ConsoleHUD";
import { VaultExplorer } from "./components/VaultExplorer";
import { DiagramModal } from "./components/DiagramModal";
import { useStore } from "./store";
import "./App.css";

function App() {
  const { language, isDiagramModalOpen, setIsDiagramModalOpen } = useStore();

  return (
    <main className="canvas-bg text-[#3a302a] font-sans h-screen w-screen overflow-hidden relative selection:bg-[#c2652a]/30 selection:text-[#c2652a]">
      {/* 1. Interlaced Brick Canvas (Background) */}
      <div className="absolute inset-0 canvas-bg z-0 pointer-events-auto">
        <Canvas />
      </div>

      {/* 2. Top Navigation & Context Bar */}
      <TopNav />

      {/* 3. Docked Left Toolbar */}
      <LeftToolbar />

      {/* 4. Floating Right Side HUD (Vault & Code Editor) */}
      <div className="absolute top-24 right-4 w-[340px] bottom-12 flex flex-col gap-3 z-40 pointer-events-none animate-slide-in-right">
        <VaultExplorer />
        <div className="hud-glass rounded-lg flex-1 flex flex-col overflow-hidden pointer-events-auto shadow-sm">
          <div className="h-8 flex items-center justify-between px-3 border-b border-[#d8d0c8] bg-[#f6f0e8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#605850]">
              {language === "logidsl" ? "LogiDSL Editor" : "PhiloDSL Editor"}
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#9a9088]">code</span>
          </div>
          <div className="flex-1 overflow-hidden bg-[#faf5ee]">
            <LogiEditor language={language} />
          </div>
        </div>
      </div>

      {/* 5. Floating Console HUD */}
      <ConsoleHUD />

      {/* 6. Universal Transpiler Modal */}
      <DiagramModal 
        isOpen={isDiagramModalOpen} 
        onClose={() => setIsDiagramModalOpen(false)} 
      />

      {/* 7. Footer Status Bar */}
      <footer className="absolute bottom-0 w-full z-50 flex items-center justify-between px-4 h-8 bg-[#f2ece4]/90 backdrop-blur border-t border-[#d8d0c8] pointer-events-auto">
        <div className="text-[10px] uppercase tracking-wider text-[#c2652a] font-bold">
          twoballoons AI Engine | WebGPU / WebGL Active
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] text-[#605850]">v0.1.0-alpha</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
