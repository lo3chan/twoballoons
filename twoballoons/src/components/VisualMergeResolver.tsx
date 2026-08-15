import { useEffect, useRef } from "react";
import { Application, Graphics, Container, Text } from "pixi.js";
import { useStore } from "../store";

export function VisualMergeResolver() {
  const { isMerging, setIsMerging, setMergeConflicts } = useStore();

  const oursCanvasRef = useRef<HTMLCanvasElement>(null);
  const theirsCanvasRef = useRef<HTMLCanvasElement>(null);
  const oursAppRef = useRef<Application | null>(null);
  const theirsAppRef = useRef<Application | null>(null);

  useEffect(() => {
    if (!isMerging) return;
    
    let isMounted = true;

    const initPixi = async (canvasRef: React.RefObject<HTMLCanvasElement | null>, appRef: React.MutableRefObject<Application | null>, color: number) => {
        if (!canvasRef.current) return;
        const app = new Application();
        await app.init({
            canvas: canvasRef.current,
            resizeTo: canvasRef.current.parentElement!,
            background: '#faf5ee',
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        
        if (!isMounted) {
            app.destroy(true);
            return;
        }

        appRef.current = app;
        const stage = app.stage;
        
        // Mock rendering AST for visual diffing
        const container = new Container();
        stage.addChild(container);

        const node = new Graphics();
        node.roundRect(0, 0, 100, 60, 8);
        node.fill({ color: 0xffffff });
        node.stroke({ color: color, width: 2 });
        node.position.set(100, 100);
        container.addChild(node);
        
        const text = new Text({ text: "Node", style: { fontSize: 14, fill: '#3a302a' }});
        text.position.set(20, 20);
        node.addChild(text);
    };

    initPixi(oursCanvasRef, oursAppRef, 0x16a34a); // Green for Ours
    initPixi(theirsCanvasRef, theirsAppRef, 0x2563eb); // Blue for Theirs

    return () => {
        isMounted = false;
        if (oursAppRef.current) oursAppRef.current.destroy(false, { children: true });
        if (theirsAppRef.current) theirsAppRef.current.destroy(false, { children: true });
    };
  }, [isMerging]);


  const handleAcceptOurs = () => {
    // Logic to merge Ours into store AST
    setMergeConflicts([]);
    setIsMerging(false);
  };

  const handleAcceptTheirs = () => {
    // Logic to merge Theirs into store AST
    setMergeConflicts([]);
    setIsMerging(false);
  };

  if (!isMerging) return null;

  return (
    <div className="absolute inset-0 bg-[#3a302a]/80 backdrop-blur-md z-[100] flex flex-col pointer-events-auto">
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#faf5ee]/95">
        <h2 className="text-xl font-serif text-[#c2652a] font-bold">Visual Merge Conflict Resolution</h2>
        <button 
          onClick={() => setIsMerging(false)}
          className="text-[#605850] hover:text-[#c2652a] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex-1 flex w-full relative">

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2">
            <div className="bg-white p-2 rounded-full shadow-lg border border-[#d8d0c8]">
                <span className="material-symbols-outlined text-[#c2652a]">compare_arrows</span>
            </div>
            <button 
                onClick={() => {
                    // Logic to smartly combine Ours and Theirs
                    setMergeConflicts([]);
                    setIsMerging(false);
                }}
                className="bg-[#c2652a] text-white px-4 py-1 rounded text-sm font-bold shadow hover:bg-[#a15322]"
            >
                Auto-Combine
            </button>
        </div>

        <div className="flex-1 border-r border-[#d8d0c8]/50 flex flex-col relative bg-[#faf5ee]">
            <div className="absolute top-2 left-4 z-10 font-mono text-sm bg-white/80 px-2 py-1 rounded shadow text-green-700 font-bold border border-green-200">
                OURS (Current)
            </div>
            {/* We will inject Canvas viewport logic here in the next step */}
            <div className="flex-1 w-full h-full relative" id="ours-canvas-container"><canvas ref={oursCanvasRef} className="absolute inset-0 w-full h-full outline-none" style={{ display: "block" }} /></div>
            <div className="p-4 border-t border-[#d8d0c8]/50 bg-white flex justify-center">
                <button onClick={handleAcceptOurs} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 shadow transition-colors">
                    Accept Ours
                </button>
            </div>
        </div>

        <div className="flex-1 flex flex-col relative bg-[#faf5ee]">
            <div className="absolute top-2 right-4 z-10 font-mono text-sm bg-white/80 px-2 py-1 rounded shadow text-blue-700 font-bold border border-blue-200">
                THEIRS (Incoming)
            </div>
             {/* We will inject Canvas viewport logic here in the next step */}
             <div className="flex-1 w-full h-full relative" id="theirs-canvas-container"><canvas ref={theirsCanvasRef} className="absolute inset-0 w-full h-full outline-none" style={{ display: "block" }} /></div>
            <div className="p-4 border-t border-[#d8d0c8]/50 bg-white flex justify-center">
                <button onClick={handleAcceptTheirs} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 shadow transition-colors">
                    Accept Theirs
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
