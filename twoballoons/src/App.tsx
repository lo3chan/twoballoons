import { Canvas } from "./components/Canvas";
import { TopNav } from "./components/TopNav";
import { TabBar } from "./components/TabBar";
import { BreadcrumbBar } from "./components/BreadcrumbBar";
import { LeftToolbar } from "./components/LeftToolbar";
import { ConsoleHUD } from "./components/ConsoleHUD";
import { VaultExplorer } from "./components/VaultExplorer";
import { BalloonCodeDrawer } from "./components/BalloonCodeDrawer";
import { DiagramModal } from "./components/DiagramModal";
import { ContextMenu } from "./components/ContextMenu";
import { AntigravityWindow } from "./components/AntigravityWindow";
import { PresentationMode } from "./components/PresentationMode";
import { VisualMergeResolver } from "./components/VisualMergeResolver";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PeerCursors } from "./components/PeerCursors";
import { useStore } from "./store";
import { useEffect } from "react";
import "./App.css";

function App() {
  const { isDiagramModalOpen, setIsDiagramModalOpen, closeContextMenu, loadVaultState, loadPresentationKeyframes } = useStore();

  useEffect(() => {
    // Rehydrate persisted local state on startup
    loadVaultState();
    loadPresentationKeyframes();

    // Globally prevent native context menus from colliding with Sahara context menu
    const preventContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", preventContext);
    return () => {
      document.removeEventListener("contextmenu", preventContext);
    }
  }, [loadVaultState, loadPresentationKeyframes]);

  return (
    <main
      className="canvas-bg text-[#3a302a] font-sans h-screen w-screen overflow-hidden relative selection:bg-[#c2652a]/30 selection:text-[#c2652a] flex flex-col"
      onClick={() => closeContextMenu()} onContextMenu={(e) => e.preventDefault()}
    >
      <ContextMenu />
      {/* 1. Top Navigation Bar */}
      <ErrorBoundary>
        <TopNav />
      </ErrorBoundary>

      {/* 2. Adobe Document Tabs Bar */}
      <ErrorBoundary>
        <TabBar />
      </ErrorBoundary>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* WebGPU Interlaced Brick Canvas */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <ErrorBoundary>
            <Canvas />
          </ErrorBoundary>
        </div>

        {/* Remote Collaborator Cursors Overlay */}
        <PeerCursors />

        {/* Hierarchical Breadcrumb Navigation */}
        <ErrorBoundary>
          <BreadcrumbBar />
        </ErrorBoundary>

        {/* Docked Left Toolbar */}
        <ErrorBoundary>
          <LeftToolbar />
        </ErrorBoundary>

        {/* Vault Explorer */}
        <div className="pointer-events-none">
          <ErrorBoundary>
            <VaultExplorer />
          </ErrorBoundary>
        </div>

        {/* Antigravity Window */}
        <ErrorBoundary>
          <AntigravityWindow />
        </ErrorBoundary>

        {/* Sliding Balloon Code Drawer */}
        <ErrorBoundary>
          <BalloonCodeDrawer />
        </ErrorBoundary>

        {/* Floating Console HUD */}
        <ErrorBoundary>
          <ConsoleHUD />
        </ErrorBoundary>

        {/* Universal Diagram Transpiler Modal */}
        <ErrorBoundary>
          <DiagramModal
            isOpen={isDiagramModalOpen}
            onClose={() => setIsDiagramModalOpen(false)}
          />
        </ErrorBoundary>
      </div>

      {/* 4. Footer Status Bar */}

      {/* 5. Presentation Mode Overlay */}
      <ErrorBoundary>
        <PresentationMode />
      </ErrorBoundary>

      {/* 6. Visual Git Merge Resolver Overlay */}
      <ErrorBoundary>
        <VisualMergeResolver />
      </ErrorBoundary>

      <footer className="h-7 w-full z-50 flex items-center justify-between px-4 bg-[#f2ece4]/90 backdrop-blur border-t border-[#d8d0c8] pointer-events-auto text-[10px]">
        <div className="uppercase tracking-wider text-[#c2652a] font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c2652a] animate-pulse" />
          twoballoons Architecture Studio | WebGPU Canvas Active
        </div>
        <div className="flex gap-4 text-[#605850] font-mono">
          <span>Tab / Enter: Rapid Branching</span>
          <span>F: Auto-Layout</span>
          <span>v0.1.0-alpha</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
